import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { createClient } from '@/lib/supabase/server';

// QR Token structure for secure scanning
export interface QRToken {
  scene_id: string;
  session_id: string;
  timestamp: number;
  expires_at: number;
  nonce: string;
}

// QR Security configuration
export interface QRSecurityConfig {
  expirationMinutes: number;
  proximityToleranceMeters: number;
  maxScansPerUser: number;
  rateLimitWindowSeconds: number;
  enableLocationValidation: boolean;
  enableDeviceFingerprinting: boolean;
}

// Geolocation for validation
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
}

// QR validation result
export interface QRValidationResult {
  valid: boolean;
  error?: string;
  message: string;
  scene_id?: string;
  points_awarded?: number;
  risk_score: number;
  fraud_indicators: string[];
  distance_meters?: number;
  processing_time_ms: number;
}

export class QRSecurityService {
  private readonly hmacSecret: string;
  private readonly defaultConfig: QRSecurityConfig;
  
  constructor() {
    this.hmacSecret = process.env.QR_HMAC_SECRET || process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    this.defaultConfig = {
      expirationMinutes: 60,
      proximityToleranceMeters: 50,
      maxScansPerUser: 1,
      rateLimitWindowSeconds: 60,
      enableLocationValidation: true,
      enableDeviceFingerprinting: true
    };
    
    if (this.hmacSecret === 'fallback-secret-change-in-production') {
    }
  }
  
  /**
   * Generate secure QR token with HMAC signature
   */
  async generateSecureQRToken(
    sceneId: string, 
    sessionId: string, 
    config: Partial<QRSecurityConfig> = {}
  ): Promise<{
    token: string;
    signature: string;
    expires_at: Date;
    qr_url: string;
    qr_data: string;
  }> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();
    const expiresAt = now + (finalConfig.expirationMinutes * 60 * 1000);
    
    // Create token payload
    const tokenPayload: QRToken = {
      scene_id: sceneId,
      session_id: sessionId,
      timestamp: now,
      expires_at: expiresAt,
      nonce: randomBytes(16).toString('hex')
    };
    
    // Encode token as base64
    const tokenString = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
    
    // Generate HMAC signature
    const hmac = createHmac('sha256', this.hmacSecret);
    hmac.update(tokenString);
    const signature = hmac.digest('hex');
    
    // Create QR data (token + signature)
    const qrData = `${tokenString}.${signature}`;
    
    // Create deep link URL for mobile apps
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.cluequest.com';
    const qrUrl = `${baseUrl}/scan?data=${encodeURIComponent(qrData)}`;
    
    return {
      token: tokenString,
      signature,
      expires_at: new Date(expiresAt),
      qr_url: qrUrl,
      qr_data: qrData
    };
  }
  
  /**
   * Validate QR token with comprehensive security checks
   */
  async validateQRToken(
    qrData: string,
    playerLocation?: GeoLocation,
    deviceFingerprint?: string,
    ipAddress?: string
  ): Promise<QRValidationResult> {
    const startTime = Date.now();
    let riskScore = 0;
    const fraudIndicators: string[] = [];
    
    try {
      // Parse QR data
      const parts = qrData.split('.');
      if (parts.length !== 2) {
        return {
          valid: false,
          error: 'invalid_format',
          message: 'Invalid QR code format',
          risk_score: 100,
          fraud_indicators: ['invalid_format'],
          processing_time_ms: Date.now() - startTime
        };
      }
      
      const [tokenString, providedSignature] = parts;
      
      // Verify HMAC signature
      const expectedHmac = createHmac('sha256', this.hmacSecret);
      expectedHmac.update(tokenString);
      const expectedSignature = expectedHmac.digest('hex');
      
      if (!timingSafeEqual(
        Buffer.from(providedSignature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      )) {
        return {
          valid: false,
          error: 'invalid_signature',
          message: 'QR code signature verification failed',
          risk_score: 100,
          fraud_indicators: ['signature_mismatch'],
          processing_time_ms: Date.now() - startTime
        };
      }
      
      // Parse token payload
      let tokenPayload: QRToken;
      try {
        tokenPayload = JSON.parse(Buffer.from(tokenString, 'base64').toString('utf-8'));
      } catch {
        return {
          valid: false,
          error: 'invalid_token',
          message: 'QR code token is malformed',
          risk_score: 100,
          fraud_indicators: ['malformed_token'],
          processing_time_ms: Date.now() - startTime
        };
      }
      
      // Check expiration
      const now = Date.now();
      if (now > tokenPayload.expires_at) {
        return {
          valid: false,
          error: 'expired',
          message: 'QR code has expired',
          risk_score: 20,
          fraud_indicators: ['expired_token'],
          processing_time_ms: Date.now() - startTime
        };
      }
      
      // Check if token is from the future (clock sync issues)
      if (tokenPayload.timestamp > now + 60000) { // 1 minute tolerance
        riskScore += 30;
        fraudIndicators.push('future_timestamp');
      }
      
      // Get scene and session details from database
      const supabase = await createClient();
      
      const { data: scene, error: sceneError } = await supabase
        .from('cluequest_scenes')
        .select(`
          id,
          adventure_id,
          title,
          location,
          proximity_radius,
          points_reward,
          qr_code_required
        `)
        .eq('id', tokenPayload.scene_id)
        .single();
      
      if (sceneError || !scene) {
        return {
          valid: false,
          error: 'scene_not_found',
          message: 'Scene not found for this QR code',
          risk_score: 100,
          fraud_indicators: ['invalid_scene_id'],
          processing_time_ms: Date.now() - startTime
        };
      }
      
      // Location validation if required
      let distanceMeters: number | undefined;
      if (playerLocation && scene.location && this.defaultConfig.enableLocationValidation) {
        distanceMeters = this.calculateDistance(
          playerLocation,
          scene.location as GeoLocation
        );
        
        const proximityTolerance = scene.proximity_radius || this.defaultConfig.proximityToleranceMeters;
        
        if (distanceMeters > proximityTolerance) {
          riskScore += Math.min(50, Math.round((distanceMeters - proximityTolerance) / 10));
          fraudIndicators.push('location_too_far');
        }
        
        // Check for impossible travel speed (teleportation detection)
        const travelSpeed = await this.checkTravelSpeed(
          supabase,
          tokenPayload.session_id,
          playerLocation,
          tokenPayload.timestamp
        );
        
        if (travelSpeed > 50) { // > 50 km/h indicates possible spoofing
          riskScore += 40;
          fraudIndicators.push('impossible_travel_speed');
        }
      }
      
      // Rate limiting check
      const rateLimitExceeded = await this.checkRateLimit(
        supabase,
        tokenPayload.session_id,
        tokenPayload.scene_id
      );
      
      if (rateLimitExceeded) {
        riskScore += 50;
        fraudIndicators.push('rate_limit_exceeded');
      }
      
      // Device fingerprint validation
      if (deviceFingerprint && this.defaultConfig.enableDeviceFingerprinting) {
        const deviceSuspicious = await this.validateDeviceFingerprint(
          supabase,
          tokenPayload.session_id,
          deviceFingerprint
        );
        
        if (deviceSuspicious) {
          riskScore += 25;
          fraudIndicators.push('suspicious_device');
        }
      }
      
      return {
        valid: riskScore < 70, // Risk threshold
        scene_id: tokenPayload.scene_id,
        points_awarded: riskScore < 70 ? scene.points_reward : 0,
        risk_score: riskScore,
        fraud_indicators: fraudIndicators,
        distance_meters: distanceMeters,
        message: riskScore < 70 
          ? 'QR scan successful' 
          : 'Scan flagged for security review',
        processing_time_ms: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        valid: false,
        error: 'validation_failed',
        message: 'QR code validation failed',
        risk_score: 100,
        fraud_indicators: ['validation_error'],
        processing_time_ms: Date.now() - startTime
      };
    }
  }
  
  /**
   * Calculate distance between two GPS coordinates using Haversine formula
   */
  private calculateDistance(location1: GeoLocation, location2: GeoLocation): number {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = location1.latitude * Math.PI / 180;
    const lat2Rad = location2.latitude * Math.PI / 180;
    const deltaLatRad = (location2.latitude - location1.latitude) * Math.PI / 180;
    const deltaLngRad = (location2.longitude - location1.longitude) * Math.PI / 180;
    
    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in meters
  }
  
  /**
   * Check for impossible travel speeds (teleportation detection)
   */
  private async checkTravelSpeed(
    supabase: any,
    sessionId: string,
    currentLocation: GeoLocation,
    currentTimestamp: number
  ): Promise<number> {
    try {
      const { data: lastScan } = await supabase
        .from('cluequest_qr_scans')
        .select('scan_location, scanned_at')
        .eq('session_id', sessionId)
        .order('scanned_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!lastScan?.scan_location) {
        return 0; // No previous location data
      }
      
      const lastLocation = lastScan.scan_location as GeoLocation;
      const timeDiffSeconds = (currentTimestamp - new Date(lastScan.scanned_at).getTime()) / 1000;
      
      if (timeDiffSeconds < 10) {
        return 0; // Too recent to calculate meaningful speed
      }
      
      const distanceMeters = this.calculateDistance(currentLocation, lastLocation);
      const speedKmh = (distanceMeters / 1000) / (timeDiffSeconds / 3600);
      
      return speedKmh;
      
    } catch (error) {
      return 0; // Assume safe on error
    }
  }
  
  /**
   * Check rate limiting for QR scans
   */
  private async checkRateLimit(
    supabase: any,
    sessionId: string,
    sceneId: string
  ): Promise<boolean> {
    try {
      const { count } = await supabase
        .from('cluequest_qr_scans')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId)
        .eq('qr_code_id', sceneId) // Assuming scene_id maps to QR code
        .gte('scanned_at', new Date(Date.now() - this.defaultConfig.rateLimitWindowSeconds * 1000).toISOString());
      
      return (count || 0) > this.defaultConfig.maxScansPerUser;
      
    } catch (error) {
      return false; // Assume safe on error
    }
  }
  
  /**
   * Validate device fingerprint for consistency
   */
  private async validateDeviceFingerprint(
    supabase: any,
    sessionId: string,
    deviceFingerprint: string
  ): Promise<boolean> {
    try {
      const { data: playerScans } = await supabase
        .from('cluequest_qr_scans')
        .select('device_fingerprint')
        .eq('session_id', sessionId)
        .order('scanned_at', { ascending: false })
        .limit(5); // Check last 5 scans
      
      if (!playerScans || playerScans.length === 0) {
        return false; // First scan, can't validate
      }
      
      // Check if device fingerprint has changed dramatically
      const uniqueFingerprints = new Set(
        playerScans
          .map(scan => scan.device_fingerprint)
          .filter(fp => fp && fp.length > 0)
      );
      
      // More than 2 different fingerprints in recent scans is suspicious
      return uniqueFingerprints.size > 2 && !uniqueFingerprints.has(deviceFingerprint);
      
    } catch (error) {
      return false; // Assume safe on error
    }
  }
  
  /**
   * Generate QR code data for scene
   */
  async generateQRCodeForScene(
    sceneId: string,
    sessionId: string,
    config: Partial<QRSecurityConfig> = {}
  ): Promise<{
    qr_code_data: string;
    qr_url: string;
    expires_at: Date;
    security_info: {
      hmac_enabled: boolean;
      location_validation: boolean;
      rate_limiting: boolean;
    };
  }> {
    const qrToken = await this.generateSecureQRToken(sceneId, sessionId, config);
    
    return {
      qr_code_data: qrToken.qr_data,
      qr_url: qrToken.qr_url,
      expires_at: qrToken.expires_at,
      security_info: {
        hmac_enabled: true,
        location_validation: this.defaultConfig.enableLocationValidation,
        rate_limiting: true
      }
    };
  }
  
  /**
   * Detect fraud patterns using ML-like heuristics
   */
  async detectFraudPatterns(
    scans: Array<{
      scanned_at: string;
      scan_location?: GeoLocation;
      is_valid: boolean;
      device_fingerprint?: string;
      ip_address?: string;
    }>
  ): Promise<{
    fraud_probability: number;
    detected_patterns: string[];
    risk_level: 'low' | 'medium' | 'high' | 'critical';
  }> {
    const patterns: string[] = [];
    let fraudProbability = 0;
    
    // Pattern 1: Rapid consecutive scans (bot behavior)
    const rapidScans = scans.filter((scan, index) => {
      if (index === 0) return false;
      const timeDiff = new Date(scan.scanned_at).getTime() - new Date(scans[index - 1].scanned_at).getTime();
      return timeDiff < 5000; // Less than 5 seconds between scans
    });
    
    if (rapidScans.length > 2) {
      patterns.push('rapid_scanning');
      fraudProbability += 30;
    }
    
    // Pattern 2: Location teleportation
    const locationJumps = scans.filter((scan, index) => {
      if (index === 0 || !scan.scan_location || !scans[index - 1].scan_location) return false;
      
      const distance = this.calculateDistance(scan.scan_location, scans[index - 1].scan_location!);
      const timeDiff = (new Date(scan.scanned_at).getTime() - new Date(scans[index - 1].scanned_at).getTime()) / 1000;
      const speed = distance / timeDiff * 3.6; // km/h
      
      return speed > 100; // Faster than highway speed
    });
    
    if (locationJumps.length > 0) {
      patterns.push('location_teleportation');
      fraudProbability += 40;
    }
    
    // Pattern 3: Multiple device fingerprints
    const uniqueDevices = new Set(
      scans
        .map(s => s.device_fingerprint)
        .filter(fp => fp && fp.length > 0)
    );
    
    if (uniqueDevices.size > 3) {
      patterns.push('device_switching');
      fraudProbability += 25;
    }
    
    // Pattern 4: High failure rate followed by sudden success
    const recentScans = scans.slice(0, 10);
    const failureRate = recentScans.filter(s => !s.is_valid).length / recentScans.length;
    
    if (failureRate > 0.7) {
      patterns.push('high_failure_rate');
      fraudProbability += 20;
    }
    
    // Pattern 5: Multiple IP addresses
    const uniqueIPs = new Set(
      scans
        .map(s => s.ip_address)
        .filter(ip => ip && ip.length > 0)
    );
    
    if (uniqueIPs.size > 2) {
      patterns.push('ip_switching');
      fraudProbability += 15;
    }
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (fraudProbability >= 80) riskLevel = 'critical';
    else if (fraudProbability >= 60) riskLevel = 'high';
    else if (fraudProbability >= 30) riskLevel = 'medium';
    else riskLevel = 'low';
    
    return {
      fraud_probability: Math.min(fraudProbability, 100),
      detected_patterns: patterns,
      risk_level: riskLevel
    };
  }
  
  /**
   * Generate batch QR codes for multiple scenes
   */
  async generateQRCodesForAdventure(
    adventureId: string,
    sessionId: string
  ): Promise<Array<{
    scene_id: string;
    scene_title: string;
    qr_code_data: string;
    qr_url: string;
    expires_at: Date;
    order_index: number;
  }>> {
    const supabase = await createClient();
    
    // Get all scenes that require QR codes
    const { data: scenes, error } = await supabase
      .from('cluequest_scenes')
      .select('id, title, order_index')
      .eq('adventure_id', adventureId)
      .eq('qr_code_required', true)
      .order('order_index');
    
    if (error || !scenes) {
      throw new Error(`Failed to get scenes: ${error?.message}`);
    }
    
    // Generate QR codes for all scenes
    const qrCodes = await Promise.all(
      scenes.map(async (scene) => {
        const qrData = await this.generateQRCodeForScene(scene.id, sessionId);
        
        return {
          scene_id: scene.id,
          scene_title: scene.title,
          qr_code_data: qrData.qr_code_data,
          qr_url: qrData.qr_url,
          expires_at: qrData.expires_at,
          order_index: scene.order_index
        };
      })
    );
    
    return qrCodes.sort((a, b) => a.order_index - b.order_index);
  }
}

// Export singleton instance
export const qrSecurityService = new QRSecurityService();
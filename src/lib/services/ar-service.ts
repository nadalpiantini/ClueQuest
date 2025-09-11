import { createClient } from '@/lib/supabase/server';

// AR Asset types based on ClueQuest mindmap requirements
export type ARAssetCategory = 'creature' | 'object' | 'environment' | 'effect' | 'character';

// AR Framework compatibility
export type ARFramework = 'mind-ar' | 'a-frame' | 'ar.js' | 'webxr' | 'model-viewer';

// AR Experience types from mindmap
export type ARExperienceType = 'creature_capture' | 'object_interaction' | 'environment_exploration' | 'puzzle_solving';

// Device AR capabilities
export interface ARCapabilities {
  webxr_supported: boolean;
  camera_access: boolean;
  gyroscope: boolean;
  accelerometer: boolean;
  device_orientation: boolean;
  webgl_version: number;
  max_texture_size: number;
  performance_tier: 'low' | 'medium' | 'high';
}

// AR Asset configuration
export interface ARAssetConfig {
  model_url: string;
  category: ARAssetCategory;
  optimization_level: 'mobile' | 'desktop' | 'high_end';
  compression: 'none' | 'standard' | 'high';
  max_polygon_count?: number;
  target_file_size_mb?: number;
  animation_enabled?: boolean;
  interaction_enabled?: boolean;
}

// AR Experience configuration  
export interface ARExperienceConfig {
  experience_type: ARExperienceType;
  primary_asset: string; // Asset ID
  secondary_assets?: string[];
  interaction_script: any;
  success_criteria: any;
  max_duration_seconds: number;
  auto_timeout: boolean;
  tutorial_enabled: boolean;
}

// AR Scene positioning
export interface ARPositioning {
  anchor_type: 'marker' | 'plane' | 'image' | 'face' | 'world';
  default_scale: number;
  position_offset: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  distance_from_camera: number;
}

export class ARService {
  private supabase: any;
  
  async getSupabaseClient() {
    if (!this.supabase) {
      this.supabase = await createClient();
    }
    return this.supabase;
  }
  
  /**
   * Detect device AR capabilities
   */
  async detectARCapabilities(): Promise<ARCapabilities> {
    // This would run on the client side, but we provide the structure
    const capabilities: ARCapabilities = {
      webxr_supported: false,
      camera_access: false,
      gyroscope: false,
      accelerometer: false,
      device_orientation: false,
      webgl_version: 1,
      max_texture_size: 1024,
      performance_tier: 'medium'
    };
    
    if (typeof navigator !== 'undefined') {
      // Check WebXR support
      if ('xr' in navigator) {
        try {
          const session = await (navigator as any).xr?.isSessionSupported('immersive-ar');
          capabilities.webxr_supported = !!session;
        } catch {
          capabilities.webxr_supported = false;
        }
      }
      
      // Check camera access
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          capabilities.camera_access = true;
          stream.getTracks().forEach(track => track.stop()); // Clean up
        } catch {
          capabilities.camera_access = false;
        }
      }
      
      // Check device orientation sensors
      if ('DeviceOrientationEvent' in window) {
        capabilities.device_orientation = true;
      }
      
      // Check gyroscope/accelerometer
      if ('DeviceMotionEvent' in window) {
        capabilities.gyroscope = true;
        capabilities.accelerometer = true;
      }
      
      // Check WebGL capabilities
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        capabilities.webgl_version = canvas.getContext('webgl2') ? 2 : 1;
        capabilities.max_texture_size = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      }
      
      // Determine performance tier based on capabilities
      if (capabilities.webxr_supported && capabilities.webgl_version === 2 && capabilities.max_texture_size >= 4096) {
        capabilities.performance_tier = 'high';
      } else if (capabilities.camera_access && capabilities.webgl_version >= 1 && capabilities.max_texture_size >= 2048) {
        capabilities.performance_tier = 'medium';
      } else {
        capabilities.performance_tier = 'low';
      }
    }
    
    return capabilities;
  }
  
  /**
   * Optimize 3D asset for target device capabilities
   */
  async optimizeAssetForDevice(
    assetId: string,
    capabilities: ARCapabilities
  ): Promise<{
    optimized_url: string;
    file_size_mb: number;
    polygon_count: number;
    load_time_estimate_ms: number;
  }> {
    const supabase = await this.getSupabaseClient();
    
    // Get original asset
    const { data: asset, error } = await supabase
      .from('cluequest_ar_assets')
      .select('*')
      .eq('id', assetId)
      .single();
    
    if (error || !asset) {
      throw new Error('AR asset not found');
    }
    
    // Determine optimization level based on device capabilities
    let targetPolygonCount: number;
    let compressionLevel: string;
    
    switch (capabilities.performance_tier) {
      case 'high':
        targetPolygonCount = 20000;
        compressionLevel = 'standard';
        break;
      case 'medium':
        targetPolygonCount = 5000;
        compressionLevel = 'high';
        break;
      case 'low':
        targetPolygonCount = 1000;
        compressionLevel = 'high';
        break;
    }
    
    // Check if we have a cached optimized version
    const optimizationKey = `${assetId}_${capabilities.performance_tier}_${compressionLevel}`;
    
    const { data: cachedOptimization } = await supabase
      .from('cluequest_ar_asset_optimizations')
      .select('optimized_url, file_size_bytes, polygon_count')
      .eq('original_asset_id', assetId)
      .eq('optimization_key', optimizationKey)
      .single();
    
    if (cachedOptimization) {
      return {
        optimized_url: cachedOptimization.optimized_url,
        file_size_mb: cachedOptimization.file_size_bytes / (1024 * 1024),
        polygon_count: cachedOptimization.polygon_count,
        load_time_estimate_ms: this.estimateLoadTime(
          cachedOptimization.file_size_bytes,
          capabilities.performance_tier
        )
      };
    }
    
    // Perform optimization (this would typically use a 3D processing service)
    const optimizedAsset = await this.processAssetOptimization(asset, {
      target_polygon_count: targetPolygonCount,
      compression_level: compressionLevel,
      texture_resolution: capabilities.max_texture_size >= 2048 ? '1024x1024' : '512x512'
    });
    
    // Cache optimized version
    await supabase
      .from('cluequest_ar_asset_optimizations')
      .insert({
        original_asset_id: assetId,
        optimization_key: optimizationKey,
        optimized_url: optimizedAsset.url,
        file_size_bytes: optimizedAsset.file_size,
        polygon_count: optimizedAsset.polygon_count,
        optimization_config: {
          performance_tier: capabilities.performance_tier,
          compression: compressionLevel,
          target_polygons: targetPolygonCount
        }
      });
    
    return {
      optimized_url: optimizedAsset.url,
      file_size_mb: optimizedAsset.file_size / (1024 * 1024),
      polygon_count: optimizedAsset.polygon_count,
      load_time_estimate_ms: this.estimateLoadTime(optimizedAsset.file_size, capabilities.performance_tier)
    };
  }
  
  /**
   * Create AR experience for scene
   */
  async createARExperience(
    adventureId: string,
    sceneId: string,
    config: ARExperienceConfig
  ): Promise<{
    experience_id: string;
    webxr_url: string;
    fallback_2d_url: string;
    assets_preload: string[];
    interaction_schema: any;
  }> {
    const supabase = await this.getSupabaseClient();
    
    try {
      // Validate assets exist
      const { data: primaryAsset } = await supabase
        .from('cluequest_ar_assets')
        .select('*')
        .eq('id', config.primary_asset)
        .single();
      
      if (!primaryAsset) {
        throw new Error('Primary AR asset not found');
      }
      
      // Create AR experience record
      const { data: experience, error: createError } = await supabase
        .from('cluequest_ar_experiences')
        .insert({
          adventure_id: adventureId,
          scene_id: sceneId,
          name: `AR Experience - ${primaryAsset.name}`,
          description: `${config.experience_type} experience`,
          experience_type: config.experience_type,
          primary_asset_id: config.primary_asset,
          secondary_assets: config.secondary_assets || [],
          interaction_script: config.interaction_script,
          success_criteria: config.success_criteria,
          max_duration: config.max_duration_seconds,
          auto_timeout: config.auto_timeout,
          tutorial_enabled: config.tutorial_enabled
        })
        .select()
        .single();
      
      if (createError) {
        throw new Error(`Failed to create AR experience: ${createError.message}`);
      }
      
      // Generate WebXR scene configuration
      const webxrConfig = this.generateWebXRConfig(experience, primaryAsset, config);
      
      // Create fallback 2D experience for non-AR devices
      const fallback2D = this.generateFallback2DConfig(experience, primaryAsset);
      
      // Get all assets for preloading
      const allAssetIds = [config.primary_asset, ...(config.secondary_assets || [])];
      const { data: allAssets } = await supabase
        .from('cluequest_ar_assets')
        .select('model_url')
        .in('id', allAssetIds);
      
      const preloadUrls = allAssets?.map((asset: any) => asset.model_url) || [];
      
      return {
        experience_id: experience.id,
        webxr_url: `/ar/experience/${experience.id}`,
        fallback_2d_url: `/ar/fallback/${experience.id}`,
        assets_preload: preloadUrls,
        interaction_schema: config.interaction_script
      };
      
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Generate WebXR scene configuration
   */
  private generateWebXRConfig(experience: any, asset: any, config: ARExperienceConfig): any {
    return {
      scene_id: experience.id,
      ar_mode: 'immersive-ar',
      assets: {
        primary: {
          url: asset.model_url,
          scale: asset.default_scale || 1.0,
          position: [0, 0, -2], // 2 meters in front of user
          rotation: [0, 0, 0],
          anchor_type: asset.anchor_type || 'plane'
        }
      },
      interactions: config.interaction_script,
      lighting: {
        ambient: 0.4,
        directional: {
          intensity: 0.8,
          direction: [1, 1, 1]
        }
      },
      performance: {
        max_polygons: asset.polygon_count,
        target_fps: 30,
        adaptive_quality: true
      }
    };
  }
  
  /**
   * Generate fallback 2D configuration for non-AR devices
   */
  private generateFallback2DConfig(experience: any, asset: any): any {
    return {
      experience_id: experience.id,
      type: '2d_interaction',
      asset_thumbnail: asset.thumbnail_url,
      interaction_mode: 'tap_and_hold',
      success_animation: 'bounce_and_sparkle',
      feedback: 'visual_and_audio'
    };
  }
  
  /**
   * Process 3D asset optimization
   */
  private async processAssetOptimization(
    asset: any,
    optimization: {
      target_polygon_count: number;
      compression_level: string;
      texture_resolution: string;
    }
  ): Promise<{
    url: string;
    file_size: number;
    polygon_count: number;
  }> {
    // In a real implementation, this would use a 3D processing service like:
    // - Blender Python scripts
    // - Three.js tools
    // - Cloud 3D processing APIs
    
    // For now, return simulated optimization
    const originalSize = asset.file_size_bytes;
    const compressionRatio = optimization.compression_level === 'high' ? 0.3 : 0.6;
    const polygonReduction = Math.min(optimization.target_polygon_count / asset.polygon_count, 1);
    
    return {
      url: asset.model_url, // Would be new optimized URL
      file_size: Math.round(originalSize * compressionRatio),
      polygon_count: Math.round(asset.polygon_count * polygonReduction)
    };
  }
  
  /**
   * Estimate load time based on file size and device performance
   */
  private estimateLoadTime(fileSizeBytes: number, performanceTier: string): number {
    const fileSizeMB = fileSizeBytes / (1024 * 1024);
    
    // Estimated load times based on performance tier and network conditions
    const loadTimeFactors = {
      high: 200,   // ms per MB
      medium: 500, // ms per MB  
      low: 1000    // ms per MB
    };
    
    const factor = loadTimeFactors[performanceTier as keyof typeof loadTimeFactors] || 500;
    return Math.round(fileSizeMB * factor);
  }
  
  /**
   * Create Mind AR scene configuration
   */
  createMindARScene(assets: any[], positioning: ARPositioning): string {
    // Generate Mind AR HTML/JavaScript configuration
    const sceneHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ClueQuest AR Experience</title>
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/dist/mindar-image-aframe.prod.js"></script>
    <style>
        body { margin: 0; font-family: Arial, sans-serif; }
        #ar-container { width: 100vw; height: 100vh; position: relative; }
        #ar-overlay { position: absolute; top: 20px; left: 20px; z-index: 100; color: white; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 8px; }
    </style>
</head>
<body>
    <div id="ar-container">
        <div id="ar-overlay">
            <div id="instructions">Point your camera at the QR code marker</div>
            <div id="status">Initializing AR...</div>
        </div>
        
        <a-scene 
            mindar-image="imageTargetSrc: #marker; maxTrack: 1; uiLoading: no; uiScanning: no; uiError: no"
            color-space="sRGB" 
            renderer="colorManagement: true, physicallyCorrectLights"
            vr-mode-ui="enabled: false" 
            device-orientation-permission-ui="enabled: false">
            
            <a-assets>
                ${assets.map((asset, index) => 
                  `<a-asset-item id="asset${index}" src="${asset.model_url}"></a-asset-item>`
                ).join('\n                ')}
                <img id="marker" src="data:image/png;base64,${this.generateMarkerImage()}" />
            </a-assets>

            <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

            <a-entity id="ar-content" mindar-image-target="targetIndex: 0">
                ${assets.map((asset, index) => `
                <a-entity 
                    id="model${index}"
                    gltf-model="#asset${index}"
                    position="${positioning.position_offset.x} ${positioning.position_offset.y} ${positioning.position_offset.z}"
                    rotation="${positioning.rotation.x} ${positioning.rotation.y} ${positioning.rotation.z}"
                    scale="${positioning.default_scale} ${positioning.default_scale} ${positioning.default_scale}"
                    animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
                    cluequest-interaction="enabled: ${asset.interaction_enabled}"
                    visible="false">
                </a-entity>`).join('\n                ')}
            </a-entity>
        </a-scene>
    </div>

    <script>
        // ClueQuest AR interaction system
        AFRAME.registerComponent('cluequest-interaction', {
            schema: { enabled: { type: 'boolean', default: true } },
            
            init: function() {
                if (!this.data.enabled) return;
                
                this.el.addEventListener('click', () => {
                    this.handleInteraction();
                });
                
                // Show/hide based on target tracking
                document.querySelector('a-scene').addEventListener('targetFound', () => {
                    this.el.setAttribute('visible', true);
                    document.querySelector('#instructions').innerHTML = 'Tap the creature to interact!';
                });
                
                document.querySelector('a-scene').addEventListener('targetLost', () => {
                    this.el.setAttribute('visible', false);
                    document.querySelector('#instructions').innerHTML = 'Point your camera at the QR code marker';
                });
            },
            
            handleInteraction: function() {
                // Trigger success animation
                this.el.setAttribute('animation', {
                    property: 'scale',
                    to: '1.2 1.2 1.2',
                    dur: 200,
                    direction: 'alternate',
                    loop: 2
                });
                
                // Send interaction event to ClueQuest backend
                if (window.parent && window.parent.postMessage) {
                    window.parent.postMessage({
                        type: 'ar_interaction_success',
                        asset_id: '${positioning.anchor_type}',
                        timestamp: Date.now()
                    }, '*');
                }
                
                // Visual feedback
                document.querySelector('#status').innerHTML = 'Great! Interaction successful!';
                setTimeout(() => {
                    document.querySelector('#status').innerHTML = 'AR Experience Active';
                }, 2000);
            }
        });
        
        // Performance monitoring
        let frameCount = 0;
        let lastTime = performance.now();
        
        function monitorPerformance() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                document.querySelector('#status').innerHTML = \`AR Active - \${fps} FPS\`;
                
                // Send performance data to backend
                if (fps < 20 && window.parent) {
                    window.parent.postMessage({
                        type: 'ar_performance_warning',
                        fps: fps,
                        timestamp: Date.now()
                    }, '*');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitorPerformance);
        }
        
        // Start monitoring after scene loads
        document.querySelector('a-scene').addEventListener('loaded', () => {
            document.querySelector('#status').innerHTML = 'AR Ready - Point at marker';
            requestAnimationFrame(monitorPerformance);
        });
    </script>
</body>
</html>`;
    
    return sceneHTML;
  }
  
  /**
   * Generate A-Frame AR scene for WebXR
   */
  createAFrameScene(
    assets: any[],
    interactions: any,
    positioning: ARPositioning
  ): string {
    return `
<a-scene 
    xr-mode-ui="enabled: true"
    ar-hit-test="target: #ar-content"
    renderer="colorManagement: true; physicallyCorrectLights: true"
    webxr="referenceSpaceType: local-floor">
    
    <a-assets>
        ${assets.map((asset, index) => 
          `<a-asset-item id="asset${index}" src="${asset.model_url}"></a-asset-item>`
        ).join('\n        ')}
    </a-assets>

    <!-- AR Camera -->
    <a-camera 
        id="ar-camera"
        position="0 1.6 0"
        xr-camera
        look-controls="enabled: false"
        cursor="rayOrigin: mouse">
    </a-camera>

    <!-- AR Content -->
    <a-entity 
        id="ar-content"
        position="${positioning.position_offset.x} ${positioning.position_offset.y} ${positioning.position_offset.z}"
        visible="false">
        
        ${assets.map((asset, index) => `
        <a-entity
            id="creature${index}"
            gltf-model="#asset${index}"
            scale="${positioning.default_scale} ${positioning.default_scale} ${positioning.default_scale}"
            rotation="${positioning.rotation.x} ${positioning.rotation.y} ${positioning.rotation.z}"
            animation="property: position; to: 0 0.5 0; dir: alternate; dur: 2000; loop: true"
            cluequest-ar-interaction="type: ${interactions.type}; reward: ${interactions.reward}"
            sound="src: url(${asset.audio_url || '#success-sound'}); on: click; volume: 0.5">
        </a-entity>`).join('\n        ')}
        
        <!-- Interactive elements -->
        <a-text 
            id="ar-instructions"
            value="Tap the creature to interact!"
            position="0 2 0"
            align="center"
            color="#FFFFFF"
            shader="msdf">
        </a-text>
        
        <!-- Success particles -->
        <a-entity
            id="success-particles"
            particle-system="preset: snow; particleCount: 100; color: #FFD700; size: 2"
            position="0 1 0"
            visible="false">
        </a-entity>
    </a-entity>

    <!-- Lighting -->
    <a-light type="ambient" color="#404040" intensity="0.4"></a-light>
    <a-light type="directional" position="1 1 0" color="#FFFFFF" intensity="0.6"></a-light>
</a-scene>`;
  }
  
  /**
   * Generate marker image for AR tracking
   */
  private generateMarkerImage(): string {
    // In a real implementation, this would generate a unique marker image
    // For now, return a base64 encoded marker pattern
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }
  
  /**
   * Validate AR scene performance
   */
  async validateARPerformance(
    experienceId: string,
    performanceData: {
      average_fps: number;
      load_time_ms: number;
      memory_usage_mb: number;
      error_count: number;
      user_completion_rate: number;
    }
  ): Promise<{
    performance_score: number;
    recommendations: string[];
    optimization_needed: boolean;
  }> {
    const supabase = await this.getSupabaseClient();
    
    // Calculate performance score (0-100)
    let score = 100;
    const recommendations: string[] = [];
    
    // FPS penalties
    if (performanceData.average_fps < 20) {
      score -= 30;
      recommendations.push('Reduce polygon count or texture resolution');
    } else if (performanceData.average_fps < 25) {
      score -= 15;
      recommendations.push('Consider minor asset optimization');
    }
    
    // Load time penalties
    if (performanceData.load_time_ms > 5000) {
      score -= 20;
      recommendations.push('Implement progressive loading or reduce asset size');
    } else if (performanceData.load_time_ms > 3000) {
      score -= 10;
      recommendations.push('Consider asset compression');
    }
    
    // Memory usage penalties
    if (performanceData.memory_usage_mb > 200) {
      score -= 25;
      recommendations.push('Optimize textures and reduce model complexity');
    } else if (performanceData.memory_usage_mb > 100) {
      score -= 10;
      recommendations.push('Monitor memory usage on lower-end devices');
    }
    
    // Error rate penalties
    if (performanceData.error_count > 0) {
      score -= performanceData.error_count * 5;
      recommendations.push('Fix compatibility issues causing errors');
    }
    
    // User completion rate
    if (performanceData.user_completion_rate < 0.7) {
      score -= 15;
      recommendations.push('Improve user experience - low completion rate detected');
    }
    
    // Update experience performance record
    await supabase
      .from('cluequest_ar_experiences')
      .update({
        completion_rate: performanceData.user_completion_rate * 100,
        error_rate: (performanceData.error_count / Math.max(1, performanceData.user_completion_rate * 100)) * 100,
        updated_at: new Date().toISOString()
      })
      .eq('id', experienceId);
    
    return {
      performance_score: Math.max(0, Math.round(score)),
      recommendations,
      optimization_needed: score < 70
    };
  }
  
  /**
   * Get AR asset library for adventure creation
   */
  async getARAssetLibrary(
    category?: ARAssetCategory,
    performanceTier?: string
  ): Promise<{
    assets: Array<{
      id: string;
      name: string;
      category: string;
      thumbnail_url: string;
      file_size_mb: number;
      polygon_count: number;
      tags: string[];
      performance_rating: number;
    }>;
    categories: string[];
    total_count: number;
  }> {
    const supabase = await this.getSupabaseClient();
    
    let query = supabase
      .from('cluequest_ar_assets')
      .select(`
        id,
        name,
        description,
        category,
        thumbnail_url,
        file_size_bytes,
        polygon_count,
        ar_framework_compatibility,
        load_success_rate,
        average_load_time_ms,
        license_type,
        created_at
      `);
    
    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    
    // Filter by performance tier
    if (performanceTier === 'low') {
      query = query.lt('file_size_bytes', 2 * 1024 * 1024); // < 2MB
      query = query.lt('polygon_count', 2000);
    } else if (performanceTier === 'medium') {
      query = query.lt('file_size_bytes', 5 * 1024 * 1024); // < 5MB
      query = query.lt('polygon_count', 10000);
    }
    
    query = query.order('load_success_rate', { ascending: false });
    
    const { data: assets, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch AR assets: ${error.message}`);
    }
    
    // Get available categories
    const { data: categoryData } = await supabase
      .from('cluequest_ar_assets')
      .select('category')
      .order('category');
    
    const categories = [...new Set(categoryData?.map((item: any) => item.category) || [])];
    
    // Transform assets for response
    const transformedAssets = assets?.map((asset: any) => ({
      id: asset.id,
      name: asset.name,
      category: asset.category,
      thumbnail_url: asset.thumbnail_url,
      file_size_mb: Math.round((asset.file_size_bytes / (1024 * 1024)) * 100) / 100,
      polygon_count: asset.polygon_count,
      tags: asset.ar_framework_compatibility || [],
      performance_rating: Math.round((asset.load_success_rate || 0) * 100)
    })) || [];
    
    return {
      assets: transformedAssets,
      categories: categories as string[],
      total_count: transformedAssets.length
    };
  }
  
  /**
   * Upload and process custom 3D asset
   */
  async uploadCustomAsset(
    userId: string,
    organizationId: string,
    file: File,
    metadata: {
      name: string;
      description?: string;
      category: ARAssetCategory;
      license_type?: string;
    }
  ): Promise<{
    asset_id: string;
    processing_status: 'uploaded' | 'processing' | 'optimized' | 'failed';
    estimated_processing_time_minutes: number;
  }> {
    const supabase = await this.getSupabaseClient();
    
    // Validate file type and size
    const allowedTypes = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only GLTF/GLB files supported.');
    }
    
    const maxSizeMB = 50;
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`File too large. Maximum size is ${maxSizeMB}MB.`);
    }
    
    // Upload to Supabase Storage
    const fileName = `custom-assets/${organizationId}/${userId}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ar-assets')
      .upload(fileName, file);
    
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('ar-assets')
      .getPublicUrl(fileName);
    
    // Create asset record
    const { data: asset, error: createError } = await supabase
      .from('cluequest_ar_assets')
      .insert({
        name: metadata.name,
        description: metadata.description,
        category: metadata.category,
        model_url: publicUrl.publicUrl,
        file_size_bytes: file.size,
        optimized_for_mobile: false, // Will be optimized in background
        license_type: metadata.license_type || 'proprietary',
        loading_priority: 'normal'
      })
      .select()
      .single();
    
    if (createError) {
      throw new Error(`Failed to create asset record: ${createError.message}`);
    }
    
    // Queue for background optimization
    await this.queueAssetOptimization(asset.id);
    
    return {
      asset_id: asset.id,
      processing_status: 'uploaded',
      estimated_processing_time_minutes: Math.round(file.size / (1024 * 1024) * 2) // ~2 minutes per MB
    };
  }
  
  /**
   * Queue asset for background optimization
   */
  private async queueAssetOptimization(assetId: string): Promise<void> {
    // In a real implementation, this would queue the asset for background processing
    // using a job queue like Redis Bull or similar
  }
}

// Export singleton instance
export const arService = new ARService();
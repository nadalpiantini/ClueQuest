/**
 * Adventure Persistence Service
 * Handles saving/loading adventure data to/from Supabase
 * Includes location and QR code data management
 */

import { createClient } from '@/lib/supabase/client'

export interface AdventureData {
  id: string
  title: string
  theme: string
  duration: number
  maxPlayers: number
  storyContent: string
  locations: Location[]
  qrCodes: QRCodeData[]
  challengeLocationMappings: ChallengeLocationMapping[]
  adventureType: 'linear' | 'parallel' | 'hub'
  challengeTypes: string[]
  narrative: string
  storyType: string
  storyFramework: string
  aiGenerated: boolean
  roles: string[]
  customCharacters: any[]
  customThemes: any[]
  customColors: {
    primary: string
    secondary: string
    accent: string
  }
  // Additional fields...
  ranking: string
  rewards: string[]
  accessMode: string
  deviceLimits: number
  createdAt?: string
  updatedAt?: string
  creatorId?: string
  status: 'draft' | 'published' | 'archived'
}

export interface Location {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  address?: string
  radius: number
  qrCodeId?: string
  order: number
  isRequired: boolean
}

export interface QRCodeData {
  id: string
  locationId: string
  locationName: string
  adventureId: string
  securityToken: string
  hmacSignature: string
  expiresAt: Date
  usageLimit: number
  currentUsage: number
}

export interface ChallengeLocationMapping {
  id: string
  challengeId: string
  locationId: string
  unlockConditions: UnlockCondition[]
  progressiveHints: ProgressiveHint[]
  isStartingPoint: boolean
  completionRewards: number
}

export interface UnlockCondition {
  type: 'location_proximity' | 'previous_challenge' | 'qr_scan' | 'time_window' | 'team_size'
  parameters: Record<string, any>
  description: string
}

export interface ProgressiveHint {
  delayMinutes: number
  hint: string
  penaltyPoints: number
}

class AdventurePersistenceService {
  private supabase = createClient()

  /**
   * Save adventure data to Supabase
   */
  async saveAdventure(adventureData: AdventureData): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' }
      }

      // Prepare data for database
      const adventureRecord = {
        id: adventureData.id,
        title: adventureData.title,
        description: adventureData.storyContent,
        theme: adventureData.theme,
        duration_minutes: adventureData.duration,
        max_players: adventureData.maxPlayers,
        adventure_type: adventureData.adventureType,
        story_framework: adventureData.storyFramework,
        ai_generated: adventureData.aiGenerated,
        challenge_types: adventureData.challengeTypes,
        roles: adventureData.roles,
        custom_colors: adventureData.customColors,
        ranking_mode: adventureData.ranking,
        access_mode: adventureData.accessMode,
        device_limits: adventureData.deviceLimits,
        status: adventureData.status || 'draft',
        creator_id: user.id,
        updated_at: new Date().toISOString()
      }

      // Save main adventure record
      const { data: adventure, error: adventureError } = await this.supabase
        .from('cluequest_adventures')
        .upsert(adventureRecord, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single()

      if (adventureError) {
        return { success: false, error: adventureError.message }
      }

      // Save locations
      if (adventureData.locations.length > 0) {
        const locationRecords = adventureData.locations.map(location => ({
          id: location.id,
          adventure_id: adventureData.id,
          name: location.name,
          description: location.description,
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
          radius_meters: location.radius,
          order_index: location.order,
          is_required: location.isRequired,
          created_at: new Date().toISOString()
        }))

        const { error: locationsError } = await this.supabase
          .from('cluequest_adventure_locations')
          .upsert(locationRecords, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })

        if (locationsError) {
          return { success: false, error: `Failed to save locations: ${locationsError.message}` }
        }
      }

      // Save QR codes
      if (adventureData.qrCodes.length > 0) {
        const qrRecords = adventureData.qrCodes.map(qr => ({
          id: qr.id,
          adventure_id: adventureData.id,
          location_id: qr.locationId,
          security_token: qr.securityToken,
          hmac_signature: qr.hmacSignature,
          expires_at: qr.expiresAt.toISOString(),
          usage_limit: qr.usageLimit,
          current_usage: qr.currentUsage,
          created_at: new Date().toISOString()
        }))

        const { error: qrError } = await this.supabase
          .from('cluequest_adventure_qr_codes')
          .upsert(qrRecords, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })

        if (qrError) {
          return { success: false, error: `Failed to save QR codes: ${qrError.message}` }
        }
      }

      // Save challenge-location mappings
      if (adventureData.challengeLocationMappings.length > 0) {
        const mappingRecords = adventureData.challengeLocationMappings.map(mapping => ({
          id: mapping.id,
          adventure_id: adventureData.id,
          challenge_id: mapping.challengeId,
          location_id: mapping.locationId,
          unlock_conditions: mapping.unlockConditions,
          progressive_hints: mapping.progressiveHints,
          is_starting_point: mapping.isStartingPoint,
          completion_rewards: mapping.completionRewards,
          created_at: new Date().toISOString()
        }))

        const { error: mappingsError } = await this.supabase
          .from('cluequest_challenge_location_mappings')
          .upsert(mappingRecords, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })

        if (mappingsError) {
          return { success: false, error: `Failed to save mappings: ${mappingsError.message}` }
        }
      }

      return { success: true, id: adventureData.id }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Load adventure data from Supabase
   */
  async loadAdventure(adventureId: string): Promise<{ success: boolean; data?: AdventureData; error?: string }> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' }
      }

      // Load main adventure record
      const { data: adventure, error: adventureError } = await this.supabase
        .from('cluequest_adventures')
        .select('*')
        .eq('id', adventureId)
        .eq('creator_id', user.id)
        .single()

      if (adventureError || !adventure) {
        return { success: false, error: 'Adventure not found' }
      }

      // Load locations
      const { data: locations, error: locationsError } = await this.supabase
        .from('cluequest_adventure_locations')
        .select('*')
        .eq('adventure_id', adventureId)
        .order('order_index', { ascending: true })

      if (locationsError) {
      }

      // Load QR codes
      const { data: qrCodes, error: qrError } = await this.supabase
        .from('cluequest_adventure_qr_codes')
        .select('*')
        .eq('adventure_id', adventureId)

      if (qrError) {
      }

      // Load challenge-location mappings
      const { data: mappings, error: mappingsError } = await this.supabase
        .from('cluequest_challenge_location_mappings')
        .select('*')
        .eq('adventure_id', adventureId)

      if (mappingsError) {
      }

      // Transform data back to component format
      const adventureData: AdventureData = {
        id: adventure.id,
        title: adventure.title,
        theme: adventure.theme,
        duration: adventure.duration_minutes,
        maxPlayers: adventure.max_players,
        storyContent: adventure.description || '',
        adventureType: adventure.adventure_type || 'linear',
        storyFramework: adventure.story_framework || 'hero_journey',
        aiGenerated: adventure.ai_generated || false,
        challengeTypes: adventure.challenge_types || [],
        roles: adventure.roles || [],
        customColors: adventure.custom_colors || {
          primary: '#f59e0b',
          secondary: '#8b5cf6',
          accent: '#10b981'
        },
        ranking: adventure.ranking_mode || 'public',
        accessMode: adventure.access_mode || 'public',
        deviceLimits: adventure.device_limits || 1,
        status: adventure.status || 'draft',
        createdAt: adventure.created_at,
        updatedAt: adventure.updated_at,
        creatorId: adventure.creator_id,
        
        // Transform locations
        locations: (locations || []).map(loc => ({
          id: loc.id,
          name: loc.name,
          description: loc.description,
          latitude: loc.latitude,
          longitude: loc.longitude,
          address: loc.address,
          radius: loc.radius_meters,
          order: loc.order_index,
          isRequired: loc.is_required,
          qrCodeId: qrCodes?.find(qr => qr.location_id === loc.id)?.id
        })),
        
        // Transform QR codes
        qrCodes: (qrCodes || []).map(qr => ({
          id: qr.id,
          locationId: qr.location_id,
          locationName: locations?.find(loc => loc.id === qr.location_id)?.name || 'Unknown',
          adventureId: qr.adventure_id,
          securityToken: qr.security_token,
          hmacSignature: qr.hmac_signature,
          expiresAt: new Date(qr.expires_at),
          usageLimit: qr.usage_limit,
          currentUsage: qr.current_usage
        })),
        
        // Transform mappings
        challengeLocationMappings: (mappings || []).map(mapping => ({
          id: mapping.id,
          challengeId: mapping.challenge_id,
          locationId: mapping.location_id,
          unlockConditions: mapping.unlock_conditions || [],
          progressiveHints: mapping.progressive_hints || [],
          isStartingPoint: mapping.is_starting_point,
          completionRewards: mapping.completion_rewards
        })),

        // Default values for missing fields
        narrative: adventure.narrative || '',
        storyType: adventure.story_type || '',
        customCharacters: [],
        customThemes: [],
        rewards: []
      }

      return { success: true, data: adventureData }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Get user's adventures
   */
  async getUserAdventures(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { data: adventures, error } = await this.supabase
        .from('cluequest_adventures')
        .select(`
          id,
          title,
          theme,
          status,
          duration_minutes,
          max_players,
          created_at,
          updated_at,
          cluequest_adventure_locations(count),
          cluequest_adventure_qr_codes(count)
        `)
        .eq('creator_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: adventures }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Delete adventure and all related data
   */
  async deleteAdventure(adventureId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' }
      }

      // Delete in cascade order: mappings, qr codes, locations, then adventure
      await Promise.all([
        this.supabase.from('cluequest_challenge_location_mappings').delete().eq('adventure_id', adventureId),
        this.supabase.from('cluequest_adventure_qr_codes').delete().eq('adventure_id', adventureId),
        this.supabase.from('cluequest_adventure_locations').delete().eq('adventure_id', adventureId)
      ])

      const { error } = await this.supabase
        .from('cluequest_adventures')
        .delete()
        .eq('id', adventureId)
        .eq('creator_id', user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Publish adventure (change status to published)
   */
  async publishAdventure(adventureId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { error } = await this.supabase
        .from('cluequest_adventures')
        .update({ 
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', adventureId)
        .eq('creator_id', user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Enhanced localStorage operations with location and QR data
   */
  saveToLocalStorage(adventureData: AdventureData) {
    if (typeof window === 'undefined') return

    try {
      const dataToSave = {
        ...adventureData,
        // Ensure dates are serialized properly
        qrCodes: adventureData.qrCodes.map(qr => ({
          ...qr,
          expiresAt: qr.expiresAt.toISOString()
        })),
        lastSaved: new Date().toISOString()
      }

      localStorage.setItem('cluequest-builder-data', JSON.stringify(dataToSave))
    } catch (error) {
    }
  }

  loadFromLocalStorage(): AdventureData | null {
    if (typeof window === 'undefined') return null

    try {
      const saved = localStorage.getItem('cluequest-builder-data')
      if (saved) {
        const parsedData = JSON.parse(saved)
        
        // Restore date objects
        if (parsedData.qrCodes) {
          parsedData.qrCodes = parsedData.qrCodes.map((qr: any) => ({
            ...qr,
            expiresAt: new Date(qr.expiresAt)
          }))
        }
        
        return parsedData
      }
    } catch (error) {
    }
    
    return null
  }

  clearLocalStorage() {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem('cluequest-builder-data')
    } catch (error) {
    }
  }
}

// Export singleton instance
export const adventurePersistence = new AdventurePersistenceService()

// Export service class for testing
export default AdventurePersistenceService
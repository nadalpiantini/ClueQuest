/**
 * Adventure Persistence Service
 * Handles saving/loading adventure data to/from Supabase
 * Includes location and QR code data management
 */

import { createClient } from '@/lib/supabase/client'

// Type definitions for database tables (temporary until Supabase types are updated)
interface AdventureRow {
  id: string
  title: string
  theme: string
  duration_minutes: number
  max_players: number
  description: string | null
  adventure_type: string | null
  story_framework: string | null
  ai_generated: boolean | null
  challenge_types: string[] | null
  roles: string[] | null
  custom_colors: any | null
  ranking_mode: string | null
  access_mode: string | null
  device_limits: number | null
  status: string | null
  created_at: string | null
  updated_at: string | null
  creator_id: string | null
  narrative: string | null
  story_type: string | null
}

interface SceneRow {
  id: string
  adventure_id: string
  title: string
  description: string | null
  order_index: number
  scene_config: any | null
  completion_criteria: string | null
}

interface QRCodeRow {
  id: string
  scene_id: string
  qr_data: string
  scan_count: number | null
}

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

      // Save locations - using scenes table as locations are stored as scenes
      if (adventureData.locations.length > 0) {
        const locationRecords = adventureData.locations.map(location => ({
          id: location.id,
          adventure_id: adventureData.id,
          title: location.name,
          description: location.description,
          order_index: location.order,
          interaction_type: 'location',
          completion_criteria: JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address,
            radius: location.radius,
            isRequired: location.isRequired
          }),
          points_reward: 0,
          narrative_data: {},
          scene_config: {},
          is_active: true,
          created_at: new Date().toISOString()
        }))

        const { error: locationsError } = await this.supabase
          .from('cluequest_scenes')
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
          scene_id: qr.locationId, // Using scene_id instead of location_id
          qr_data: qr.securityToken, // Using qr_data field
          location: JSON.stringify({
            latitude: 0, // Will be populated from scene data
            longitude: 0
          }),
          is_active: true,
          scan_count: qr.currentUsage,
          created_at: new Date().toISOString()
        }))

        const { error: qrError } = await this.supabase
          .from('cluequest_qr_codes')
          .upsert(qrRecords, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })

        if (qrError) {
          return { success: false, error: `Failed to save QR codes: ${qrError.message}` }
        }
      }

      // Save challenge-location mappings - storing as scene configuration
      if (adventureData.challengeLocationMappings.length > 0) {
        // Store mappings in the scene_config of the corresponding scenes
        for (const mapping of adventureData.challengeLocationMappings) {
          const { error: updateError } = await this.supabase
            .from('cluequest_scenes')
            .update({
              scene_config: {
                challenge_id: mapping.challengeId,
                unlock_conditions: mapping.unlockConditions,
                progressive_hints: mapping.progressiveHints,
                is_starting_point: mapping.isStartingPoint,
                completion_rewards: mapping.completionRewards
              }
            })
            .eq('id', mapping.locationId)
            .eq('adventure_id', adventureData.id)

          if (updateError) {
            return { success: false, error: `Failed to save mapping for scene ${mapping.locationId}: ${updateError.message}` }
          }
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

      // Type the adventure data properly
      const typedAdventure = adventure as AdventureRow

      // Load locations (stored as scenes)
      const { data: locations, error: locationsError } = await this.supabase
        .from('cluequest_scenes')
        .select('*')
        .eq('adventure_id', adventureId)
        .eq('interaction_type', 'location')
        .order('order_index', { ascending: true })

      if (locationsError) {
        console.warn('Failed to load locations:', locationsError.message)
      }

      // Type the locations data properly
      const typedLocations = (locations || []) as SceneRow[]

      // Load QR codes
      const { data: qrCodes, error: qrError } = await this.supabase
        .from('cluequest_qr_codes')
        .select('*')
        .in('scene_id', typedLocations.map(loc => loc.id))

      if (qrError) {
        console.warn('Failed to load QR codes:', qrError.message)
      }

      // Type the QR codes data properly
      const typedQrCodes = (qrCodes || []) as QRCodeRow[]

      // Load challenge-location mappings (stored in scene_config)
      const mappings = typedLocations.map(scene => {
        const config = scene.scene_config as any
        return {
          id: `${scene.id}-mapping`,
          challengeId: config?.challenge_id || '',
          locationId: scene.id,
          unlockConditions: config?.unlock_conditions || [],
          progressiveHints: config?.progressive_hints || [],
          isStartingPoint: config?.is_starting_point || false,
          completionRewards: config?.completion_rewards || 0
        }
      })

      // Transform data back to component format
      const adventureData: AdventureData = {
        id: typedAdventure.id,
        title: typedAdventure.title,
        theme: typedAdventure.theme,
        duration: typedAdventure.duration_minutes,
        maxPlayers: typedAdventure.max_players,
        storyContent: typedAdventure.description || '',
        adventureType: (typedAdventure.adventure_type as 'linear' | 'parallel' | 'hub') || 'linear',
        storyFramework: typedAdventure.story_framework || 'hero_journey',
        aiGenerated: typedAdventure.ai_generated || false,
        challengeTypes: typedAdventure.challenge_types || [],
        roles: typedAdventure.roles || [],
        customColors: typedAdventure.custom_colors || {
          primary: '#f59e0b',
          secondary: '#8b5cf6',
          accent: '#10b981'
        },
        ranking: typedAdventure.ranking_mode || 'public',
        accessMode: typedAdventure.access_mode || 'public',
        deviceLimits: typedAdventure.device_limits || 1,
        status: (typedAdventure.status as 'draft' | 'published' | 'archived') || 'draft',
        createdAt: typedAdventure.created_at || undefined,
        updatedAt: typedAdventure.updated_at || undefined,
        creatorId: typedAdventure.creator_id || undefined,
        
        // Transform locations
        locations: typedLocations.map(loc => {
          const locationData = loc.completion_criteria ? JSON.parse(loc.completion_criteria) : {}
          return {
            id: loc.id,
            name: loc.title,
            description: loc.description || '',
            latitude: locationData.latitude || 0,
            longitude: locationData.longitude || 0,
            address: locationData.address || '',
            radius: locationData.radius || 50,
            order: loc.order_index,
            isRequired: locationData.isRequired || false,
            qrCodeId: typedQrCodes?.find(qr => qr.scene_id === loc.id)?.id
          }
        }),
        
        // Transform QR codes
        qrCodes: typedQrCodes.map(qr => ({
          id: qr.id,
          locationId: qr.scene_id,
          locationName: typedLocations?.find(loc => loc.id === qr.scene_id)?.title || 'Unknown',
          adventureId: adventureId,
          securityToken: qr.qr_data,
          hmacSignature: '', // Not stored in current schema
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24h
          usageLimit: 1000, // Default limit
          currentUsage: qr.scan_count || 0
        })),
        
        // Transform mappings
        challengeLocationMappings: mappings,

        // Default values for missing fields
        narrative: typedAdventure.narrative || '',
        storyType: typedAdventure.story_type || '',
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
          theme_name,
          status,
          estimated_duration,
          max_participants,
          created_at,
          updated_at
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

      // Delete in cascade order: qr codes, scenes, then adventure
      await Promise.all([
        this.supabase.from('cluequest_qr_codes').delete().in('scene_id', 
          (await this.supabase.from('cluequest_scenes').select('id').eq('adventure_id', adventureId)).data?.map(s => s.id) || []
        ),
        this.supabase.from('cluequest_scenes').delete().eq('adventure_id', adventureId)
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
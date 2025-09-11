import { Client } from '@googlemaps/google-maps-services-js'

export interface GeocodingResult {
  latitude: number
  longitude: number
  formattedAddress: string
  placeId?: string
  addressComponents?: {
    streetNumber?: string
    route?: string
    locality?: string
    administrativeAreaLevel1?: string
    country?: string
    postalCode?: string
  }
}

export interface GeocodingError {
  code: string
  message: string
}

class GeocodingService {
  private client: Client
  private apiKey: string

  constructor() {
    this.client = new Client({})
    // Production API key for Google Maps
    this.apiKey = 'AIzaSyAy-oS-hSSi38S5nNnuc4ykUK8F9RBVCH0'
    
    if (!this.apiKey) {
      console.warn('⚠️ Google Maps API key not configured.')
      console.info('🔧 To enable real geocoding, configure the API key.')
    } else {
      console.info('🗺️ Google Maps API key configured. Using real geocoding service.')
    }
  }

  /**
   * Geocode an address to get coordinates
   */
  async geocodeAddress(address: string): Promise<GeocodingResult | GeocodingError> {
    if (!this.apiKey) {
      return {
        code: 'API_KEY_MISSING',
        message: 'Google Maps API key is required for geocoding'
      }
    }

    try {
      const response = await this.client.geocode({
        params: {
          address: address,
          key: this.apiKey,
        },
      })

      if (response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0]
        const location = result.geometry.location

        return {
          latitude: location.lat,
          longitude: location.lng,
          formattedAddress: result.formatted_address,
          placeId: result.place_id,
          addressComponents: this.parseAddressComponents(result.address_components || [])
        }
      }

      return {
        code: 'ZERO_RESULTS',
        message: 'No results found for the given address'
      }
    } catch (error: any) {
      console.error('Google Maps Geocoding Error:', error.message)
      return {
        code: 'API_ERROR',
        message: `Geocoding failed: ${error.message}`
      }
    }
  }

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult | GeocodingError> {
    if (!this.apiKey) {
      return {
        code: 'API_KEY_MISSING',
        message: 'Google Maps API key is required for reverse geocoding'
      }
    }

    try {
      const response = await this.client.reverseGeocode({
        params: {
          latlng: { lat: latitude, lng: longitude },
          key: this.apiKey,
        },
      })

      if (response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0]

        return {
          latitude,
          longitude,
          formattedAddress: result.formatted_address,
          placeId: result.place_id,
          addressComponents: this.parseAddressComponents(result.address_components || [])
        }
      }

      return {
        code: 'ZERO_RESULTS',
        message: 'No results found for the given coordinates'
      }
    } catch (error: any) {
      console.error('Google Maps Reverse Geocoding Error:', error.message)
      return {
        code: 'API_ERROR',
        message: `Reverse geocoding failed: ${error.message}`
      }
    }
  }

  /**
   * Search for places using text query
   */
  async searchPlaces(query: string): Promise<GeocodingResult[]> {
    if (!this.apiKey) {
      console.error('Google Maps API key not configured for place search')
      return []
    }

    try {
      // Use Geocoding API instead of Places API to avoid 403 errors
      const response = await this.client.geocode({
        params: {
          address: query,
          key: this.apiKey,
        },
      })

      if (response.data.results && response.data.results.length > 0) {
        return response.data.results.slice(0, 5).map((result) => ({
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          formattedAddress: result.formatted_address,
          placeId: result.place_id,
          addressComponents: this.parseAddressComponents(result.address_components || [])
        }))
      }

      return []
    } catch (error: any) {
      console.error('Google Maps Place Search Error:', error.message)
      return []
    }
  }

  /**
   * Parse address components from Google Maps response
   */
  private parseAddressComponents(components: any[]): GeocodingResult['addressComponents'] {
    const parsed: GeocodingResult['addressComponents'] = {}

    for (const component of components) {
      const types = component.types

      if (types.includes('street_number')) {
        parsed.streetNumber = component.long_name
      } else if (types.includes('route')) {
        parsed.route = component.long_name
      } else if (types.includes('locality')) {
        parsed.locality = component.long_name
      } else if (types.includes('administrative_area_level_1')) {
        parsed.administrativeAreaLevel1 = component.long_name
      } else if (types.includes('country')) {
        parsed.country = component.long_name
      } else if (types.includes('postal_code')) {
        parsed.postalCode = component.long_name
      }
    }

    return parsed
  }
}

// Export singleton instance
export const geocodingService = new GeocodingService()
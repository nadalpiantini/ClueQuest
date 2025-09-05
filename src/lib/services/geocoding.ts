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
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || ''
    
    if (!this.apiKey) {
      console.warn('Google Maps API key not found. Geocoding will use fallback service.')
    }
  }

  /**
   * Geocode an address to get coordinates
   */
  async geocodeAddress(address: string): Promise<GeocodingResult | GeocodingError> {
    if (!this.apiKey) {
      return this.fallbackGeocode(address)
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
      console.error('Geocoding error:', error)
      
      // Fallback to mock service if API fails
      return this.fallbackGeocode(address)
    }
  }

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult | GeocodingError> {
    if (!this.apiKey) {
      return this.fallbackReverseGeocode(latitude, longitude)
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
      console.error('Reverse geocoding error:', error)
      
      // Fallback to mock service if API fails
      return this.fallbackReverseGeocode(latitude, longitude)
    }
  }

  /**
   * Search for places using text query
   */
  async searchPlaces(query: string): Promise<GeocodingResult[] | GeocodingError> {
    if (!this.apiKey) {
      return this.fallbackSearchPlaces(query)
    }

    try {
      const response = await this.client.placeAutocomplete({
        params: {
          input: query,
          key: this.apiKey,
        },
      })

      if (response.data.predictions && response.data.predictions.length > 0) {
        // Get details for each prediction
        const results: GeocodingResult[] = []
        
        for (const prediction of response.data.predictions.slice(0, 5)) { // Limit to 5 results
          try {
            const detailsResponse = await this.client.placeDetails({
              params: {
                place_id: prediction.place_id,
                fields: ['geometry', 'formatted_address', 'address_components'],
                key: this.apiKey,
              },
            })

            if (detailsResponse.data.result) {
              const result = detailsResponse.data.result
              const location = result.geometry?.location

              if (location) {
                results.push({
                  latitude: location.lat,
                  longitude: location.lng,
                  formattedAddress: result.formatted_address || prediction.description,
                  placeId: prediction.place_id,
                  addressComponents: this.parseAddressComponents(result.address_components || [])
                })
              }
            }
          } catch (detailError) {
            console.warn('Failed to get place details for:', prediction.place_id)
          }
        }

        return results
      }

      return []
    } catch (error: any) {
      console.error('Place search error:', error)
      
      // Fallback to mock service if API fails
      return this.fallbackSearchPlaces(query)
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

  /**
   * Fallback geocoding service when Google Maps API is not available
   */
  private fallbackGeocode(address: string): GeocodingResult {
    // Simple fallback that returns mock coordinates
    // In production, you might want to use a different geocoding service
    const mockCoords = this.getMockCoordinates(address)
    
    return {
      latitude: mockCoords.latitude,
      longitude: mockCoords.longitude,
      formattedAddress: address,
      addressComponents: {
        locality: 'New York',
        administrativeAreaLevel1: 'NY',
        country: 'United States'
      }
    }
  }

  /**
   * Fallback reverse geocoding service
   */
  private fallbackReverseGeocode(latitude: number, longitude: number): GeocodingResult {
    return {
      latitude,
      longitude,
      formattedAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      addressComponents: {
        locality: 'New York',
        administrativeAreaLevel1: 'NY',
        country: 'United States'
      }
    }
  }

  /**
   * Fallback place search service
   */
  private fallbackSearchPlaces(query: string): GeocodingResult[] {
    const mockCoords = this.getMockCoordinates(query)
    
    return [{
      latitude: mockCoords.latitude,
      longitude: mockCoords.longitude,
      formattedAddress: query,
      addressComponents: {
        locality: 'New York',
        administrativeAreaLevel1: 'NY',
        country: 'United States'
      }
    }]
  }

  /**
   * Generate mock coordinates based on address string
   */
  private getMockCoordinates(address: string): { latitude: number; longitude: number } {
    // Generate consistent mock coordinates based on address hash
    let hash = 0
    for (let i = 0; i < address.length; i++) {
      const char = address.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }

    // Use hash to generate coordinates around NYC area
    const latOffset = (hash % 1000) / 10000 - 0.05 // ±0.05 degrees
    const lngOffset = ((hash >> 10) % 1000) / 10000 - 0.05 // ±0.05 degrees

    return {
      latitude: 40.7128 + latOffset,
      longitude: -74.0060 + lngOffset
    }
  }
}

// Export singleton instance
export const geocodingService = new GeocodingService()

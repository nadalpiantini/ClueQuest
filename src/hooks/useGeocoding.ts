import { useState, useCallback } from 'react'
import { GeocodingResult, GeocodingError } from '@/lib/services/geocoding'

interface UseGeocodingReturn {
  isLoading: boolean
  error: string | null
  geocodeAddress: (address: string) => Promise<GeocodingResult | null>
  reverseGeocode: (latitude: number, longitude: number) => Promise<GeocodingResult | null>
  searchPlaces: (query: string) => Promise<GeocodingResult[] | null>
  clearError: () => void
}

export function useGeocoding(): UseGeocodingReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const geocodeAddress = useCallback(async (address: string): Promise<GeocodingResult | null> => {
    if (!address.trim()) {
      setError('Address is required')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/geocoding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'geocode',
          query: address,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if ('code' in result && 'message' in result) {
        // This is an error response
        setError(result.message)
        return null
      }

      return result as GeocodingResult
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to geocode address'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reverseGeocode = useCallback(async (latitude: number, longitude: number): Promise<GeocodingResult | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/geocoding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reverse',
          latitude,
          longitude,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if ('code' in result && 'message' in result) {
        // This is an error response
        setError(result.message)
        return null
      }

      return result as GeocodingResult
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reverse geocode coordinates'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchPlaces = useCallback(async (query: string): Promise<GeocodingResult[] | null> => {
    if (!query.trim()) {
      setError('Search query is required')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/geocoding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'search',
          query,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if ('code' in result && 'message' in result) {
        // This is an error response
        setError(result.message)
        return null
      }

      return result as GeocodingResult[]
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    geocodeAddress,
    reverseGeocode,
    searchPlaces,
    clearError,
  }
}

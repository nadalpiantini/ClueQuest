import { NextRequest, NextResponse } from 'next/server'
import { geocodingService } from '@/lib/services/geocoding'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, query, latitude, longitude } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'geocode':
        if (!query) {
          return NextResponse.json(
            { error: 'Query is required for geocoding' },
            { status: 400 }
          )
        }
        
        const geocodeResult = await geocodingService.geocodeAddress(query)
        return NextResponse.json(geocodeResult)

      case 'reverse':
        if (latitude === undefined || longitude === undefined) {
          return NextResponse.json(
            { error: 'Latitude and longitude are required for reverse geocoding' },
            { status: 400 }
          )
        }
        
        const reverseResult = await geocodingService.reverseGeocode(latitude, longitude)
        return NextResponse.json(reverseResult)

      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Query is required for place search' },
            { status: 400 }
          )
        }
        
        const searchResult = await geocodingService.searchPlaces(query)
        return NextResponse.json(searchResult)

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: geocode, reverse, search' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const query = searchParams.get('query')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  try {
    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'geocode':
        if (!query) {
          return NextResponse.json(
            { error: 'Query is required for geocoding' },
            { status: 400 }
          )
        }
        
        const geocodeResult = await geocodingService.geocodeAddress(query)
        return NextResponse.json(geocodeResult)

      case 'reverse':
        if (!lat || !lng) {
          return NextResponse.json(
            { error: 'Latitude and longitude are required for reverse geocoding' },
            { status: 400 }
          )
        }
        
        const reverseResult = await geocodingService.reverseGeocode(
          parseFloat(lat),
          parseFloat(lng)
        )
        return NextResponse.json(reverseResult)

      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Query is required for place search' },
            { status: 400 }
          )
        }
        
        const searchResult = await geocodingService.searchPlaces(query)
        return NextResponse.json(searchResult)

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: geocode, reverse, search' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

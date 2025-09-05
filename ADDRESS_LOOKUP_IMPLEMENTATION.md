# Address Lookup Implementation - ClueQuest

## Overview

This document describes the implementation of real address lookup functionality using Google Maps API, replacing the previous mock implementation in the ClueQuest application.

## Changes Made

### 1. Google Maps API Integration

#### New Files Created:
- `src/lib/services/geocoding.ts` - Core geocoding service with Google Maps API integration
- `src/app/api/geocoding/route.ts` - API endpoint for geocoding operations
- `src/hooks/useGeocoding.ts` - React hook for geocoding functionality
- `GOOGLE_MAPS_SETUP.md` - Setup guide for Google Maps API
- `scripts/test-geocoding.js` - Test script for geocoding functionality

#### Modified Files:
- `src/components/builder/LocationBuilder.tsx` - Updated to use real geocoding
- `src/app/layout.tsx` - Added geolocation permissions
- `package.json` - Added Google Maps dependency and test script

### 2. Features Implemented

#### Geocoding Service (`src/lib/services/geocoding.ts`)
- **Address to Coordinates**: Convert street addresses to lat/lng
- **Reverse Geocoding**: Convert coordinates back to addresses
- **Place Search**: Autocomplete search for businesses and landmarks
- **Fallback System**: Mock coordinates when API is unavailable
- **Error Handling**: Comprehensive error management

#### API Endpoint (`src/app/api/geocoding/route.ts`)
- **POST /api/geocoding**: Main endpoint for geocoding operations
- **GET /api/geocoding**: Alternative GET endpoint with query parameters
- **Actions Supported**:
  - `geocode`: Convert address to coordinates
  - `reverse`: Convert coordinates to address
  - `search`: Search for places with autocomplete

#### React Hook (`src/hooks/useGeocoding.ts`)
- **useGeocoding()**: Custom hook for geocoding operations
- **Loading States**: Track loading status for UI feedback
- **Error Handling**: Manage and display errors
- **TypeScript Support**: Full type safety

#### Enhanced LocationBuilder Component
- **Real-time Search**: Autocomplete as user types
- **Search Results Dropdown**: Display multiple location options
- **Error Display**: Show geocoding errors to users
- **Improved UX**: Better loading states and feedback

### 3. Security & Permissions

#### Geolocation Permissions
- Added `Permissions-Policy: geolocation=*` to layout
- Improved geolocation error handling
- Optional geolocation with graceful fallback

#### API Security
- Environment variable for API key
- Server-side API calls (key not exposed to client)
- Rate limiting considerations
- Error sanitization

### 4. Testing

#### Test Script (`scripts/test-geocoding.js`)
- Tests all geocoding endpoints
- Verifies fallback functionality
- Can be run with: `npm run test:geocoding`

#### Manual Testing
1. Navigate to `/create` page
2. Go to Step 3: Locations & QR Codes
3. Click "Add Location"
4. Test address lookup functionality

## Configuration

### Environment Variables
```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Required Google Cloud APIs
- Geocoding API
- Places API
- Maps JavaScript API (optional, for future map features)

## Usage Examples

### Basic Address Lookup
```typescript
const { geocodeAddress } = useGeocoding()
const result = await geocodeAddress("Times Square, New York, NY")
// Returns: { latitude: 40.7589, longitude: -73.9851, formattedAddress: "..." }
```

### Place Search
```typescript
const { searchPlaces } = useGeocoding()
const results = await searchPlaces("Central Park")
// Returns: Array of location results with autocomplete
```

### Reverse Geocoding
```typescript
const { reverseGeocode } = useGeocoding()
const result = await reverseGeocode(40.7589, -73.9851)
// Returns: { formattedAddress: "Times Square, New York, NY", ... }
```

## Error Handling

### API Errors
- **No API Key**: Falls back to mock coordinates
- **Quota Exceeded**: Shows user-friendly error message
- **Network Issues**: Graceful degradation
- **Invalid Addresses**: Clear error feedback

### User Experience
- Loading indicators during API calls
- Error messages with actionable feedback
- Fallback to manual coordinate entry
- Optional geolocation with no blocking errors

## Performance Considerations

### Caching
- Consider implementing caching for frequently searched locations
- Browser geolocation caching (5-minute maximum age)
- API response caching on server side

### Rate Limiting
- Google Maps API has usage limits
- Consider implementing client-side rate limiting
- Monitor API usage in production

## Future Enhancements

### Planned Features
1. **Map Visualization**: Interactive map for location selection
2. **Batch Geocoding**: Process multiple addresses at once
3. **Location History**: Remember recently used locations
4. **Offline Support**: Cache popular locations for offline use

### Alternative Services
- Consider adding fallback to other geocoding services
- OpenStreetMap Nominatim as free alternative
- Mapbox Geocoding API as premium option

## Troubleshooting

### Common Issues

1. **"API key not found" warning**
   - Check environment variable is set
   - Restart development server

2. **No search results**
   - Verify Places API is enabled
   - Check API key permissions

3. **Geolocation blocked**
   - Check browser permissions
   - Verify Permissions-Policy header

4. **CORS errors**
   - API calls are server-side, no CORS issues expected

### Debug Mode
- Check browser console for detailed error messages
- Use test script to verify API functionality
- Monitor network requests in DevTools

## Production Deployment

### Checklist
- [ ] Set `GOOGLE_MAPS_API_KEY` environment variable
- [ ] Enable required Google Cloud APIs
- [ ] Configure API key restrictions
- [ ] Set up billing alerts
- [ ] Test geocoding functionality
- [ ] Monitor API usage

### Security
- [ ] Restrict API key to production domains
- [ ] Set up usage quotas
- [ ] Monitor for unusual activity
- [ ] Regular API key rotation

## Cost Estimation

### Google Maps API Pricing (2024)
- Geocoding API: $5 per 1,000 requests
- Places API: $17 per 1,000 requests
- Free tier: $200 credit per month

### Usage Projections
- Small team (10 users): ~$5-10/month
- Medium team (100 users): ~$50-100/month
- Large team (1000+ users): ~$500+/month

## Conclusion

The address lookup functionality has been successfully implemented with:
- ✅ Real Google Maps API integration
- ✅ Comprehensive error handling
- ✅ Fallback systems for reliability
- ✅ Enhanced user experience
- ✅ Security best practices
- ✅ Testing infrastructure

The system is production-ready and provides a robust foundation for location-based features in ClueQuest.

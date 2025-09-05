# Google Maps API Setup Guide

This guide explains how to set up Google Maps API for the ClueQuest application's geocoding functionality.

## Prerequisites

1. A Google Cloud Platform account
2. A project in Google Cloud Console

## Step 1: Enable Required APIs

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Library"
4. Enable the following APIs:
   - **Geocoding API** - for converting addresses to coordinates
   - **Places API** - for place search and autocomplete
   - **Maps JavaScript API** - for map display (optional, for future use)

## Step 2: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Recommended) Restrict the API key:
   - Click on the API key to edit it
   - Under "Application restrictions", select "HTTP referrers" or "IP addresses"
   - Under "API restrictions", select "Restrict key" and choose the APIs you enabled

## Step 3: Configure Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the create page: `http://localhost:3000/create`
3. Go to Step 3: Locations & QR Codes
4. Click "Add Location"
5. In the "Address Lookup" section, try searching for an address
6. You should see autocomplete suggestions and be able to find real coordinates

## Features Implemented

### Geocoding
- Convert street addresses to latitude/longitude coordinates
- Support for various address formats
- Fallback to mock coordinates if API is unavailable

### Place Search
- Autocomplete search as you type
- Search for businesses, landmarks, and addresses
- Display formatted addresses with location details

### Reverse Geocoding
- Convert coordinates back to readable addresses
- Useful for displaying user's current location

## Error Handling

The system includes comprehensive error handling:

- **API Key Missing**: Falls back to mock coordinates
- **API Quota Exceeded**: Shows user-friendly error message
- **Network Issues**: Graceful degradation with fallback
- **Invalid Addresses**: Clear error messages

## Cost Considerations

Google Maps API pricing (as of 2024):
- Geocoding API: $5 per 1,000 requests
- Places API: $17 per 1,000 requests (for autocomplete)
- Free tier: $200 credit per month

## Security Best Practices

1. **Restrict API Key**: Limit to specific domains/IPs
2. **Monitor Usage**: Set up billing alerts
3. **Environment Variables**: Never commit API keys to version control
4. **Rate Limiting**: Implement client-side rate limiting

## Troubleshooting

### Common Issues

1. **"API key not found" warning**
   - Check that `GOOGLE_MAPS_API_KEY` is set in your environment variables
   - Restart your development server after adding the environment variable

2. **"This API project is not authorized"**
   - Ensure the required APIs are enabled in Google Cloud Console
   - Check that your API key has the correct permissions

3. **"Quota exceeded" error**
   - Check your Google Cloud billing and quotas
   - Consider implementing caching for repeated requests

4. **No search results**
   - Verify the Places API is enabled
   - Check that your API key restrictions allow your domain

### Debug Mode

To debug geocoding issues, check the browser console for detailed error messages. The system logs all API interactions for troubleshooting.

## Future Enhancements

- Map visualization for location selection
- Batch geocoding for multiple addresses
- Caching layer for frequently searched locations
- Integration with other mapping services as fallbacks

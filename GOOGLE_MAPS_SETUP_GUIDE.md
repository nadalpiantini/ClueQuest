# 🗺️ Google Maps API Setup Guide

## Quick Setup (5 minutes)

### 1. **Get Google Maps API Key**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable these APIs:
   - **Geocoding API**
   - **Places API** 
   - **Maps JavaScript API** (optional)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your new API key

### 2. **Configure ClueQuest**
1. Open `/Users/nadalpiantini/Dev/ClueQuest/.env.local`
2. Replace `your_google_maps_api_key_here` with your actual API key:
   ```env
   GOOGLE_MAPS_API_KEY=AIzaSyC1234567890abcdef_YOUR_REAL_KEY_HERE
   ```
3. Restart your development server: `npm run dev`

### 3. **Test Address Lookup**
1. Navigate to `http://localhost:5173/builder?step=4`
2. Click the **Locations** tab  
3. Add a new location
4. Try the "Google Maps Address Lookup" feature
5. Search for real addresses and verify coordinates

## 🎯 **What You Get With Real API Key:**
- ✅ **Real Address Lookup**: Find exact coordinates for any address worldwide
- ✅ **Place Suggestions**: Autocomplete suggestions as you type
- ✅ **Accurate Coordinates**: Perfect for geofencing and rally routes
- ✅ **Address Formatting**: Standardized address formatting

## 🔄 **Fallback Mode (Without API Key):**
- ⚠️ **Mock Coordinates**: Generates consistent but fake coordinates
- ⚠️ **No Real Lookup**: Address search returns placeholder data
- ✅ **Still Functional**: Adventure Builder still works for testing
- ✅ **Consistent**: Same address always gets same mock coordinates

## 💡 **API Key Security Best Practices:**
1. **Restrict API Key**: Limit to your domain only
2. **Enable Only Needed APIs**: Geocoding + Places APIs only
3. **Set Usage Limits**: Prevent unexpected charges
4. **Monitor Usage**: Check Google Cloud Console regularly

## 🚨 **Troubleshooting:**
- **"Fallback geocoding" message**: API key not configured properly
- **"HTTP error 403"**: API key restrictions too strict
- **"No results found"**: Address format might be invalid
- **Slow responses**: API quota might be exceeded

## 💰 **Cost Information:**
- **Free Tier**: $200/month credit (covers ~40,000 geocoding requests)
- **Geocoding**: $0.005 per request
- **Places API**: $0.017 per request
- **Typical Usage**: Adventure Builder uses ~1-5 requests per location

---

**🎯 Your QR Sticker Adventure Builder is ready to work with real-world locations!**
# Playwright Debug Setup for /create Page

## Quick Start

### Debug with Default Server (Port 5173)
```bash
npm run test:e2e:debug:create
```

### Debug with External Server (Port 3000)
```bash
# First, start your dev server on port 3000
npm run dev -- -p 3000

# Then in another terminal, run the debug session
npm run test:e2e:debug:create:port3000
```

### Debug with Slow Motion
```bash
npm run test:e2e:debug:slow
```

## What the Debug Tests Cover

### 1. Basic Page Load Test
- ✅ Page loads without errors
- ✅ Main elements are visible
- ✅ Screenshots captured automatically

### 2. Adventure Form Interactions
- ✅ Title input field
- ✅ Theme selection
- ✅ Duration setting
- ✅ Max players configuration

### 3. Story Generation Modal (AI Feature)
- ✅ Tests the 401 fix we just implemented
- ✅ Modal opens correctly
- ✅ API calls work without authentication errors
- ✅ Loading states and success/error handling

### 4. Mobile Responsiveness
- ✅ Different viewport sizes (iPhone, iPad, Desktop)
- ✅ Touch target size validation (44px minimum)
- ✅ Responsive design verification

### 5. Network and Console Monitoring
- ✅ Console error detection
- ✅ Network failure monitoring
- ✅ Special focus on 401 errors from story generation API

### 6. Interactive Debug Mode
- ✅ Manual testing with browser kept open
- ✅ Perfect for hands-on debugging

## Debug Commands Explained

| Command | Purpose |
|---------|---------|
| `npm run test:e2e:debug:create` | Debug /create page with default setup |
| `npm run test:e2e:debug:create:port3000` | Debug /create page on port 3000 (external server) |
| `npm run test:e2e:debug:slow` | Debug with 1-second delays between actions |

## Screenshots Location

All debug screenshots are saved to: `debug-screenshots/`

- `create-page-initial.png` - Page load state
- `title-filled.png` - After filling title
- `story-modal-open.png` - Story generation modal
- `ready-to-generate.png` - Before API call
- `after-api-call.png` - After API response
- `responsive-*.png` - Different viewport sizes

## Interactive Debug Features

When you run the debug commands, you get:

1. **Browser stays open** - Perfect for manual testing
2. **Step-through debugging** - Click "Resume" to proceed
3. **Console logging** - Real-time feedback in terminal
4. **Network monitoring** - 401 errors will be highlighted
5. **Screenshot capture** - Visual record of each step

## Troubleshooting the 401 Error Fix

The debug tests specifically monitor for:
- ✅ `/api/ai/story-generation` endpoint responses
- ✅ Authentication header presence
- ✅ Server vs client Supabase usage

If you still see 401 errors, the debug session will:
1. 🚨 Highlight the error in terminal output
2. 📸 Capture screenshots of the failure state
3. 🔍 Show network details for investigation

## Usage Examples

### Test the Story Generation Fix
```bash
# Start your server on port 3000
npm run dev -- -p 3000

# Open debug session focused on story generation
npm run test:e2e:debug:create:port3000
```

### Manual Testing Session
1. Run the debug command
2. Browser opens to /create page
3. Click "Resume" to step through automated tests
4. Use the "Interactive pause" test for manual exploration
5. Browser stays open for hands-on testing

### Network Error Monitoring
The debug session will automatically:
- Monitor all network requests
- Log any 4xx/5xx errors
- Specifically highlight 401 errors on story generation API
- Show request/response details in terminal

Perfect for verifying that our authentication fix is working! 🚀
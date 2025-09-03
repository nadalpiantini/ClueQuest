import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAuthPage = url.pathname.startsWith('/auth')
  // Include /welcome as public page for demo purposes, and /adventure-selection for adventure selection
  const isPublicPage = ['/', '/pricing', '/about', '/contact', '/welcome', '/adventure-selection'].includes(url.pathname)
  const isApiRoute = url.pathname.startsWith('/api')
  const isPublicApiRoute = ['/api/health', '/api/webhook'].some(route => 
    url.pathname.startsWith(route)
  )

  // Security Headers (production-ready from AXIS6 patterns)
  const response = supabaseResponse
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live",
    "frame-src 'self' https://*.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')

  // Set security headers
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
  
  // HSTS header for HTTPS enforcement
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  // Rate limiting headers (informational)
  response.headers.set('X-RateLimit-Limit', '1000')
  response.headers.set('X-RateLimit-Remaining', '999')

  // API route protection
  if (isApiRoute && !isPublicApiRoute) {
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401, headers: response.headers }
      )
    }
    
    // API key validation for external API access
    const apiKey = request.headers.get('x-api-key')
    if (apiKey) {
      // Validate API key (implement based on your API key strategy)
      // This is a placeholder - implement actual API key validation
      const isValidApiKey = await validateApiKey(apiKey, supabase)
      if (!isValidApiKey) {
        return NextResponse.json(
          { error: 'Invalid API Key', message: 'The provided API key is invalid or expired' },
          { status: 401, headers: response.headers }
        )
      }
    }
  }

  // Auth page redirects
  if (isAuthPage) {
    if (user) {
      // User is logged in, redirect to dashboard
      const redirectUrl = url.searchParams.get('redirectTo') || '/dashboard'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    // User is not logged in, allow access to auth pages
    return response
  }

  // Protected route handling
  if (!isPublicPage && !isApiRoute) {
    if (!user) {
      // User is not logged in, redirect to login
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectTo', url.pathname + url.search)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user needs to complete onboarding
    if (url.pathname !== '/onboarding') {
      const profile = await getUserProfile(user.id, supabase)
      if (profile && !profile.onboarding_completed) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }

    // Organization-specific route protection
    const orgSlug = extractOrgSlugFromPath(url.pathname)
    if (orgSlug) {
      const hasAccess = await checkOrganizationAccess(user.id, orgSlug, supabase)
      if (!hasAccess) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
  }

  // Add user info to headers for server components (optional)
  if (user) {
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-email', user.email || '')
  }

  return response
}

// Helper function to validate API keys
async function validateApiKey(apiKey: string, supabase: any): Promise<boolean> {
  try {
    // Extract key prefix and hash
    const [prefix] = apiKey.split('_')
    
    // Hash the full API key for comparison
    const encoder = new TextEncoder()
    const data = encoder.encode(apiKey)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    // Check if API key exists and is active
    const { data: apiKeyData, error } = await supabase
      .from('cluequest_api_keys')
      .select('id, organization_id, rate_limit_per_hour, last_used_at, expires_at')
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .single()
    
    if (error || !apiKeyData) return false
    
    // Check if key is expired
    if (apiKeyData.expires_at && new Date(apiKeyData.expires_at) < new Date()) {
      return false
    }
    
    // Update last used timestamp
    await supabase
      .from('cluequest_api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', apiKeyData.id)
    
    return true
  } catch (error) {
    console.error('API key validation error:', error)
    return false
  }
}

// Helper function to get user profile
async function getUserProfile(userId: string, supabase: any) {
  try {
    const { data, error } = await supabase
      .from('cluequest_profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single()
    
    if (error) return null
    return data
  } catch {
    return null
  }
}

// Helper function to extract organization slug from path
function extractOrgSlugFromPath(pathname: string): string | null {
  const orgMatch = pathname.match(/^\/org\/([^\/]+)/)
  return orgMatch ? orgMatch[1] : null
}

// Helper function to check organization access
async function checkOrganizationAccess(userId: string, orgSlug: string, supabase: any): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('cluequest_organization_members')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('organization.slug', orgSlug)
      .single()
    
    return !error && !!data
  } catch {
    return false
  }
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public folder
   * - .well-known (for SSL certificates, etc.)
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
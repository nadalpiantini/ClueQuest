import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      // Server-side configuration
      global: {
        headers: {
          'x-client-info': 'cluequest-server@1.0.0',
        },
      },
      auth: {
        // Flow type for server-side
        flowType: 'pkce',
        // Auto refresh is handled by middleware
        autoRefreshToken: false,
        // Don't persist session on server
        persistSession: false,
        // Don't detect session in URL on server
        detectSessionInUrl: false,
      },
    }
  )
}

// Server-side auth helpers
export async function getUser() {
  const supabase = await createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function getSession() {
  const supabase = await createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error fetching session:', error)
    return null
  }
}

// Get user profile with organization information
export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('cluequest_profiles')
      .select(`
        *,
        organizations:cluequest_organization_members!inner(
          role,
          organization:cluequest_organizations(
            id,
            name,
            slug,
            logo_url
          )
        )
      `)
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

// Check if user has required role in organization
export async function hasOrganizationRole(
  userId: string, 
  organizationId: string, 
  requiredRoles: string[]
): Promise<boolean> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('cluequest_organization_members')
      .select('role')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .maybeSingle()
    
    if (error || !data) return false
    
    return requiredRoles.includes((data as any).role)
  } catch {
    return false
  }
}

// Service role client for admin operations
export async function createServiceClient() {
  const cookieStore = await cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // Service client doesn't need to set cookies
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          'x-client-info': 'cluequest-service@1.0.0',
        },
      },
    }
  )
}
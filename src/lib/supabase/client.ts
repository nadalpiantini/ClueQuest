import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

// Create a singleton Supabase client for browser-side usage
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (!supabaseInstance) {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || supabaseUrl === 'TU_URL_AQUI') {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured. Please check your .env.local file.')
    }
    
    if (!supabaseAnonKey || supabaseAnonKey === 'TU_ANON_KEY_AQUI') {
      throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured. Please check your .env.local file.')
    }
    
    // Validate URL format
    try {
      new URL(supabaseUrl)
    } catch {
      throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Please check your .env.local file.`)
    }
    
    supabaseInstance = createBrowserClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        // Global settings for performance and reliability
        global: {
          headers: {
            'x-client-info': 'cluequest-web@1.0.0',
          },
        },
        // Database configuration
        db: {
          schema: 'public',
        },
        // Auth configuration for global market
        auth: {
          // Automatically refresh tokens
          autoRefreshToken: true,
          // Persist session in localStorage
          persistSession: true,
          // Detect session from URL (for email confirmations)
          detectSessionInUrl: true,
          // Storage key for session
          storageKey: 'cluequest-auth-token',
          // Flow type for PKCE (more secure)
          flowType: 'pkce',
        },
        // Realtime configuration (optimized for global usage)
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      }
    )
  }
  
  return supabaseInstance
}

// Export the client instance
export const supabase = createClient()

// Type-safe auth helpers
export const auth = supabase.auth

// Database helpers with type safety
export const db = supabase.from

// Storage helpers
export const storage = supabase.storage

// Realtime helpers
export const realtime = supabase.channel

// Utility function to handle auth errors consistently
export function handleAuthError(error: any): string {
  if (!error) return 'An unknown error occurred'
  
  // Common auth errors with user-friendly messages
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password. Please try again.',
    'Email not confirmed': 'Please check your email and click the confirmation link.',
    'User not found': 'No account found with this email address.',
    'Password is too weak': 'Password must be at least 8 characters with a mix of letters and numbers.',
    'Email already registered': 'An account with this email already exists. Try signing in instead.',
    'Token has expired or is invalid': 'Your session has expired. Please sign in again.',
    'Too many requests': 'Too many attempts. Please wait a few minutes before trying again.',
    'Signup disabled': 'New account creation is temporarily disabled.',
  }
  
  // Return user-friendly message or the original error
  return errorMessages[error.message] || error.message || 'Something went wrong. Please try again.'
}

// Utility function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data: { session } } = await auth.getSession()
    return !!session?.user
  } catch {
    return false
  }
}

// Utility function to get current user with error handling
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    return null
  }
}

// Utility function for sign out with cleanup
export async function signOut() {
  try {
    // Clear any cached data
    await supabase.removeAllChannels()
    
    // Sign out from Supabase
    const { error } = await auth.signOut()
    if (error) throw error
    
    // Clear localStorage
    localStorage.removeItem('cluequest-auth-token')
    
    // Redirect to login page
    window.location.href = '/auth/login'
  } catch (error) {
    // Force redirect even if there's an error
    window.location.href = '/auth/login'
  }
}

// Utility function for password reset
export async function resetPassword(email: string) {
  const { error } = await auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  
  if (error) {
    throw new Error(handleAuthError(error))
  }
}

// Utility function for email confirmation resend
export async function resendConfirmation(email: string) {
  const { error } = await auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  })
  
  if (error) {
    throw new Error(handleAuthError(error))
  }
}

// Utility function to check if email needs verification
export async function needsEmailVerification(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return user ? !user.email_confirmed_at : false
  } catch {
    return false
  }
}

// Type exports for use across the application
export type { Database } from '@/types/supabase'
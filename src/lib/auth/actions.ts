import { supabase } from '@/lib/supabase/client'

// Default Organization UUID (production-ready)
export const DEFAULT_ORG = 'f7b93ab0-b4c2-46bc-856f-6e22ac6671fb'

/**
 * Sign up with magic link (email OTP)
 * Returns user-friendly success message
 */
export async function signUpWithLink(email: string): Promise<string> {
  const { error } = await supabase.auth.signInWithOtp({ 
    email, 
    options: { 
      emailRedirectTo: window.location.origin + '/auth/confirm',
      shouldCreateUser: true
    } 
  })
  
  if (error) throw new Error(error.message)
  
  return 'Te mandé el link mágico. Revisa tu correo y vuelve a esta página.'
}

/**
 * Sign in with magic link (existing users)
 * Returns user-friendly success message  
 */
export async function signInWithLink(email: string): Promise<string> {
  const { error } = await supabase.auth.signInWithOtp({ 
    email, 
    options: { 
      emailRedirectTo: window.location.origin + '/auth/confirm',
      shouldCreateUser: false
    } 
  })
  
  if (error) throw new Error(error.message)
  
  return 'Te mandé el link de acceso. Revisa tu correo y vuelve a esta página.'
}

/**
 * Bootstrap membership as OWNER after successful login
 * Uses the RPC function with SECURITY DEFINER privileges
 */
export async function ensureMembershipOwner(): Promise<string> {
  const { data: session } = await supabase.auth.getSession()
  if (!session?.session) {
    throw new Error('No hay sesión activa. Inicia sesión primero.')
  }

  // Call the RPC function to ensure membership
  const { error } = await supabase.rpc('ensure_membership_for_current_user', { 
    p_org: DEFAULT_ORG, 
    p_role: 'owner' 
  } as any)
  
  if (error) {
    console.error('Membership bootstrap error:', error)
    throw new Error(`Error al activar membresía: ${error.message}`)
  }
  
  return 'Membresía asegurada como OWNER en Default Organization. ¡Ya puedes crear aventuras!'
}

/**
 * Alternative membership roles for different use cases
 */
export async function ensureMembershipAdmin(): Promise<string> {
  const { data: session } = await supabase.auth.getSession()
  if (!session?.session) {
    throw new Error('No hay sesión activa. Inicia sesión primero.')
  }

  const { error } = await supabase.rpc('ensure_membership_for_current_user', { 
    p_org: DEFAULT_ORG, 
    p_role: 'admin' 
  } as any)
  
  if (error) {
    console.error('Membership bootstrap error:', error)
    throw new Error(`Error al activar membresía: ${error.message}`)
  }
  
  return 'Membresía asegurada como ADMIN en Default Organization.'
}

/**
 * Check current user's membership status
 */
export async function getUserMembership(): Promise<{
  isMember: boolean
  role?: 'owner' | 'admin' | 'member'
  organizationId?: string
}> {
  const { data: session } = await supabase.auth.getSession()
  if (!session?.session) {
    return { isMember: false }
  }

  const { data, error } = await supabase
    .from('cluequest_organization_members')
    .select('role, organization_id')
    .eq('user_id', session.session.user.id)
    .eq('organization_id', DEFAULT_ORG)
    .eq('status', 'active')
    .single()

  if (error || !data) {
    return { isMember: false }
  }

  return {
    isMember: true,
    role: (data as any).role as 'owner' | 'admin' | 'member',
    organizationId: (data as any).organization_id
  }
}

/**
 * Complete authentication flow: signup + auto-membership
 * Perfect for new users
 */
export async function completeOnboarding(email: string): Promise<string> {
  // First, send magic link
  await signUpWithLink(email)
  
  return 'Link mágico enviado. Después de confirmar tu email, tu membresía se activará automáticamente.'
}

/**
 * Get current user with membership info
 */
export async function getCurrentUserWithMembership() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const membership = await getUserMembership()

  return {
    user,
    membership
  }
}

/**
 * Sign out with cleanup
 */
export async function signOutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

/**
 * Check if user has permission for specific actions
 */
export async function hasPermission(permission: 'create' | 'edit' | 'delete' | 'admin'): Promise<boolean> {
  const membership = await getUserMembership()
  
  if (!membership.isMember) return false
  
  const role = membership.role
  
  switch (permission) {
    case 'create':
      return ['owner', 'admin', 'member'].includes(role!)
    case 'edit':
      return ['owner', 'admin'].includes(role!)
    case 'delete':
      return ['owner'].includes(role!)
    case 'admin':
      return ['owner', 'admin'].includes(role!)
    default:
      return false
  }
}
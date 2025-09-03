/**
 * Supabase Storage utilities for ClueQuest avatar management
 */

import { createClient } from './server'

export async function ensureAvatarsBucket() {
  const supabase = await createClient()
  
  // Check if bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  
  if (listError) {
    console.error('Failed to list buckets:', listError)
    return false
  }
  
  const avatarsBucket = buckets.find(bucket => bucket.name === 'avatars')
  
  if (!avatarsBucket) {
    // Create the bucket
    const { error: createError } = await supabase.storage.createBucket('avatars', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 10485760, // 10MB
    })
    
    if (createError) {
      console.error('Failed to create avatars bucket:', createError)
      return false
    }
    
    console.log('Created avatars storage bucket')
  }
  
  return true
}

/**
 * Get avatar storage config for ClueQuest
 */
export const AVATAR_STORAGE_CONFIG = {
  bucket: 'avatars',
  folders: {
    selfies: 'selfies',
    generated: 'generated',
    processed: 'processed'
  },
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  cacheControl: '31536000', // 1 year
}
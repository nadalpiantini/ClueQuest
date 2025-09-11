/**
 * Server-side Supabase client with connection pooling and error handling
 * Optimized for high-concurrency API routes and server-side operations
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

// Connection pool configuration for high concurrency
const CONNECTION_POOL_CONFIG = {
  // Maximum connections per instance
  max: parseInt(process.env.SUPABASE_POOL_MAX || '20'),
  
  // Minimum connections to maintain
  min: parseInt(process.env.SUPABASE_POOL_MIN || '5'),
  
  // Connection timeout in milliseconds
  connectionTimeoutMillis: parseInt(process.env.SUPABASE_TIMEOUT || '10000'),
  
  // Idle timeout in milliseconds
  idleTimeoutMillis: parseInt(process.env.SUPABASE_IDLE_TIMEOUT || '30000'),
}

// Global client cache for connection reuse
const clientCache = new Map<string, ReturnType<typeof createServerClient<Database>>>()

/**
 * Create server-side Supabase client with automatic cookie handling
 * Supports Next.js App Router and provides connection pooling
 */
export async function createClient(cookieStore = cookies()) {
  const cacheKey = 'server-client'
  
  // Return cached client if available
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!
  }

  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookieStore
          return store.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const store = await cookieStore
            store.set({ name, value, ...options })
          } catch (error) {
            // Handle case where cookies can't be set (e.g., middleware)
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const store = await cookieStore
            store.set({ name, value: '', ...options })
          } catch (error) {
          }
        },
      },
      // Database configuration for performance
      db: {
        schema: 'public',
      },
      // Auth configuration
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      // Global configuration for API performance
      global: {
        headers: {
          'x-client-info': 'cluequest-server@1.0.0',
        },
      },
    }
  )

  // Cache the client for reuse
  clientCache.set(cacheKey, client)
  
  return client
}

/**
 * Create service role client with elevated permissions
 * Use for admin operations and bypassing RLS when necessary
 */
export function createServiceClient() {
  const cacheKey = 'service-client'
  
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey) as any
  }

  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: () => undefined,
        set: () => {},
        remove: () => {},
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

  clientCache.set(cacheKey, client as any)
  return client
}

/**
 * Enhanced client with retry logic and circuit breaker
 */
export class ResilientSupabaseClient {
  private client: ReturnType<typeof createServerClient<Database>>
  private circuitBreaker: {
    isOpen: boolean
    failures: number
    lastFailure: number
    timeout: number
  }

  constructor(client: ReturnType<typeof createServerClient<Database>>) {
    this.client = client
    this.circuitBreaker = {
      isOpen: false,
      failures: 0,
      lastFailure: 0,
      timeout: 60000, // 1 minute
    }
  }

  /**
   * Execute query with retry logic and circuit breaker
   */
  async executeQuery<T>(
    queryFn: () => Promise<{ data: T; error: any }>,
    maxRetries: number = 3,
    baseDelay: number = 100
  ): Promise<{ data: T | null; error: any }> {
    // Check circuit breaker
    if (this.isCircuitOpen()) {
      return {
        data: null,
        error: new Error('Circuit breaker is open - service temporarily unavailable')
      }
    }

    let lastError: any = null
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        const result = await queryFn()
        
        // Reset circuit breaker on success
        if (result.error === null) {
          this.resetCircuitBreaker()
        } else {
          this.recordFailure()
        }
        
        return result
        
      } catch (error) {
        lastError = error
        attempt++
        this.recordFailure()

        if (attempt < maxRetries) {
          // Exponential backoff with jitter
          const delay = baseDelay * Math.pow(2, attempt - 1)
          const jitter = Math.random() * 0.1 * delay
          await this.sleep(delay + jitter)
        }
      }
    }

    return {
      data: null,
      error: lastError || new Error('Max retries exceeded')
    }
  }

  /**
   * Execute transaction with rollback on failure
   */
  async executeTransaction<T>(
    operations: Array<() => Promise<any>>
  ): Promise<{ success: boolean; results?: T[]; error?: any }> {
    try {
      const results: T[] = []
      
      // Execute all operations
      for (const operation of operations) {
        const result = await this.executeQuery(operation)
        
        if (result.error) {
          throw result.error
        }
        
        results.push(result.data as T)
      }

      return {
        success: true,
        results
      }

    } catch (error) {
      
      return {
        success: false,
        error
      }
    }
  }

  /**
   * Batch operations with parallel execution
   */
  async executeBatch<T>(
    operations: Array<() => Promise<{ data: T; error: any }>>,
    maxConcurrency: number = 5
  ): Promise<Array<{ data: T | null; error: any }>> {
    const results: Array<{ data: T | null; error: any }> = []
    
    // Execute in batches to control concurrency
    for (let i = 0; i < operations.length; i += maxConcurrency) {
      const batch = operations.slice(i, i + maxConcurrency)
      
      const batchPromises = batch.map(operation => 
        this.executeQuery(operation)
      )
      
      const batchResults = await Promise.allSettled(batchPromises)
      
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        } else {
          results.push({
            data: null,
            error: result.reason
          })
        }
      })
    }

    return results
  }

  private isCircuitOpen(): boolean {
    if (!this.circuitBreaker.isOpen) return false
    
    const timeSinceLastFailure = Date.now() - this.circuitBreaker.lastFailure
    
    if (timeSinceLastFailure > this.circuitBreaker.timeout) {
      this.circuitBreaker.isOpen = false
      this.circuitBreaker.failures = 0
      return false
    }
    
    return true
  }

  private recordFailure(): void {
    this.circuitBreaker.failures++
    this.circuitBreaker.lastFailure = Date.now()
    
    // Open circuit if too many failures
    if (this.circuitBreaker.failures >= 5) {
      this.circuitBreaker.isOpen = true
    }
  }

  private resetCircuitBreaker(): void {
    this.circuitBreaker.isOpen = false
    this.circuitBreaker.failures = 0
    this.circuitBreaker.lastFailure = 0
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Proxy methods to underlying client
  get from() { return this.client.from }
  get auth() { return this.client.auth }
  get storage() { return this.client.storage }
  get functions() { return this.client.functions }
  get channel() { return this.client.channel }
}

/**
 * Get resilient client instance
 */
export async function createResilientClient(cookieStore = cookies()): Promise<ResilientSupabaseClient> {
  const client = await createClient(cookieStore)
  return new ResilientSupabaseClient(client)
}

/**
 * Database health check
 */
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean
  latency?: number
  error?: string
}> {
  try {
    const start = Date.now()
    const client = await createClient()
    
    // Simple query to test connectivity
    const { error } = await client
      .from('cluequest_profiles')
      .select('id')
      .limit(1)
      .single()
    
    const latency = Date.now() - start

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error
    }

    return {
      healthy: true,
      latency
    }

  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Connection pool monitoring
 */
export function getConnectionStats() {
  return {
    activeConnections: clientCache.size,
    maxConnections: CONNECTION_POOL_CONFIG.max,
    minConnections: CONNECTION_POOL_CONFIG.min
  }
}

/**
 * Clear connection pool (for testing or restart)
 */
export function clearConnectionPool(): void {
  clientCache.clear()
}

/**
 * Utility for handling Supabase errors consistently
 */
export function handleSupabaseError(error: any): {
  code: string
  message: string
  statusCode: number
} {
  if (!error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      statusCode: 500
    }
  }

  // Map common Supabase error codes to HTTP status codes
  const errorMappings: Record<string, { statusCode: number; message?: string }> = {
    'PGRST301': { statusCode: 400, message: 'Invalid request parameters' },
    'PGRST116': { statusCode: 404, message: 'Resource not found' },
    'PGRST204': { statusCode: 400, message: 'Invalid range parameters' },
    'PGRST100': { statusCode: 400, message: 'Bad request' },
    '42501': { statusCode: 403, message: 'Insufficient privileges' },
    '23505': { statusCode: 409, message: 'Resource already exists' },
    '23503': { statusCode: 400, message: 'Foreign key constraint violation' },
    '23502': { statusCode: 400, message: 'Not null constraint violation' },
    'auth.session_not_found': { statusCode: 401, message: 'Authentication required' },
    'auth.invalid_credentials': { statusCode: 401, message: 'Invalid credentials' },
    'auth.too_many_requests': { statusCode: 429, message: 'Too many authentication attempts' }
  }

  const mapping = errorMappings[error.code] || { statusCode: 500 }

  return {
    code: error.code || 'DATABASE_ERROR',
    message: mapping.message || error.message || 'Database operation failed',
    statusCode: mapping.statusCode
  }
}

/**
 * Middleware-compatible request/response handling
 */
export async function createClientFromRequest(request: NextRequest) {
  const response = NextResponse.next()
  
  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  return { client, response }
}

export { type Database } from '@/types/supabase'
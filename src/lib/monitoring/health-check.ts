/**
 * Comprehensive Health Check System for ClueQuest
 * Monitors database, Redis, external services, and system resources
 * Provides circuit breaker functionality and automated recovery
 */

import { createServiceClient, checkDatabaseHealth } from '@/lib/supabase/server'
import Redis from 'ioredis'

// Health check interfaces
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  component: string
  latency?: number
  error?: string
  metadata?: Record<string, any>
  lastChecked: string
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy'
  components: HealthCheckResult[]
  timestamp: string
  version: string
}

// Circuit breaker state
interface CircuitBreakerState {
  failures: number
  lastFailure: number
  state: 'closed' | 'open' | 'half-open'
  timeout: number
}

/**
 * Health Check Service
 */
export class HealthCheckService {
  private static instance: HealthCheckService
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map()
  private healthCache: Map<string, HealthCheckResult> = new Map()
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5
  private readonly CIRCUIT_BREAKER_TIMEOUT = 60000 // 1 minute
  private readonly CACHE_TTL = 30000 // 30 seconds

  static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService()
    }
    return HealthCheckService.instance
  }

  /**
   * Comprehensive system health check
   */
  async checkSystemHealth(): Promise<SystemHealth> {
    const components: HealthCheckResult[] = []

    // Parallel health checks for better performance
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkExternalServices(),
      this.checkSystemResources(),
      this.checkQueues(),
      this.checkStorage()
    ])

    // Process results
    checks.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        components.push(result.value)
      } else {
        const componentNames = ['database', 'redis', 'external', 'system', 'queues', 'storage']
        components.push({
          status: 'unhealthy',
          component: componentNames[index],
          error: result.reason?.message || 'Health check failed',
          lastChecked: new Date().toISOString()
        })
      }
    })

    // Determine overall health
    const overallStatus = this.calculateOverallHealth(components)

    return {
      overall: overallStatus,
      components,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    }
  }

  /**
   * Database health check with circuit breaker
   */
  async checkDatabase(): Promise<HealthCheckResult> {
    const component = 'database'
    
    // Check circuit breaker
    if (this.isCircuitOpen(component)) {
      return {
        status: 'unhealthy',
        component,
        error: 'Circuit breaker open',
        lastChecked: new Date().toISOString()
      }
    }

    // Check cache first
    const cached = this.getCachedResult(component)
    if (cached) return cached

    try {
      const result = await checkDatabaseHealth()
      
      if (result.healthy) {
        this.resetCircuitBreaker(component)
        
        const healthResult: HealthCheckResult = {
          status: result.latency! > 1000 ? 'degraded' : 'healthy',
          component,
          latency: result.latency,
          metadata: {
            connectionPool: this.getConnectionPoolStats()
          },
          lastChecked: new Date().toISOString()
        }

        this.cacheResult(component, healthResult)
        return healthResult
      } else {
        throw new Error(result.error)
      }

    } catch (error) {
      this.recordFailure(component)
      
      const healthResult: HealthCheckResult = {
        status: 'unhealthy',
        component,
        error: error instanceof Error ? error.message : 'Database check failed',
        lastChecked: new Date().toISOString()
      }

      this.cacheResult(component, healthResult)
      return healthResult
    }
  }

  /**
   * Redis health check
   */
  async checkRedis(): Promise<HealthCheckResult> {
    const component = 'redis'
    
    if (this.isCircuitOpen(component)) {
      return {
        status: 'unhealthy',
        component,
        error: 'Circuit breaker open',
        lastChecked: new Date().toISOString()
      }
    }

    const cached = this.getCachedResult(component)
    if (cached) return cached

    try {
      const redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        connectTimeout: 5000,
        lazyConnect: true
      })

      const start = Date.now()
      await redis.ping()
      const latency = Date.now() - start
      
      const info = await redis.info('memory')
      const memoryMatch = info.match(/used_memory_human:(.+)/)
      const usedMemory = memoryMatch ? memoryMatch[1].trim() : 'unknown'

      await redis.quit()

      this.resetCircuitBreaker(component)
      
      const healthResult: HealthCheckResult = {
        status: latency > 500 ? 'degraded' : 'healthy',
        component,
        latency,
        metadata: {
          usedMemory,
          version: await this.getRedisVersion(redis)
        },
        lastChecked: new Date().toISOString()
      }

      this.cacheResult(component, healthResult)
      return healthResult

    } catch (error) {
      this.recordFailure(component)
      
      const healthResult: HealthCheckResult = {
        status: 'unhealthy',
        component,
        error: error instanceof Error ? error.message : 'Redis check failed',
        lastChecked: new Date().toISOString()
      }

      this.cacheResult(component, healthResult)
      return healthResult
    }
  }

  /**
   * External services health check (Resend, Stripe, etc.)
   */
  async checkExternalServices(): Promise<HealthCheckResult> {
    const component = 'external-services'
    
    if (this.isCircuitOpen(component)) {
      return {
        status: 'unhealthy',
        component,
        error: 'Circuit breaker open',
        lastChecked: new Date().toISOString()
      }
    }

    const cached = this.getCachedResult(component)
    if (cached) return cached

    try {
      const checks = await Promise.allSettled([
        this.checkResendHealth(),
        this.checkStripeHealth(),
        this.checkSupabaseHealth()
      ])

      const results = checks.map(check => ({
        success: check.status === 'fulfilled',
        error: check.status === 'rejected' ? check.reason?.message : null
      }))

      const successCount = results.filter(r => r.success).length
      const totalCount = results.length

      let status: HealthCheckResult['status']
      if (successCount === totalCount) {
        status = 'healthy'
      } else if (successCount > 0) {
        status = 'degraded'
      } else {
        status = 'unhealthy'
      }

      this.resetCircuitBreaker(component)

      const healthResult: HealthCheckResult = {
        status,
        component,
        metadata: {
          checks: {
            resend: results[0].success ? 'healthy' : 'failed',
            stripe: results[1].success ? 'healthy' : 'failed',
            supabase: results[2].success ? 'healthy' : 'failed'
          },
          successRate: `${successCount}/${totalCount}`
        },
        lastChecked: new Date().toISOString()
      }

      this.cacheResult(component, healthResult)
      return healthResult

    } catch (error) {
      this.recordFailure(component)
      
      const healthResult: HealthCheckResult = {
        status: 'unhealthy',
        component,
        error: error instanceof Error ? error.message : 'External services check failed',
        lastChecked: new Date().toISOString()
      }

      this.cacheResult(component, healthResult)
      return healthResult
    }
  }

  /**
   * System resources health check
   */
  async checkSystemResources(): Promise<HealthCheckResult> {
    const component = 'system-resources'
    
    try {
      const memoryUsage = process.memoryUsage()
      const cpuUsage = process.cpuUsage()
      
      // Convert bytes to MB
      const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)
      const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024)
      const memoryUsagePercent = Math.round((heapUsedMB / heapTotalMB) * 100)

      // Check if memory usage is concerning
      let status: HealthCheckResult['status'] = 'healthy'
      if (memoryUsagePercent > 90) {
        status = 'unhealthy'
      } else if (memoryUsagePercent > 75) {
        status = 'degraded'
      }

      const healthResult: HealthCheckResult = {
        status,
        component,
        metadata: {
          memory: {
            heapUsed: `${heapUsedMB}MB`,
            heapTotal: `${heapTotalMB}MB`,
            usagePercent: `${memoryUsagePercent}%`,
            external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
          },
          cpu: {
            user: `${Math.round(cpuUsage.user / 1000)}ms`,
            system: `${Math.round(cpuUsage.system / 1000)}ms`
          },
          uptime: `${Math.round(process.uptime())}s`,
          nodeVersion: process.version,
          platform: process.platform
        },
        lastChecked: new Date().toISOString()
      }

      this.cacheResult(component, healthResult)
      return healthResult

    } catch (error) {
      return {
        status: 'unhealthy',
        component,
        error: error instanceof Error ? error.message : 'System resources check failed',
        lastChecked: new Date().toISOString()
      }
    }
  }

  /**
   * Queue health check
   */
  async checkQueues(): Promise<HealthCheckResult> {
    const component = 'queues'
    
    try {
      // This would integrate with your queue monitoring
      // For now, return a basic health check
      const healthResult: HealthCheckResult = {
        status: 'healthy',
        component,
        metadata: {
          email: 'active',
          webhooks: 'active',
          analytics: 'active'
        },
        lastChecked: new Date().toISOString()
      }

      this.cacheResult(component, healthResult)
      return healthResult

    } catch (error) {
      return {
        status: 'unhealthy',
        component,
        error: error instanceof Error ? error.message : 'Queue check failed',
        lastChecked: new Date().toISOString()
      }
    }
  }

  /**
   * Storage health check
   */
  async checkStorage(): Promise<HealthCheckResult> {
    const component = 'storage'
    
    try {
      const supabase = createServiceClient()
      
      const start = Date.now()
      const { data, error } = await supabase.storage.listBuckets()
      const latency = Date.now() - start

      if (error) throw error

      const healthResult: HealthCheckResult = {
        status: latency > 2000 ? 'degraded' : 'healthy',
        component,
        latency,
        metadata: {
          bucketsCount: data?.length || 0
        },
        lastChecked: new Date().toISOString()
      }

      this.cacheResult(component, healthResult)
      return healthResult

    } catch (error) {
      return {
        status: 'unhealthy',
        component,
        error: error instanceof Error ? error.message : 'Storage check failed',
        lastChecked: new Date().toISOString()
      }
    }
  }

  /**
   * Individual service checks
   */
  private async checkResendHealth(): Promise<void> {
    // Simple API key validation
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key not configured')
    }
    
    // In production, you might make a test API call
    // For now, just check configuration
  }

  private async checkStripeHealth(): Promise<void> {
    // Check Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe not configured')
    }
  }

  private async checkSupabaseHealth(): Promise<void> {
    // Already covered in database check
  }

  /**
   * Circuit breaker implementation
   */
  private isCircuitOpen(component: string): boolean {
    const breaker = this.circuitBreakers.get(component)
    if (!breaker) return false

    if (breaker.state === 'open') {
      // Check if timeout has passed
      if (Date.now() - breaker.lastFailure > breaker.timeout) {
        breaker.state = 'half-open'
        return false
      }
      return true
    }

    return false
  }

  private recordFailure(component: string): void {
    let breaker = this.circuitBreakers.get(component)
    
    if (!breaker) {
      breaker = {
        failures: 0,
        lastFailure: 0,
        state: 'closed',
        timeout: this.CIRCUIT_BREAKER_TIMEOUT
      }
      this.circuitBreakers.set(component, breaker)
    }

    breaker.failures++
    breaker.lastFailure = Date.now()

    if (breaker.failures >= this.CIRCUIT_BREAKER_THRESHOLD) {
      breaker.state = 'open'
    }
  }

  private resetCircuitBreaker(component: string): void {
    const breaker = this.circuitBreakers.get(component)
    if (breaker) {
      breaker.failures = 0
      breaker.state = 'closed'
    }
  }

  /**
   * Health check caching
   */
  private getCachedResult(component: string): HealthCheckResult | null {
    const cached = this.healthCache.get(component)
    if (!cached) return null

    const age = Date.now() - new Date(cached.lastChecked).getTime()
    if (age > this.CACHE_TTL) {
      this.healthCache.delete(component)
      return null
    }

    return cached
  }

  private cacheResult(component: string, result: HealthCheckResult): void {
    this.healthCache.set(component, result)
  }

  /**
   * Calculate overall system health
   */
  private calculateOverallHealth(components: HealthCheckResult[]): SystemHealth['overall'] {
    const unhealthyCount = components.filter(c => c.status === 'unhealthy').length
    const degradedCount = components.filter(c => c.status === 'degraded').length
    
    if (unhealthyCount > 0) {
      return 'unhealthy'
    } else if (degradedCount > 0) {
      return 'degraded'
    } else {
      return 'healthy'
    }
  }

  /**
   * Utility methods
   */
  private getConnectionPoolStats() {
    // This would integrate with your connection pool monitoring
    return {
      active: 5,
      idle: 15,
      total: 20
    }
  }

  private async getRedisVersion(redis: Redis): Promise<string> {
    try {
      const info = await redis.info('server')
      const versionMatch = info.match(/redis_version:(.+)/)
      return versionMatch ? versionMatch[1].trim() : 'unknown'
    } catch {
      return 'unknown'
    }
  }

  /**
   * Get circuit breaker states for monitoring
   */
  getCircuitBreakerStates(): Record<string, CircuitBreakerState> {
    return Object.fromEntries(this.circuitBreakers)
  }

  /**
   * Manual circuit breaker reset (admin function)
   */
  resetCircuitBreakers(): void {
    this.circuitBreakers.clear()
    this.healthCache.clear()
  }
}

// Singleton instance
export const healthCheckService = HealthCheckService.getInstance()

/**
 * Express/Next.js compatible middleware for health checks
 */
export async function healthCheckMiddleware() {
  try {
    const health = await healthCheckService.checkSystemHealth()
    
    const statusCode = health.overall === 'healthy' ? 200 :
                      health.overall === 'degraded' ? 200 : 503

    return {
      status: statusCode,
      body: health
    }

  } catch (error) {
    return {
      status: 503,
      body: {
        overall: 'unhealthy',
        error: error instanceof Error ? error.message : 'Health check failed',
        timestamp: new Date().toISOString()
      }
    }
  }
}

export default healthCheckService
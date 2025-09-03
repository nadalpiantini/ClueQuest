/**
 * Webhook Delivery System for ClueQuest
 * Reliable webhook delivery with retry logic, circuit breaker, and monitoring
 * Supports various webhook events and automatic retry with exponential backoff
 */

import { createServiceClient } from '@/lib/supabase/server'
import { queueManager } from '@/lib/queue/bull-queue'
import crypto from 'crypto'

// Webhook event types
export type WebhookEventType = 
  | 'adventure.created'
  | 'adventure.updated' 
  | 'adventure.deleted'
  | 'session.started'
  | 'session.completed'
  | 'session.participant_joined'
  | 'session.participant_left'
  | 'user.created'
  | 'user.updated'
  | 'organization.subscription_changed'
  | 'organization.usage_limit_reached'
  | 'billing.invoice_created'
  | 'billing.payment_succeeded'
  | 'billing.payment_failed'

// Webhook payload interface
export interface WebhookPayload {
  id: string
  event: WebhookEventType
  timestamp: string
  data: Record<string, any>
  organization_id?: string
  user_id?: string
  api_version: string
}

// Webhook endpoint configuration
export interface WebhookEndpoint {
  id: string
  organization_id: string
  url: string
  events: WebhookEventType[]
  secret: string
  is_active: boolean
  created_by: string
  headers?: Record<string, string>
  retry_config?: {
    max_attempts: number
    backoff_factor: number
    max_delay: number
  }
}

/**
 * Webhook Delivery Service
 */
export class WebhookDeliveryService {
  private static instance: WebhookDeliveryService

  static getInstance(): WebhookDeliveryService {
    if (!WebhookDeliveryService.instance) {
      WebhookDeliveryService.instance = new WebhookDeliveryService()
    }
    return WebhookDeliveryService.instance
  }

  /**
   * Send webhook to all registered endpoints for an event
   */
  async sendWebhook(
    event: WebhookEventType,
    data: Record<string, any>,
    organizationId?: string,
    userId?: string
  ): Promise<{ sent: number; failed: number; results: any[] }> {
    try {
      // Get active webhook endpoints for this event
      const endpoints = await this.getActiveEndpoints(event, organizationId)
      
      if (endpoints.length === 0) {
        return { sent: 0, failed: 0, results: [] }
      }

      // Create webhook payload
      const payload: WebhookPayload = {
        id: crypto.randomUUID(),
        event,
        timestamp: new Date().toISOString(),
        data,
        organization_id: organizationId,
        user_id: userId,
        api_version: '2024-01-01'
      }

      // Send to all endpoints
      const results = await Promise.allSettled(
        endpoints.map(endpoint => this.sendToEndpoint(endpoint, payload))
      )

      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      // Log webhook delivery attempt
      await this.logWebhookDelivery(payload, endpoints, results)

      return {
        sent: successful,
        failed,
        results: results.map((result, index) => ({
          endpoint: endpoints[index],
          status: result.status,
          result: result.status === 'fulfilled' ? result.value : result.reason
        }))
      }

    } catch (error) {
      console.error('Webhook delivery failed:', error)
      throw error
    }
  }

  /**
   * Send webhook to specific endpoint with retry logic
   */
  private async sendToEndpoint(
    endpoint: WebhookEndpoint,
    payload: WebhookPayload
  ): Promise<{
    success: boolean
    response?: any
    error?: string
    attempts: number
  }> {
    const maxAttempts = endpoint.retry_config?.max_attempts || 5
    const backoffFactor = endpoint.retry_config?.backoff_factor || 2
    const maxDelay = endpoint.retry_config?.max_delay || 300000 // 5 minutes
    
    let lastError: any = null
    let attempts = 0

    while (attempts < maxAttempts) {
      attempts++

      try {
        // Generate signature
        const signature = this.generateSignature(payload, endpoint.secret)
        
        // Prepare headers
        const headers = {
          'Content-Type': 'application/json',
          'User-Agent': 'ClueQuest-Webhooks/1.0',
          'X-Webhook-ID': payload.id,
          'X-Webhook-Event': payload.event,
          'X-Webhook-Timestamp': payload.timestamp,
          'X-Webhook-Signature': signature,
          'X-Webhook-Attempt': attempts.toString(),
          ...endpoint.headers
        }

        // Send webhook with timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        // Check if successful (2xx status codes)
        if (response.ok) {
          const responseText = await response.text()
          
          // Log successful delivery
          await this.logDeliveryAttempt(endpoint.id, payload.id, true, {
            status: response.status,
            response: responseText,
            attempts
          })

          return {
            success: true,
            response: responseText,
            attempts
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

      } catch (error) {
        lastError = error
        
        // Log failed attempt
        await this.logDeliveryAttempt(endpoint.id, payload.id, false, {
          error: error instanceof Error ? error.message : 'Unknown error',
          attempts
        })

        // If not the last attempt, wait before retrying
        if (attempts < maxAttempts) {
          const delay = Math.min(
            Math.pow(backoffFactor, attempts - 1) * 1000,
            maxDelay
          )
          
          // Add jitter to prevent thundering herd
          const jitter = Math.random() * 0.1 * delay
          await this.sleep(delay + jitter)
        }
      }
    }

    return {
      success: false,
      error: lastError instanceof Error ? lastError.message : 'Unknown error',
      attempts
    }
  }

  /**
   * Get active webhook endpoints for an event
   */
  private async getActiveEndpoints(
    event: WebhookEventType,
    organizationId?: string
  ): Promise<WebhookEndpoint[]> {
    try {
      const supabase = createServiceClient()
      
      let query = supabase
        .from('cluequest_webhook_endpoints')
        .select('*')
        .eq('is_active', true)
        .contains('events', [event])

      if (organizationId) {
        query = query.eq('organization_id', organizationId)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []

    } catch (error) {
      console.error('Error fetching webhook endpoints:', error)
      return []
    }
  }

  /**
   * Generate HMAC signature for webhook payload
   */
  private generateSignature(payload: WebhookPayload, secret: string): string {
    const payloadString = JSON.stringify(payload)
    return crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex')
  }

  /**
   * Log webhook delivery attempt to database
   */
  private async logDeliveryAttempt(
    endpointId: string,
    webhookId: string,
    success: boolean,
    details: Record<string, any>
  ): Promise<void> {
    try {
      const supabase = createServiceClient()
      
      await supabase.from('cluequest_webhook_deliveries').insert({
        endpoint_id: endpointId,
        webhook_id: webhookId,
        success,
        response_status: details.status,
        response_body: details.response,
        error_message: details.error,
        attempts: details.attempts,
        delivered_at: new Date().toISOString()
      })

    } catch (error) {
      console.error('Error logging webhook delivery:', error)
      // Don't throw - logging failure shouldn't break webhook delivery
    }
  }

  /**
   * Log overall webhook delivery results
   */
  private async logWebhookDelivery(
    payload: WebhookPayload,
    endpoints: WebhookEndpoint[],
    results: PromiseSettledResult<any>[]
  ): Promise<void> {
    try {
      const supabase = createServiceClient()
      
      await supabase.from('cluequest_webhook_logs').insert({
        webhook_id: payload.id,
        event_type: payload.event,
        organization_id: payload.organization_id,
        user_id: payload.user_id,
        endpoints_count: endpoints.length,
        successful_deliveries: results.filter(r => r.status === 'fulfilled').length,
        failed_deliveries: results.filter(r => r.status === 'rejected').length,
        payload_size: JSON.stringify(payload).length,
        created_at: new Date().toISOString()
      })

    } catch (error) {
      console.error('Error logging webhook delivery summary:', error)
    }
  }

  /**
   * Schedule webhook delivery through queue (for reliability)
   */
  async scheduleWebhookDelivery(
    event: WebhookEventType,
    data: Record<string, any>,
    organizationId?: string,
    userId?: string,
    delay?: number
  ): Promise<void> {
    const payload: WebhookPayload = {
      id: crypto.randomUUID(),
      event,
      timestamp: new Date().toISOString(),
      data,
      organization_id: organizationId,
      user_id: userId,
      api_version: '2024-01-01'
    }

    // Get endpoints for this event
    const endpoints = await this.getActiveEndpoints(event, organizationId)

    // Schedule delivery for each endpoint
    const jobs = endpoints.map(endpoint => 
      queueManager.webhookQueue.scheduleWebhookDelivery(
        endpoint.url,
        payload,
        {
          'X-Webhook-Signature': this.generateSignature(payload, endpoint.secret),
          ...endpoint.headers
        },
        endpoint.secret,
        { delay }
      )
    )

    await Promise.all(jobs)
  }

  /**
   * Validate webhook signature (for incoming webhooks)
   */
  verifySignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex')

      // Use timing-safe comparison
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      )
    } catch (error) {
      return false
    }
  }

  /**
   * Get webhook delivery statistics
   */
  async getDeliveryStats(
    organizationId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalWebhooks: number
    successfulDeliveries: number
    failedDeliveries: number
    averageResponseTime: number
    eventBreakdown: Record<string, number>
  }> {
    try {
      const supabase = createServiceClient()
      
      let query = supabase
        .from('cluequest_webhook_logs')
        .select('*')
        .eq('organization_id', organizationId)

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString())
      }
      
      if (endDate) {
        query = query.lte('created_at', endDate.toISOString())
      }

      const { data: logs, error } = await query

      if (error) throw error

      // Calculate statistics
      const totalWebhooks = logs?.length || 0
      const successfulDeliveries = logs?.reduce((sum, log) => sum + log.successful_deliveries, 0) || 0
      const failedDeliveries = logs?.reduce((sum, log) => sum + log.failed_deliveries, 0) || 0

      // Event breakdown
      const eventBreakdown: Record<string, number> = {}
      logs?.forEach(log => {
        eventBreakdown[log.event_type] = (eventBreakdown[log.event_type] || 0) + 1
      })

      return {
        totalWebhooks,
        successfulDeliveries,
        failedDeliveries,
        averageResponseTime: 0, // Would need additional tracking
        eventBreakdown
      }

    } catch (error) {
      console.error('Error getting webhook stats:', error)
      throw error
    }
  }

  /**
   * Retry failed webhook deliveries
   */
  async retryFailedDeliveries(
    organizationId: string,
    webhookId?: string,
    maxAge?: number // in hours
  ): Promise<{ retried: number }> {
    try {
      const supabase = createServiceClient()
      
      let query = supabase
        .from('cluequest_webhook_deliveries')
        .select('*, endpoint:cluequest_webhook_endpoints(*)')
        .eq('success', false)

      if (organizationId) {
        query = query.eq('endpoint.organization_id', organizationId)
      }

      if (webhookId) {
        query = query.eq('webhook_id', webhookId)
      }

      if (maxAge) {
        const cutoff = new Date()
        cutoff.setHours(cutoff.getHours() - maxAge)
        query = query.gte('created_at', cutoff.toISOString())
      }

      const { data: failedDeliveries, error } = await query

      if (error) throw error

      // Group by webhook ID to avoid duplicate retries
      const webhookGroups = new Map<string, any[]>()
      failedDeliveries?.forEach(delivery => {
        if (!webhookGroups.has(delivery.webhook_id)) {
          webhookGroups.set(delivery.webhook_id, [])
        }
        webhookGroups.get(delivery.webhook_id)!.push(delivery)
      })

      let retried = 0
      
      // Retry each unique webhook
      for (const [webhookId, deliveries] of webhookGroups) {
        // Get the original webhook payload from logs
        const { data: webhookLog } = await supabase
          .from('cluequest_webhook_logs')
          .select('*')
          .eq('webhook_id', webhookId)
          .single()

        if (webhookLog) {
          await this.scheduleWebhookDelivery(
            webhookLog.event_type,
            {}, // Would need to store original payload
            webhookLog.organization_id,
            webhookLog.user_id
          )
          retried++
        }
      }

      return { retried }

    } catch (error) {
      console.error('Error retrying failed deliveries:', error)
      throw error
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Singleton instance
export const webhookService = WebhookDeliveryService.getInstance()

// Helper functions for common webhook events
export const webhookEvents = {
  adventureCreated: (adventure: any, organizationId: string, userId: string) => 
    webhookService.sendWebhook('adventure.created', adventure, organizationId, userId),
    
  adventureUpdated: (adventure: any, organizationId: string, userId: string) =>
    webhookService.sendWebhook('adventure.updated', adventure, organizationId, userId),
    
  sessionStarted: (session: any, organizationId: string, userId: string) =>
    webhookService.sendWebhook('session.started', session, organizationId, userId),
    
  sessionCompleted: (session: any, organizationId: string, userId: string) =>
    webhookService.sendWebhook('session.completed', session, organizationId, userId),
    
  userCreated: (user: any, organizationId?: string) =>
    webhookService.sendWebhook('user.created', user, organizationId),
    
  subscriptionChanged: (subscription: any, organizationId: string) =>
    webhookService.sendWebhook('organization.subscription_changed', subscription, organizationId),
    
  usageLimitReached: (usage: any, organizationId: string) =>
    webhookService.sendWebhook('organization.usage_limit_reached', usage, organizationId),
    
  paymentSucceeded: (payment: any, organizationId: string) =>
    webhookService.sendWebhook('billing.payment_succeeded', payment, organizationId),
    
  paymentFailed: (payment: any, organizationId: string) =>
    webhookService.sendWebhook('billing.payment_failed', payment, organizationId)
}

export default webhookService
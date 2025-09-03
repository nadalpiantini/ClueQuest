/**
 * Bull Queue Implementation for ClueQuest
 * Handles background jobs with retry logic, monitoring, and scaling
 * Supports email sending, webhook delivery, analytics processing, and cleanup tasks
 */

import Bull, { Job, Queue, JobOptions } from 'bull'
import Redis from 'ioredis'
import { createServiceClient } from '@/lib/supabase/server'

// Queue configurations
const QUEUE_CONFIGS = {
  email: {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_QUEUE_DB || '1'),
    },
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 50,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  },
  webhooks: {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_QUEUE_DB || '1'),
    },
    defaultJobOptions: {
      removeOnComplete: 50,
      removeOnFail: 25,
      attempts: 10,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  },
  analytics: {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_QUEUE_DB || '1'),
    },
    defaultJobOptions: {
      removeOnComplete: 20,
      removeOnFail: 10,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
  },
  cleanup: {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_QUEUE_DB || '1'),
    },
    defaultJobOptions: {
      removeOnComplete: 5,
      removeOnFail: 3,
      attempts: 2,
      repeat: { cron: '0 2 * * *' }, // Daily at 2 AM
    },
  },
}

// Queue instances
const queues: Record<string, Queue> = {}

/**
 * Initialize queue with configuration
 */
function createQueue(name: string, config: typeof QUEUE_CONFIGS.email): Queue {
  if (queues[name]) {
    return queues[name]
  }

  const queue = new Bull(name, {
    redis: config.redis,
    defaultJobOptions: config.defaultJobOptions,
  })

  // Global error handling
  queue.on('error', (error) => {
    console.error(`Queue ${name} error:`, error)
  })

  queue.on('waiting', (jobId) => {
    console.log(`Job ${jobId} is waiting in queue ${name}`)
  })

  queue.on('active', (job) => {
    console.log(`Job ${job.id} started processing in queue ${name}`)
  })

  queue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed in queue ${name}`, result)
  })

  queue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed in queue ${name}:`, err)
  })

  queue.on('stalled', (job) => {
    console.warn(`Job ${job.id} stalled in queue ${name}`)
  })

  queues[name] = queue
  return queue
}

/**
 * Email Queue Implementation
 */
export class EmailQueue {
  private queue: Queue

  constructor() {
    this.queue = createQueue('email', QUEUE_CONFIGS.email)
    this.setupProcessors()
  }

  private setupProcessors() {
    // Welcome email processor
    this.queue.process('welcome', 5, async (job: Job) => {
      const { userId, email, name } = job.data
      return this.sendWelcomeEmail(userId, email, name)
    })

    // Password reset processor
    this.queue.process('password-reset', 10, async (job: Job) => {
      const { email, resetToken } = job.data
      return this.sendPasswordResetEmail(email, resetToken)
    })

    // Notification processor
    this.queue.process('notification', 20, async (job: Job) => {
      const { recipients, subject, template, data } = job.data
      return this.sendNotificationEmail(recipients, subject, template, data)
    })

    // Bulk email processor
    this.queue.process('bulk', 2, async (job: Job) => {
      const { recipients, template, data } = job.data
      return this.sendBulkEmail(recipients, template, data)
    })
  }

  async sendWelcomeEmail(userId: string, email: string, name: string) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      const { data, error } = await resend.emails.send({
        from: 'ClueQuest <welcome@cluequest.app>',
        to: email,
        subject: 'Welcome to ClueQuest!',
        html: `
          <h1>Welcome ${name}!</h1>
          <p>Thank you for joining ClueQuest. Get ready for amazing adventures!</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding">Complete your setup</a>
        `,
      })

      if (error) throw error

      // Log successful send
      const supabase = createServiceClient()
      await supabase.from('cluequest_audit_logs').insert({
        user_id: userId,
        action: 'email_sent',
        resource_type: 'email',
        new_values: { type: 'welcome', recipient: email, messageId: data?.id },
      })

      return { success: true, messageId: data?.id }
    } catch (error) {
      console.error('Welcome email failed:', error)
      throw error
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

      const { data, error } = await resend.emails.send({
        from: 'ClueQuest <security@cluequest.app>',
        to: email,
        subject: 'Reset Your Password - ClueQuest',
        html: `
          <h1>Password Reset Request</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link expires in 1 hour.</p>
        `,
      })

      if (error) throw error

      return { success: true, messageId: data?.id }
    } catch (error) {
      console.error('Password reset email failed:', error)
      throw error
    }
  }

  async sendNotificationEmail(recipients: string[], subject: string, template: string, data: any) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      const results = await Promise.allSettled(
        recipients.map(async (recipient) => {
          const { data: emailData, error } = await resend.emails.send({
            from: 'ClueQuest <notifications@cluequest.app>',
            to: recipient,
            subject,
            html: this.renderTemplate(template, { ...data, recipient }),
          })

          if (error) throw error
          return { recipient, messageId: emailData?.id }
        })
      )

      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      return { successful, failed, results }
    } catch (error) {
      console.error('Notification email failed:', error)
      throw error
    }
  }

  async sendBulkEmail(recipients: string[], template: string, data: any) {
    // Process in batches to avoid rate limits
    const batchSize = 100
    const batches = []

    for (let i = 0; i < recipients.length; i += batchSize) {
      batches.push(recipients.slice(i, i + batchSize))
    }

    const results = []
    for (const batch of batches) {
      const batchResult = await this.sendNotificationEmail(batch, data.subject, template, data)
      results.push(batchResult)

      // Brief delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return {
      totalBatches: batches.length,
      totalRecipients: recipients.length,
      results
    }
  }

  private renderTemplate(template: string, data: any): string {
    // Simple template rendering - in production, use a proper template engine
    let rendered = template
    Object.keys(data).forEach(key => {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      rendered = rendered.replace(placeholder, data[key])
    })
    return rendered
  }

  // Public methods for adding jobs
  async scheduleWelcomeEmail(userId: string, email: string, name: string, options?: JobOptions) {
    return this.queue.add('welcome', { userId, email, name }, options)
  }

  async schedulePasswordResetEmail(email: string, resetToken: string, options?: JobOptions) {
    return this.queue.add('password-reset', { email, resetToken }, options)
  }

  async scheduleNotificationEmail(recipients: string[], subject: string, template: string, data: any, options?: JobOptions) {
    return this.queue.add('notification', { recipients, subject, template, data }, options)
  }

  async scheduleBulkEmail(recipients: string[], template: string, data: any, options?: JobOptions) {
    return this.queue.add('bulk', { recipients, template, data }, options)
  }
}

/**
 * Webhook Queue Implementation
 */
export class WebhookQueue {
  private queue: Queue

  constructor() {
    this.queue = createQueue('webhooks', QUEUE_CONFIGS.webhooks)
    this.setupProcessors()
  }

  private setupProcessors() {
    this.queue.process('delivery', 5, async (job: Job) => {
      const { url, payload, headers, secret } = job.data
      return this.deliverWebhook(url, payload, headers, secret)
    })
  }

  async deliverWebhook(url: string, payload: any, headers: Record<string, string> = {}, secret?: string) {
    try {
      // Generate signature if secret provided
      if (secret) {
        const crypto = await import('crypto')
        const signature = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(payload))
          .digest('hex')
        
        headers['X-Webhook-Signature'] = `sha256=${signature}`
      }

      // Add standard headers
      headers['Content-Type'] = 'application/json'
      headers['User-Agent'] = 'ClueQuest-Webhooks/1.0'
      headers['X-Webhook-Timestamp'] = new Date().toISOString()

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`)
      }

      const responseText = await response.text()
      
      return {
        success: true,
        status: response.status,
        response: responseText,
        timestamp: new Date().toISOString()
      }

    } catch (error) {
      console.error('Webhook delivery failed:', error)
      throw error
    }
  }

  async scheduleWebhookDelivery(url: string, payload: any, headers?: Record<string, string>, secret?: string, options?: JobOptions) {
    return this.queue.add('delivery', { url, payload, headers, secret }, options)
  }
}

/**
 * Analytics Queue Implementation
 */
export class AnalyticsQueue {
  private queue: Queue

  constructor() {
    this.queue = createQueue('analytics', QUEUE_CONFIGS.analytics)
    this.setupProcessors()
  }

  private setupProcessors() {
    this.queue.process('process-events', 3, async (job: Job) => {
      const { events } = job.data
      return this.processEvents(events)
    })

    this.queue.process('generate-reports', 1, async (job: Job) => {
      const { organizationId, reportType, dateRange } = job.data
      return this.generateReports(organizationId, reportType, dateRange)
    })

    this.queue.process('cleanup-old-data', 1, async (job: Job) => {
      const { retentionDays } = job.data
      return this.cleanupOldData(retentionDays)
    })
  }

  async processEvents(events: any[]) {
    try {
      const supabase = createServiceClient()
      
      // Batch process events
      const batchSize = 100
      const results = []

      for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize)
        
        // Transform events for database insertion
        const usageRecords = batch.map(event => ({
          organization_id: event.organizationId,
          user_id: event.userId,
          event_type: event.type,
          quantity: event.quantity || 1,
          metadata: event.metadata || {},
          recorded_at: new Date(event.timestamp),
          billing_period_start: this.getBillingPeriodStart(new Date(event.timestamp)),
          billing_period_end: this.getBillingPeriodEnd(new Date(event.timestamp))
        }))

        const { data, error } = await supabase
          .from('cluequest_usage_records')
          .insert(usageRecords)
          .select()

        if (error) throw error
        results.push(...(data || []))
      }

      return {
        processed: events.length,
        records: results.length
      }

    } catch (error) {
      console.error('Event processing failed:', error)
      throw error
    }
  }

  async generateReports(organizationId: string, reportType: string, dateRange: { start: Date, end: Date }) {
    try {
      const supabase = createServiceClient()

      // Generate different report types
      switch (reportType) {
        case 'usage-summary':
          return this.generateUsageSummary(supabase, organizationId, dateRange)
        case 'user-activity':
          return this.generateUserActivity(supabase, organizationId, dateRange)
        case 'performance-metrics':
          return this.generatePerformanceMetrics(supabase, organizationId, dateRange)
        default:
          throw new Error(`Unknown report type: ${reportType}`)
      }

    } catch (error) {
      console.error('Report generation failed:', error)
      throw error
    }
  }

  private async generateUsageSummary(supabase: any, organizationId: string, dateRange: { start: Date, end: Date }) {
    const { data, error } = await supabase
      .rpc('calculate_usage_metrics', {
        org_id: organizationId,
        start_date: dateRange.start.toISOString().split('T')[0],
        end_date: dateRange.end.toISOString().split('T')[0]
      })

    if (error) throw error
    return data
  }

  private async generateUserActivity(supabase: any, organizationId: string, dateRange: { start: Date, end: Date }) {
    // Implementation for user activity report
    return { reportType: 'user-activity', organizationId, dateRange }
  }

  private async generatePerformanceMetrics(supabase: any, organizationId: string, dateRange: { start: Date, end: Date }) {
    // Implementation for performance metrics report
    return { reportType: 'performance-metrics', organizationId, dateRange }
  }

  async cleanupOldData(retentionDays: number) {
    try {
      const supabase = createServiceClient()
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

      // Clean up old usage records
      const { error: usageError } = await supabase
        .from('cluequest_usage_records')
        .delete()
        .lt('recorded_at', cutoffDate.toISOString())

      if (usageError) throw usageError

      // Clean up old API usage records
      const { error: apiError } = await supabase
        .from('cluequest_api_usage')
        .delete()
        .lt('created_at', cutoffDate.toISOString())

      if (apiError) throw apiError

      return {
        cleanupDate: cutoffDate.toISOString(),
        retentionDays
      }

    } catch (error) {
      console.error('Data cleanup failed:', error)
      throw error
    }
  }

  private getBillingPeriodStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  private getBillingPeriodEnd(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)
  }

  // Public methods
  async scheduleEventProcessing(events: any[], options?: JobOptions) {
    return this.queue.add('process-events', { events }, options)
  }

  async scheduleReportGeneration(organizationId: string, reportType: string, dateRange: { start: Date, end: Date }, options?: JobOptions) {
    return this.queue.add('generate-reports', { organizationId, reportType, dateRange }, options)
  }

  async scheduleDataCleanup(retentionDays: number, options?: JobOptions) {
    return this.queue.add('cleanup-old-data', { retentionDays }, options)
  }
}

/**
 * Queue Manager - Central interface for all queues
 */
export class QueueManager {
  private static instance: QueueManager
  
  public emailQueue: EmailQueue
  public webhookQueue: WebhookQueue
  public analyticsQueue: AnalyticsQueue

  private constructor() {
    this.emailQueue = new EmailQueue()
    this.webhookQueue = new WebhookQueue()
    this.analyticsQueue = new AnalyticsQueue()
  }

  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager()
    }
    return QueueManager.instance
  }

  /**
   * Get queue statistics
   */
  async getStats() {
    const stats: Record<string, any> = {}
    
    for (const [name, queue] of Object.entries(queues)) {
      const waiting = await queue.getWaiting()
      const active = await queue.getActive()
      const completed = await queue.getCompleted()
      const failed = await queue.getFailed()
      const delayed = await queue.getDelayed()

      stats[name] = {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
      }
    }

    return stats
  }

  /**
   * Clean up completed and failed jobs
   */
  async cleanup() {
    const results: Record<string, any> = {}

    for (const [name, queue] of Object.entries(queues)) {
      await queue.clean(24 * 60 * 60 * 1000, 'completed') // 24 hours
      await queue.clean(7 * 24 * 60 * 60 * 1000, 'failed') // 7 days
      results[name] = 'cleaned'
    }

    return results
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    const shutdownPromises = Object.values(queues).map(queue => queue.close())
    await Promise.all(shutdownPromises)
  }
}

// Export singleton instance
export const queueManager = QueueManager.getInstance()

// Export individual queues for direct access if needed
export const emailQueue = queueManager.emailQueue
export const webhookQueue = queueManager.webhookQueue
export const analyticsQueue = queueManager.analyticsQueue
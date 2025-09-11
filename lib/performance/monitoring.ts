/**
 * Performance Monitoring System for ClueQuest
 * Real-time tracking of Core Web Vitals, database queries, and user experience metrics
 * Implements proven monitoring patterns from AXIS6 production deployments
 */

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  context?: Record<string, unknown>
}

interface WebVital {
  name: 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'FCP' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

interface QueryMetric {
  name: string
  duration: number
  success: boolean
  error?: string
  timestamp: number
  context?: Record<string, any>
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private webVitals: WebVital[] = []
  private queryMetrics: QueryMetric[] = []
  private observers: PerformanceObserver[] = []
  private isInitialized = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  /**
   * Initialize performance monitoring
   */
  private initialize(): void {
    if (this.isInitialized) return
    
    this.setupWebVitalsTracking()
    this.setupResourceTracking()
    this.setupNavigationTracking()
    this.setupErrorTracking()
    
    this.isInitialized = true
    console.log('📊 Performance monitoring initialized')
  }

  /**
   * Track Core Web Vitals with thresholds
   */
  private setupWebVitalsTracking(): void {
    // Largest Contentful Paint (LCP)
    this.observePerformance('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1]
      const value = lastEntry.startTime
      
      this.recordWebVital('LCP', value, this.getLCPRating(value))
    })

    // First Input Delay (FID)
    this.observePerformance('first-input', (entries) => {
      entries.forEach((entry: any) => {
        const value = entry.processingStart - entry.startTime
        this.recordWebVital('FID', value, this.getFIDRating(value))
      })
    })

    // Cumulative Layout Shift (CLS)
    this.observePerformance('layout-shift', (entries) => {
      let clsValue = 0
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      
      if (clsValue > 0) {
        this.recordWebVital('CLS', clsValue, this.getCLSRating(clsValue))
      }
    })

    // First Contentful Paint (FCP)
    this.observePerformance('paint', (entries) => {
      const fcpEntry = entries.find((entry: any) => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        const value = fcpEntry.startTime
        this.recordWebVital('FCP', value, this.getFCPRating(value))
      }
    })

    // Time to First Byte (TTFB)
    this.observePerformance('navigation', (entries) => {
      const navEntry = entries[0] as PerformanceNavigationTiming
      const value = navEntry.responseStart - navEntry.requestStart
      
      this.recordWebVital('TTFB', value, this.getTTFBRating(value))
    })

    // Interaction to Next Paint (INP) - Chrome 96+
    if ('PerformanceEventTiming' in window) {
      this.observePerformance('event', (entries) => {
        entries.forEach((entry: any) => {
          if (entry.interactionId) {
            const value = entry.processingEnd - entry.startTime
            this.recordWebVital('INP', value, this.getINPRating(value))
          }
        })
      })
    }
  }

  /**
   * Track resource loading performance
   */
  private setupResourceTracking(): void {
    this.observePerformance('resource', (entries) => {
      entries.forEach((entry: PerformanceResourceTiming) => {
        const duration = entry.responseEnd - entry.startTime
        
        // Track slow resources
        if (duration > 1000) {
          this.recordMetric('slow-resource', duration, {
            name: entry.name,
            type: this.getResourceType(entry),
            size: entry.transferSize
          })
        }
      })
    })
  }

  /**
   * Track navigation performance
   */
  private setupNavigationTracking(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        // Page load time
        const loadTime = perfData.loadEventEnd - perfData.fetchStart
        this.recordMetric('page-load', loadTime)
        
        // DOM processing time
        const domTime = perfData.domContentLoadedEventEnd - perfData.fetchStart
        this.recordMetric('dom-processing', domTime)
        
        // Network time
        const networkTime = perfData.responseEnd - perfData.requestStart
        this.recordMetric('network-time', networkTime)
        
        // Check for slow loads
        if (loadTime > 3000) {
          this.recordSlowPageLoad(loadTime, perfData)
        }
      })
    }
  }

  /**
   * Track JavaScript errors and performance issues
   */
  private setupErrorTracking(): void {
    if (typeof window !== 'undefined') {
      // Unhandled errors
      window.addEventListener('error', (event) => {
        this.recordMetric('javascript-error', 1, {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        })
      })

      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.recordMetric('unhandled-rejection', 1, {
          reason: event.reason?.toString()
        })
      })

      // Long tasks (blocking main thread)
      this.observePerformance('longtask', (entries) => {
        entries.forEach((entry: any) => {
          this.recordMetric('long-task', entry.duration, {
            name: entry.name,
            startTime: entry.startTime
          })
        })
      })
    }
  }

  /**
   * Observer helper for performance entries
   */
  private observePerformance(type: string, callback: (entries: any[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      
      observer.observe({ entryTypes: [type] })
      this.observers.push(observer)
      
    } catch (error) {
      console.warn(`Could not observe ${type}:`, error)
    }
  }

  /**
   * Track database query performance
   */
  async trackQuery<T>(
    queryName: string, 
    queryFn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    const start = performance.now()
    const startTime = Date.now()
    
    try {
      const result = await queryFn()
      const duration = performance.now() - start
      
      this.queryMetrics.push({
        name: queryName,
        duration,
        success: true,
        timestamp: startTime,
        context
      })
      
      // Log slow queries
      if (duration > 500) {
        console.warn(`🐌 Slow query detected: ${queryName} took ${Math.round(duration)}ms`)
        
        this.recordMetric('slow-query', duration, {
          name: queryName,
          ...context
        })
      }
      
      // Track query success rate
      this.recordMetric('query-success', 1, { name: queryName })
      
      return result
      
    } catch (error: any) {
      const duration = performance.now() - start
      
      this.queryMetrics.push({
        name: queryName,
        duration,
        success: false,
        error: error.message,
        timestamp: startTime,
        context
      })
      
      this.recordMetric('query-error', 1, {
        name: queryName,
        error: error.message,
        ...context
      })
      
      throw error
    }
  }

  /**
   * Track custom performance metrics
   */
  recordMetric(name: string, value: number, context?: Record<string, any>): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      context
    })
    
    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500)
    }
  }

  /**
   * Record Web Vital measurement
   */
  private recordWebVital(name: WebVital['name'], value: number, rating: WebVital['rating']): void {
    this.webVitals.push({
      name,
      value,
      rating,
      timestamp: Date.now()
    })
    
    // Log poor vitals
    if (rating === 'poor') {
      console.warn(`⚠️ Poor ${name}: ${Math.round(value)}${name === 'CLS' ? '' : 'ms'}`)
    }
    
    // Emit custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cluequest:web-vital', {
        detail: { name, value, rating }
      }))
    }
  }

  /**
   * Rating thresholds for Web Vitals
   */
  private getLCPRating(value: number): WebVital['rating'] {
    if (value <= 2500) return 'good'
    if (value <= 4000) return 'needs-improvement'
    return 'poor'
  }

  private getFIDRating(value: number): WebVital['rating'] {
    if (value <= 100) return 'good'
    if (value <= 300) return 'needs-improvement'
    return 'poor'
  }

  private getCLSRating(value: number): WebVital['rating'] {
    if (value <= 0.1) return 'good'
    if (value <= 0.25) return 'needs-improvement'
    return 'poor'
  }

  private getFCPRating(value: number): WebVital['rating'] {
    if (value <= 1800) return 'good'
    if (value <= 3000) return 'needs-improvement'
    return 'poor'
  }

  private getTTFBRating(value: number): WebVital['rating'] {
    if (value <= 800) return 'good'
    if (value <= 1800) return 'needs-improvement'
    return 'poor'
  }

  private getINPRating(value: number): WebVital['rating'] {
    if (value <= 200) return 'good'
    if (value <= 500) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Helper methods
   */
  private getResourceType(entry: PerformanceResourceTiming): string {
    const url = entry.name
    
    if (url.includes('.js')) return 'script'
    if (url.includes('.css')) return 'stylesheet'
    if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) return 'image'
    if (url.includes('api/')) return 'api'
    
    return 'other'
  }

  private recordSlowPageLoad(loadTime: number, perfData: PerformanceNavigationTiming): void {
    // Send alert for very slow loads
    if (process.env.NODE_ENV === 'production') {
      this.sendPerformanceAlert({
        type: 'slow_page_load',
        duration: loadTime,
        url: window.location.href,
        userAgent: navigator.userAgent,
        connection: (navigator as any).connection?.effectiveType,
        perfData: {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          ttfb: perfData.responseStart - perfData.requestStart,
          dom: perfData.domContentLoadedEventEnd - perfData.fetchStart
        }
      })
    }
  }

  /**
   * Send performance data to analytics
   */
  private sendPerformanceAlert(data: any): void {
    if (typeof fetch !== 'undefined') {
      fetch('/api/analytics/performance-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {
        // Silently fail - don't let monitoring break the app
      })
    }
  }

  /**
   * Flush metrics to analytics service
   */
  flush(): void {
    if (process.env.NODE_ENV === 'production' && this.metrics.length > 0) {
      const data = {
        metrics: this.metrics.slice(),
        webVitals: this.webVitals.slice(),
        queryMetrics: this.queryMetrics.slice(),
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      }
      
      if (typeof fetch !== 'undefined') {
        fetch('/api/analytics/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(() => {
          // Silently fail - don't let monitoring break the app
        })
      }
    }
    
    // Clear stored metrics after flushing
    this.metrics = []
    this.webVitals = []
    this.queryMetrics = []
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    webVitals: { [key: string]: { value: number, rating: string } }
    queryStats: { 
      totalQueries: number
      avgDuration: number
      successRate: number
      slowQueries: number
    }
    pageMetrics: { [key: string]: number }
  } {
    // Latest web vitals
    const latestVitals = this.webVitals.reduce((acc, vital) => {
      if (!acc[vital.name] || vital.timestamp > acc[vital.name].timestamp) {
        acc[vital.name] = { value: vital.value, rating: vital.rating, timestamp: vital.timestamp }
      }
      return acc
    }, {} as any)

    // Clean up timestamps for return
    Object.keys(latestVitals).forEach(key => {
      delete latestVitals[key].timestamp
    })

    // Query statistics
    const queryStats = {
      totalQueries: this.queryMetrics.length,
      avgDuration: this.queryMetrics.length > 0 
        ? this.queryMetrics.reduce((sum, q) => sum + q.duration, 0) / this.queryMetrics.length 
        : 0,
      successRate: this.queryMetrics.length > 0
        ? this.queryMetrics.filter(q => q.success).length / this.queryMetrics.length
        : 1,
      slowQueries: this.queryMetrics.filter(q => q.duration > 500).length
    }

    // Page metrics
    const pageMetrics = this.metrics.reduce((acc, metric) => {
      if (['page-load', 'dom-processing', 'network-time'].includes(metric.name)) {
        acc[metric.name] = metric.value
      }
      return acc
    }, {} as { [key: string]: number })

    return {
      webVitals: latestVitals,
      queryStats,
      pageMetrics
    }
  }

  /**
   * Cleanup observers
   */
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Auto-flush every 30 seconds in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  setInterval(() => {
    performanceMonitor.flush()
  }, 30000)
  
  // Flush on page unload
  window.addEventListener('beforeunload', () => {
    performanceMonitor.flush()
  })
}

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  return {
    trackQuery: performanceMonitor.trackQuery.bind(performanceMonitor),
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getSummary: performanceMonitor.getSummary.bind(performanceMonitor),
    flush: performanceMonitor.flush.bind(performanceMonitor)
  }
}
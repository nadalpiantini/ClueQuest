'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Bug, Home, Download } from 'lucide-react'
import { GamingButton, GamingCard } from '@/components/ui/gaming-components'

interface Props {
  children: ReactNode
  fallbackComponent?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  retryCount: number
}

export class AdventureBuilderErrorBoundary extends Component<Props, State> {
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })

    // Log error details for debugging
    console.error('🚨 Adventure Builder Error Boundary Caught:', error)
    console.error('📍 Component Stack:', errorInfo.componentStack)
    
    // Check for specific error types
    if (error.message?.includes('Cannot read properties of undefined')) {
      console.error('💥 Data Structure Error: Likely undefined object property access')
      console.info('🔧 Solution: Check for null safety patterns (?.length, || []) in components')
    }
    
    if (error.message?.includes('challengeTypes') || error.message?.includes('qrLocations')) {
      console.error('🔄 Migration Error: Old data structure detected')
      console.info('🔧 Solution: Clear localStorage or implement data migration')
    }

    // Call parent error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Auto-retry for certain types of errors
    if (this.state.retryCount < this.maxRetries && this.shouldAutoRetry(error)) {
      setTimeout(() => {
        this.setState(prevState => ({
          hasError: false,
          error: null,
          errorInfo: null,
          retryCount: prevState.retryCount + 1
        }))
      }, 1000)
    }
  }

  private shouldAutoRetry(error: Error): boolean {
    // Auto-retry for temporary network errors or React hydration issues
    return error.message?.includes('hydration') ||
           error.message?.includes('network') ||
           error.message?.includes('fetch')
  }

  private clearSavedData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cluequest-builder-data')
      console.info('🧹 Cleared adventure data from localStorage')
      this.retry()
    }
  }

  private exportErrorReport = () => {
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: {
        message: this.state.error?.message,
        stack: this.state.error?.stack,
        name: this.state.error?.name
      },
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    }

    const dataStr = JSON.stringify(errorReport, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `adventure-builder-error-${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  private retry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <GamingCard className="max-w-2xl w-full p-8 text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="p-6 rounded-full bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="h-12 w-12 text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-red-200">
                Adventure Builder Error
              </h1>
              <p className="text-slate-400">
                Something went wrong with the Adventure Builder. This is likely due to a data structure change or configuration issue.
              </p>
              {this.state.retryCount > 0 && (
                <p className="text-amber-400 text-sm">
                  Retry attempt: {this.state.retryCount}/{this.maxRetries}
                </p>
              )}
            </div>

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="text-left p-4 rounded-lg bg-slate-800/60 border border-slate-600">
                <h3 className="text-red-300 font-bold mb-2 flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Error Details (Development)
                </h3>
                <div className="text-xs text-slate-300 space-y-2">
                  <div>
                    <strong>Message:</strong> {this.state.error.message}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 text-xs text-slate-400 whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {this.state.error.stack?.substring(0, 500)}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 text-xs text-slate-400 whitespace-pre-wrap max-h-20 overflow-y-auto">
                        {this.state.errorInfo.componentStack?.substring(0, 300)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recovery Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Recovery Options</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GamingButton
                  variant="mystery"
                  size="md"
                  onClick={this.retry}
                  disabled={this.state.retryCount >= this.maxRetries}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </GamingButton>

                <GamingButton
                  variant="outline"
                  size="md"
                  onClick={this.clearSavedData}
                  className="w-full"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Clear Saved Data
                </GamingButton>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GamingButton
                  variant="ghost"
                  size="md"
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full"
                >
                  <Home className="h-4 w-4" />
                  Back to Dashboard
                </GamingButton>

                {process.env.NODE_ENV === 'development' && (
                  <GamingButton
                    variant="ghost"
                    size="md"
                    onClick={this.exportErrorReport}
                    className="w-full"
                  >
                    <Download className="h-4 w-4" />
                    Export Error Report
                  </GamingButton>
                )}
              </div>
            </div>

            {/* Quick Fixes */}
            <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 text-left">
              <h4 className="text-amber-200 font-bold mb-2">🔧 Quick Fixes to Try:</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• <strong>Clear Data:</strong> Click "Clear Saved Data" to reset adventure data</li>
                <li>• <strong>Refresh Page:</strong> Try refreshing the browser (Cmd/Ctrl + R)</li>
                <li>• <strong>Check Console:</strong> Open browser DevTools for more error details</li>
                {!this.shouldAutoRetry(this.state.error!) && (
                  <li>• <strong>Contact Support:</strong> This error may require developer assistance</li>
                )}
              </ul>
            </div>

            {/* Migration Notice */}
            {this.state.error?.message?.includes('challengeTypes') || 
             this.state.error?.message?.includes('qrLocations') && (
              <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5 text-left">
                <h4 className="text-blue-200 font-bold mb-2">🔄 Data Migration Required</h4>
                <p className="text-sm text-slate-300">
                  This error occurred because you have adventure data from an older version. 
                  Clearing saved data will allow the new Adventure Builder to work properly.
                </p>
              </div>
            )}
          </GamingCard>
        </div>
      )
    }

    return this.props.children
  }
}
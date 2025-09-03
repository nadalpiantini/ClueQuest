"use client"

import * as React from "react"
import { formatRelativeTime, cn } from "@/lib/utils"
import { 
  User, 
  FileText, 
  MessageSquare, 
  Settings, 
  UserPlus, 
  GitCommit,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreHorizontal
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface ActivityItem {
  id: string
  type: 'comment' | 'file_upload' | 'task_completed' | 'user_joined' | 'project_created' | 'settings_changed' | 'commit' | 'custom'
  title: string
  description?: string
  timestamp: string
  user: {
    id: string
    name: string
    avatar?: string
    role?: string
  }
  metadata?: {
    project?: string
    file?: string
    task?: string
    commit?: string
    [key: string]: any
  }
  priority?: 'low' | 'medium' | 'high'
  category?: string
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
  loading?: boolean
  showFilters?: boolean
  compact?: boolean
  limit?: number
  onLoadMore?: () => void
  hasMore?: boolean
  className?: string
}

const activityIcons = {
  comment: MessageSquare,
  file_upload: Upload,
  task_completed: CheckCircle2,
  user_joined: UserPlus,
  project_created: FileText,
  settings_changed: Settings,
  commit: GitCommit,
  custom: Clock,
}

const activityColors = {
  comment: 'text-primary-600 bg-primary-100',
  file_upload: 'text-secondary-600 bg-secondary-100',
  task_completed: 'text-success-600 bg-success-100',
  user_joined: 'text-primary-600 bg-primary-100',
  project_created: 'text-purple-600 bg-purple-100',
  settings_changed: 'text-neutral-600 bg-neutral-100',
  commit: 'text-orange-600 bg-orange-100',
  custom: 'text-neutral-600 bg-neutral-100',
}

function ActivityIcon({ type, className }: { type: ActivityItem['type']; className?: string }) {
  const IconComponent = activityIcons[type] || Clock
  const colorClass = activityColors[type] || activityColors.custom

  return (
    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", colorClass, className)}>
      <IconComponent className="w-4 h-4" />
    </div>
  )
}

function ActivityCard({ activity, compact = false }: { activity: ActivityItem; compact?: boolean }) {
  const [showDetails, setShowDetails] = React.useState(false)

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-neutral-200 -z-10" />

      <div className="flex items-start space-x-4 pb-6 last:pb-0">
        <ActivityIcon type={activity.type} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {activity.title}
                </p>
                {activity.priority && (
                  <Badge
                    size="sm"
                    variant={activity.priority === 'high' ? 'destructive' : 
                            activity.priority === 'medium' ? 'warning' : 'secondary'}
                  >
                    {activity.priority}
                  </Badge>
                )}
              </div>

              {activity.description && (
                <p className={cn(
                  "text-sm text-neutral-600",
                  compact ? "line-clamp-1" : "line-clamp-2",
                  showDetails && "line-clamp-none"
                )}>
                  {activity.description}
                </p>
              )}

              {/* Metadata */}
              {activity.metadata && !compact && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  {activity.metadata.project && (
                    <Badge variant="outline" size="sm">
                      {activity.metadata.project}
                    </Badge>
                  )}
                  {activity.metadata.file && (
                    <span>📎 {activity.metadata.file}</span>
                  )}
                  {activity.metadata.task && (
                    <span>✓ {activity.metadata.task}</span>
                  )}
                  {activity.metadata.commit && (
                    <span className="font-mono">
                      {activity.metadata.commit.substring(0, 7)}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-2 flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Avatar size="xs">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback name={activity.user.name} />
                  </Avatar>
                  <span className="text-xs font-medium text-neutral-700">
                    {activity.user.name}
                  </span>
                  {activity.user.role && (
                    <Badge variant="outline" size="sm">
                      {activity.user.role}
                    </Badge>
                  )}
                </div>
                
                <span className="text-xs text-neutral-500">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>
            </div>

            {!compact && (
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-neutral-600 touch-target"
                onClick={() => setShowDetails(!showDetails)}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ActivityTimeline({
  activities,
  loading = false,
  showFilters = false,
  compact = false,
  limit,
  onLoadMore,
  hasMore = false,
  className,
}: ActivityTimelineProps) {
  const [filter, setFilter] = React.useState<string>('all')
  const [expandedActivities, setExpandedActivities] = React.useState<Set<string>>(new Set())

  const filteredActivities = React.useMemo(() => {
    let filtered = activities

    if (filter !== 'all') {
      filtered = activities.filter(activity => activity.type === filter)
    }

    if (limit) {
      filtered = filtered.slice(0, limit)
    }

    return filtered
  }, [activities, filter, limit])

  const activityTypes = React.useMemo(() => {
    const types = Array.from(new Set(activities.map(a => a.type)))
    return types.map(type => ({
      value: type,
      label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: activities.filter(a => a.type === type).length
    }))
  }, [activities])

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-neutral-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-neutral-200 rounded-full" />
                    <div className="h-3 bg-neutral-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <div className="w-12 h-12 bg-neutral-100 rounded-lg center-flex mx-auto mb-4">
            <Clock className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
          <p className="text-neutral-600">
            Activity will appear here as your team collaborates
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Activity Timeline</CardTitle>
          <Badge variant="secondary" size="sm">
            {activities.length} activities
          </Badge>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full transition-colors touch-target",
                filter === 'all'
                  ? "bg-primary-100 text-primary-700"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
            >
              All ({activities.length})
            </button>
            {activityTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full transition-colors touch-target",
                  filter === type.value
                    ? "bg-primary-100 text-primary-700"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                )}
              >
                {type.label} ({type.count})
              </button>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="relative">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              compact={compact}
            />
          ))}

          {hasMore && onLoadMore && (
            <div className="text-center pt-4 border-t">
              <Button
                variant="ghost"
                size="touch"
                onClick={onLoadMore}
                className="w-full"
              >
                Load more activities
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Compact timeline for dashboard widgets
export function CompactActivityTimeline({
  activities,
  limit = 5,
  className,
}: {
  activities: ActivityItem[]
  limit?: number
  className?: string
}) {
  const recentActivities = activities.slice(0, limit)

  return (
    <div className={cn("space-y-4", className)}>
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-3">
          <ActivityIcon type={activity.type} className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{activity.title}</p>
            <div className="flex items-center space-x-2 text-xs text-neutral-500">
              <span>{activity.user.name}</span>
              <span>•</span>
              <span>{formatRelativeTime(activity.timestamp)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Activity feed for real-time updates
export function ActivityFeed({ 
  activities,
  onActivityClick,
}: {
  activities: ActivityItem[]
  onActivityClick?: (activity: ActivityItem) => void
}) {
  return (
    <div className="max-h-96 overflow-y-auto space-y-1 scrollbar-thin">
      {activities.map((activity) => (
        <button
          key={activity.id}
          onClick={() => onActivityClick?.(activity)}
          className="w-full p-3 text-left hover:bg-neutral-50 rounded-lg transition-colors"
        >
          <div className="flex items-start space-x-3">
            <ActivityIcon type={activity.type} className="mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">{activity.title}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {activity.user.name} • {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
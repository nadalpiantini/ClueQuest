"use client"

import * as React from "react"
import Link from "next/link"
import { formatRelativeTime } from "@/lib/utils"
import { 
  MoreHorizontal, 
  Calendar, 
  Users, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Circle
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from "@/components/ui/avatar"
import { Badge, StatusBadge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'completed' | 'cancelled' | 'draft' | 'pending'
  priority: 'low' | 'medium' | 'high' | 'critical'
  progress: number
  dueDate?: string
  lastActivity: string
  team: {
    id: string
    name: string
    avatar?: string
    role?: string
    status?: 'online' | 'offline' | 'busy' | 'away'
  }[]
  stats: {
    totalTasks: number
    completedTasks: number
    openIssues: number
    recentActivity: number
  }
  tags?: string[]
  color?: string
}

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (project: Project) => void
  onArchive?: (project: Project) => void
  className?: string
}

const priorityConfig = {
  low: { color: 'text-success-600', bg: 'bg-success-100', label: 'Low' },
  medium: { color: 'text-secondary-600', bg: 'bg-secondary-100', label: 'Medium' },
  high: { color: 'text-error-600', bg: 'bg-error-100', label: 'High' },
  critical: { color: 'text-error-700', bg: 'bg-error-200', label: 'Critical' },
}

export function ProjectCard({ project, onEdit, onDelete, onArchive, className }: ProjectCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const priority = priorityConfig[project.priority]
  
  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-success-600" />
      case 'active':
        return <Circle className="w-4 h-4 text-primary-600 fill-current" />
      case 'pending':
        return <Clock className="w-4 h-4 text-secondary-600" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-error-600" />
      default:
        return <Circle className="w-4 h-4 text-neutral-400" />
    }
  }

  const completionRate = Math.round((project.stats.completedTasks / project.stats.totalTasks) * 100) || 0

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer",
        className
      )}
      interactive
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Color accent bar */}
      {project.color && (
        <div 
          className="absolute top-0 left-0 w-full h-1" 
          style={{ backgroundColor: project.color }}
        />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(project.status)}
              <h3 className="font-semibold text-lg truncate">
                <Link 
                  href={`/projects/${project.id}`}
                  className="hover:text-primary-600 transition-colors"
                >
                  {project.name}
                </Link>
              </h3>
              <Badge 
                size="sm" 
                className={cn(priority.bg, priority.color)}
                variant="secondary"
              >
                {priority.label}
              </Badge>
            </div>
            
            {project.description && (
              <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                {project.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} size="sm" />
              
              {project.tags && project.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
              
              {project.tags && project.tags.length > 2 && (
                <Badge variant="outline" size="sm">
                  +{project.tags.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity touch-target",
                  isHovered && "opacity-100"
                )}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="w-48 bg-white rounded-md shadow-lg border border-neutral-200 p-1 z-50"
                side="bottom"
                align="end"
              >
                <DropdownMenu.Item 
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-100 cursor-pointer text-sm"
                  onClick={() => onEdit?.(project)}
                >
                  <span>Edit project</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item 
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-100 cursor-pointer text-sm"
                  onClick={() => onArchive?.(project)}
                >
                  <span>Archive</span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-neutral-200 my-1" />
                <DropdownMenu.Item 
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-error-50 cursor-pointer text-sm text-error-600"
                  onClick={() => onDelete?.(project)}
                >
                  <span>Delete project</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Progress</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-neutral-900">
              {project.stats.totalTasks}
            </div>
            <div className="text-neutral-500">Tasks</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-success-600">
              {project.stats.completedTasks}
            </div>
            <div className="text-neutral-500">Done</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-error-600">
              {project.stats.openIssues}
            </div>
            <div className="text-neutral-500">Issues</div>
          </div>
        </div>

        {/* Team and meta info */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <div className="flex items-center space-x-2">
            <AvatarGroup max={3} size="xs">
              {project.team.map((member) => (
                <Avatar key={member.id} size="xs" status={member.status}>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback name={member.name} />
                </Avatar>
              ))}
            </AvatarGroup>
            <span className="text-xs text-neutral-500">
              {project.team.length} member{project.team.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-neutral-500">
            {project.dueDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatRelativeTime(project.dueDate)}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>{formatRelativeTime(project.lastActivity)}</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Hover overlay for quick actions */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      )}
    </Card>
  )
}

// Project grid component
export function ProjectGrid({ 
  projects, 
  onEdit, 
  onDelete, 
  onArchive,
  loading = false 
}: {
  projects: Project[]
  onEdit?: (project: Project) => void
  onDelete?: (project: Project) => void
  onArchive?: (project: Project) => void
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-neutral-200 rounded w-full mb-1" />
                  <div className="h-4 bg-neutral-200 rounded w-2/3" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-2 bg-neutral-200 rounded w-full" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-8 bg-neutral-200 rounded" />
                  <div className="h-8 bg-neutral-200 rounded" />
                  <div className="h-8 bg-neutral-200 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-neutral-600 mb-4">
            Get started by creating your first project
          </p>
          <Button>Create Project</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onArchive={onArchive}
        />
      ))}
    </div>
  )
}
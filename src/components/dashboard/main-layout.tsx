"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Settings, 
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  Plus,
  LogOut,
  User,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: React.ReactNode
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
    organization?: {
      name: string
      role: string
    }
  }
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  description?: string
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and analytics"
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderOpen,
    badge: 3,
    description: "Manage your projects"
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
    description: "Team members and collaboration"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account and organization settings"
  },
]

export function MainLayout({ children, user }: MainLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [notifications, setNotifications] = React.useState([
    { id: 1, title: "New team member joined", time: "2m ago", unread: true },
    { id: 2, title: "Project deadline reminder", time: "1h ago", unread: true },
    { id: 3, title: "Weekly report ready", time: "3h ago", unread: false },
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="h-screen flex bg-neutral-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-200 ease-in-out z-50 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CQ</span>
              </div>
              <span className="font-semibold text-lg">ClueQuest</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              className="lg:hidden touch-target"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick actions */}
          <div className="p-4 border-b border-neutral-200">
            <Button size="touch" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} onClick={closeSidebar}>
                  <div
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors touch-target",
                      isActive
                        ? "bg-primary-100 text-primary-700"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <Badge size="sm" variant="secondary">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User profile */}
          <div className="border-t border-neutral-200 p-4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-neutral-100 transition-colors touch-target">
                  <Avatar size="sm">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback name={user?.name} />
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">{user?.name || 'John Doe'}</p>
                    <p className="text-xs text-neutral-500 truncate">
                      {user?.organization?.role || 'Admin'} at {user?.organization?.name || 'Acme Inc'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="w-56 bg-white rounded-md shadow-lg border border-neutral-200 p-1 z-50"
                  side="top"
                  align="start"
                >
                  <DropdownMenu.Item className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-100 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-100 cursor-pointer">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">Organization</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-neutral-200 my-1" />
                  <DropdownMenu.Item className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-100 cursor-pointer text-error-600">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-neutral-200 px-4 lg:px-6 h-16 flex items-center justify-between">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden touch-target"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                type="search"
                placeholder="Search projects, teams, or documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="ghost" size="icon" className="relative touch-target">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      size="sm" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="w-80 bg-white rounded-md shadow-lg border border-neutral-200 p-0 z-50"
                  side="bottom"
                  align="end"
                >
                  <div className="p-4 border-b border-neutral-200">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <DropdownMenu.Item
                        key={notification.id}
                        className="flex items-start space-x-3 p-4 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-0"
                      >
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                          notification.unread ? "bg-primary-500" : "bg-neutral-300"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-neutral-500">{notification.time}</p>
                        </div>
                      </DropdownMenu.Item>
                    ))}
                  </div>
                  <div className="p-3 border-t border-neutral-200">
                    <Button variant="ghost" size="sm" className="w-full">
                      View all notifications
                    </Button>
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* User avatar */}
            <Avatar size="sm" ring className="cursor-pointer">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback name={user?.name} />
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 pb-safe">
          {children}
        </main>
      </div>
    </div>
  )
}

// Page header component for consistent page styling
export function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  breadcrumbs?: { name: string; href?: string }[]
}) {
  return (
    <div className="mb-8">
      {breadcrumbs && (
        <nav className="flex items-center space-x-2 text-sm text-neutral-500 mb-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.name}>
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-neutral-700 transition-colors">
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-neutral-900 font-medium">{crumb.name}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
          {description && (
            <p className="mt-2 text-neutral-600">{description}</p>
          )}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    </div>
  )
}
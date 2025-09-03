"use client"

import * as React from "react"
import { LoginForm } from "@/components/auth/login-form"
import { MainLayout, PageHeader } from "@/components/dashboard/main-layout"
import { ProjectCard, ProjectGrid } from "@/components/dashboard/project-card"
import { ActivityTimeline, CompactActivityTimeline } from "@/components/dashboard/activity-timeline"
import { MultiStepForm, ProjectSetupForm } from "@/components/forms/multi-step-form"
import { FileUpload, CompactFileUpload } from "@/components/forms/file-upload"
import { useToast, ToastContainer } from "@/components/notifications/toast"
import { 
  Button, 
  Input, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Avatar,
  AvatarFallback,
  Badge,
  ConfirmDialog,
  FormDialog
} from "@/components/ui"

// Mock data for demonstrations
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@acme.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
  organization: {
    name: "Acme Inc",
    role: "Admin"
  }
}

const mockProjects = [
  {
    id: "1",
    name: "ClueQuest Mobile App",
    description: "Native mobile application for iOS and Android with real-time collaboration features",
    status: 'active' as const,
    priority: 'high' as const,
    progress: 75,
    dueDate: "2024-12-31",
    lastActivity: "2024-01-15T10:30:00Z",
    team: [
      { id: "1", name: "John Doe", avatar: "", status: 'online' as const },
      { id: "2", name: "Jane Smith", avatar: "", status: 'busy' as const },
      { id: "3", name: "Mike Johnson", avatar: "", status: 'offline' as const },
    ],
    stats: {
      totalTasks: 45,
      completedTasks: 34,
      openIssues: 3,
      recentActivity: 8
    },
    tags: ["React Native", "TypeScript", "Mobile"],
    color: "#0ea5e9"
  },
  {
    id: "2", 
    name: "API Documentation",
    description: "Comprehensive API documentation and developer portal",
    status: 'completed' as const,
    priority: 'medium' as const,
    progress: 100,
    dueDate: "2024-01-20",
    lastActivity: "2024-01-14T15:45:00Z",
    team: [
      { id: "4", name: "Sarah Wilson", avatar: "", status: 'away' as const },
      { id: "5", name: "David Brown", avatar: "", status: 'online' as const },
    ],
    stats: {
      totalTasks: 25,
      completedTasks: 25,
      openIssues: 0,
      recentActivity: 2
    },
    tags: ["Documentation", "OpenAPI"],
    color: "#22c55e"
  }
]

const mockActivities = [
  {
    id: "1",
    type: 'comment' as const,
    title: "Added feedback on mobile UI design",
    description: "The new navigation pattern looks great! I think we should consider adding haptic feedback for button interactions.",
    timestamp: "2024-01-15T10:30:00Z",
    user: mockUser,
    metadata: { project: "ClueQuest Mobile" }
  },
  {
    id: "2",
    type: 'task_completed' as const,
    title: "Completed user authentication flow",
    description: "Implemented OAuth 2.0 integration with Google and GitHub providers",
    timestamp: "2024-01-15T09:15:00Z",
    user: { id: "2", name: "Jane Smith", role: "Developer" },
    metadata: { 
      project: "ClueQuest Mobile",
      task: "AUTH-123"
    }
  },
  {
    id: "3",
    type: 'file_upload' as const,
    title: "Uploaded design mockups",
    timestamp: "2024-01-15T08:45:00Z",
    user: { id: "3", name: "Mike Johnson", role: "Designer" },
    metadata: {
      project: "ClueQuest Mobile",
      file: "mobile-wireframes-v3.figma"
    }
  }
]

export function ComponentShowcase() {
  const { toast, success, error } = useToast()
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [showFormDialog, setShowFormDialog] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState<any>(null)

  const handleLogin = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    success({
      title: "Login successful!",
      description: "Welcome back to ClueQuest"
    })
  }

  const handleProjectSetup = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    success({
      title: "Project created!",
      description: `${data.projectName} has been set up successfully`
    })
    setShowFormDialog(false)
  }

  const handleFileUpload = (files: any[]) => {
    success({
      title: "Files uploaded",
      description: `${files.length} file(s) uploaded successfully`
    })
  }

  return (
    <MainLayout user={mockUser}>
      <div className="max-w-7xl mx-auto space-y-12">
        <PageHeader
          title="Component Showcase"
          description="Production-ready ClueQuest components with mobile-first design"
          action={
            <Button onClick={() => toast({ 
              title: "Hello ClueQuest!", 
              description: "All components ready for production" 
            })}>
              Test Toast
            </Button>
          }
        />

        {/* Authentication Components */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Authentication</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Login Form</h3>
                <LoginForm onSubmit={handleLogin} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Feature Highlights</h3>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Mobile-First Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Badge variant="success" size="sm">✓</Badge>
                      <span>44px touch targets (WCAG compliant)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success" size="sm">✓</Badge>
                      <span>Social auth integration ready</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success" size="sm">✓</Badge>
                      <span>Form validation with Zod</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success" size="sm">✓</Badge>
                      <span>Loading states and error handling</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success" size="sm">✓</Badge>
                      <span>Responsive design (375px - 4K)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Project Management */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Project Management</h2>
            <ProjectGrid
              projects={mockProjects}
              onEdit={setSelectedProject}
              onDelete={(project) => {
                setSelectedProject(project)
                setShowConfirmDialog(true)
              }}
            />
          </div>
        </section>

        {/* Activity Timeline */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Activity & Collaboration</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ActivityTimeline
                  activities={mockActivities}
                  showFilters
                />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CompactActivityTimeline activities={mockActivities} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Forms & File Upload */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Forms & File Upload</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Multi-Step Form</h3>
                <Button 
                  onClick={() => setShowFormDialog(true)}
                  size="touch"
                  className="mb-4"
                >
                  Create New Project
                </Button>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Form Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>✓ Progressive enhancement</div>
                    <div>✓ Step validation and navigation</div>
                    <div>✓ Mobile-optimized progress indicators</div>
                    <div>✓ Form state persistence</div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">File Upload</h3>
                <FileUpload
                  onFilesChange={handleFileUpload}
                  maxFiles={3}
                  acceptedTypes={['image/*', 'application/pdf']}
                />
              </div>
            </div>
          </div>
        </section>

        {/* UI Components Grid */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">UI Component Library</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Buttons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Button size="touch" className="w-full">Primary</Button>
                    <Button variant="secondary" size="touch" className="w-full">Secondary</Button>
                    <Button variant="outline" size="touch" className="w-full">Outline</Button>
                    <Button variant="ghost" size="touch" className="w-full">Ghost</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Avatars */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Avatars</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Avatar size="xs" status="online">
                      <AvatarFallback name="John Doe" />
                    </Avatar>
                    <Avatar size="sm" status="busy">
                      <AvatarFallback name="Jane Smith" />
                    </Avatar>
                    <Avatar size="md" status="away">
                      <AvatarFallback name="Mike Johnson" />
                    </Avatar>
                    <Avatar size="lg" status="offline">
                      <AvatarFallback name="Sarah Wilson" />
                    </Avatar>
                  </div>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Badges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="destructive">Error</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mobile Optimization Highlights */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Mobile Optimization</h2>
            <Card variant="glass">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 bg-primary-100 rounded-lg center-flex mx-auto mb-3">
                      <span className="text-primary-600 font-bold">44px</span>
                    </div>
                    <h3 className="font-semibold mb-1">Touch Targets</h3>
                    <p className="text-sm text-neutral-600">WCAG compliant minimum size</p>
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 bg-success-100 rounded-lg center-flex mx-auto mb-3">
                      <span className="text-success-600 font-bold">✓</span>
                    </div>
                    <h3 className="font-semibold mb-1">Safe Areas</h3>
                    <p className="text-sm text-neutral-600">Perfect for notched devices</p>
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg center-flex mx-auto mb-3">
                      <span className="text-secondary-600 font-bold">⚡</span>
                    </div>
                    <h3 className="font-semibold mb-1">GPU Acceleration</h3>
                    <p className="text-sm text-neutral-600">Smooth 60fps animations</p>
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg center-flex mx-auto mb-3">
                      <span className="text-purple-600 font-bold">📱</span>
                    </div>
                    <h3 className="font-semibold mb-1">Responsive</h3>
                    <p className="text-sm text-neutral-600">320px to 4K displays</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Delete Project"
        description={`Are you sure you want to delete "${selectedProject?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => {
          error({
            title: "Project deleted",
            description: `${selectedProject?.name} has been removed`
          })
        }}
      />

      <FormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        title="Create New Project"
        description="Set up a new project with our guided setup process"
        size="lg"
      >
        <ProjectSetupForm onSubmit={handleProjectSetup} />
      </FormDialog>

      {/* Toast Container */}
      <ToastContainer />
    </MainLayout>
  )
}

export default ComponentShowcase
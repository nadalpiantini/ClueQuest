// Authentication Components
export { LoginForm, LoginPage } from './auth/login-form'
export { RegisterForm as Register } from './auth/register-form'
export { DemoAuthProvider, useDemoAuth } from './auth/demo-auth-provider'

// Layout Components
export { BodyWrapper } from './layout/body-wrapper'

// Dashboard Components  
export { MainLayout, PageHeader } from './dashboard/main-layout'
export { ProjectCard, ProjectGrid } from './dashboard/project-card'
export { 
  ActivityTimeline, 
  CompactActivityTimeline, 
  ActivityFeed 
} from './dashboard/activity-timeline'

// Form Components
export { 
  MultiStepForm, 
  ProjectSetupForm,
  type Step,
  type MultiStepFormProps
} from './forms/multi-step-form'
export { 
  FileUpload, 
  CompactFileUpload,
  type UploadedFile 
} from './forms/file-upload'

// Notification Components
export { 
  useToast,
  ToastContainer,
  EnhancedToast,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps
} from './notifications/toast'

// UI Components (Core)
export {
  Button,
  buttonVariants,
  Input,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  Badge,
  StatusBadge,
  badgeVariants,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  ConfirmDialog,
  FormDialog,
  cn
} from './ui'

// AI Components
export { 
  default as AILoading,
  AIThinking,
  AIGenerating,
  AIProcessing,
  AIButtonLoading
} from './ui/ai-loading'

// Builder Components
export { default as LocationBuilder } from './builder/LocationBuilder'
export { default as QRGenerator } from './builder/QRGenerator'
export { default as ChallengeLocationMapper } from './builder/ChallengeLocationMapper'
export { default as QRExporter } from './builder/QRExporter'

// Example & Showcase
export { default as ComponentShowcase } from './examples/component-showcase'

// Type definitions for common interfaces
export type { Project } from './dashboard/project-card'
export type { ActivityItem } from './dashboard/activity-timeline'
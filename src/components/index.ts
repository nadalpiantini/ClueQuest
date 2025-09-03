// Authentication Components
export { LoginForm, RegisterForm, LoginPage, RegisterPage } from './auth/login-form'
export { RegisterForm as Register } from './auth/register-form'

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

// Example & Showcase
export { default as ComponentShowcase } from './examples/component-showcase'

// Type definitions for common interfaces
export type { Project } from './dashboard/project-card'
export type { ActivityItem } from './dashboard/activity-timeline'
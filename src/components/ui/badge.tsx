"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-500 text-white",
        secondary: "border-transparent bg-secondary-100 text-secondary-900",
        destructive: "border-transparent bg-error-500 text-white",
        outline: "text-foreground",
        success: "border-transparent bg-success-500 text-white",
        warning: "border-transparent bg-secondary-400 text-white",
        info: "border-transparent bg-primary-100 text-primary-800",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  removable?: boolean
  onRemove?: () => void
}

function Badge({ 
  className, 
  variant, 
  size,
  dot = false, 
  removable = false, 
  onRemove,
  children,
  ...props 
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <div className="w-2 h-2 rounded-full bg-current mr-2" />
      )}
      {children}
      {removable && (
        <button
          type="button"
          className="ml-2 hover:bg-black/10 rounded-full p-0.5 transition-colors touch-target"
          onClick={onRemove}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

// Status Badge Component
const StatusBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant'> & {
    status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'draft'
  }
>(({ status, ...props }, ref) => {
  const statusVariants = {
    active: { variant: 'success' as const, children: 'Active' },
    inactive: { variant: 'secondary' as const, children: 'Inactive' },
    pending: { variant: 'warning' as const, children: 'Pending' },
    completed: { variant: 'success' as const, children: 'Completed' },
    cancelled: { variant: 'destructive' as const, children: 'Cancelled' },
    draft: { variant: 'outline' as const, children: 'Draft' },
  }

  const config = statusVariants[status]

  return (
    <Badge
      // ref={ref}
      variant={config.variant}
      dot
      {...props}
    >
      {config.children}
    </Badge>
  )
})
StatusBadge.displayName = "StatusBadge"

export { Badge, badgeVariants, StatusBadge }
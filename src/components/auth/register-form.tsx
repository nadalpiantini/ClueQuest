"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail, Lock, User, Building2, Github, Chrome, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  organizationType: z.enum(["startup", "enterprise", "nonprofit", "education", "government"]),
  agreeToTerms: z.boolean().refine((val) => val, "You must agree to the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>
  loading?: boolean
  error?: string
  className?: string
}

const organizationTypes = [
  { value: "startup", label: "Startup" },
  { value: "enterprise", label: "Enterprise" },
  { value: "nonprofit", label: "Non-profit" },
  { value: "education", label: "Education" },
  { value: "government", label: "Government" },
]

const passwordRequirements = [
  { label: "At least 8 characters", regex: /.{8,}/ },
  { label: "One uppercase letter", regex: /[A-Z]/ },
  { label: "One lowercase letter", regex: /[a-z]/ },
  { label: "One number", regex: /[0-9]/ },
]

export function RegisterForm({ onSubmit, loading = false, error, className }: RegisterFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [password, setPassword] = React.useState("")
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organizationType: "startup",
      agreeToTerms: false,
    },
    mode: "onChange",
  })

  const watchedPassword = watch("password", "")

  React.useEffect(() => {
    setPassword(watchedPassword)
  }, [watchedPassword])

  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      await onSubmit(data)
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Something went wrong"
      })
    }
  }

  const handleSocialRegister = (provider: 'google' | 'github') => {
    // Integration with Supabase social auth
  }

  const nextStep = async () => {
    const fieldsToValidate = currentStep === 1 
      ? ["firstName", "lastName", "email"] 
      : ["password", "confirmPassword"]
    
    const isValid = await trigger(fieldsToValidate as any)
    if (isValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <Card className={cn("w-full max-w-lg mx-auto", className)}>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
        <CardDescription>
          Join ClueQuest and start solving complex challenges
        </CardDescription>
        
        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 pt-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                step <= currentStep ? "bg-primary-500" : "bg-neutral-200"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {(error || errors.root) && (
            <div className="p-3 text-sm text-error-600 bg-error-50 border border-error-200 rounded-md animate-fade-in">
              {error || errors.root?.message}
            </div>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <p className="text-sm text-muted-foreground">Tell us about yourself</p>
              </div>

              {/* Social Registration */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="touch"
                  onClick={() => handleSocialRegister('google')}
                  disabled={loading}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline" 
                  size="touch"
                  onClick={() => handleSocialRegister('github')}
                  disabled={loading}
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...register("firstName")}
                  label="First Name"
                  placeholder="John"
                  icon={<User className="w-4 h-4" />}
                  error={errors.firstName?.message}
                  disabled={loading}
                  autoComplete="given-name"
                  autoFocus
                />

                <Input
                  {...register("lastName")}
                  label="Last Name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  disabled={loading}
                  autoComplete="family-name"
                />
              </div>

              <Input
                {...register("email")}
                type="email"
                label="Email Address"
                placeholder="john@company.com"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                disabled={loading}
                autoComplete="email"
              />
            </div>
          )}

          {/* Step 2: Security */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Set up your password</h3>
                <p className="text-sm text-muted-foreground">Choose a strong password</p>
              </div>

              <Input
                {...register("password")}
                type="password"
                label="Password"
                placeholder="Create a strong password"
                icon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                disabled={loading}
                autoComplete="new-password"
              />

              {/* Password Requirements */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Password must contain:</p>
                <div className="space-y-1">
                  {passwordRequirements.map((req, index) => {
                    const isValid = req.regex.test(password)
                    return (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center",
                          isValid ? "bg-success-100 text-success-600" : "bg-neutral-100 text-neutral-400"
                        )}>
                          {isValid && <Check className="w-3 h-3" />}
                        </div>
                        <span className={isValid ? "text-success-600" : "text-neutral-500"}>
                          {req.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Input
                {...register("confirmPassword")}
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                icon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          )}

          {/* Step 3: Organization Setup */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Organization Setup</h3>
                <p className="text-sm text-muted-foreground">Set up your organization</p>
              </div>

              <Input
                {...register("organizationName")}
                label="Organization Name"
                placeholder="Acme Inc."
                icon={<Building2 className="w-4 h-4" />}
                error={errors.organizationName?.message}
                disabled={loading}
                autoComplete="organization"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Type</label>
                <select
                  {...register("organizationType")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-target"
                  disabled={loading}
                >
                  {organizationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  {...register("agreeToTerms")}
                  type="checkbox"
                  className="mt-1 rounded border-neutral-300 text-primary-600 shadow-sm focus:ring-primary-500 touch-target"
                  disabled={loading}
                />
                <div className="text-sm text-neutral-600 leading-5">
                  I agree to the{" "}
                  <Link href="/legal/terms" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal/privacy" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </Link>
                </div>
              </label>
              {errors.agreeToTerms && (
                <p className="text-sm text-error-500">{errors.agreeToTerms.message}</p>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between space-x-4 pt-6">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="touch"
                onClick={prevStep}
                disabled={loading}
                className="flex-1"
              >
                Previous
              </Button>
            ) : (
              <div className="flex-1" />
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                size="touch"
                onClick={nextStep}
                disabled={loading}
                className="flex-1"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                size="touch"
                loading={loading || isSubmitting}
                disabled={loading || isSubmitting}
                className="flex-1"
              >
                Create Account
              </Button>
            )}
          </div>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary-600 hover:text-primary-500 font-medium transition-colors touch-target"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Pre-built register page component
export function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string>()

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true)
    setError(undefined)

    try {
      // Integration with Supabase auth
      // const { error } = await supabase.auth.signUp({
      //   email: data.email,
      //   password: data.password,
      //   options: {
      //     data: {
      //       first_name: data.firstName,
      //       last_name: data.lastName,
      //       organization_name: data.organizationName,
      //       organization_type: data.organizationType,
      //     }
      //   }
      // })
      // 
      // if (error) throw error
      // router.push('/auth/verify-email')

      // Temporary mock
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/auth/verify-email')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <RegisterForm
        onSubmit={handleRegister}
        loading={loading}
        error={error}
      />
    </div>
  )
}
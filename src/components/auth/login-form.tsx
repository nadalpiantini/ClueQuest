"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail, Lock, Github, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  loading?: boolean
  error?: string
  className?: string
}

export function LoginForm({ onSubmit, loading = false, error, className }: LoginFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data)
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Something went wrong"
      })
    }
  }

  const handleSocialLogin = (provider: 'google' | 'github') => {
    // Integration with Supabase social auth
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your ClueQuest account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            size="touch"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            className="w-full"
          >
            <Chrome className="w-4 h-4 mr-2" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            size="touch"
            onClick={() => handleSocialLogin('github')}
            disabled={loading}
            className="w-full"
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

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {(error || errors.root) && (
            <div className="p-3 text-sm text-error-600 bg-error-50 border border-error-200 rounded-md animate-fade-in">
              {error || errors.root?.message}
            </div>
          )}

          <Input
            {...register("email")}
            type="email"
            label="Email"
            placeholder="Enter your email"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            disabled={loading}
            autoComplete="email"
            autoFocus
          />

          <Input
            {...register("password")}
            type="password"
            label="Password"
            placeholder="Enter your password"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            disabled={loading}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register("rememberMe")}
                type="checkbox"
                className="rounded border-neutral-300 text-primary-600 shadow-sm focus:ring-primary-500 touch-target"
                disabled={loading}
              />
              <span className="text-sm text-neutral-600">Remember me</span>
            </label>

            <Link
              href="/auth/reset"
              className="text-sm text-primary-600 hover:text-primary-500 transition-colors touch-target"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            size="touch"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
            className="w-full"
          >
            Sign In
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-primary-600 hover:text-primary-500 font-medium transition-colors touch-target"
          >
            Sign up for free
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors touch-target"
          >
            ← Back to homepage
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

// Pre-built login page component
export function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string>()

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true)
    setError(undefined)

    try {
      // Integration with Supabase auth
      // const { error } = await supabase.auth.signInWithPassword({
      //   email: data.email,
      //   password: data.password,
      // })
      // 
      // if (error) throw error
      // router.push('/dashboard')

      // Temporary mock
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </div>
  )
}
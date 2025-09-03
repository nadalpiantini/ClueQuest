"use client"

import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  description?: string
  schema: z.ZodSchema
  component: React.ComponentType<{
    formMethods: any
    errors: any
    isSubmitting: boolean
  }>
  optional?: boolean
}

interface MultiStepFormProps<T = any> {
  steps: Step[]
  onSubmit: (data: T) => Promise<void>
  onStepChange?: (currentStep: number, totalSteps: number) => void
  initialData?: Partial<T>
  className?: string
  showProgress?: boolean
  allowSkipOptional?: boolean
}

export function MultiStepForm<T = any>({
  steps,
  onSubmit,
  onStepChange,
  initialData,
  className,
  showProgress = true,
  allowSkipOptional = false,
}: MultiStepFormProps<T>) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [stepData, setStepData] = React.useState<Partial<T>>(initialData || {})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set())

  const currentStepConfig = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  // Create combined schema for all steps up to current
  const combinedSchema = React.useMemo(() => {
    const schemas = steps.slice(0, currentStep + 1).reduce((acc, step) => {
      return acc.merge(step.schema)
    }, z.object({}))
    return schemas
  }, [steps, currentStep])

  const formMethods = useForm({
    resolver: zodResolver(currentStepConfig.schema),
    defaultValues: { ...initialData, ...stepData } as any,
    mode: "onChange",
  })

  const { handleSubmit, trigger, getValues, formState: { errors, isValid } } = formMethods

  React.useEffect(() => {
    onStepChange?.(currentStep, steps.length)
  }, [currentStep, steps.length, onStepChange])

  const validateCurrentStep = async () => {
    const isValidStep = await trigger()
    if (isValidStep) {
      const currentValues = getValues()
      setStepData(prev => ({ ...prev, ...currentValues }))
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      return true
    }
    return false
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = async (stepIndex: number) => {
    if (stepIndex < currentStep || completedSteps.has(stepIndex)) {
      const currentValues = getValues()
      setStepData(prev => ({ ...prev, ...currentValues }))
      setCurrentStep(stepIndex)
    }
  }

  const skipStep = () => {
    if (currentStepConfig.optional && allowSkipOptional) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleFormSubmit = async (data: any) => {
    if (isLastStep) {
      setIsSubmitting(true)
      try {
        const finalData = { ...stepData, ...data }
        await onSubmit(finalData as T)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      await nextStep()
    }
  }

  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100)

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      {showProgress && (
        <CardHeader className="pb-6">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(index)
              const isCurrent = index === currentStep
              const isAccessible = index <= currentStep || completedSteps.has(index)

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => isAccessible && goToStep(index)}
                    disabled={!isAccessible}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 touch-target",
                      {
                        "border-primary-500 bg-primary-500 text-white": isCurrent,
                        "border-success-500 bg-success-500 text-white": isCompleted,
                        "border-neutral-300 bg-white text-neutral-500": !isCurrent && !isCompleted,
                        "cursor-pointer hover:scale-105": isAccessible,
                        "cursor-not-allowed opacity-50": !isAccessible,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div 
                      className={cn(
                        "w-12 h-0.5 mx-2 transition-colors duration-300",
                        isCompleted ? "bg-success-500" : "bg-neutral-300"
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Progress</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Current step info */}
          <div className="text-center mt-4">
            <CardTitle className="text-xl">{currentStepConfig.title}</CardTitle>
            {currentStepConfig.description && (
              <p className="text-neutral-600 mt-1">{currentStepConfig.description}</p>
            )}
            <p className="text-sm text-neutral-500 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </CardHeader>
      )}

      <CardContent>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Render current step component */}
            <currentStepConfig.component
              formMethods={formMethods}
              errors={errors}
              isSubmitting={isSubmitting}
            />

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6 border-t border-neutral-200">
              <Button
                type="button"
                variant="outline"
                size="touch"
                onClick={prevStep}
                disabled={isFirstStep || isSubmitting}
                className={cn(!isFirstStep && "flex items-center space-x-2")}
              >
                {!isFirstStep && (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </>
                )}
              </Button>

              <div className="flex space-x-3">
                {currentStepConfig.optional && allowSkipOptional && !isLastStep && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="touch"
                    onClick={skipStep}
                    disabled={isSubmitting}
                  >
                    Skip
                  </Button>
                )}

                <Button
                  type="submit"
                  size="touch"
                  loading={isSubmitting}
                  disabled={isSubmitting || (!isValid && !isLastStep)}
                  className="flex items-center space-x-2"
                >
                  <span>{isLastStep ? 'Complete' : 'Next'}</span>
                  {!isLastStep && <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

// Example usage components
export const ExampleStepOne: React.FC<{
  formMethods: any
  errors: any
  isSubmitting: boolean
}> = ({ formMethods }) => {
  const { register } = formMethods
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Project Name</label>
        <input
          {...register("projectName")}
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Enter project name"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Describe your project"
        />
      </div>
    </div>
  )
}

// Pre-configured multi-step form for common use cases
export function ProjectSetupForm({ 
  onSubmit,
  initialData 
}: {
  onSubmit: (data: any) => Promise<void>
  initialData?: any
}) {
  const steps: Step[] = [
    {
      id: 'basic',
      title: 'Project Basics',
      description: 'Set up your project foundation',
      schema: z.object({
        projectName: z.string().min(1, 'Project name is required'),
        description: z.string().optional(),
      }),
      component: ExampleStepOne,
    },
    {
      id: 'team',
      title: 'Team Setup',
      description: 'Configure your team and permissions',
      schema: z.object({
        teamSize: z.number().min(1),
        inviteEmails: z.array(z.string().email()).optional(),
      }),
      component: ({ formMethods }) => (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Team Size</label>
            <select
              {...formMethods.register("teamSize", { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value={1}>Just me</option>
              <option value={5}>Small team (2-5)</option>
              <option value={15}>Medium team (6-15)</option>
              <option value={50}>Large team (16+)</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your project settings',
      optional: true,
      schema: z.object({
        notifications: z.boolean().default(true),
        visibility: z.enum(['private', 'team', 'public']).default('team'),
      }),
      component: ({ formMethods }) => (
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...formMethods.register("notifications")}
              className="rounded border-neutral-300 text-primary-600 shadow-sm focus:ring-primary-500"
            />
            <span className="text-sm">Enable notifications</span>
          </label>
        </div>
      ),
    },
  ]

  return (
    <MultiStepForm
      steps={steps}
      onSubmit={onSubmit}
      initialData={initialData}
      allowSkipOptional
    />
  )
}

export type { Step, MultiStepFormProps }
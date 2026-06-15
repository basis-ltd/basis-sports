import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLink, AuthShell } from '@/components/auth/AuthShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForgotPasswordMutation } from '@/features/auth/authApi'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/schemas'
import { getApiErrorMessage } from '@/lib/api-error'

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFormError(null)
    try {
      const result = await forgotPassword(values).unwrap()
      setSuccessMessage(result.message)
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not send the reset link. Try again.'))
    }
  }

  return (
    <AuthShell
      title="Reset password"
      description="Enter your email and we will send a reset link."
      footer={<AuthLink to="/login">Back to sign in</AuthLink>}
    >
      {successMessage ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{successMessage}</p>
          <AuthLink to="/login">Back to sign in</AuthLink>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending…' : 'Send link'}
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
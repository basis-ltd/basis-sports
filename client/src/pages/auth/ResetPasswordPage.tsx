import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLink, AuthShell } from '@/components/auth/AuthShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResetPasswordMutation } from '@/features/auth/authApi'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/schemas'
import { getApiErrorMessage } from '@/lib/api-error'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [token] = useState(() => searchParams.get('token'))
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const url = new URL(window.location.href)
    url.searchParams.delete('token')
    window.history.replaceState({}, '', url.pathname)
  }, [token])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return

    setFormError(null)
    try {
      const result = await resetPassword({
        token,
        password: values.password,
      }).unwrap()
      setSuccessMessage(result.message)
      window.setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'This link is invalid or expired. Request a new one.',
      )
      setFormError(
        message === 'Invalid or expired password reset token'
          ? 'This link is invalid or expired. Request a new one.'
          : message,
      )
    }
  }

  if (!token) {
    return (
      <AuthShell title="Link invalid" footer={<AuthLink to="/login">Back to sign in</AuthLink>}>
        <div className="space-y-4">
          <p className="text-sm text-destructive">
            This reset link is missing. Request a new one.
          </p>
          <AuthLink to="/forgot-password">Request a new link</AuthLink>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Set new password"
      footer={<AuthLink to="/login">Back to sign in</AuthLink>}
    >
      {successMessage ? (
        <p className="text-sm text-muted-foreground">{successMessage}</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                className="pr-9"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword ? (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Resetting…' : 'Reset password'}
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
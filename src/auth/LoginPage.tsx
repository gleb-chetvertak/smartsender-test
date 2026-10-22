import { useForm } from 'react-hook-form'
import { Navigate, useLocation } from 'react-router'
import { applyServerErrors } from '../lib/formErrors'
import { getReturnTo } from '../lib/navigation'
import { FieldError } from '../ui/FieldError'
import { signIn, type Credentials } from './store'
import { useUser } from './useUser'

const FIELDS = ['email', 'password'] as const

export function LoginPage() {
  const user = useUser()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Credentials>({ defaultValues: { email: '', password: '' } })

  if (user !== null) {
    return <Navigate to={getReturnTo(location.state, '/webhooks')} replace />
  }

  const onSubmit = async (values: Credentials) => {
    try {
      await signIn(values)
    } catch (error) {
      applyServerErrors(error, setError, FIELDS)
    }
  }

  return (
    <main className="auth-page">
      <form className="card auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>Sign in</h1>
        <label className="field">
          <span>Email</span>
          <input type="email" autoComplete="username" {...register('email')} />
          <FieldError message={errors.email?.message} />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" autoComplete="current-password" {...register('password')} />
          <FieldError message={errors.password?.message} />
        </label>
        <FieldError message={errors.root?.message} />
        <button type="submit" className="button button-block" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}

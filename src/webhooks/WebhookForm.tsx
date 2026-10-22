import { useForm } from 'react-hook-form'
import { Link, type To } from 'react-router'
import type { UpdateWebhookRequest, Webhook } from '../api/types'
import { applyServerErrors } from '../lib/formErrors'
import { FieldError } from '../ui/FieldError'

const FIELDS = ['name', 'url'] as const

interface WebhookFormProps {
  webhook: Webhook
  cancelTo: To
  onSubmit: (values: UpdateWebhookRequest) => Promise<void>
}

export function WebhookForm({ webhook, cancelTo, onSubmit }: WebhookFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateWebhookRequest>({ defaultValues: { name: webhook.name, url: webhook.url } })

  const submit = async (values: UpdateWebhookRequest) => {
    try {
      await onSubmit(values)
    } catch (error) {
      applyServerErrors(error, setError, FIELDS)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit(submit)} noValidate>
      <label className="field">
        <span>Name</span>
        <input type="text" {...register('name')} />
        <FieldError message={errors.name?.message} />
      </label>
      <label className="field">
        <span>URL</span>
        <input type="url" {...register('url')} />
        <FieldError message={errors.url?.message} />
      </label>
      <FieldError message={errors.root?.message} />
      <div className="actions">
        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <Link to={cancelTo} className="button button-secondary">
          Cancel
        </Link>
      </div>
    </form>
  )
}

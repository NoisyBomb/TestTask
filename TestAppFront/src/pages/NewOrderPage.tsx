import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, NetworkError, createOrder } from '../api/ordersApi'
import type { NewOrderPayload } from '../types'

interface FormState {
  senderCity: string
  senderAddress: string
  receiverCity: string
  receiverAddress: string
  weight: string
  orderPickupDate: string
}

const emptyForm: FormState = {
  senderCity: '',
  senderAddress: '',
  receiverCity: '',
  receiverAddress: '',
  weight: '',
  orderPickupDate: '',
}

const fieldLabels: Record<keyof FormState, string> = {
  senderCity: 'Город отправителя',
  senderAddress: 'Адрес отправителя',
  receiverCity: 'Город получателя',
  receiverAddress: 'Адрес получателя',
  weight: 'Вес груза',
  orderPickupDate: 'Дата забора груза',
}

// Backend sends PascalCase field names inside `errors`; map them onto our form keys.
const serverFieldMap: Record<string, keyof FormState> = {
  SenderCity: 'senderCity',
  SenderAddress: 'senderAddress',
  ReceiverCity: 'receiverCity',
  ReceiverAddress: 'receiverAddress',
  Weight: 'weight',
  OrderPickupDate: 'orderPickupDate',
}

type FieldErrors = Partial<Record<keyof FormState, string>>

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}

  if (!form.senderCity.trim()) errors.senderCity = 'Укажите город отправителя.'
  if (!form.senderAddress.trim()) errors.senderAddress = 'Укажите адрес отправителя.'
  if (!form.receiverCity.trim()) errors.receiverCity = 'Укажите город получателя.'
  if (!form.receiverAddress.trim()) errors.receiverAddress = 'Укажите адрес получателя.'

  const weightValue = Number(form.weight)
  if (!form.weight.trim() || Number.isNaN(weightValue)) {
    errors.weight = 'Укажите вес груза.'
  } else if (weightValue <= 0) {
    errors.weight = 'Вес должен быть больше нуля.'
  }

  if (!form.orderPickupDate) errors.orderPickupDate = 'Укажите дату забора груза.'

  return errors
}

export default function NewOrderPage() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const clientErrors = validate(form)
    setFieldErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    const payload: NewOrderPayload = {
      senderCity: form.senderCity.trim(),
      senderAddress: form.senderAddress.trim(),
      receiverCity: form.receiverCity.trim(),
      receiverAddress: form.receiverAddress.trim(),
      weight: Number(form.weight),
      orderPickupDate: form.orderPickupDate,
    }

    setSubmitting(true)
    try {
      await createOrder(payload)
      navigate('/')
    } catch (error) {
      if (error instanceof ApiError && error.status === 400 && error.problem?.errors) {
        const nextErrors: FieldErrors = {}
        for (const [serverField, messages] of Object.entries(error.problem.errors)) {
          const formField = serverFieldMap[serverField]
          if (formField && messages.length > 0) {
            nextErrors[formField] = messages[0]
          }
        }
        setFieldErrors(nextErrors)
        setFormError('Проверьте выделенные поля — сервер их не принял.')
      } else if (error instanceof NetworkError) {
        setFormError('Не удалось соединиться с сервером. Проверьте, что backend запущен.')
      } else {
        setFormError('Не получилось создать заказ. Попробуйте ещё раз.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page page--narrow">
      <div className="page__head">
        <h1>Новый заказ</h1>
        <p className="page__lede">Заполните все поля, чтобы принять груз в доставку.</p>
      </div>

      <form className="form" noValidate onSubmit={handleSubmit}>
        <fieldset className="form__group">
          <legend>Отправитель</legend>
          <Field
            id="senderCity"
            label={fieldLabels.senderCity}
            value={form.senderCity}
            error={fieldErrors.senderCity}
            onChange={(v) => updateField('senderCity', v)}
          />
          <Field
            id="senderAddress"
            label={fieldLabels.senderAddress}
            value={form.senderAddress}
            error={fieldErrors.senderAddress}
            onChange={(v) => updateField('senderAddress', v)}
          />
        </fieldset>

        <fieldset className="form__group">
          <legend>Получатель</legend>
          <Field
            id="receiverCity"
            label={fieldLabels.receiverCity}
            value={form.receiverCity}
            error={fieldErrors.receiverCity}
            onChange={(v) => updateField('receiverCity', v)}
          />
          <Field
            id="receiverAddress"
            label={fieldLabels.receiverAddress}
            value={form.receiverAddress}
            error={fieldErrors.receiverAddress}
            onChange={(v) => updateField('receiverAddress', v)}
          />
        </fieldset>

        <fieldset className="form__group">
          <legend>Груз</legend>
          <div className="field">
            <label htmlFor="weight">{fieldLabels.weight}, кг</label>
            <input
              id="weight"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              value={form.weight}
              aria-invalid={Boolean(fieldErrors.weight)}
              onChange={(e) => updateField('weight', e.target.value)}
            />
            {fieldErrors.weight && <p className="field__error">{fieldErrors.weight}</p>}
          </div>
          <div className="field">
            <label htmlFor="orderPickupDate">{fieldLabels.orderPickupDate}</label>
            <input
              id="orderPickupDate"
              type="date"
              value={form.orderPickupDate}
              aria-invalid={Boolean(fieldErrors.orderPickupDate)}
              onChange={(e) => updateField('orderPickupDate', e.target.value)}
            />
            {fieldErrors.orderPickupDate && <p className="field__error">{fieldErrors.orderPickupDate}</p>}
          </div>
        </fieldset>

        {formError && <p className="form__error" role="alert">{formError}</p>}

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Отправляем…' : 'Принять заказ'}
          </button>
        </div>
      </form>
    </section>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
}

function Field({ id, label, value, error, onChange }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="field__error">{error}</p>}
    </div>
  )
}

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ApiError, api } from '../api/client'
import type { Category, QuoteFormValues } from '../api/types'
import { useApi } from '../hooks/useApi'
import { useContactInfo } from '../hooks/useContactInfo'
import { PageHeader } from '../components/PageChrome'
import { WhatsAppIcon } from '../components/Icons'
import { usePageMeta } from '../hooks/usePageMeta'

const EMPTY_FORM: QuoteFormValues = {
  fullName: '',
  phone: '',
  email: '',
  company: '',
  productSlug: '',
  productName: '',
  quantity: '',
  format: '',
  material: '',
  finishings: '',
  message: '',
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; whatsappUrl: string | null }

/**
 * Ficha grande de cotizacion. Al enviarla guardamos el pedido en la API y
 * abrimos WhatsApp con el mensaje ya redactado.
 */
export function QuotePage() {
  const [searchParams] = useSearchParams()
  const { data: categories } = useApi<Category[]>(() => api.categories(), [])
  const contact = useContactInfo()

  const [values, setValues] = useState<QuoteFormValues>(EMPTY_FORM)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  usePageMeta({
    title: 'Cotizá tu proyecto',
    description:
      'Contanos qué necesitás imprimir y te respondemos con un presupuesto a medida. Sin compromiso.',
    path: '/cotiza',
  })

  // Si llegamos desde la ficha de un producto, viene preseleccionado.
  useEffect(() => {
    const slug = searchParams.get('producto')
    if (slug) {
      setValues((current) => ({ ...current, productSlug: slug }))
    }
  }, [searchParams])

  const update = (field: keyof QuoteFormValues) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus({ kind: 'sending' })
    setFieldErrors({})
    setGeneralError(null)

    try {
      const created = await api.createQuote(values)
      setStatus({ kind: 'sent', whatsappUrl: created.whatsappUrl })
      if (created.whatsappUrl) {
        window.open(created.whatsappUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      setStatus({ kind: 'idle' })
      if (error instanceof ApiError) {
        setFieldErrors(error.fieldErrors)
        // Si el error es de campos puntuales, esos mensajes ya se muestran al lado del input.
        if (Object.keys(error.fieldErrors).length === 0) {
          setGeneralError(error.message)
        }
      } else {
        setGeneralError('No pudimos enviar tu pedido. Intentá de nuevo.')
      }
    }
  }

  if (status.kind === 'sent') {
    return <SentPanel whatsappUrl={status.whatsappUrl} contactEmail={contact?.email ?? null} />
  }

  return (
    <div className="pt-24 pb-20">
      <PageHeader
        eyebrow="Presupuestos"
        title="Cotizá tu proyecto"
        description="Completá los datos y te respondemos con un presupuesto a medida. Al enviar se abre WhatsApp con tu consulta ya escrita."
      />

      <form onSubmit={handleSubmit} noValidate className="mx-auto mt-12 max-w-3xl px-6">
        <fieldset className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
          <legend className="px-2 font-display text-lg font-semibold text-ink-900">
            Tus datos
          </legend>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field
              label="Nombre y apellido"
              name="fullName"
              value={values.fullName}
              onChange={update('fullName')}
              error={fieldErrors.fullName}
              required
            />
            <Field
              label="Teléfono"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={update('phone')}
              error={fieldErrors.phone}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={update('email')}
              error={fieldErrors.email}
            />
            <Field
              label="Empresa"
              name="company"
              value={values.company}
              onChange={update('company')}
              error={fieldErrors.company}
            />
          </div>
        </fieldset>

        <fieldset className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
          <legend className="px-2 font-display text-lg font-semibold text-ink-900">
            Tu proyecto
          </legend>

          <div className="mt-4 grid gap-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-900">Producto</span>
              <select
                name="productSlug"
                value={values.productSlug}
                onChange={update('productSlug')}
                className="w-full rounded-lg border border-ink-300 bg-white px-4 py-2.5 text-ink-900 focus:border-ink-900 focus:outline-none"
              >
                <option value="">No está en la lista / otro</option>
                {categories?.map((category) => (
                  <optgroup key={category.slug} label={category.name}>
                    {category.products.map((product) => (
                      <option key={product.slug} value={product.slug}>
                        {product.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            {values.productSlug === '' && (
              <Field
                label="¿Qué necesitás imprimir?"
                name="productName"
                value={values.productName}
                onChange={update('productName')}
                error={fieldErrors.productName}
              />
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Cantidad"
                name="quantity"
                value={values.quantity}
                onChange={update('quantity')}
                error={fieldErrors.quantity}
                placeholder="Ej: 500 unidades"
              />
              <Field
                label="Formato"
                name="format"
                value={values.format}
                onChange={update('format')}
                error={fieldErrors.format}
                placeholder="Ej: A4"
              />
              <Field
                label="Material"
                name="material"
                value={values.material}
                onChange={update('material')}
                error={fieldErrors.material}
                placeholder="Ej: Cartulina ilustración"
              />
              <Field
                label="Terminaciones"
                name="finishings"
                value={values.finishings}
                onChange={update('finishings')}
                error={fieldErrors.finishings}
                placeholder="Ej: OPP mate, UV sectorizado"
              />
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-900">
                Contanos más sobre el proyecto
              </span>
              <textarea
                name="message"
                value={values.message}
                onChange={update('message')}
                rows={5}
                className="w-full rounded-lg border border-ink-300 px-4 py-2.5 text-ink-900 focus:border-ink-900 focus:outline-none"
                placeholder="Plazos, cantidad de páginas, referencias, lo que sea que nos ayude a presupuestar."
              />
              {fieldErrors.message && <FieldError message={fieldErrors.message} />}
            </label>
          </div>
        </fieldset>

        {generalError && (
          <p role="alert" className="mt-6 rounded-lg bg-brand-500/10 px-4 py-3 text-brand-600">
            {generalError}
          </p>
        )}

        <button
          type="submit"
          disabled={status.kind === 'sending'}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-8 py-4 font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <WhatsAppIcon className="size-5" />
          {status.kind === 'sending' ? 'Enviando...' : 'Enviar por WhatsApp'}
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  required = false,
  placeholder,
}: {
  label: string
  name: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-900">
        {label}
        {required && <span className="text-brand-500"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border px-4 py-2.5 text-ink-900 focus:outline-none ${
          error ? 'border-brand-500' : 'border-ink-300 focus:border-ink-900'
        }`}
      />
      {error && <FieldError message={error} />}
    </label>
  )
}

function FieldError({ message }: { message: string }) {
  return (
    <span role="alert" className="mt-1 block text-sm text-brand-600">
      {message}
    </span>
  )
}

/** Pantalla de confirmacion. Contempla que el navegador bloquee la pestana nueva. */
function SentPanel({
  whatsappUrl,
  contactEmail,
}: {
  whatsappUrl: string | null
  contactEmail: string | null
}) {
  return (
    <div className="grid min-h-[70dvh] place-items-center px-6 pt-24 pb-20">
      <div className="max-w-lg text-center">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          ¡Recibimos tu pedido!
        </h1>

        {whatsappUrl ? (
          <>
            <p className="mt-4 text-lg text-ink-500">
              Se abrió WhatsApp con tu consulta lista para enviar. Si no se abrió, usá este botón.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-4 font-medium text-white transition hover:bg-brand-600"
            >
              <WhatsAppIcon className="size-5" />
              Abrir WhatsApp
            </a>
          </>
        ) : (
          <p className="mt-4 text-lg text-ink-500">
            Guardamos tu consulta y te vamos a responder a la brevedad
            {contactEmail && <> . También podés escribirnos a {contactEmail}</>}.
          </p>
        )}
      </div>
    </div>
  )
}

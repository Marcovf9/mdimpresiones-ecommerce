import type {
  Category,
  ContactInfo,
  Finishing,
  ProductDetail,
  ProductSummary,
  QuoteCreated,
  QuoteFormValues,
} from './types'
import type { ApiErrorBody } from './types'

/** En desarrollo Vite hace proxy de /api al backend en el puerto 8080. */
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: Record<string, string>

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
  } catch {
    throw new ApiError(0, 'No pudimos conectarnos con el servidor. Revisá tu conexión.')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null) as ApiErrorBody | null
    throw new ApiError(
      response.status,
      body?.message ?? 'Algo salió mal. Intentá de nuevo en un momento.',
      body?.fieldErrors ?? {},
    )
  }

  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}

export const api = {
  categories: () => request<Category[]>('/api/categories'),

  products: (categorySlug?: string) =>
    request<ProductSummary[]>(
      categorySlug ? `/api/products?category=${encodeURIComponent(categorySlug)}` : '/api/products',
    ),

  product: (slug: string) => request<ProductDetail>(`/api/products/${encodeURIComponent(slug)}`),

  search: (term: string) =>
    request<ProductSummary[]>(`/api/search?q=${encodeURIComponent(term)}`),

  finishings: () => request<Finishing[]>('/api/finishings'),

  contact: () => request<ContactInfo>('/api/contact'),

  createQuote: (values: QuoteFormValues) =>
    request<QuoteCreated>('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(values),
    }),
}

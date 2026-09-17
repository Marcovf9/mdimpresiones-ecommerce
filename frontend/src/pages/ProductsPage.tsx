import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Category, ProductSummary } from '../api/types'
import { useApi } from '../hooks/useApi'
import { ArrowRightIcon, ChevronDownIcon } from '../components/Icons'
import { PageHeader, ErrorState, LoadingState } from '../components/PageChrome'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * Listado de rubros. En escritorio, pasar por encima de un rubro muestra sus
 * derivados en la columna de al lado; en telefono el mismo toque los despliega
 * debajo, porque ahi no existe el hover.
 */
export function ProductsPage() {
  const { data: categories, loading, error } = useApi<Category[]>(() => api.categories(), [])
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  usePageMeta({
    title: 'Productos',
    description:
      'Carpetas, tarjetas, folletos, catálogos, libros, talonarios, packaging y regalos empresariales. Materiales, formatos y terminaciones de cada producto.',
    path: '/productos',
  })

  if (loading) return <LoadingState label="Cargando productos" />
  if (error) return <ErrorState message={error} />
  if (!categories || categories.length === 0) {
    return <ErrorState message="Todavía no hay productos cargados." />
  }

  const active = categories.find((category) => category.slug === activeSlug) ?? categories[0]

  return (
    <div className="bg-ink-50 pt-24 pb-20">
      <PageHeader
        eyebrow="Catálogo"
        title="Productos"
        description="Elegí un rubro para ver todo lo que producimos. Cada ficha incluye materiales, formatos y terminaciones disponibles."
      />

      <div className="mx-auto mt-12 max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
          {/* Columna de rubros */}
          <ul className="space-y-2">
            {categories.map((category) => {
              const isActive = category.slug === active.slug
              return (
                <li key={category.slug}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveSlug(category.slug)}
                    onFocus={() => setActiveSlug(category.slug)}
                    onClick={() =>
                      setActiveSlug((current) => (current === category.slug ? null : category.slug))
                    }
                    aria-expanded={isActive}
                    className={`flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition ${
                      isActive
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-ink-100 bg-white text-ink-900 hover:border-ink-300'
                    }`}
                  >
                    <span>
                      <span className="block font-display text-xl font-semibold">
                        {category.name}
                      </span>
                      <span
                        className={`mt-1 block text-sm ${isActive ? 'text-ink-100' : 'text-ink-500'}`}
                      >
                        {category.products.length}{' '}
                        {category.products.length === 1 ? 'producto' : 'productos'}
                      </span>
                    </span>
                    <ChevronDownIcon
                      className={`size-5 shrink-0 transition-transform lg:hidden ${
                        isActive ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* En telefono los derivados se despliegan debajo del rubro. */}
                  {isActive && (
                    <div className="mt-2 lg:hidden">
                      <ProductGrid products={category.products} />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Columna de derivados, solo en escritorio */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-ink-100 bg-white p-8">
              <h2 className="font-display text-2xl font-semibold text-ink-900">{active.name}</h2>
              {active.description && (
                <p className="mt-2 max-w-2xl text-ink-500">{active.description}</p>
              )}
              <div className="mt-6">
                <ProductGrid products={active.products} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductGrid({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) {
    return <p className="text-ink-500">Estamos cargando los productos de este rubro.</p>
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {products.map((product) => (
        <li key={product.slug}>
          <Link
            to={`/productos/${product.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink-100 bg-white transition hover:border-ink-900 hover:shadow-sm"
          >
            {product.coverImageUrl && (
              <img
                src={product.coverImageUrl}
                alt=""
                loading="lazy"
                className="aspect-[4/3] w-full bg-ink-50 object-contain"
              />
            )}
            <span className="flex flex-1 flex-col justify-between gap-3 p-5">
              <span>
                <span className="block font-medium text-ink-900">{product.name}</span>
                {product.summary && (
                  <span className="mt-1 block text-sm text-ink-500">{product.summary}</span>
                )}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-500">
                Ver ficha
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

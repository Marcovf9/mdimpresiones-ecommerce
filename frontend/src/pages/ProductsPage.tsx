import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Category, ProductSummary } from '../api/types'
import { useApi } from '../hooks/useApi'
import { ArrowRightIcon, ChevronDownIcon } from '../components/Icons'
import { PageHeader, ErrorState } from '../components/PageChrome'
import { usePageMeta } from '../hooks/usePageMeta'
import { SkeletonListadoProductos } from '../components/Skeletons'
import { imagenOptimizada } from '../api/imagenes'

/**
 * Listado de rubros.
 *
 * <p>Escritorio y teléfono se comportan distinto, así que se arman por separado:
 * en escritorio pasar por encima de un rubro muestra sus derivados en la columna
 * de al lado, y en teléfono el toque los despliega debajo, en un acordeón que se
 * puede cerrar. Compartían un solo estado y eso hacía que en el celular quedara
 * siempre un rubro abierto: al cerrarlo, el valor caía a null y el respaldo
 * reabría el primero.
 */
export function ProductsPage() {
  const { data: categories, loading, error } = useApi<Category[]>(() => api.categories(), [])

  usePageMeta({
    title: 'Productos',
    description:
      'Carpetas, tarjetas, folletos, catálogos, libros, talonarios, packaging y regalos empresariales. Materiales, formatos y terminaciones de cada producto.',
    path: '/productos',
  })

  if (loading) return <SkeletonListadoProductos />
  if (error) return <ErrorState message={error} />
  if (!categories || categories.length === 0) {
    return <ErrorState message="Todavía no hay productos cargados." />
  }

  return (
    <div className="pt-24 pb-20">
      <PageHeader
        eyebrow="Catálogo"
        title="Productos"
        description="Elegí un rubro para ver todo lo que producimos. Cada ficha incluye materiales, formatos y terminaciones disponibles."
      />

      <div className="mx-auto mt-10 max-w-6xl px-6">
        <AcordeonMovil categories={categories} />
        <VistaEscritorio categories={categories} />
      </div>
    </div>
  )
}

/** Teléfono: acordeón que se abre y se cierra con el mismo toque. */
function AcordeonMovil({ categories }: { categories: Category[] }) {
  // null es un estado válido: todos cerrados.
  const [abierto, setAbierto] = useState<string | null>(null)

  return (
    <ul className="space-y-2 lg:hidden">
      {categories.map((category) => {
        const estaAbierto = category.slug === abierto
        const panelId = `rubro-${category.slug}`
        return (
          <li key={category.slug}>
            <button
              type="button"
              onClick={() => setAbierto((actual) => (actual === category.slug ? null : category.slug))}
              aria-expanded={estaAbierto}
              aria-controls={panelId}
              className={`flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition ${
                estaAbierto
                  ? 'border-ink-900 bg-ink-900 text-white'
                  : 'border-ink-100 bg-white text-ink-900'
              }`}
            >
              <span>
                <span className="block font-display text-lg font-semibold">{category.name}</span>
                <span className={`mt-0.5 block text-sm ${estaAbierto ? 'text-ink-100' : 'text-ink-500'}`}>
                  {category.products.length}{' '}
                  {category.products.length === 1 ? 'producto' : 'productos'}
                </span>
              </span>
              <ChevronDownIcon
                className={`size-5 shrink-0 transition-transform ${estaAbierto ? 'rotate-180' : ''}`}
              />
            </button>

            {estaAbierto && (
              <div id={panelId} className="mt-2">
                {category.description && (
                  <p className="mb-3 px-1 text-sm text-ink-500">{category.description}</p>
                )}
                <ProductGrid products={category.products} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** Escritorio: la columna izquierda elige y la derecha muestra. */
function VistaEscritorio({ categories }: { categories: Category[] }) {
  // Acá siempre hay uno elegido: el panel de la derecha no puede quedar vacío.
  const [elegido, setElegido] = useState(categories[0].slug)
  const active = categories.find((c) => c.slug === elegido) ?? categories[0]

  return (
    <div className="hidden gap-8 lg:grid lg:grid-cols-[minmax(0,22rem)_1fr]">
      <ul className="space-y-2">
        {categories.map((category) => {
          const isActive = category.slug === active.slug
          return (
            <li key={category.slug}>
              <button
                type="button"
                onMouseEnter={() => setElegido(category.slug)}
                onFocus={() => setElegido(category.slug)}
                onClick={() => setElegido(category.slug)}
                aria-current={isActive}
                className={`flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition ${
                  isActive
                    ? 'border-ink-900 bg-ink-900 text-white'
                    : 'border-ink-100 bg-white text-ink-900 hover:border-ink-300'
                }`}
              >
                <span>
                  <span className="block font-display text-xl font-semibold">{category.name}</span>
                  <span className={`mt-1 block text-sm ${isActive ? 'text-ink-100' : 'text-ink-500'}`}>
                    {category.products.length}{' '}
                    {category.products.length === 1 ? 'producto' : 'productos'}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="rounded-2xl border border-ink-100 bg-white p-8">
        <h2 className="font-display text-2xl font-semibold text-ink-900">{active.name}</h2>
        {active.description && <p className="mt-2 max-w-2xl text-ink-500">{active.description}</p>}
        <div className="mt-6">
          <ProductGrid products={active.products} />
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
                {...imagenOptimizada(product.coverImageUrl, 560)}
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

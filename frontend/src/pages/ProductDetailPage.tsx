import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import type { ProductDetail } from '../api/types'
import { useApi } from '../hooks/useApi'
import { ArrowRightIcon } from '../components/Icons'
import { ErrorState, LoadingState } from '../components/PageChrome'
import { usePageMeta } from '../hooks/usePageMeta'
import { imagenOptimizada } from '../api/imagenes'

/** Ficha del producto: descripcion, fotos, ficha tecnica y boton de cotizacion. */
export function ProductDetailPage() {
  const { slug = '' } = useParams()
  const { data: product, loading, error } = useApi<ProductDetail>(
    () => api.product(slug),
    [slug],
  )

  // El hook se llama siempre, aunque el producto todavía no haya llegado:
  // no puede quedar detrás de un return anticipado.
  usePageMeta({
    title: product?.name ?? 'Producto',
    description:
      product?.summary ??
      product?.description?.slice(0, 160) ??
      'Materiales, formatos y terminaciones disponibles. Pedí tu presupuesto sin compromiso.',
    path: `/productos/${slug}`,
    image: product?.images[0]?.url,
  })

  if (loading) return <LoadingState label="Cargando el producto" />
  if (error) return <ErrorState message={error} />
  if (!product) return <ErrorState message="No encontramos ese producto." />

  return (
    <article className="pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <nav aria-label="Ruta de navegación" className="text-sm text-ink-500">
          <Link to="/productos" className="transition hover:text-ink-900">
            Productos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-900">{product.categoryName}</span>
        </nav>

        <header className="mt-6">
          <h1 className="font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
            {product.name}
          </h1>
          {product.description && (
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-700">
              {product.description}
            </p>
          )}
        </header>

        <Gallery product={product} />

        {product.specs.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-ink-900">Ficha técnica</h2>
            <dl className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white">
              {product.specs.map((spec, index) => (
                <div
                  key={spec.id}
                  className={`grid gap-1 px-6 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6 ${
                    index > 0 ? 'border-t border-ink-100' : ''
                  }`}
                >
                  <dt className="font-medium text-ink-900">{spec.label}</dt>
                  <dd className="text-ink-700">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="mt-14 rounded-2xl bg-ink-900 px-8 py-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            ¿Te interesa este producto?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-100">
            Contanos cantidad, formato y terminaciones, y te pasamos un presupuesto a medida.
          </p>
          <Link
            to={`/cotiza?producto=${encodeURIComponent(product.slug)}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-4 font-medium text-white transition hover:bg-brand-600"
          >
            Cotizá tu proyecto
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </article>
  )
}

/** Galeria de fotos. Si el producto todavia no tiene, no deja un hueco vacio. */
function Gallery({ product }: { product: ProductDetail }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (product.images.length === 0) {
    return (
      <div className="mt-10 grid h-64 place-items-center rounded-2xl border border-dashed border-ink-300 bg-white text-ink-500">
        Estamos preparando las fotos de este producto.
      </div>
    )
  }

  const active = product.images[activeIndex] ?? product.images[0]

  return (
    <div className="mt-10">
      <img
        {...imagenOptimizada(active.url, 1100)}
        alt={active.altText ?? product.name}
        // contain y no cover: casi todas las fotos son verticales y un recorte
        // apaisado se comía el producto. El fondo neutro sostiene el encuadre.
        className="aspect-[4/3] w-full rounded-2xl bg-white object-contain"
      />

      {product.images.length > 1 && (
        <ul className="mt-4 flex flex-wrap gap-3">
          {product.images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver foto ${index + 1} de ${product.name}`}
                aria-current={index === activeIndex}
                className={`overflow-hidden rounded-lg border-2 transition ${
                  index === activeIndex ? 'border-ink-900' : 'border-transparent hover:border-ink-300'
                }`}
              >
                <img
                  {...imagenOptimizada(image.url, 80)}
                  alt=""
                  className="size-20 object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

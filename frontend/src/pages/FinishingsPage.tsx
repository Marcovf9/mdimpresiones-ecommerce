import { useState } from 'react'
import { api } from '../api/client'
import type { Finishing } from '../api/types'
import { useApi } from '../hooks/useApi'
import { Modal } from '../components/Modal'
import { ErrorState, LoadingState, PageHeader } from '../components/PageChrome'

/**
 * Grilla de terminaciones con el nombre debajo de cada imagen.
 * Al tocar una se abre un modal con su foto y su descripcion.
 */
export function FinishingsPage() {
  const { data: finishings, loading, error } = useApi<Finishing[]>(() => api.finishings(), [])
  const [selected, setSelected] = useState<Finishing | null>(null)

  if (loading) return <LoadingState label="Cargando terminaciones" />
  if (error) return <ErrorState message={error} />
  if (!finishings || finishings.length === 0) {
    return <ErrorState message="Todavía no hay terminaciones cargadas." />
  }

  return (
    <div className="bg-ink-50 pt-24 pb-20">
      <PageHeader
        eyebrow="Acabados"
        title="Terminaciones"
        description="El detalle que distingue una pieza. Tocá cada terminación para ver de qué se trata."
      />

      <ul className="mx-auto mt-12 grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {finishings.map((finishing) => (
          <li key={finishing.slug}>
            <button
              type="button"
              onClick={() => setSelected(finishing)}
              className="group w-full text-left"
            >
              <div className="overflow-hidden rounded-2xl bg-ink-100">
                {finishing.imageUrl ? (
                  <img
                    src={finishing.imageUrl}
                    alt={finishing.name}
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center bg-ink-900 text-ink-300">
                    <span className="font-display text-sm tracking-[0.2em] uppercase">
                      MD Impresiones
                    </span>
                  </div>
                )}
              </div>
              <h2 className="mt-3 font-display text-lg font-medium text-ink-900 transition group-hover:text-brand-500">
                {finishing.name}
              </h2>
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
      >
        {selected && (
          <>
            {selected.imageUrl && (
              <img
                src={selected.imageUrl}
                alt={selected.name}
                className="mb-6 aspect-[16/9] w-full rounded-xl object-cover"
              />
            )}
            <p className="text-lg leading-relaxed text-ink-700">{selected.description}</p>
          </>
        )}
      </Modal>
    </div>
  )
}

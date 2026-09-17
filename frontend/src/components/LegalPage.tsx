import type { ReactNode } from 'react'
import { identificacionFiscal } from '../config/empresa'

/** Estructura común de las páginas legales. */
export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string
  updatedAt: string
  children: ReactNode
}) {
  const fiscal = identificacionFiscal()

  return (
    <div className="pt-24 pb-20">
      <article className="mx-auto max-w-3xl px-6">
        <h1 className="font-display text-4xl font-semibold text-ink-900">{title}</h1>
        <p className="mt-3 text-sm text-ink-500">Última actualización: {updatedAt}</p>

        {!fiscal && (
          <p className="mt-6 rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-800">
            <strong>Pendiente de completar:</strong> falta cargar la razón social y el CUIT en
            <code className="mx-1 rounded bg-amber-500/20 px-1">src/config/empresa.ts</code>
            antes de publicar el sitio.
          </p>
        )}

        <div className="mt-8 space-y-8 text-ink-700">{children}</div>
      </article>
    </div>
  )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-ink-900">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed">{children}</div>
    </section>
  )
}

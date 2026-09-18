import type { FiltrosDisponibles, OpcionFiltro } from '../api/types'

export interface FiltrosElegidos {
  finishing?: string
  material?: string
}

/**
 * Filtros del catálogo por terminación y material.
 *
 * <p>Cada opción muestra cuántos productos tiene. Las que no tienen ninguno no
 * llegan desde el servidor, así que nunca se ofrece un filtro que dejaría la
 * pantalla vacía.
 */
export function FiltrosCatalogo({
  disponibles,
  elegidos,
  onCambio,
}: {
  disponibles: FiltrosDisponibles
  elegidos: FiltrosElegidos
  onCambio: (elegidos: FiltrosElegidos) => void
}) {
  const hayAlguno = Boolean(elegidos.finishing || elegidos.material)

  function alternar(campo: keyof FiltrosElegidos, clave: string) {
    onCambio({ ...elegidos, [campo]: elegidos[campo] === clave ? undefined : clave })
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-sm font-semibold tracking-wide text-ink-900 uppercase">
          Filtrar
        </h2>
        {hayAlguno && (
          <button
            type="button"
            onClick={() => onCambio({})}
            className="text-sm font-medium text-brand-500 transition hover:text-brand-600"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <Grupo
        titulo="Por terminación"
        opciones={disponibles.terminaciones}
        elegida={elegidos.finishing}
        onElegir={(clave) => alternar('finishing', clave)}
      />
      <Grupo
        titulo="Por material"
        opciones={disponibles.materiales}
        elegida={elegidos.material}
        onElegir={(clave) => alternar('material', clave)}
      />
    </div>
  )
}

function Grupo({
  titulo,
  opciones,
  elegida,
  onElegir,
}: {
  titulo: string
  opciones: OpcionFiltro[]
  elegida?: string
  onElegir: (clave: string) => void
}) {
  if (opciones.length === 0) return null

  return (
    <div className="mt-4">
      <p className="text-xs text-ink-500">{titulo}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {opciones.map((opcion) => {
          const activa = elegida === opcion.clave
          return (
            <li key={opcion.clave}>
              <button
                type="button"
                onClick={() => onElegir(opcion.clave)}
                aria-pressed={activa}
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  activa
                    ? 'border-ink-900 bg-ink-900 text-white'
                    : 'border-ink-300 text-ink-700 hover:border-ink-900'
                }`}
              >
                {opcion.etiqueta}
                <span className={`ml-1.5 text-xs ${activa ? 'text-ink-300' : 'text-ink-500'}`}>
                  {opcion.cantidad}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * Datos de la empresa que aparecen en las páginas legales, en el pie y en los
 * datos estructurados que lee Google.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  COMPLETAR ANTES DE PUBLICAR. Todo lo que quede en cadena vacía se oculta
 *  del sitio, y las páginas legales avisan que falta el dato.
 * ────────────────────────────────────────────────────────────────────────────
 */
export const EMPRESA = {
  nombreComercial: 'MO Impresiones',

  /** Razón social completa, tal como figura en la constancia de AFIP. */
  razonSocial: '',

  /** CUIT con guiones: 30-12345678-9 */
  cuit: '',

  domicilio: {
    calle: '',
    ciudad: 'Córdoba',
    provincia: 'Córdoba',
    codigoPostal: '',
    pais: 'Argentina',
  },

  /** Horario de atención, en texto libre. Ej: 'Lunes a viernes de 8 a 17 h'. */
  horarioAtencion: '',

  /** Dominio propio, sin barra final. */
  sitioWeb: 'https://moimpresiones.com',

  fundacion: 1994,
} as const

/** Domicilio en una línea, o null si todavía no se cargó. */
export function domicilioCompleto(): string | null {
  const { calle, ciudad, provincia, codigoPostal } = EMPRESA.domicilio
  if (!calle) return null
  return [calle, codigoPostal, ciudad, provincia].filter(Boolean).join(', ')
}

/** Identificación fiscal para las páginas legales, o null si falta. */
export function identificacionFiscal(): string | null {
  if (!EMPRESA.razonSocial && !EMPRESA.cuit) return null
  return [EMPRESA.razonSocial, EMPRESA.cuit && `CUIT ${EMPRESA.cuit}`]
    .filter(Boolean)
    .join(' — ')
}

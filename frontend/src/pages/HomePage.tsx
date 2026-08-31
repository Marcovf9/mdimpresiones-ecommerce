import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRightIcon } from '../components/Icons'

/**
 * Texto institucional entregado por el cliente ("Quienes somos FINAL.docx").
 * Vive en el frontend porque es copy fijo, no contenido de catalogo.
 */
const ABOUT_PARAGRAPHS = [
  'Somos una empresa gráfica familiar de Córdoba, Argentina, con más de 30 años de trayectoria en la industria.',
  'Desde 1994, trabajamos acompañando a empresas, comercios y emprendimientos en el desarrollo de sus proyectos gráficos, combinando experiencia, calidad y atención personalizada.',
  'A lo largo de los años fuimos creciendo, incorporando tecnología y ampliando nuestras capacidades de producción, sin perder la esencia que nos caracteriza desde el comienzo: el compromiso con cada trabajo y la cercanía con nuestros clientes.',
  'Hoy seguimos apostando a la industria gráfica, ofreciendo soluciones a medida y cuidando cada etapa del proceso, desde la impresión hasta la terminación final.',
]

export function HomePage() {
  const location = useLocation()

  // El menu enlaza a /#quienes-somos: al llegar con ese hash, bajamos a la seccion.
  useEffect(() => {
    if (location.hash === '#quienes-somos') {
      document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  return (
    <>
      <Hero />

      <section id="quienes-somos" className="scroll-mt-20 bg-ink-50 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-display text-sm tracking-[0.3em] text-brand-500 uppercase">
            Nuestra historia
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
            ¿Quiénes somos?
          </h2>

          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-700">
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-10 border-l-4 border-brand-500 pl-6 font-display text-2xl text-ink-900 italic">
            Más de tres décadas imprimiendo ideas y construyendo relaciones.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3 font-medium text-white transition hover:bg-ink-700"
            >
              Ver productos
              <ArrowRightIcon />
            </Link>
            <Link
              to="/cotiza"
              className="inline-flex items-center gap-2 rounded-full border border-ink-300 px-7 py-3 font-medium text-ink-900 transition hover:border-ink-900"
            >
              Cotizá tu proyecto
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/**
 * Nombre del negocio sobre el video de una maquina funcionando.
 * El video se coloca en public/video/imprenta.mp4; si falta, queda el poster
 * y el degradado, asi la portada nunca se ve rota.
 */
function Hero() {
  return (
    <section className="relative grid min-h-dvh place-items-center overflow-hidden bg-ink-900">
      <video
        className="absolute inset-0 size-full object-cover opacity-60"
        autoPlay
        muted
        loop
        playsInline
        poster="/video/imprenta-poster.jpg"
      >
        <source src="/video/imprenta.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/40 to-ink-900" />

      <div className="relative px-6 text-center">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
          MD Impresiones
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink-100">
          Imprenta en Córdoba, Argentina. Más de 30 años de oficio gráfico,
          del pliego a la terminación final.
        </p>
        <a
          href="#quienes-somos"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 font-medium text-white transition hover:bg-white hover:text-ink-900"
        >
          Conocenos
        </a>
      </div>
    </section>
  )
}

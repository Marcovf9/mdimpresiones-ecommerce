import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useContactInfo } from '../hooks/useContactInfo'
import { InstagramIcon, MailIcon, MenuIcon, WhatsAppIcon } from './Icons'
import { MenuOverlay } from './MenuOverlay'
import { WhatsAppFab } from './WhatsAppFab'
import { StructuredData } from './StructuredData'
import { domicilioCompleto, EMPRESA } from '../config/empresa'

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const contact = useContactInfo()
  const location = useLocation()

  // El header arranca transparente sobre el video del inicio y se vuelve solido al bajar.
  const overHero = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!overHero) return
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overHero])

  const solid = !overHero || scrolled

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          solid ? 'bg-ink-900/95 backdrop-blur' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" aria-label="MO Impresiones — ir al inicio">
            <img
              src="/imagenes/logo.png"
              alt="MO Impresiones"
              width={600}
              height={313}
              className="h-9 w-auto sm:h-10"
            />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            className="rounded-full p-2 text-white transition hover:bg-white/10"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} contact={contact} />

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
      <WhatsAppFab />
      <StructuredData />
    </div>
  )
}

function SiteFooter() {
  const contact = useContactInfo()

  return (
    <footer className="bg-ink-900 text-ink-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2">
        <div>
          <img
            src="/imagenes/logo.png"
            alt="MO Impresiones"
            width={600}
            height={313}
            className="h-10 w-auto"
          />
          <p className="mt-3 max-w-sm text-sm">
            Empresa gráfica familiar de Córdoba, Argentina. Más de 30 años imprimiendo ideas.
          </p>
          {domicilioCompleto() && <p className="mt-3 text-sm">{domicilioCompleto()}</p>}
          {EMPRESA.horarioAtencion && (
            <p className="mt-1 text-sm">{EMPRESA.horarioAtencion}</p>
          )}
        </div>

        <div className="sm:justify-self-end">
          <p className="font-display text-sm tracking-[0.2em] text-white uppercase">Contacto</p>
          <ul className="mt-3 flex gap-3">
            {contact?.whatsappUrl && (
              <li>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-brand-500 hover:text-white"
                >
                  <WhatsAppIcon className="size-5" />
                </a>
              </li>
            )}
            {contact?.instagramUrl && (
              <li>
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-brand-500 hover:text-white"
                >
                  <InstagramIcon className="size-5" />
                </a>
              </li>
            )}
            {contact?.email && (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  aria-label="Enviar un mail"
                  className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-brand-500 hover:text-white"
                >
                  <MailIcon className="size-5" />
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-xs sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} MO Impresiones. Todos los derechos reservados.</p>
          <nav aria-label="Enlaces legales" className="flex gap-4">
            <NavLink to="/terminos" className="transition hover:text-white">
              Términos y condiciones
            </NavLink>
            <NavLink to="/privacidad" className="transition hover:text-white">
              Privacidad
            </NavLink>
          </nav>
        </div>
      </div>
    </footer>
  )
}

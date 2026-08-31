import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import type { ContactInfo, ProductSummary } from '../api/types'
import {
  ChevronDownIcon,
  CloseIcon,
  InstagramIcon,
  MailIcon,
  SearchIcon,
  WhatsAppIcon,
} from './Icons'

interface MenuOverlayProps {
  open: boolean
  onClose: () => void
  contact: ContactInfo | null
}

/**
 * Menu principal, segun el boceto: Buscar, Inicio, Quienes somos, Productos,
 * Terminaciones, Contacto (que despliega los canales) y Cotiza tu producto.
 */
export function MenuOverlay({ open, onClose, contact }: MenuOverlayProps) {
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setContactOpen(false)
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-ink-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <nav
        aria-label="Menú principal"
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-ink-900 text-ink-50 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6">
          <span className="font-display text-sm tracking-[0.3em] text-ink-300 uppercase">Menú</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-full p-1 text-ink-300 transition hover:bg-white/10 hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-6">
          <SearchBox onNavigate={onClose} />
        </div>

        <ul className="mt-8 flex-1 space-y-1 px-6 pb-10">
          <MenuLink to="/" onClick={onClose}>Inicio</MenuLink>
          <MenuLink to="/#quienes-somos" onClick={onClose}>¿Quiénes somos?</MenuLink>
          <MenuLink to="/productos" onClick={onClose}>Productos</MenuLink>
          <MenuLink to="/terminaciones" onClick={onClose}>Terminaciones</MenuLink>

          <li>
            <button
              type="button"
              onClick={() => setContactOpen((value) => !value)}
              aria-expanded={contactOpen}
              className="flex w-full items-center justify-between border-b border-white/10 py-4 font-display text-2xl text-ink-50 transition hover:text-brand-500"
            >
              Contacto
              <ChevronDownIcon
                className={`size-5 transition-transform ${contactOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {contactOpen && <ContactChannels contact={contact} />}
          </li>

          <MenuLink to="/cotiza" onClick={onClose}>Cotizá tu producto</MenuLink>
        </ul>
      </nav>
    </div>
  )
}

function MenuLink({ to, onClick, children }: { to: string; onClick: () => void; children: string }) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className="block border-b border-white/10 py-4 font-display text-2xl transition hover:text-brand-500"
      >
        {children}
      </Link>
    </li>
  )
}

/** Los canales que pidio el cliente: WhatsApp, Instagram y mail. */
function ContactChannels({ contact }: { contact: ContactInfo | null }) {
  const channels = [
    contact?.whatsappUrl && {
      href: contact.whatsappUrl,
      label: 'WhatsApp',
      icon: <WhatsAppIcon className="size-5" />,
      external: true,
    },
    contact?.instagramUrl && {
      href: contact.instagramUrl,
      label: 'Instagram',
      icon: <InstagramIcon className="size-5" />,
      external: true,
    },
    contact?.email && {
      href: `mailto:${contact.email}`,
      label: contact.email,
      icon: <MailIcon className="size-5" />,
      external: false,
    },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode; external: boolean }[]

  if (channels.length === 0) {
    return (
      <p className="py-4 text-sm text-ink-300">
        Estamos cargando nuestros datos de contacto.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2 py-4 pl-1">
      {channels.map((channel) => (
        <li key={channel.label}>
          <a
            href={channel.href}
            target={channel.external ? '_blank' : undefined}
            rel={channel.external ? 'noreferrer' : undefined}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-ink-100 transition hover:bg-white/10 hover:text-white"
          >
            {channel.icon}
            <span>{channel.label}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Buscador del menu: consulta la API a partir de dos caracteres. */
function SearchBox({ onNavigate }: { onNavigate: () => void }) {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<ProductSummary[]>([])
  const [searching, setSearching] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const trimmed = term.trim()
    if (trimmed.length < 2) {
      setResults([])
      return
    }

    let cancelled = false
    setSearching(true)
    // Pequena espera para no disparar una consulta por tecla.
    const timer = setTimeout(() => {
      api.search(trimmed)
        .then((found) => {
          if (!cancelled) setResults(found)
        })
        .catch(() => {
          if (!cancelled) setResults([])
        })
        .finally(() => {
          if (!cancelled) setSearching(false)
        })
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [term])

  return (
    <div>
      <label className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-3 focus-within:bg-white/15">
        <SearchIcon className="size-5 shrink-0 text-ink-300" />
        <span className="sr-only">Buscar productos</span>
        <input
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Buscar productos..."
          className="w-full bg-transparent text-ink-50 placeholder:text-ink-300 focus:outline-none"
        />
      </label>

      {term.trim().length >= 2 && (
        <div className="mt-3 max-h-64 overflow-y-auto rounded-xl bg-white/5">
          {searching && <p className="px-4 py-3 text-sm text-ink-300">Buscando...</p>}
          {!searching && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-ink-300">
              No encontramos productos para «{term.trim()}».
            </p>
          )}
          {results.map((product) => (
            <button
              key={product.slug}
              type="button"
              onClick={() => {
                navigate(`/productos/${product.slug}`)
                onNavigate()
              }}
              className="block w-full px-4 py-3 text-left transition hover:bg-white/10"
            >
              <span className="block text-ink-50">{product.name}</span>
              <span className="block text-xs text-ink-300">{product.categoryName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

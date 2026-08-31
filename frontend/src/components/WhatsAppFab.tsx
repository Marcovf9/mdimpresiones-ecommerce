import { useContactInfo } from '../hooks/useContactInfo'
import { WhatsAppIcon } from './Icons'

/**
 * Botón flotante de WhatsApp. En Argentina es la vía por la que la mayoría
 * escribe, y ahorra tener que buscar el contacto en el menú.
 */
export function WhatsAppFab() {
  const contact = useContactInfo()
  if (!contact?.whatsappUrl) return null

  return (
    <a
      href={contact.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed right-5 bottom-5 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  )
}

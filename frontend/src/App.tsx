import { Route, Routes } from 'react-router-dom'

/**
 * Esqueleto de rutas. Cada pagina se implementa en su propia rama de trabajo.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder title="Inicio" />} />
      <Route path="/productos" element={<Placeholder title="Productos" />} />
      <Route path="/terminaciones" element={<Placeholder title="Terminaciones" />} />
      <Route path="/cotiza" element={<Placeholder title="Cotiza tu proyecto" />} />
      <Route path="*" element={<Placeholder title="Pagina no encontrada" />} />
    </Routes>
  )
}

function Placeholder({ title }: { title: string }) {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="font-display text-sm tracking-[0.3em] text-brand-500 uppercase">
          MD Impresiones
        </p>
        <h1 className="mt-3 text-4xl font-semibold">{title}</h1>
        <p className="mt-2 text-ink-500">Pantalla en construccion.</p>
      </div>
    </main>
  )
}

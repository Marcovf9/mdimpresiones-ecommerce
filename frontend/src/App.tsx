import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { FinishingsPage } from './pages/FinishingsPage'
import { QuotePage } from './pages/QuotePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TerminosPage } from './pages/TerminosPage'
import { PrivacidadPage } from './pages/PrivacidadPage'
import { AdminApp } from './admin/AdminApp'
import { PresupuestoProvider } from './hooks/usePresupuesto'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* El panel corre aparte: tiene su propio layout y su propia sesión. */}
        <Route path="/admin/*" element={<AdminApp />} />

        <Route
          element={
            <PresupuestoProvider>
              <Layout />
            </PresupuestoProvider>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/productos/:slug" element={<ProductDetailPage />} />
          <Route path="/terminaciones" element={<FinishingsPage />} />
          <Route path="/cotiza" element={<QuotePage />} />
          <Route path="/terminos" element={<TerminosPage />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

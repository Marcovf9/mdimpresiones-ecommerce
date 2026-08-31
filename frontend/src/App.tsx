import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { FinishingsPage } from './pages/FinishingsPage'
import { QuotePage } from './pages/QuotePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AdminApp } from './admin/AdminApp'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* El panel corre aparte: tiene su propio layout y su propia sesión. */}
        <Route path="/admin/*" element={<AdminApp />} />

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/productos/:slug" element={<ProductDetailPage />} />
          <Route path="/terminaciones" element={<FinishingsPage />} />
          <Route path="/cotiza" element={<QuotePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

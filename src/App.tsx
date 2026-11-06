import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AdminLayout } from './components/admin/AdminLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { CartProvider } from './contexts/CartContext';
import { PrototypeProvider } from './contexts/PrototypeContext';
import { About } from './pages/About';
import { AdminArtworkEditor } from './pages/admin/AdminArtworkEditor';
import { AdminArtworks } from './pages/admin/AdminArtworks';
import { AdminCollections } from './pages/admin/AdminCollections';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminOrders } from './pages/admin/AdminOrders';
import { ArtworkDetail } from './pages/ArtworkDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { CollectionDetail } from './pages/CollectionDetail';
import { Collections } from './pages/Collections';
import { Contact } from './pages/Contact';
import { Gallery } from './pages/Gallery';
import { Home } from './pages/Home';
import { InfoPage } from './pages/InfoPage';
import { NotFound } from './pages/NotFound';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { store } from './store';
import { Toaster } from 'sonner';

const router = createBrowserRouter([
{
  element: <PublicLayout />,
  children: [
  { path: '/', element: <Home /> },
  { path: '/gallery', element: <Gallery /> },
  { path: '/artwork/:slug', element: <ArtworkDetail /> },
  { path: '/collections', element: <Collections /> },
  { path: '/collections/:slug', element: <CollectionDetail /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/cart', element: <Cart /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/order/:orderNumber', element: <OrderConfirmation /> },
  { path: '/info/:slug', element: <InfoPage /> },
  { path: '*', element: <NotFound /> }]

},
{ path: '/admin/login', element: <AdminLogin /> },
{
  path: '/admin',
  element: <AdminLayout />,
  children: [
  { index: true, element: <AdminDashboard /> },
  { path: 'artworks', element: <AdminArtworks /> },
  { path: 'artworks/new', element: <AdminArtworkEditor /> },
  { path: 'artworks/:id/edit', element: <AdminArtworkEditor /> },
  { path: 'orders', element: <AdminOrders /> },
  { path: 'collections', element: <AdminCollections /> }]

}]
);

interface AppProps {
  /** Prototype only: make mock checkout return a payment decline. */
  simulatePaymentFailure?: boolean;
  /** Header floats transparently over the homepage hero until scroll. */
  transparentHomeHeader?: boolean;
}

export function App({ simulatePaymentFailure = false, transparentHomeHeader = true }: AppProps) {
  return (
    <MotionConfig reducedMotion="user">
      <PrototypeProvider value={{ simulatePaymentFailure, transparentHomeHeader }}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <CartProvider>
              <RouterProvider router={router} />
              <Toaster position="bottom-right" />
            </CartProvider>
          </QueryClientProvider>
        </Provider>
      </PrototypeProvider>
    </MotionConfig>);

}
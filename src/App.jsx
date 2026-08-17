import { Routes, Route, useLocation } from 'react-router-dom';
import { SmoothScroll } from './components/SmoothScroll';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
// ShippingModal deshabilitado temporalmente (precio dinámico por ubicación en pausa,
// ver useDisplayPrice.js) mientras el enfoque está en el diseño visual de la tienda.
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCosts from './pages/admin/AdminCosts';

function StoreLayout({ children }) {
  const location = useLocation();
  const hideFooter = location.pathname === '/iniciar-sesion' || location.pathname === '/crear-cuenta' || location.pathname.startsWith('/pedido-confirmado');
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      {!hideFooter && <Footer />}
      <CartDrawer />
    </>
  );
}

function App() {
  return (
    <SmoothScroll>
      <Routes>
        <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
        <Route path="/productos" element={<StoreLayout><Products /></StoreLayout>} />
        <Route path="/producto/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
        <Route path="/pagar" element={<StoreLayout><Checkout /></StoreLayout>} />
        <Route path="/pedido-confirmado/:id" element={<StoreLayout><OrderConfirmation /></StoreLayout>} />
        <Route path="/iniciar-sesion" element={<StoreLayout><Login /></StoreLayout>} />
        <Route path="/crear-cuenta" element={<StoreLayout><Register /></StoreLayout>} />
        <Route path="/cuenta" element={<StoreLayout><Account /></StoreLayout>} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pedidos" element={<AdminOrders />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="clientes" element={<AdminCustomers />} />
          <Route path="costos" element={<AdminCosts />} />
        </Route>
      </Routes>
    </SmoothScroll>
  );
}

export default App

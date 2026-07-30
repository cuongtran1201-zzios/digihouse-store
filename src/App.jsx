import React, { useState, useEffect, useMemo } from 'react';

import Header from './layout/Header.jsx';
import Footer from './layout/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CustomerLoginModal from './components/CustomerLoginModal.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminShell from './components/AdminShell.jsx';
import Toast from './components/Toast.jsx';
import CustomerView from './views/CustomerView.jsx';
import SellerView from './views/SellerView.jsx';

import { supabase } from './lib/supabaseClient.js';
import { getProfile, signOut, createOrder } from './lib/auth.js';
import {
  fetchProducts, createProduct, updateProduct, deleteProduct as deleteProductApi,
} from './lib/productsApi.js';

export default function App() {
  const [view, setView] = useState('store'); // 'store' | 'adminLogin' | 'admin'
  const [customer, setCustomer] = useState(null); // { id, name } | null
  const [loginOpen, setLoginOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [adminTab, setAdminTab] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState('');
  const [cartPulse, setCartPulse] = useState(0);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(''), 2600);
  };

  /* ---------------- Load products from Supabase ---------------- */
  useEffect(() => {
    let alive = true;
    setProductsLoading(true);
    fetchProducts()
      .then(rows => { if (alive) setProducts(rows); })
      .catch(err => showToast('Lỗi tải sản phẩm: ' + err.message))
      .finally(() => { if (alive) setProductsLoading(false); });
    return () => { alive = false; };
  }, []);

  /* ---------------- Track Supabase auth session (customer) ---------------- */
  useEffect(() => {
    async function loadFromSession(session) {
      if (!session) { setCustomer(null); return; }
      try {
        const profile = await getProfile(session.user.id);
        setCustomer({ id: session.user.id, name: profile.full_name || session.user.email });
      } catch {
        setCustomer(null);
      }
    }

    supabase.auth.getSession().then(({ data }) => loadFromSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadFromSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartItems = cart.map(c => ({ ...c, product: products.find(p => p.id === c.id) })).filter(c => c.product);
  const cartTotal = cartItems.reduce((s, c) => s + c.product.price * c.qty, 0);

  const filtered = useMemo(() => (
    activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory)
  ), [products, activeCategory]);

  const flashSale = useMemo(() => products.filter(p => p.compareAtPrice), [products]);

  /* ---------------- Cart ---------------- */
  function addToCart(id) {
    setCart(prev => {
      const found = prev.find(c => c.id === id);
      if (found) return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id, qty: 1 }];
    });
    setCartPulse(p => p + 1);
    setCartOpen(true);
    setOrderPlaced(false);
  }
  function changeQty(id, delta) {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0));
  }
  function removeFromCart(id) { setCart(prev => prev.filter(c => c.id !== id)); }

  async function placeOrder() {
    if (!customer) {
      setCartOpen(false);
      setLoginOpen(true);
      showToast('Vui lòng đăng nhập để đặt hàng.');
      return;
    }
    setPlacingOrder(true);
    try {
      await createOrder({
        customerId: customer.id,
        items: cartItems.map(({ product, qty }) => ({ id: product.id, name: product.name, price: product.price, qty })),
        total: cartTotal,
      });
      setOrderPlaced(true);
      setCart([]);
    } catch (err) {
      showToast('Đặt hàng thất bại: ' + err.message);
    } finally {
      setPlacingOrder(false);
    }
  }

  /* ---------------- Product CRUD (admin) ---------------- */
  async function upsertProduct(data) {
    if (editingId) {
      const updated = await updateProduct(editingId, data);
      setProducts(prev => prev.map(p => p.id === editingId ? updated : p));
      showToast('Đã cập nhật sản phẩm.');
      setEditingId(null);
    } else {
      const created = await createProduct(data);
      setProducts(prev => [created, ...prev]);
      showToast('Đã thêm sản phẩm mới.');
    }
    setAdminTab('inventory');
  }

  async function handleDeleteProduct(id) {
    try {
      await deleteProductApi(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Đã xoá sản phẩm.');
    } catch (err) {
      showToast('Xoá thất bại: ' + err.message);
    }
  }

  function startEdit(id) { setEditingId(id); setAdminTab('add'); }
  const editingProduct = editingId ? products.find(p => p.id === editingId) : null;

  /* ---------------- Auth handlers ---------------- */
  function handleCustomerLoggedIn(user) {
    setLoginOpen(false);
    getProfile(user.id).then(profile => {
      setCustomer({ id: user.id, name: profile.full_name || user.email });
      showToast(`Xin chào, ${profile.full_name || user.email}!`);
    });
  }
  async function handleCustomerLogout() {
    await signOut();
    setCustomer(null);
    showToast('Đã đăng xuất.');
  }
  function handleAdminLogin() {
    setView('admin');
    setEditingId(null);
    setAdminTab('inventory');
  }
  async function handleAdminLogout() {
    await signOut();
    setView('store');
    setEditingId(null);
  }

  /* ------------- Separate admin portal: own screens, no store chrome ------------- */
  if (view === 'adminLogin') {
    return (
      <div className="dh-app dh-view-fade">
        <AdminLogin onSuccess={handleAdminLogin} onBack={() => setView('store')} />
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="dh-app dh-view-fade">
        <AdminShell onLogout={handleAdminLogout}>
          <SellerView
            products={products}
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            editingProduct={editingProduct}
            onCancelEdit={() => { setEditingId(null); setAdminTab('inventory'); }}
            onSubmit={upsertProduct}
            onDelete={handleDeleteProduct}
            onEdit={startEdit}
          />
        </AdminShell>
        <Toast message={toast} />
      </div>
    );
  }

  /* ------------------------- Customer storefront ------------------------- */
  return (
    <div className="dh-app dh-view-fade">
      <Header
        customer={customer}
        onLoginClick={() => setLoginOpen(true)}
        onLogoutClick={handleCustomerLogout}
        cartCount={cartCount}
        cartPulse={cartPulse}
        onCartClick={() => setCartOpen(true)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <CustomerView
        products={filtered}
        flashSale={flashSale}
        addToCart={addToCart}
        loading={productsLoading}
      />

      <Footer onAdminClick={() => setView('adminLogin')} />

      {loginOpen && (
        <CustomerLoginModal onClose={() => setLoginOpen(false)} onLoggedIn={handleCustomerLoggedIn} />
      )}

      {cartOpen && (
        <CartDrawer
          cartItems={cartItems}
          cartTotal={cartTotal}
          orderPlaced={orderPlaced}
          placing={placingOrder}
          onClose={() => setCartOpen(false)}
          onChangeQty={changeQty}
          onRemove={removeFromCart}
          onPlaceOrder={placeOrder}
          onContinueShopping={() => { setOrderPlaced(false); setCartOpen(false); }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}

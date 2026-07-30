import React from 'react';
import {
  MapPin, Truck, ShieldCheck, Search, Phone, User, LogOut,
  ShoppingCart, Menu, Flame,
} from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { CATEGORIES, CATEGORY_LABEL } from '../data/products.js';

export default function Header({
  customer,
  onLoginClick,
  onLogoutClick,
  cartCount,
  cartPulse,
  onCartClick,
  activeCategory,
  setActiveCategory,
}) {
  return (
    <>
      {/* ---------------- Top utility bar ---------------- */}
      <div className="dh-topbar">
        <div className="dh-topbar-inner">
          <span className="dh-topbar-item"><MapPin size={12} /> Hệ thống 24 cửa hàng toàn quốc</span>
          <div className="dh-topbar-right">
            <span className="dh-topbar-item"><Truck size={12} /> Miễn phí giao hàng</span>
            <span className="dh-topbar-item"><ShieldCheck size={12} /> Bảo hành chính hãng 12 tháng</span>
          </div>
        </div>
      </div>

      {/* ---------------- Main header ---------------- */}
      <header className="dh-header">
        <div className="dh-header-inner">
          <Logo size="lg" />
          <div className="dh-searchbar">
            <input placeholder="Bạn muốn tìm máy ảnh gì hôm nay?" />
            <button aria-label="Tìm kiếm"><Search size={18} /></button>
          </div>
          <div className="dh-header-actions">
            <div className="dh-hotline">
              <div className="dh-hotline-icon"><Phone size={16} /></div>
              <div>
                <span className="dh-hotline-label">Tổng đài miễn phí</span>
                <strong>1800.2097</strong>
              </div>
            </div>
            {customer ? (
              <button className="dh-account-btn" onClick={onLogoutClick}>
                <User size={16} /> {customer.name} <LogOut size={13} />
              </button>
            ) : (
              <button className="dh-account-btn" onClick={onLoginClick}>
                <User size={16} /> Đăng nhập
              </button>
            )}
            <button className="dh-cart-btn" onClick={onCartClick}>
              <span key={cartPulse} className="dh-cart-icon-wrap">
                <ShoppingCart size={20} />
              </span>
              {cartCount > 0 && <span key={`badge-${cartPulse}`} className="dh-cart-badge">{cartCount}</span>}
              <span className="dh-cart-label">Giỏ hàng</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- Category nav ---------------- */}
      <nav className="dh-catnav">
        <div className="dh-catnav-inner">
          <button className="dh-catnav-all"><Menu size={16} /> Danh mục sản phẩm</button>
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              className={`dh-catnav-item ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' ? 'Tất cả' : CATEGORY_LABEL[cat]}
            </button>
          ))}
          <span className="dh-catnav-flash"><Flame size={13} /> Flash Sale</span>
        </div>
      </nav>
    </>
  );
}

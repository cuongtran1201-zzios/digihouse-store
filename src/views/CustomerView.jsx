import React, { useRef, useState } from 'react';
import {
  Camera, ChevronRight, ArrowRight, Flame, Package, BadgePercent, ShieldCheck, Truck,
} from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import Countdown from '../components/Countdown.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import ProductThumb from '../components/ProductThumb.jsx';
import Orb from '../components/Orb.jsx';
import ProductCard from './ProductCard.jsx';
import { CATEGORIES, CATEGORY_LABEL, VND } from '../data/products.js';

export default function CustomerView({ products, flashSale, addToCart, loading }) {
  const heroRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleHeroMove(e) {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  }
  function resetTilt() { setTilt({ x: 0, y: 0 }); }

  const featured = (flashSale.length ? flashSale : products).slice(0, 3);

  return (
    <>
      {/* Hero: dark glass card with floating orbs */}
      <section className="dh-hero2-wrap">
        <div
          ref={heroRef}
          className="dh-hero2"
          onMouseMove={handleHeroMove}
          onMouseLeave={resetTilt}
          style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          <span className="dh-dotgrid" style={{ top: 36, left: 40 }} />
          <span className="dh-dotgrid" style={{ top: 70, right: 60 }} />
          <span className="dh-xmark" style={{ top: 120, left: 90 }}>×</span>
          <span className="dh-xmark" style={{ bottom: 60, right: 130 }}>×</span>
          <span className="dh-xmark" style={{ bottom: 40, left: '38%' }}>×</span>

          <Orb size={70} top={-20} right={230} from="#BFFFE0" to="#16A085" delay={0} />
          <Orb size={30} top={90} left={120} from="#FFD9E8" to="#FF6FA3" delay={0.6} />
          <Orb size={46} top={220} left={40} from="#CDEBFF" to="#2BA9E1" delay={1.1} />
          <Orb size={54} bottom={70} right={70} from="#FFE3B0" to="#FF7A3C" delay={0.3} />
          <Orb size={26} bottom={160} right={-6} from="#E8D6FF" to="#B692FF" delay={0.9} />

          <div className="dh-ring3d-wrap" style={{ top: 30, right: 90 }}>
            <span className="dh-ring3d" />
          </div>

          <div className="dh-hero2-inner">
            <span className="dh-eyebrow2 dh-hero-in" style={{ animationDelay: '0ms' }}>
              Ưu đãi tháng 7 · Trả góp 0%
            </span>
            <h1 className="dh-hero-in" style={{ animationDelay: '80ms' }}>
              Săn máy ảnh<br />giảm đến <span className="dh-hero2-accent">20%</span>
            </h1>
            <p className="dh-hero-in" style={{ animationDelay: '170ms' }}>
              Hàng chính hãng, bảo hành tận tâm — hỗ trợ thu cũ đổi mới tại toàn hệ thống Digi house.
            </p>
            <a href="#shop" className="dh-pill-cta dh-hero-in" style={{ animationDelay: '250ms' }}>
              Khám phá ngay
              <span className="dh-pill-icon"><ArrowRight size={16} /></span>
            </a>
          </div>

          {!loading && featured.length > 0 && (
            <div className="dh-hero2-cards">
              {featured.map((p, i) => (
                <div
                  className="dh-mini-card dh-hero-in"
                  key={p.id}
                  style={{ animationDelay: `${340 + i * 90}ms` }}
                  onClick={() => { window.location.hash = `#/product/${p.id}`; }}
                >
                  <div className="dh-mini-card-thumb">
                    <ProductThumb product={p} />
                  </div>
                  <div className="dh-mini-card-body">
                    <span className="dh-mini-card-cat">{CATEGORY_LABEL[p.category]}</span>
                    <h4>{p.name}</h4>
                    <div className="dh-mini-card-row">
                      <span className="dh-mini-card-price">{VND(p.price)}</span>
                      <button className="dh-mini-card-btn" onClick={(e) => { e.stopPropagation(); addToCart(p.id); }}>Chọn mua</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category quick icons */}
      <section className="dh-catrow">
        {CATEGORIES.map((cat, i) => (
          <Reveal key={cat} delay={i * 60}>
            <div className="dh-catrow-item">
              <div className="dh-catrow-icon"><Camera size={22} /></div>
              <span>{CATEGORY_LABEL[cat]}</span>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Flash sale */}
      {flashSale.length > 0 && (
        <section className="dh-flash">
          <div className="dh-flash-head">
            <div className="dh-flash-title"><Flame size={18} className="dh-flame-flicker" /> FLASH SALE</div>
            <Countdown minutesFromNow={195} />
          </div>
          <div className="dh-flash-scroll">
            {flashSale.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} addToCart={addToCart} compact />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Product grid */}
      <section id="shop" className="dh-shop">
        <div className="dh-shop-head">
          <h2>Sản phẩm nổi bật</h2>
        </div>
        {loading ? (
          <div className="dh-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="dh-empty dh-empty-shop">
            <Package size={32} />
            <p>Chưa có sản phẩm trong danh mục này.</p>
          </div>
        ) : (
          <div className="dh-grid">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 70}>
                <ProductCard product={p} addToCart={addToCart} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Promo banners */}
      <section className="dh-promos">
        <Reveal delay={0}><div className="dh-promo-card dh-promo-red"><BadgePercent size={20} /> <span>Giảm thêm 5% khi thanh toán online</span></div></Reveal>
        <Reveal delay={80}><div className="dh-promo-card dh-promo-dark"><ShieldCheck size={20} /> <span>Bảo hành chính hãng 12–24 tháng</span></div></Reveal>
        <Reveal delay={160}><div className="dh-promo-card dh-promo-blue"><Truck size={20} /> <span>Giao nhanh 2 giờ nội thành</span></div></Reveal>
      </section>
    </>
  );
}

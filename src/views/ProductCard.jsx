import React, { useState, useRef } from 'react';
import { Plus, Check } from 'lucide-react';
import ProductThumb from '../components/ProductThumb.jsx';
import Stars from '../components/Stars.jsx';
import { CATEGORY_LABEL, VND } from '../data/products.js';

export default function ProductCard({ product: p, addToCart, compact }) {
  const discount = p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : null;
  const [justAdded, setJustAdded] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState(null); // null = not hovering

  function handleAdd() {
    addToCart(p.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1300);
  }

  function handleMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -10, y: px * 12 });
  }

  const style = tilt
    ? { transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) scale(1.015)` }
    : { transform: 'perspective(700px) rotateX(0deg) rotateY(0deg)' };

  return (
    <article
      ref={cardRef}
      className={`dh-card ${compact ? 'dh-card-compact' : ''}`}
      style={style}
      onMouseMove={handleMove}
      onMouseEnter={handleMove}
      onMouseLeave={() => setTilt(null)}
    >
      {discount && <span className="dh-badge-discount">-{discount}%</span>}
      <ProductThumb product={p} />
      <div className="dh-card-body">
        <span className="dh-card-category">{CATEGORY_LABEL[p.category]}</span>
        <h3>{p.name}</h3>
        <div className="dh-card-rating">
          <Stars rating={p.rating} /> <span className="dh-card-sold">Đã bán {p.sold}</span>
        </div>
        <div className="dh-price-row">
          <span className="dh-price-now">{VND(p.price)}</span>
          {p.compareAtPrice && <span className="dh-price-old">{VND(p.compareAtPrice)}</span>}
        </div>
        <div className="dh-spec-row">
          <span className="dh-spec-chip">{p.sensor}</span>
          <span className="dh-spec-chip">{p.iso}</span>
        </div>
        <button className={`dh-btn-primary dh-add-btn ${justAdded ? 'dh-add-btn-done' : ''}`} onClick={handleAdd}>
          {justAdded ? <>Đã thêm <Check size={14} /></> : <>Chọn mua <Plus size={14} /></>}
        </button>
      </div>
    </article>
  );
}

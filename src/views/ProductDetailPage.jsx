import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Check, Play } from 'lucide-react';
import Stars from '../components/Stars.jsx';
import { CATEGORY_LABEL, VND } from '../data/products.js';

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return null;
}

export default function ProductDetailPage({ product, addToCart, onBack }) {
  const images = useMemo(() => {
    const list = [product.image, ...(product.gallery || [])].filter(Boolean);
    return list.length > 0 ? list : [null];
  }, [product]);

  const [activeImage, setActiveImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;
  const embedUrl = getYouTubeEmbedUrl(product.videoUrl);

  function handleAdd() {
    addToCart(product.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1300);
  }

  return (
    <section className="dh-detail">
      <button className="dh-detail-back" onClick={onBack}>
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="dh-detail-grid">
        {/* ---- Gallery ---- */}
        <div className="dh-detail-gallery">
          <div className="dh-detail-main-image">
            {images[activeImage] ? (
              <img src={images[activeImage]} alt={product.name} />
            ) : (
              <div className="dh-detail-noimg">Chưa có ảnh</div>
            )}
            {discount && <span className="dh-badge-discount dh-detail-badge">-{discount}%</span>}
          </div>
          {(images.length > 1 || embedUrl) && (
            <div className="dh-detail-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`dh-detail-thumb ${activeImage === i ? 'active' : ''}`}
                  onClick={() => setActiveImage(i)}
                >
                  {img ? <img src={img} alt={`${product.name} ${i + 1}`} /> : <span>Ảnh</span>}
                </button>
              ))}
              {embedUrl && (
                <a className="dh-detail-thumb dh-detail-thumb-video" href={`#video-${product.id}`}
                  onClick={(e) => { e.preventDefault(); document.getElementById('dh-detail-video')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <Play size={18} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* ---- Info ---- */}
        <div className="dh-detail-info">
          <span className="dh-card-category">{CATEGORY_LABEL[product.category]}</span>
          <h1>{product.name}</h1>
          <div className="dh-card-rating">
            <Stars rating={product.rating} /> <span className="dh-card-sold">Đã bán {product.sold}</span>
          </div>
          <div className="dh-price-row dh-detail-price-row">
            <span className="dh-price-now">{VND(product.price)}</span>
            {product.compareAtPrice && <span className="dh-price-old">{VND(product.compareAtPrice)}</span>}
          </div>

          <table className="dh-detail-specs">
            <tbody>
              <tr><td>Độ phân giải</td><td>{product.sensor}</td></tr>
              <tr><td>Zoom quang học</td><td>{product.mount}</td></tr>
              <tr><td>Tình trạng máy</td><td>{product.iso}</td></tr>
            </tbody>
          </table>

          <p className="dh-detail-desc">{product.description}</p>

          <button className={`dh-btn-primary dh-detail-add ${justAdded ? 'dh-add-btn-done' : ''}`} onClick={handleAdd}>
            {justAdded ? <>Đã thêm <Check size={16} /></> : <>Chọn mua <Plus size={16} /></>}
          </button>
        </div>
      </div>

      {/* ---- Video ---- */}
      {embedUrl && (
        <div id="dh-detail-video" className="dh-detail-video-section">
          <h2>Video giới thiệu</h2>
          <div className="dh-detail-video-wrap">
            <iframe
              src={embedUrl}
              title={`Video ${product.name}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Check, Play } from 'lucide-react';
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
  const [direction, setDirection] = useState('next'); // dùng để chọn hiệu ứng trượt trái/phải
  const [justAdded, setJustAdded] = useState(false);
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;
  const embedUrl = getYouTubeEmbedUrl(product.videoUrl);

  const touchStartX = useRef(null);

  function goTo(idx, dir) {
    setDirection(dir);
    setActiveImage(idx);
  }
  function goPrev() {
    goTo((activeImage - 1 + images.length) % images.length, 'prev');
  }
  function goNext() {
    goTo((activeImage + 1) % images.length, 'next');
  }
  function selectThumb(i) {
    goTo(i, i > activeImage ? 'next' : 'prev');
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e) {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext(); else goPrev();
    }
    touchStartX.current = null;
  }

  function handleAdd() {
    addToCart(product.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1300);
  }

  // ---- Điều hướng bằng phím mũi tên trái/phải trên bàn phím ----
  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return; // đang gõ chữ ở ô khác thì bỏ qua
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeImage, images.length]);

  return (
    <section className="dh-detail">
      <button className="dh-detail-back" onClick={onBack}>
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="dh-detail-grid">
        {/* ---- Gallery ---- */}
        <div className="dh-detail-gallery">
          <div
            className="dh-detail-main-image"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div key={activeImage} className={`dh-detail-slide dh-detail-slide-${direction}`}>
              {images[activeImage] ? (
                <img src={images[activeImage]} alt={product.name} />
              ) : (
                <div className="dh-detail-noimg">Chưa có ảnh</div>
              )}
            </div>

            {discount && <span className="dh-badge-discount dh-detail-badge">-{discount}%</span>}

            {images.length > 1 && (
              <>
                <button className="dh-detail-nav dh-detail-nav-prev" onClick={goPrev} aria-label="Ảnh trước">
                  <ChevronLeft size={20} />
                </button>
                <button className="dh-detail-nav dh-detail-nav-next" onClick={goNext} aria-label="Ảnh sau">
                  <ChevronRight size={20} />
                </button>
                <div className="dh-detail-dots">
                  {images.map((_, i) => (
                    <span key={i} className={`dh-detail-dot ${activeImage === i ? 'active' : ''}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {(images.length > 1 || embedUrl) && (
            <div className="dh-detail-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`dh-detail-thumb ${activeImage === i ? 'active' : ''}`}
                  onClick={() => selectThumb(i)}
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

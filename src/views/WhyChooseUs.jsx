import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Truck, BadgeCheck } from 'lucide-react';

const ITEMS = [
  { icon: ShieldCheck, title: 'Hàng chính hãng', desc: 'Kiểm tra kỹ trước khi giao', accent: '#2BA9E1' },
  { icon: Truck, title: 'Giao nhanh 2 giờ', desc: 'Nội thành, đóng gói cẩn thận', accent: '#2DD4A0' },
  { icon: BadgeCheck, title: 'Bảo hành 12 tháng', desc: 'Đổi trả trong 7 ngày', accent: '#B388FF' },
];

export default function WhyChooseUs() {
  const cardRefs = useRef([]);

  useEffect(() => {
    function update() {
      const vh = window.innerHeight;
      const center = vh / 2;
      cardRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cardCenter = r.top + r.height / 2;
        const dist = (cardCenter - center) / (vh / 2);
        const clamped = Math.max(-1, Math.min(1, dist));
        const rotate = clamped * 30;
        const scale = 1 - Math.abs(clamped) * 0.15;
        const opacity = 1 - Math.abs(clamped) * 0.5;
        el.style.transform = `rotateX(${rotate.toFixed(1)}deg) scale(${scale.toFixed(2)})`;
        el.style.opacity = Math.max(0.35, opacity).toFixed(2);
      });
    }
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => { update(); ticking = false; });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll);
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="dh-why">
      <h2 className="dh-why-title">
        <span className="dh-why-title-pre">Vì sao chọn </span>
        <span className="dh-why-title-digi">Digi</span>
        <span className="dh-why-title-house"> house</span>
      </h2>
      <div className="dh-why-grid">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              ref={(el) => (cardRefs.current[i] = el)}
              className="dh-why-card"
            >
              <div className="dh-why-icon" style={{ background: `${item.accent}26`, color: item.accent }}>
                <Icon size={i === 0 ? 30 : 24} strokeWidth={1.8} />
              </div>
              <p className="dh-why-card-title">{item.title}</p>
              <p className="dh-why-card-desc">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

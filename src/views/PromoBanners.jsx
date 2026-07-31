import React, { useEffect, useRef } from 'react';
import { BadgePercent, RefreshCw, Users } from 'lucide-react';

const ITEMS = [
  { icon: BadgePercent, title: 'Giảm thêm 5%', desc: 'Khi thanh toán online', bg: 'var(--red)' },
  { icon: RefreshCw, title: 'Thu cũ đổi mới', desc: 'Lên đời máy dễ dàng', bg: 'var(--ink)' },
  { icon: Users, title: '500+ khách tin chọn', desc: 'Cộng đồng Digi house', bg: '#1E5FBF' },
];

export default function PromoBanners() {
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
        const rotate = clamped * 24;
        const scale = 1 - Math.abs(clamped) * 0.12;
        const opacity = 1 - Math.abs(clamped) * 0.5;
        el.style.transform = `rotateX(${rotate.toFixed(1)}deg) scale(${scale.toFixed(2)})`;
        el.style.opacity = Math.max(0.4, opacity).toFixed(2);
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
    <section className="dh-promos2">
      {ITEMS.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            ref={(el) => (cardRefs.current[i] = el)}
            className="dh-promo2-card"
            style={{ background: item.bg }}
          >
            <Icon size={22} />
            <div>
              <p className="dh-promo2-title">{item.title}</p>
              <p className="dh-promo2-desc">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

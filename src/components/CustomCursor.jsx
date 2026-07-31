import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Chỉ bật trên máy có chuột thật (không bật trên điện thoại/máy cảm ứng)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;
    setEnabled(true);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf;

    function onMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
      const isInteractive = e.target.closest(
        'a, button, input, textarea, select, [role="button"], .dh-card, .dh-mini-card'
      );
      if (ringRef.current) {
        ringRef.current.classList.toggle('dh-cursor-hover', !!isInteractive);
      }
    }

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animateRing);
    }

    window.addEventListener('mousemove', onMouseMove);
    raf = requestAnimationFrame(animateRing);
    document.body.classList.add('dh-cursor-none');

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove('dh-cursor-none');
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="dh-cursor-ring" />
      <div ref={dotRef} className="dh-cursor-dot" />
    </>
  );
}

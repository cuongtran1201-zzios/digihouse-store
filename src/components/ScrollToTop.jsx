import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!show) return null;

  return (
    <button className="dh-scrolltop" onClick={handleClick} aria-label="Lên đầu trang">
      <ArrowUp size={20} />
    </button>
  );
}
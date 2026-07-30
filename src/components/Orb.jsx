import React from 'react';

export default function Orb({ size, top, left, right, bottom, from, to, delay = 0 }) {
  return (
    <span
      className="dh-orb"
      style={{
        width: size, height: size, top, left, right, bottom,
        background: `radial-gradient(circle at 30% 28%, ${from}, ${to} 72%)`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

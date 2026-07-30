import React from 'react';
import { Star } from 'lucide-react';

export default function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="dh-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} fill={i < full ? '#FFA000' : 'none'} color={i < full ? '#FFA000' : '#D6D8DC'} />
      ))}
    </span>
  );
}

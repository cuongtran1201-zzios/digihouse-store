import React from 'react';
import { Camera } from 'lucide-react';

export default function ProductThumb({ product, size = 'card' }) {
  if (product.image) {
    return (
      <div className={`dh-thumb dh-thumb-${size}`}>
        <img src={product.image} alt={product.name} />
      </div>
    );
  }
  return (
    <div className={`dh-thumb dh-thumb-${size} dh-thumb-placeholder`}>
      <Camera size={size === 'row' ? 20 : 44} color="#C6CBD3" strokeWidth={1.4} />
    </div>
  );
}

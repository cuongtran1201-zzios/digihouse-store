import React from 'react';
import { Camera } from 'lucide-react';

export default function Logo({ size = 'md' }) {
  return (
    <div className={`dh-logo dh-logo-${size}`}>
      <span className="dh-logo-digi">Digi</span>
      <span className="dh-logo-house">house</span>
      <Camera className="dh-logo-cam" size={size === 'lg' ? 24 : 17} strokeWidth={2.4} />
    </div>
  );
}

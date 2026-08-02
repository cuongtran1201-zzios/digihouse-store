import React, { useState } from 'react';
import { Phone, Facebook, Instagram, Music2, Camera, X } from 'lucide-react';
import { CONTACT_INFO } from '../data/contactConfig.js';

const CHANNELS = [
  {
    key: 'phone',
    label: `Gọi: ${CONTACT_INFO.phone}`,
    icon: Phone,
    href: `tel:${CONTACT_INFO.phone}`,
    color: '#1B4C87',
  },
  {
    key: 'messenger',
    label: 'Nhắn Messenger',
    icon: Facebook,
    href: `https://m.me/${CONTACT_INFO.messengerPageId}`,
    color: '#0866FF',
  },
  {
    key: 'instagram',
    label: 'Nhắn Instagram',
    icon: Instagram,
    href: `https://ig.me/m/${CONTACT_INFO.instagramUsername}`,
    color: '#D6249F',
  },
  {
    key: 'tiktok',
    label: 'Xem TikTok',
    icon: Music2,
    href: `https://www.tiktok.com/@${CONTACT_INFO.tiktokUsername}`,
    color: '#000000',
  },
];

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="dh-fcontact-wrap">
      {open && (
        <div className="dh-fcontact-list">
          {CHANNELS.map((ch, i) => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.key}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="dh-fcontact-pill"
                style={{ background: ch.color, animationDelay: `${i * 45}ms` }}
              >
                <span>{ch.label}</span>
                <Icon size={16} />
              </a>
            );
          })}
        </div>
      )}
      <button
        className="dh-fcontact-fab"
        onClick={() => setOpen(o => !o)}
        aria-label="Liên hệ nhanh"
      >
        {open ? <X size={22} /> : <Camera size={22} />}
      </button>
    </div>
  );
}

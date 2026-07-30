import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="dh-skel-card">
      <div className="dh-skel dh-skel-img" />
      <div className="dh-skel-body">
        <div className="dh-skel dh-skel-line" style={{ width: '40%' }} />
        <div className="dh-skel dh-skel-line" style={{ width: '75%', height: 16 }} />
        <div className="dh-skel dh-skel-line" style={{ width: '55%' }} />
        <div className="dh-skel dh-skel-line" style={{ width: '50%', height: 18, marginTop: 4 }} />
        <div className="dh-skel dh-skel-btn" />
      </div>
    </div>
  );
}

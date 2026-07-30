import React, { useState, useEffect } from 'react';

export default function Countdown({ minutesFromNow = 195 }) {
  const [remaining, setRemaining] = useState(minutesFromNow * 60);

  useEffect(() => {
    const t = setInterval(() => setRemaining(r => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');

  return (
    <div className="dh-countdown">
      <span>{h}</span><em>:</em><span>{m}</span><em>:</em><span>{s}</span>
    </div>
  );
}

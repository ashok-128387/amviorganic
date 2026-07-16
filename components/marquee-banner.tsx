'use client';

import { useEffect, useState } from 'react';

export default function MarqueeBanner() {
  const [mounted, setMounted] = useState(false);
  const [threshold, setThreshold] = useState(999);
  const [announcementText, setAnnouncementText] = useState('');

  useEffect(() => {
    setMounted(true);
    fetch('/api/settings-get')
      .then(r => r.json())
      .then(({ settings }) => {
        if (settings?.freeShippingThreshold) {
          setThreshold(Number(settings.freeShippingThreshold));
        }
        if (settings?.announcementText) {
          setAnnouncementText(String(settings.announcementText));
        }
      })
      .catch(() => {});
  }, []);

  if (!mounted) return <div style={{ background: '#1e4a2a', height: '37px' }} />;

  const text = announcementText
    ? announcementText.replace(/\{threshold\}/g, threshold.toString())
    : `FREE SHIPPING on orders above ₹${threshold} | Use code WELCOME10 for 10% OFF`;

  // Repeat the message many times so the duplicated track is always wider than the viewport.
  // This makes the marquee loop appear continuous without gaps.
  const REPEAT_COUNT = 12;
  const repeatedItems = Array.from({ length: REPEAT_COUNT }, (_, i) => (
    <span key={i}><span className="marquee-dot"></span>&nbsp; {text}</span>
  ));

  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {/* First set */}
        {repeatedItems.map((item, i) => (
          <div key={`a-${i}`} className="marquee-item">{item}</div>
        ))}
        {/* Duplicate set for seamless loop */}
        {repeatedItems.map((item, i) => (
          <div key={`b-${i}`} className="marquee-item">{item}</div>
        ))}
      </div>

      <style jsx>{`
        .marquee-wrap {
          background: #1e4a2a;
          padding: 10px 0;
          overflow: hidden;
          width: 100%;
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 40px;
          white-space: nowrap;
          font-size: 13px;
          font-weight: 500;
          color: #ffffff;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.3px;
        }
        .marquee-item strong {
          color: #ffffff;
          font-weight: 700;
        }
        .marquee-sep {
          color: rgba(255, 255, 255, 0.5);
          margin: 0 6px;
        }
        .marquee-dot {
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          flex-shrink: 0;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

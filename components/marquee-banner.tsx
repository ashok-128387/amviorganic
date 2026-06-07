'use client';

import { useEffect, useState } from 'react';

export default function MarqueeBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ background: '#1e4a2a', height: '37px' }} />;

  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {/* First set */}
        <div className="marquee-item">
          <span className="marquee-dot"></span>&nbsp; FREE SHIPPING on orders above ₹999 <span className="marquee-sep">|</span> Use code <strong>WELCOME10</strong> for 10% off
        </div>
        <div className="marquee-item">
          <span className="marquee-dot"></span>&nbsp; 100% Natural &amp; Organic Jaggery Products <span className="marquee-sep">|</span> FREE SHIPPING on orders above ₹999
        </div>
        <div className="marquee-item">
          <span className="marquee-dot"></span>&nbsp; Use code <strong>WELCOME10</strong> for 10% off your first order
        </div>
        <div className="marquee-item">
          <span className="marquee-dot"></span>&nbsp; FREE SHIPPING on orders above ₹999 <span className="marquee-sep">|</span> COD Available
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="marquee-item">
          <span className="marquee-dot"></span>&nbsp; FREE SHIPPING on orders above ₹999 <span className="marquee-sep">|</span> Use code <strong>WELCOME10</strong> for 10% off
        </div>
        <div className="marquee-item">
          <span className="marquee-dot"></span>&nbsp; 100% Natural &amp; Organic Jaggery Products <span className="marquee-sep">|</span> FREE SHIPPING on orders above ₹999
        </div>
        <div className="marquee-item">
          <span className="marquee-dot"></span>&nbsp; Use code <strong>WELCOME10</strong> for 10% off your first order
        </div>
        <div className="marquee-item">
          <span className="marquee-dot"></span>&nbsp; FREE SHIPPING on orders above ₹999 <span className="marquee-sep">|</span> COD Available
        </div>
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
          animation: marquee 22s linear infinite;
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
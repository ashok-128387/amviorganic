'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const banners = [
  '/Product images for website/Product images for website/Banner 1.png',
  '/Product images for website/Product images for website/Banner 2.png',
  '/Product images for website/Product images for website/Banner 3.png',
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3500);
  };

  useEffect(() => {
    if (!paused) startTimer();
    else if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  const prev = () => { setCurrent((p) => (p - 1 + banners.length) % banners.length); if (!paused) startTimer(); };
  const next = () => { setCurrent((p) => (p + 1) % banners.length); if (!paused) startTimer(); };

  return (
    <section className="banner-section relative w-full overflow-hidden" data-banner>
      {banners.map((src, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <Image src={src} alt={`Banner ${i + 1}`} fill className="object-cover object-center" priority={i === 0} sizes="100vw" />
        </div>
      ))}

      {/* View All button */}
      <div className="absolute bottom-12 sm:bottom-10 left-1/2 -translate-x-1/2 z-10">
        <Link href="/#jaggery"
          className="px-5 py-2 sm:px-7 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-lg transition-all duration-200 whitespace-nowrap"
          style={{ background: '#c8922a', color: '#fff', letterSpacing: '0.04em' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e8b84b')}
          onMouseLeave={e => (e.currentTarget.style.background = '#c8922a')}>
          View All Products →
        </Link>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'bg-white w-6 h-2.5' : 'bg-white/50 w-2.5 h-2.5'}`} />
        ))}
      </div>

      {/* Arrows */}
      <button onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/55 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl z-10 transition">
        ‹
      </button>
      <button onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/55 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl z-10 transition">
        ›
      </button>

      {/* Pause/Play */}
      <button onClick={() => setPaused(p => !p)}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white transition"
        style={{ background: 'rgba(0,0,0,0.35)' }} title={paused ? 'Play' : 'Pause'}>
        {paused ? (
          <svg width="13" height="14" viewBox="0 0 13 14" fill="white"><polygon points="1,0 12,7 1,14"/></svg>
        ) : (
          <svg width="11" height="13" viewBox="0 0 11 13" fill="white"><rect x="0" y="0" width="3.5" height="13"/><rect x="6.5" y="0" width="3.5" height="13"/></svg>
        )}
      </button>

      <style jsx>{`
        .banner-section {
          aspect-ratio: 16/9;
        }
        @media (min-width: 768px) {
          .banner-section {
            aspect-ratio: auto;
            height: 380px;
          }
        }
        @media (min-width: 1024px) {
          .banner-section {
            height: 460px;
          }
        }
        @media (min-width: 1280px) {
          .banner-section {
            height: 560px;
          }
        }
        @media (min-width: 1536px) {
          .banner-section {
            height: 640px;
          }
        }
      `}</style>
    </section>
  );
}

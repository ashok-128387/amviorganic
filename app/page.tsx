'use client';

import CartDrawer from '@/components/cart-drawer';
import ProductCard from '@/components/product-card';
import BannerSlider from '@/components/banner-slider';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Merriweather } from 'next/font/google';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['700']
});

// Certification Carousel Component
function CertificationCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const certifications = [
    {
      name: 'FSSAI',
      image: '/Certification logo/Certification logo/fssai-logo-png_seeklogo-304263.png',
      description: 'Food Safety & Standards Authority of India'
    },
    {
      name: 'Jaivik Bharat',
      image: '/Certification logo/Certification logo/Jaivik Bharat logo (1).png',
      description: 'Organic Certification'
    },
    {
      name: 'PGS India Organic',
      image: '/Certification logo/Certification logo/PGS India Organic logo (1).png',
      description: 'Participatory Guarantee System'
    },
    {
      name: 'ROCO',
      image: '/Certification logo/Certification logo/ROCO Logo (3).jpg',
      description: 'Registered Organic Certifying Organization'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === certifications.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Back to 3 seconds for smooth rotation

    return () => clearInterval(timer);
  }, [certifications.length]);

  return (
    <section className="bg-white py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trusted Certifications</h2>
          <p className="text-gray-600">Our commitment to quality and authenticity</p>
        </div>
        
        {/* Mobile Carousel - Continuous Running */}
        <div className="md:hidden">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <div className="transition-all duration-500 ease-in-out">
                <img
                  src={certifications[currentIndex].image}
                  alt={certifications[currentIndex].name}
                  loading="lazy"
                  className="h-20 mx-auto mb-3 object-contain transition-opacity duration-300"
                />
                <p className="text-sm font-semibold text-gray-900">{certifications[currentIndex].name}</p>
                <p className="text-xs text-gray-600">{certifications[currentIndex].description}</p>
              </div>
            </div>
          </div>
          
          {/* Dots Navigation - For reference only */}
          <div className="flex justify-center mt-6 space-x-2">
            {certifications.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-green-700 w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop - Scrolling Logos */}
        <div className="hidden md:block">
          <div className="overflow-hidden">
            <div className="flex animate-scroll space-x-12 items-center justify-center">
              {/* First set */}
              {certifications.map((cert, index) => (
                <div key={`first-${index}`} className="flex-shrink-0 text-center">
                  <div className="bg-gray-50 rounded-lg p-6 mb-3 hover:bg-green-50 transition-colors">
                    <img
                      src={cert.image}
                      alt={cert.name}
                      loading="lazy"
                      className="h-16 mx-auto object-contain"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{cert.name}</p>
                  <p className="text-xs text-gray-600">{cert.description}</p>
                </div>
              ))}
              {/* Second set for seamless loop */}
              {certifications.map((cert, index) => (
                <div key={`second-${index}`} className="flex-shrink-0 text-center">
                  <div className="bg-gray-50 rounded-lg p-6 mb-3 hover:bg-green-50 transition-colors">
                    <img
                      src={cert.image}
                      alt={cert.name}
                      className="h-16 mx-auto object-contain"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{cert.name}</p>
                  <p className="text-xs text-gray-600">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

// Customer Reviews Carousel Component
function CustomerReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [mounted, setMounted] = useState(false);

  const reviews = [
    {
      text: "The organic jaggery cubes are amazing! Perfect sweetness without any chemicals. My family loves using them in tea and desserts. Highly recommend!",
      name: "Priya Sharma",
      initial: "P",
      gradient: "linear-gradient(135deg, #1e4a2a, #2a6b3e)"
    },
    {
      text: "AMVI Organics jaggery powder has become a staple in my kitchen. The quality is outstanding and it dissolves perfectly in milk and sweets.",
      name: "Rajesh Kumar",
      initial: "R",
      gradient: "linear-gradient(135deg, #c8922a, #d4a356)"
    },
    {
      text: "Love the liquid jaggery! It's so convenient to use and the taste is incredibly pure. My children prefer it over regular sugar now.",
      name: "Meera Patel",
      initial: "M",
      gradient: "linear-gradient(135deg, #1e4a2a, #c8922a)"
    },
    {
      text: "The masala jaggery cubes are a game changer! Perfect blend of spices and sweetness. Great for making traditional Indian sweets.",
      name: "Dr. Anjali Verma",
      initial: "A",
      gradient: "linear-gradient(135deg, #2a6b3e, #1e4a2a)"
    },
    {
      text: "Excellent quality jaggery products! I can taste the difference - it's so natural and pure. Will definitely keep ordering from AMVI Organics.",
      name: "Sanjay Gupta",
      initial: "S",
      gradient: "linear-gradient(135deg, #c8922a, #1e4a2a)"
    },
    {
      text: "The jaggery powder jar is perfect for daily use. Easy to store and the quality remains fresh for months. Authentic taste guaranteed!",
      name: "Kavya Reddy",
      initial: "K",
      gradient: "linear-gradient(135deg, #2a6b3e, #c8922a)"
    }
  ];

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 700) {
        setVisibleCount(1);
      } else if (window.innerWidth <= 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    updateVisibleCount();
    setMounted(true);
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const totalSlides = Math.max(0, reviews.length - visibleCount + 1);

  const goTo = (index: number) => {
    const maxIndex = Math.max(0, reviews.length - visibleCount);
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const handlePrevious = () => {
    goTo(currentIndex - 1);
  };

  const handleNext = () => {
    goTo(currentIndex + 1);
  };

  return (
    <>
      <section className="reviews-section">
        <h2 className={`reviews-heading ${merriweather.className}`}>What Do Our Customers Say</h2>

        <div className="carousel-outer">
          <div 
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount + (visibleCount > 1 ? 20 / visibleCount : 0))}%)`,
              transition: 'transform 0.45s cubic-bezier(.4,0,.2,1)'
            }}
          >
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <p className="review-text">{review.text}</p>
                <div className="reviewer">
                  <div 
                    className="reviewer-avatar-placeholder" 
                    style={{ background: review.gradient }}
                  >
                    {review.initial}
                  </div>
                  <div className="reviewer-info">
                    <p className="reviewer-name">{review.name}</p>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="carousel-controls">
          <button 
            className="carousel-arrow" 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div className="carousel-dots">
            {Array.from({ length: totalSlides }, (_, i) => (
              <button
                key={i}
                className={`dot ${i === currentIndex ? 'active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button 
            className="carousel-arrow" 
            onClick={handleNext}
            disabled={currentIndex >= totalSlides - 1}
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </section>

      <style jsx>{`
        .reviews-section {
          max-width: 1300px;
          margin: 0 auto;
          padding: 60px 24px 70px;
          background: #f5f2ed;
        }

        .reviews-heading {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          color: #1e4a2a;
          margin-bottom: 44px;
        }

        .carousel-outer {
          overflow: hidden;
          position: relative;
        }

        .carousel-track {
          display: flex;
          gap: 20px;
          will-change: transform;
        }

        .review-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 28px 26px 24px;
          flex: 0 0 calc(${mounted ? 100 / visibleCount : 25}% - ${mounted && visibleCount > 1 ? 15 : 0}px);
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 2px 16px rgba(30, 74, 42, 0.08);
          border: 1px solid rgba(30, 74, 42, 0.05);
        }

        .review-text {
          font-size: 0.82rem;
          color: #444;
          line-height: 1.75;
          flex: 1;
          margin-bottom: 24px;
        }

        .reviewer {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .reviewer-avatar-placeholder {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
        }

        .reviewer-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e4a2a;
          margin-bottom: 4px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .stars span {
          color: #c8922a;
          font-size: 0.85rem;
        }

        .carousel-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 36px;
        }

        .carousel-arrow {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1.5px solid #1e4a2a;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e4a2a;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
        }

        .carousel-arrow:hover:not(:disabled) {
          background: #1e4a2a;
          color: #fff;
        }

        .carousel-arrow:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .carousel-arrow svg {
          width: 16px;
          height: 16px;
        }

        .carousel-dots {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #c5d4c5;
          cursor: pointer;
          transition: background 0.25s, transform 0.25s;
          border: none;
          padding: 0;
        }

        .dot.active {
          background: #1e4a2a;
          transform: scale(1.15);
        }

        @media (max-width: 1024px) {
          .review-card {
            flex: 0 0 calc(33.33% - 14px);
          }
        }

        @media (max-width: 700px) {
          .review-card {
            flex: 0 0 100%;
          }
          .reviews-heading {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<'Sweeteners' | 'Combo Deals' | 'New'>('Sweeteners');
  const [mounted, setMounted] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'combo') setActiveCategory('Combo Deals');
    if (params.get('tab') === 'new') setActiveCategory('New');
    fetch('/api/products-get').then(r => r.json()).then(({ products }) => {
      if (products) setAllProducts(products);
    });
  }, []);

  const sweeteners = allProducts.filter((p: any) => p.category === 'Sweeteners');
  const combos = allProducts.filter((p: any) => p.category === 'Combo Deals');
  const newProducts = allProducts.filter((p: any) => p.category === 'New');
  const displayProducts = activeCategory === 'Sweeteners' ? sweeteners : activeCategory === 'Combo Deals' ? combos : newProducts;

  return (
    <>
      {/* Hero Slider */}
      <BannerSlider />

      {/* Trust Badges */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center font-bold text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem' }}>Why Choose AMVI Organics</h2>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-0 sm:justify-between">

            {/* Sustainable Farming */}
            <div className="flex flex-col items-center gap-2 w-28">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
                <path d="M20 52 C18 48 16 44 18 40 C20 36 25 36 27 40 L28 44" stroke="#1e4a2a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M28 44 L28 30 C28 27.8 29.8 26 32 26 C34.2 26 36 27.8 36 30 L36 40" stroke="#1e4a2a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M36 32 C36 29.8 37.8 28 40 28 C42.2 28 44 29.8 44 32 L44 40" stroke="#1e4a2a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M44 34 C44 31.8 45.8 30 48 30 C50.2 30 52 31.8 52 34 L52 44" stroke="#1e4a2a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M20 52 C20 56 22 60 28 62 L44 62 C50 62 52 58 52 54 L52 44" stroke="#1e4a2a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M28 62 L28 44" stroke="#1e4a2a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M36 62 L36 40" stroke="#1e4a2a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M44 62 L44 40" stroke="#1e4a2a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M34 26 L34 14" stroke="#c8922a" strokeWidth="1.6" strokeLinecap="round"/>
                <path d="M34 20 C30 18 26 14 28 10 C30 10 34 12 34 18" stroke="#c8922a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <path d="M34 16 C38 14 42 10 40 6 C38 6 34 8 34 14" stroke="#c8922a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
              <span className="text-center text-xs text-gray-600 leading-snug">Sustainable Farming Techniques</span>
            </div>

            {/* Chemical Pesticide-free */}
            <div className="flex flex-col items-center gap-2 w-28">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
                <circle cx="40" cy="38" r="26" stroke="#1e4a2a" strokeWidth="1.8" fill="none"/>
                <line x1="21" y1="57" x2="59" y2="19" stroke="#c8922a" strokeWidth="1.8"/>
                <rect x="36" y="32" width="14" height="18" rx="2" stroke="#1e4a2a" strokeWidth="1.5" fill="none"/>
                <path d="M36 36 L30 36 L28 32 L36 32" stroke="#1e4a2a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 36 L30 40 L34 40" stroke="#1e4a2a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <circle cx="24" cy="30" r="1" fill="#1e4a2a"/>
                <circle cx="21" cy="33" r="1" fill="#1e4a2a"/>
                <circle cx="22" cy="27" r="1" fill="#1e4a2a"/>
                <rect x="40" y="28" width="6" height="4" rx="1" stroke="#1e4a2a" strokeWidth="1.3" fill="none"/>
              </svg>
              <span className="text-center text-xs text-gray-600 leading-snug">Chemical Pesticide-free</span>
            </div>

            {/* Non-GMO */}
            <div className="flex flex-col items-center gap-2 w-28">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
                <circle cx="40" cy="40" r="26" stroke="#1e4a2a" strokeWidth="1.8" fill="none"/>
                <line x1="21" y1="59" x2="59" y2="21" stroke="#c8922a" strokeWidth="1.8"/>
                <rect x="36" y="20" width="8" height="10" rx="1" stroke="#1e4a2a" strokeWidth="1.5" fill="none"/>
                <path d="M36 30 L28 50 L52 50 L44 30 Z" stroke="#1e4a2a" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                <path d="M30 44 L50 44" stroke="#1e4a2a" strokeWidth="1.2"/>
                <circle cx="36" cy="47" r="1.2" fill="#1e4a2a"/>
                <circle cx="43" cy="47" r="1.2" fill="#1e4a2a"/>
                <line x1="36" y1="24" x2="44" y2="24" stroke="#1e4a2a" strokeWidth="1"/>
              </svg>
              <span className="text-center text-xs text-gray-600 leading-snug">Non-GMO Produce</span>
            </div>

            {/* Locally Sourced */}
            <div className="flex flex-col items-center gap-2 w-28">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
                <path d="M40 65 C40 65 20 50 20 32 C20 20 30 14 40 14 C50 14 60 20 60 32 C60 50 40 65 40 65 Z" stroke="#1e4a2a" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="40" y1="65" x2="40" y2="14" stroke="#c8922a" strokeWidth="1.5"/>
                <path d="M40 30 C36 28 30 26 26 24" stroke="#1e4a2a" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M40 38 C35 36 28 34 24 32" stroke="#1e4a2a" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M40 46 C35 44 29 42 25 40" stroke="#1e4a2a" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M40 30 C44 28 50 26 54 24" stroke="#1e4a2a" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M40 38 C45 36 52 34 56 32" stroke="#1e4a2a" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M40 46 C45 44 51 42 55 40" stroke="#1e4a2a" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span className="text-center text-xs text-gray-600 leading-snug">Locally Ethically Sourced</span>
            </div>

            {/* Global Testing */}
            <div className="flex flex-col items-center gap-2 w-28">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
                <circle cx="40" cy="40" r="26" stroke="#1e4a2a" strokeWidth="1.8" fill="none"/>
                <ellipse cx="40" cy="40" rx="13" ry="26" stroke="#1e4a2a" strokeWidth="1.5" fill="none"/>
                <line x1="14" y1="40" x2="66" y2="40" stroke="#c8922a" strokeWidth="1.5"/>
                <path d="M18 26 Q40 30 62 26" stroke="#1e4a2a" strokeWidth="1.3" fill="none"/>
                <path d="M18 54 Q40 50 62 54" stroke="#1e4a2a" strokeWidth="1.3" fill="none"/>
              </svg>
              <span className="text-center text-xs text-gray-600 leading-snug">250 Global Testing Standards</span>
            </div>

          </div>
        </div>
      </section>

      {/* Products Section with Category Tabs */}
      <section id="jaggery" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Our Products</h2>
            <p className="text-gray-600">Pure organic jaggery — natural sweeteners and value combo deals</p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-10">
            <div className="flex bg-gray-100 rounded-full p-1 gap-1">
              {(['Sweeteners', 'Combo Deals', 'New'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-green-700 text-white shadow-md'
                      : 'text-gray-600 hover:text-green-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mounted && displayProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {!mounted && [1,2,3].map(i => (
              <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Brand Poster */}
      <section>
        <Link href="/products">
          <img
            src="/Product images for website/Product images for website/Jaggery _Where Science Meets Tradition_ poster v.png"
            alt="Jaggery - Where Science Meets Tradition"
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </Link>
      </section>

      {/* Certification Carousel */}
      <CertificationCarousel />

      {/* Customer Reviews Carousel */}
      <CustomerReviewsCarousel />
    </>
  );
}

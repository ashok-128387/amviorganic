'use client';

import { Playfair_Display, DM_Sans } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['700'],
  style: ['normal', 'italic']
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600']
});

export default function FAQsPage() {
  return (
    <>
      <div className={dmSans.className}>
        <section className="mko-faq-section">
          {/* LEFT PANEL */}
          <aside className="mko-faq-left">
            <div className="mko-faq-left-top">
              <div className="mko-faq-tag">Help Centre</div>
              <h2 className={`mko-faq-heading ${playfair.className}`}>
                Frequently<br />Asked<br /><em>Questions</em>
              </h2>
              <p className="mko-faq-desc">
                Everything you need to know about our products, orders, and delivery. Can't find the answer? Reach out to us directly.
              </p>

              <div className="mko-faq-contact">
                <div className="mko-faq-contact-label">Still have questions?</div>
                <div className="mko-faq-contact-row">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <a href="mailto:contact@amviorganics.com">contact@amviorganics.com</a>
                </div>
                <div className="mko-faq-contact-row">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 0112 1.18 2 2 0 0114 3.18v3a2 2 0 01-1.8 2 15.86 15.86 0 006.62 6.62 2 2 0 012 -1.8z"/>
                  </svg>
                  <span>+91-8748899100</span>
                </div>
              </div>
            </div>

            <div>
              <div className="mko-faq-deco">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5 C20 5 5 25 5 50 C5 75 25 95 50 95 C50 65 65 35 95 20 C75 8 62 5 50 5Z"/>
                </svg>
              </div>
              <div className="mko-faq-brand">
                <div className={`mko-faq-brand-name ${playfair.className}`}>AMVI ORGANICS</div>
                <div className="mko-faq-brand-tagline">Nature's Trust, Delivered.</div>
              </div>
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <div className="mko-faq-right">
            <div className="mko-faq-count"><span>10</span> Questions Answered</div>

            <div className="mko-faq-list">
              {faqData.map((faq, index) => (
                <details key={index} className="mko-faq-item">
                  <summary className="mko-faq-q">
                    <div className="mko-faq-q-inner">
                      <span className="mko-faq-num">{String(index + 1).padStart(2, '0')}</span>
                      <span className="mko-faq-q-text">{faq.question}</span>
                    </div>
                    <div className="mko-faq-icon">
                      <svg viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </div>
                  </summary>
                  <div className="mko-faq-a" dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(:root) {
          --green: #1e4a2a;
          --green-light: #2a6b3e;
          --gold: #c8922a;
          --bg: #f5f2ed;
          --white: #ffffff;
          --text: #2b2b2b;
          --muted: #6b6b6b;
          --border: #e0dbd3;
        }

        .mko-faq-section {
          display: grid;
          grid-template-columns: 340px 1fr;
          min-height: 100vh;
        }

        .mko-faq-left {
          background: var(--green);
          padding: 64px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .mko-faq-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          border: 1px solid var(--gold);
          padding: 5px 14px;
          border-radius: 999px;
          margin-bottom: 28px;
        }

        .mko-faq-heading {
          font-size: clamp(28px, 3vw, 38px);
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .mko-faq-heading em {
          font-style: italic;
          color: #f0d08a;
        }

        .mko-faq-desc {
          font-size: 14px;
          line-height: 1.75;
          color: rgba(255,255,255,0.65);
          margin-bottom: 40px;
        }

        .mko-faq-contact {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 24px;
        }

        .mko-faq-contact-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 14px;
        }

        .mko-faq-contact-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .mko-faq-contact-row:last-child { 
          margin-bottom: 0; 
        }

        .mko-faq-contact-row svg {
          width: 16px; 
          height: 16px;
          stroke: rgba(255,255,255,0.5);
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          flex-shrink: 0;
        }

        .mko-faq-contact-row a,
        .mko-faq-contact-row span {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
        }

        .mko-faq-contact-row a:hover { 
          color: #fff; 
        }

        .mko-faq-brand {
          margin-top: 40px;
        }

        .mko-faq-brand-name {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.04em;
        }

        .mko-faq-brand-tagline {
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
        }

        .mko-faq-deco {
          margin-top: 32px;
          opacity: 0.12;
        }

        .mko-faq-deco svg {
          width: 80px; 
          height: 80px;
          fill: #fff;
        }

        .mko-faq-right {
          padding: 64px 56px;
          background: var(--bg);
        }

        .mko-faq-count {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 32px;
        }

        .mko-faq-count span { 
          color: var(--green); 
        }

        .mko-faq-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .mko-faq-item {
          border-bottom: 1px solid var(--border);
        }

        .mko-faq-item:first-child {
          border-top: 1px solid var(--border);
        }

        .mko-faq-q {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 4px;
          cursor: pointer;
          user-select: none;
          list-style: none;
        }

        .mko-faq-q::-webkit-details-marker { 
          display: none; 
        }

        .mko-faq-q-inner {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .mko-faq-num {
          font-size: 11px;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 0.06em;
          min-width: 24px;
          padding-top: 2px;
        }

        .mko-faq-q-text {
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.45;
          transition: color 0.2s;
        }

        .mko-faq-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }

        .mko-faq-icon svg {
          width: 14px; 
          height: 14px;
          stroke: var(--muted);
          fill: none;
          stroke-width: 2.2;
          stroke-linecap: round;
          transition: transform 0.35s, stroke 0.2s;
        }

        :global(details[open]) .mko-faq-q-text { 
          color: var(--green); 
        }

        :global(details[open]) .mko-faq-icon {
          background: var(--green);
          border-color: var(--green);
        }

        :global(details[open]) .mko-faq-icon svg {
          stroke: #fff;
          transform: rotate(45deg);
        }

        .mko-faq-a {
          padding: 0 4px 22px 40px;
          font-size: 14px;
          line-height: 1.75;
          color: var(--muted);
          animation: mko-fadein 0.25s ease;
        }

        @keyframes mko-fadein {
          from { 
            opacity: 0; 
            transform: translateY(-6px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @media (max-width: 820px) {
          .mko-faq-section {
            grid-template-columns: 1fr;
            min-height: unset;
          }
          .mko-faq-left {
            position: static;
            height: auto;
            padding: 48px 28px 40px;
          }
          .mko-faq-deco { 
            display: none; 
          }
          .mko-faq-right {
            padding: 40px 20px 60px;
          }
        }
      `}</style>
    </>
  );
}

// FAQ Data
const faqData = [
  {
    question: "What is AMVI ORGANICS?",
    answer: "AMVI ORGANICS is a premium organic food brand offering high-quality products such as Organic Jaggery Powder, Organic Jaggery Cubes, Organic Pulses, and more."
  },
  {
    question: "Are your products organic?",
    answer: "Yes. We are committed to providing authentic organic and naturally sourced food products that meet applicable quality standards."
  },
  {
    question: "Do your products contain chemicals or preservatives?",
    answer: "Our products are carefully sourced and processed to maintain their natural quality. Please refer to the product label for ingredient details."
  },
  {
    question: "Why does the colour of jaggery vary?",
    answer: "Jaggery is a natural product. Its colour may vary depending on the sugarcane variety, harvest season, and processing conditions."
  },
  {
    question: "How should I store your products?",
    answer: "Store products in a cool, dry place away from direct sunlight and moisture. After opening, keep them in an airtight container."
  },
  {
    question: "How do I place an order?",
    answer: "Simply browse our products, add your preferred items to the cart, and complete checkout using your preferred payment method."
  },
  {
    question: "Where do you deliver?",
    answer: "We currently deliver across most serviceable PIN codes in India through our trusted logistics partners."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, tracking details will be shared via email, SMS, or WhatsApp."
  },
  {
    question: "Can I return a food product?",
    answer: "Due to the nature of food products, products are generally non-returnable except in cases of damaged, incorrect, tampered, or missing items."
  },
  {
    question: "How can I contact customer support?",
    answer: 'You can reach us at:<br><br>📧 <a href="mailto:contact@amviorganics.com" style="color:var(--green);text-decoration:none;">contact@amviorganics.com</a><br>📞 <a href="tel:+918748899100" style="color:var(--green);text-decoration:none;">+91-8748899100</a>'
  }
];
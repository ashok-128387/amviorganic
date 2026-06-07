'use client';

import { Playfair_Display, Source_Serif_4 } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['700'],
  style: ['normal', 'italic']
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic']
});

export default function OurProcessPage() {
  return (
    <>
      <div className={`mko-body ${sourceSerif.className}`}>
        <section className="mko-section">
          {/* PAGE HEADING */}
          <h2 className={`mko-heading ${playfair.className}`}>Our Process</h2>
          <div className="mko-divider"></div>

          {/* INTRO PARAGRAPHS */}
          <div className="mko-content">
            <p className="mko-paragraph">
              At AMVI Organics, transparency is our core value. We believe you have the right to know exactly how your food is made. From the sugarcane fields of Karnataka to your kitchen table, every step is chemical-free and rooted in tradition.
            </p>
            <p className="mko-paragraph">
              AMVI Organics began with small-batch production and a question that wouldn't go away: why has something as simple as jaggery become so hard to trust? Industrial sugar replaced jaggery. Sulphur replaced sunlight. Mass production replaced craftsmanship.
            </p>
            <p className="mko-paragraph">
              We started AMVI Organics to bring back the original — single-origin sugarcane, sun-drying yards, and farmers we know by name.
            </p>
          </div>

          {/* PROCESS STEPS */}
          <div className="mko-steps">
            <div className="mko-step">
              <div className={`mko-step-num ${playfair.className}`}>01</div>
              <div>
                <div className={`mko-step-title ${playfair.className}`}>Organic Farming</div>
                <p className="mko-step-text">We source exclusively from certified organic farms, where sugarcane is grown without synthetic pesticides or chemical fertilizers.</p>
              </div>
            </div>
            <div className="mko-step">
              <div className={`mko-step-num ${playfair.className}`}>02</div>
              <div>
                <div className={`mko-step-title ${playfair.className}`}>Juice Extraction</div>
                <p className="mko-step-text">Freshly harvested sugarcane is crushed within hours of harvest to retain its natural sweetness, minerals, and nutritional value.</p>
              </div>
            </div>
            <div className="mko-step">
              <div className={`mko-step-num ${playfair.className}`}>03</div>
              <div>
                <div className={`mko-step-title ${playfair.className}`}>Natural Clarification</div>
                <p className="mko-step-text">Instead of chemical bleaching agents, we use natural herbal clarifiers — such as okra extract — to remove impurities while preserving purity and quality.</p>
              </div>
            </div>
            <div className="mko-step">
              <div className={`mko-step-num ${playfair.className}`}>04</div>
              <div>
                <div className={`mko-step-title ${playfair.className}`}>Hand Molding</div>
                <p className="mko-step-text">The thickened syrup is carefully hand-poured into traditional molds and allowed to cool naturally, forming our signature jaggery cubes.</p>
              </div>
            </div>
          </div>

          {/* OUR PROMISE */}
          <div className="mko-card">
            <h3 className={`mko-card-title ${playfair.className}`}>Our Promise</h3>
            <p style={{fontSize:'0.95rem',color:'#6b6b6b',marginBottom:'22px',fontStyle:'italic'}}>Three things we will never do:</p>
            <ul className="mko-promise-list">
              <li>We will never use sulphur, bleach, or refining agents.</li>
              <li>We will never blend single-origin batches just to ship faster.</li>
              <li>We will never source from farms we have not visited ourselves.</li>
            </ul>
          </div>
        </section>
      </div>

      <style jsx>{`
        .mko-body {
          background-color: #f5f2ed;
          color: #2e3328;
          min-height: 100vh;
          padding: 72px 20px;
        }

        .mko-section {
          max-width: 780px;
          width: 100%;
          margin: 0 auto;
        }

        .mko-heading {
          font-size: 2.6rem;
          font-weight: 700;
          text-align: center;
          color: #1a1f14;
          margin-bottom: 18px;
          letter-spacing: -0.5px;
        }

        .mko-divider {
          width: 100%;
          height: 1px;
          background-color: #c9c4bc;
          margin-bottom: 42px;
        }

        .mko-content {
          display: flex;
          flex-direction: column;
          gap: 28px;
          margin-bottom: 52px;
        }

        .mko-paragraph {
          font-size: 1.08rem;
          line-height: 1.85;
          text-align: center;
          color: #3a3d33;
        }

        .mko-subheading {
          font-size: 1.7rem;
          font-weight: 700;
          color: #1a1f14;
          text-align: center;
          margin-bottom: 14px;
        }

        .mko-sub-divider {
          width: 48px;
          height: 3px;
          background: #1e4a2a;
          border-radius: 2px;
          margin: 0 auto 36px;
        }

        .mko-steps {
          display: flex;
          flex-direction: column;
          margin-bottom: 52px;
        }

        .mko-step {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          padding: 28px 0;
          border-bottom: 1px solid #e4dfd8;
        }

        .mko-step:last-child { 
          border-bottom: none; 
        }

        .mko-step-num {
          font-size: 2rem;
          font-weight: 700;
          color: #c9c4bc;
          line-height: 1;
          min-width: 40px;
          padding-top: 4px;
        }

        .mko-step-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e4a2a;
          margin-bottom: 8px;
        }

        .mko-step-text {
          font-size: 0.98rem;
          line-height: 1.8;
          color: #3a3d33;
        }

        .mko-card {
          background-color: #ffffff;
          border: 1px solid #dedad4;
          border-radius: 10px;
          padding: 40px 48px;
          text-align: center;
          margin-bottom: 52px;
        }

        .mko-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e4a2a;
          margin-bottom: 16px;
          letter-spacing: 0.2px;
        }

        .mko-promise-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
        }

        .mko-promise-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.98rem;
          line-height: 1.7;
          color: #3a3d33;
        }

        .mko-promise-list li::before {
          content: '';
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #1e4a2a;
          flex-shrink: 0;
          margin-top: 8px;
        }

        @media (max-width: 600px) {
          .mko-card { 
            padding: 28px 20px; 
          }
          .mko-heading { 
            font-size: 2rem; 
          }
          .mko-step { 
            gap: 16px; 
          }
        }
      `}</style>
    </>
  );
}
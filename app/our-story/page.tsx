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

export default function OurStoryPage() {
  return (
    <>
      <div className={`mko-body ${sourceSerif.className}`}>
        <section className="mko-section">
          {/* OUR STORY */}
          <h2 className={`mko-heading ${playfair.className}`}>Our Story</h2>
          <div className="mko-divider"></div>
          <div className="mko-content">
            <p className="mko-paragraph">
              AMVI Organics was born from a simple desire to bring the authentic taste of Indian tradition back to every household. At a time when shelves are filled with chemically refined sugars that offer little beyond empty calories, we chose a more honest path.
            </p>
            <p className="mko-paragraph">
              Our journey begins in fertile sugarcane fields where age-old organic farming techniques are still respected and practiced. The sugarcane we grow and source is nurtured naturally, without synthetic fertilizers or pesticides, allowing the soil to remain alive and the sweetness to stay pure.
            </p>
          </div>

          {/* OUR MISSION */}
          <div className="mko-card">
            <h3 className={`mko-card-title ${playfair.className}`}>Our Mission</h3>
            <p className="mko-card-quote">
              "To replace every grain of refined sugar in your kitchen with a healthy, mineral-rich organic alternative."
            </p>
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

        .mko-card-quote {
          font-size: 1.05rem;
          font-style: italic;
          color: #3a3d33;
          line-height: 1.75;
        }

        @media (max-width: 600px) {
          .mko-card { 
            padding: 28px 20px; 
          }
          .mko-heading { 
            font-size: 2rem; 
          }
        }
      `}</style>
    </>
  );
}
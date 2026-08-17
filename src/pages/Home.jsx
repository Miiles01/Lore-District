import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';

// Cadena de color en el fondo al hacer scroll: Obsidiana → Selva → Rosa Neón (tono oscuro) → Obsidiana.
// Los tonos se mantienen oscuros (mezclados con Obsidiana) para que el texto claro siga siendo legible.
const BG_CHAIN = ['#1c1c1f', '#15291d', '#2a1522', '#1c1c1f'];
const BG_STOPS = [0, 0.4, 0.75, 1];

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixColorChain(colors, stops, t) {
  const clamped = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < stops.length - 2 && clamped > stops[i + 1]) i++;
  const localT = (clamped - stops[i]) / (stops[i + 1] - stops[i] || 1);
  const [r1, g1, b1] = hexToRgb(colors[i]);
  const [r2, g2, b2] = hexToRgb(colors[i + 1]);
  const r = Math.round(r1 + (r2 - r1) * localT);
  const g = Math.round(g1 + (g2 - g1) * localT);
  const b = Math.round(b1 + (b2 - b1) * localT);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [featured]);

  const background = mixColorChain(BG_CHAIN, BG_STOPS, progress);

  useEffect(() => {
    api.get('products.php?featured=1').then(setFeatured).catch(() => {});
  }, []);

  return (
    <div style={{ background, transition: 'background-color 0.15s linear' }}>
      <section className="hero" style={styles.heroSection}>
        <div className="hero-content-bottom">
          <h1 style={styles.heroHeadline}>
            La cultura <span style={{ color: 'var(--rosa-neon)' }}>se viste.</span><br />
            La historia continúa.
          </h1>
          <p style={styles.heroSubtext}>Algodón de alto gramaje, bordados de calidad, cultura pop.</p>
          <Link to="/productos" className="btn" style={styles.heroBtn}>
            Ver productos
          </Link>
        </div>
      </section>

      <section className="container" style={{ padding: '60px 20px 40px' }}>
        <p style={styles.eyebrow}>Nuestra colección para ti</p>
        <h2 style={{ marginBottom: '32px' }}>Prendas que cuentan tu historia</h2>

        <div className="carousel-track" style={{ padding: '0 20px 16px', margin: '0 -20px' }}>
          {featured.map((p) => (
            <div key={p.id} className="carousel-item" style={{ minWidth: '260px' }}>
              <ProductCard product={p} />
            </div>
          ))}
          {/* Spacer al final para respetar el margen derecho en navegadores móviles */}
          <div style={{ width: '4px', flexShrink: 0 }}></div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link to="/productos" className="btn btn-cream">Ver toda la colección</Link>
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Newsletter />
      </div>
    </div>
  );
}

const styles = {
  heroSection: {
    position: 'relative',
    overflow: 'hidden',
  },
  heroHeadline: {
    color: 'var(--acero)',
    fontSize: 'clamp(32px, 7vw, 56px)',
    lineHeight: 1.05,
    marginBottom: '16px',
  },
  heroSubtext: {
    color: 'var(--text-soft)',
    fontSize: '16px',
    marginBottom: '24px',
    lineHeight: 1.4,
    fontFamily: 'var(--font)',
    textTransform: 'none',
  },
  heroBtn: {
    background: 'var(--rosa-neon)',
    color: 'var(--obsidiana)',
    borderRadius: '999px',
    padding: '16px 32px',
    border: 'none',
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '16px',
    display: 'inline-flex',
  },
  eyebrow: {
    fontSize: '14px',
    color: 'var(--text-soft)',
    marginBottom: '8px',
    textTransform: 'none',
    fontFamily: 'var(--font)',
  },
  quote: {
    padding: '60px 24px',
    textAlign: 'center',
    background: 'var(--acero)',
  },
  quoteText: {
    fontSize: '26px',
    fontWeight: 400,
    color: 'var(--obsidiana)',
    marginBottom: '10px',
  },
  quoteSub: {
    fontSize: '15px',
    color: 'var(--obsidiana)',
  },
};

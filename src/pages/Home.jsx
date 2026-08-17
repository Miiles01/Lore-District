import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('products.php?featured=1').then(setFeatured).catch(() => {});
  }, []);

  return (
    <div>
      <section className="hero" style={styles.heroSection}>
        <div className="hero-content-top">
          <img src="/brand/logotipo-lore.svg" alt="Lore District" className="hero-wordmark" />
        </div>
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

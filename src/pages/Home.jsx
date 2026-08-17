import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';

// Regla de fondos: solo Obsidiana (negro) o Blanco, nunca otro color (ver DESIGN_SYSTEM.md).
// El home alterna Negro (hero) → Blanco (colección) → Negro (newsletter) conforme cada
// sección cruza el centro de la pantalla. Se usa IntersectionObserver (no scroll listener,
// no depende de cómo el smooth-scroll mueva el scroll) + transición CSS pura en background-color
// y color — así el cambio es siempre fluido, nunca "cortado", sin importar qué tan rápido
// se haga scroll ni si el navegador dispara eventos de scroll de forma irregular.
const OBSIDIANA = '#1c1c1f';
const ACERO = '#f2f2f2';
const BLANCO = '#ffffff';

const SECTIONS = {
  hero: { bg: OBSIDIANA, text: ACERO },
  products: { bg: BLANCO, text: OBSIDIANA },
  newsletter: { bg: OBSIDIANA, text: ACERO },
};

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [active, setActive] = useState('hero');
  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const newsletterRef = useRef(null);

  useEffect(() => {
    api.get('products.php?featured=1').then(setFeatured).catch(() => {});
  }, []);

  useEffect(() => {
    const targets = [
      [heroRef.current, 'hero'],
      [productsRef.current, 'products'],
      [newsletterRef.current, 'newsletter'],
    ].filter(([el]) => el);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = targets.find(([el]) => el === entry.target);
          if (match) setActive(match[1]);
        });
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' }
    );

    targets.forEach(([el]) => observer.observe(el));
    return () => observer.disconnect();
  }, [featured]);

  const { bg, text } = SECTIONS[active];
  const textStyle = { color: text, transition: 'color 0.6s ease' };

  return (
    <div style={{ background: bg, transition: 'background-color 0.6s ease' }}>
      <section ref={heroRef} className="hero" style={styles.heroSection}>
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

      <section ref={productsRef} className="container" style={styles.productsSection}>
        <p style={{ ...styles.eyebrow, ...textStyle }}>Nuestra colección para ti</p>
        <h2 style={{ marginBottom: '32px', ...textStyle }}>Prendas que cuentan tu historia</h2>

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

      <div ref={newsletterRef} style={{ display: 'flex', justifyContent: 'center' }}>
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
  productsSection: {
    padding: 'clamp(56px, 10vw, 120px) 20px clamp(48px, 8vw, 96px)',
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
    marginBottom: '8px',
    textTransform: 'none',
    fontFamily: 'var(--font)',
  },
};

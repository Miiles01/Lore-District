import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';

gsap.registerPlugin(ScrollTrigger);

// Regla de fondos: solo Obsidiana (negro) o Blanco, nunca otro color (ver DESIGN_SYSTEM.md).
// El home alterna Negro (hero) → Blanco (colección) → Negro (newsletter) al hacer scroll,
// con un tween corto y suave en cada punto de cambio (mismo patrón usado en NJB: GSAP
// ScrollTrigger + onEnter/onLeaveBack sobre checkpoints, no un listener de scroll crudo).
// Los elementos con la clase .home-flip-text son controlados por GSAP directamente en el DOM;
// a propósito no se les pasa `color` vía React `style` para que no compitan por la propiedad.
const OBSIDIANA = '#1c1c1f';
const ACERO = '#f2f2f2';
const BLANCO = '#ffffff';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const wrapperRef = useRef(null);
  const productsRef = useRef(null);
  const newsletterRef = useRef(null);

  useEffect(() => {
    api.get('products.php?featured=1')
      .then((data) => {
        setFeatured(data);
        requestAnimationFrame(() => ScrollTrigger.refresh());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      function flip(bg, text) {
        gsap.to(wrapper, { backgroundColor: bg, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.home-flip-text', { color: text, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
      }

      ScrollTrigger.create({
        trigger: productsRef.current,
        start: 'top 75%',
        onEnter: () => flip(BLANCO, OBSIDIANA),
        onLeaveBack: () => flip(OBSIDIANA, ACERO),
      });

      ScrollTrigger.create({
        trigger: newsletterRef.current,
        start: 'top 75%',
        onEnter: () => flip(OBSIDIANA, ACERO),
        onLeaveBack: () => flip(BLANCO, OBSIDIANA),
      });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} style={{ background: OBSIDIANA }}>
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

      <section ref={productsRef} className="container" style={{ padding: '60px 20px 40px' }}>
        <p className="home-flip-text home-eyebrow" style={styles.eyebrow}>Nuestra colección para ti</p>
        <h2 className="home-flip-text" style={{ marginBottom: '32px' }}>Prendas que cuentan tu historia</h2>

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

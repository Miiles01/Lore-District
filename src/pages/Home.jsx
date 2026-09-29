import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScroll, useTransform, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';

gsap.registerPlugin(ScrollTrigger);

// Equivalente al GSAP scrub: true de NJB.
// useScroll({ target }) devuelve scrollYProgress [0..1] dentro de la sección.
// useTransform lo mapea a un color exacto — sin delays, sin CSS transitions,
// sin React state. El color es 1:1 con el scroll, igual que el scrub de GSAP.

const FEATURES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--azul-distrito)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    titulo: 'Alto gramaje',
    texto: 'Algodón 380g que se mantiene, lavado tras lavado.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--rosa-neon)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M8 12s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" /><line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
      </svg>
    ),
    titulo: 'Bordado de calidad',
    texto: 'Alta precisión. Los detalles no se destiñen ni deshilachan.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    titulo: 'Cultura pop',
    texto: 'Íconos de animación, cine de culto y referencias que cuentan historias.',
  },
];

// ─── Sección puente: dark → light ────────────────────────────────────────────
// Esta sección actúa como zona de transición. Su propio fondo pasa de obsidiana
// a blanco al scrollear por ella, jalando también al wrapper padre.
function TransitionBridge({ onColorChange }) {
  const ref = useRef(null);

  // scrollYProgress = 0 cuando el top de la sección llega al 60% del viewport,
  //                 = 1 cuando el bottom sale por arriba — igual que GSAP:
  //                   start: "top 60%", end: "bottom top"
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 60%', 'end start'],
  });

  // Interpolar fondo del wrapper padre (negro → blanco)
  const bgColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['#1c1c1f', '#ffffff']
  );

  // Publicar el motionValue al padre para que lo aplique al wrapper
  useEffect(() => {
    onColorChange(bgColor);
  }, [bgColor, onColorChange]);

  return (
    <section
      ref={ref}
      style={{
        padding: 'clamp(48px, 8vw, 96px) 20px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'clamp(28px, 4vw, 48px)',
        }}
      >
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.titulo}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{
              color: 'var(--rosa-neon)',
              width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(237, 74, 155, 0.12)',
              borderRadius: '10px',
            }}>{f.icon}</div>
            <h3 style={{
              fontSize: '17px', color: 'var(--acero)',
              fontFamily: 'var(--font)', fontWeight: 600,
              margin: 0, textTransform: 'none',
            }}>{f.titulo}</h3>
            <p style={{
              fontSize: '14px', color: 'var(--text-soft)',
              lineHeight: 1.65, fontFamily: 'var(--font)', margin: 0,
            }}>{f.texto}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Sección puente: light → dark ────────────────────────────────────────────
// Eliminada: El newsletter y el footer ahora son blancos, ya no regresamos al modo oscuro.

// ─── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const wrapperRef = useRef(null);
  
  // Refs para animación GSAP (3D Products - MWG 068)
  const gsapRootRef = useRef(null);
  const pinHeightRef = useRef(null);
  const gsapContainerRef = useRef(null);

  // Refs para animación GSAP (Hero - MWG 050)
  const mwgHeroRootRef = useRef(null);
  const mwgHeroPinHeightRef = useRef(null);
  const mwgHeroContainerRef = useRef(null);
  
  // Refs para títulos animados
  const heroTitleRef = useRef(null);
  const productsTitleRef = useRef(null);
  const productsSubtextRef = useRef(null);
  const historyTitleRef = useRef(null);

  // El motionValue activo que controla el fondo — se reemplaza cuando
  // una sección nueva "toma el control"
  const activeBgRef = useRef(null);

  useEffect(() => {
    api.get('products.php?featured=1').then(setFeatured).catch(() => {});
  }, []);

  useLayoutEffect(() => {
    if (featured.length === 0) return;

    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
        const root = gsapRootRef.current;
        const pinHeight = pinHeightRef.current;
        const container = gsapContainerRef.current;
        const medias = gsap.utils.toArray('.media', root);

        if (!root || !pinHeight || !container || medias.length === 0) return;

        // Limpiar animaciones previas en este trigger si las hay (por hot reload)
        ScrollTrigger.getAll().forEach(t => {
          if(t.vars.trigger === root || t.vars.trigger === pinHeight) t.kill();
        });

        const master = gsap.timeline({
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top',
                end: 'bottom bottom',
                pin: container,
                scrub: true
            }
        });

        const isPortrait = window.innerHeight > window.innerWidth;
        const step = (isPortrait ? 1.5 : 1) / medias.length;

        medias.forEach((media, i) => {
            const tl = gsap.timeline();

            tl.fromTo(media, {
                rotateX: -90,
                zIndex: medias.length - i
            }, {
                xPercent: 100,
                x: window.innerWidth,
                rotateX: 90,
                ease: 'power1.inOut',
                duration: 1.1
            });
            tl.set(media, {
                zIndex: 0,
                ease: 'power1.in',
            }, "-=0.55");

            master.add(tl, i * step);
        });
      });

      // MWG 050 Hero Animation (Todas las resoluciones)
      mm.add("(min-width: 0px)", () => {
        const heroRoot = mwgHeroRootRef.current;
        const heroPinHeight = mwgHeroPinHeightRef.current;
        const heroContainer = mwgHeroContainerRef.current;
        
        if (heroRoot && heroPinHeight && heroContainer) {
          const realImages = gsap.utils.toArray('.real-image', heroContainer);
          
          ScrollTrigger.getAll().forEach(t => {
            if(t.vars.trigger === heroRoot || t.vars.trigger === heroPinHeight) t.kill();
          });

          // En el efecto original, el z-index de las imágenes se apila
          realImages.forEach((img, i) => {
              gsap.set(img, { zIndex: i + 1, scale: 0 });
          });
          
          // Arrancamos con la primera imagen (Logo Lore) completamente escalada (1.005)
          gsap.set(realImages[0], { scale: 1.005 });
          
          // Adelantamos la animación de la segunda imagen para que ya se vea un poco en el centro
          gsap.set(realImages[1], { scale: 0.25 });

          // Creamos la línea de tiempo usando los exactos valores del MWG 050
          // (duración larga y solapamiento) y usamos scrub: 2 para simular el quickTo
          const heroMaster = gsap.timeline({
            scrollTrigger: {
              trigger: heroPinHeight,
              start: 'top top',
              end: '+=4000', // Suficiente espacio de scroll para el efecto completo
              pin: heroContainer,
              scrub: 1.5 // Simula la inercia del Observer original
            }
          });

          heroMaster.to(realImages.slice(1), {
            scale: 1.005,
            ease: "expo.inOut",
            duration: 8,
            stagger: 1.2
          });
        }
      });

      // Animación de los títulos con SplitType (MWG Effect 046 Style - Letras Aleatorias)
      const animateTitle = (element) => {
        if (!element) return;
        const split = new SplitType(element, { types: 'words, chars' });
        
        // Hacemos que cada palabra oculte el desbordamiento (overflow hidden)
        // para que las letras parezca que "salen" desde abajo.
        gsap.set(split.words, { overflow: 'hidden', display: 'inline-flex' });
        
        // Función para desordenar el arreglo (shuffle) y que aparezcan al azar
        const shuffleArray = (array) => {
          const arr = [...array];
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          return arr;
        };

        const shuffledChars = shuffleArray(split.chars);
        
        gsap.from(shuffledChars, {
          y: '110%',
          ease: "power4.out",
          duration: 0.8,
          stagger: 0.025, // Velocidad a la que salen las letras
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse", // Se reproduce solo, no depende del scroll
          }
        });
      };

      animateTitle(heroTitleRef.current);
      // Animación para subtextos (Por palabras, fade-up suave)
      const animateSubtext = (element) => {
        if (!element) return;
        const split = new SplitType(element, { types: 'words' });
        
        gsap.from(split.words, {
          opacity: 0,
          y: 15,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none reverse",
          }
        });
      };

      animateTitle(historyTitleRef.current);
      animateTitle(productsTitleRef.current);
      animateSubtext(productsSubtextRef.current);

      // --- Fin de Animaciones ---

    }, wrapperRef);

    return () => ctx.revert();
  }, [featured]);

  // Callback que reciben las secciones puente: registran su motionValue
  // y empiezan a escribir el backgroundColor del wrapper directamente.
  function handleColorChange(motionValue) {
    if (activeBgRef.current) {
      activeBgRef.current.destroy?.();
    }
    // Suscribirse al motionValue y escribir al DOM sin re-renders
    const unsubscribe = motionValue.on('change', (val) => {
      if (wrapperRef.current) {
        wrapperRef.current.style.backgroundColor = val;
      }
    });
    activeBgRef.current = { destroy: unsubscribe };
  }

  return (
    <div ref={wrapperRef} style={{ backgroundColor: '#1c1c1f' }}>

      {/* ── HERO ANIMADO (MWG 050 Style) ── */}
      <section ref={mwgHeroRootRef} className="mwg_effect050" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <div ref={mwgHeroPinHeightRef} className="pin-height" style={{ height: '400vh' }}>
            <div ref={mwgHeroContainerRef} className="mwg-container" style={{ position: 'relative', height: '100vh', width: '100%', display: 'block', zIndex: 1 }}>
                <picture className="real-image">
                  <source media="(max-width: 768px)" srcSet="/covers/mobile/1.png" />
                  <img src="/covers/desktop/1.png" alt="Lore Cover 1" />
                </picture>
                <picture className="real-image">
                  <source media="(max-width: 768px)" srcSet="/covers/mobile/2.png" />
                  <img src="/covers/desktop/2.png" alt="Lore Cover 2" />
                </picture>
                <picture className="real-image">
                  <source media="(max-width: 768px)" srcSet="/covers/mobile/3.png" />
                  <img src="/covers/desktop/3.png" alt="Lore Cover 3" />
                </picture>
                <picture className="real-image">
                  <source media="(max-width: 768px)" srcSet="/covers/mobile/4.png" />
                  <img src="/covers/desktop/4.png" alt="Lore Cover 4" />
                </picture>
            </div>
        </div>
      </section>

      {/* ── NUESTRA HISTORIA ── */}
      <section style={{ padding: 'clamp(80px, 10vw, 160px) 20px', textAlign: 'center', background: 'transparent' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '14px', marginBottom: '16px', color: 'rgba(242, 242, 242, 0.65)', fontFamily: 'var(--font)' }}>Nuestra historia</p>
          <h2 ref={historyTitleRef} style={styles.heroHeadline}>
            La cultura<br />
            <span style={{ color: 'var(--rosa-neon)' }}>se viste.</span><br />
            La historia<br />
            continúa.
          </h2>
        </div>
      </section>

      {/* ── FEATURES: zona de transición dark → light, controlada por scrub ── */}
      <TransitionBridge onColorChange={handleColorChange} />

      {/* ── PRODUCTOS DESTACADOS (transparent, hereda el fondo animado del wrapper) ── */}
      <section className="productos-destacados-section" style={{ paddingTop: 'clamp(56px, 10vw, 120px)' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={styles.eyebrow}>Nuestra colección para ti</p>
          <h2 ref={productsTitleRef} style={{ color: '#1c1c1f', fontSize: 'clamp(32px, 6vw, 72px)' }}>
            Prendas que cuentan tu historia
          </h2>
        </div>

        {/* --- Mobile Carousel --- */}
        <div className="mobile-only-carousel">
          <div className="carousel-track" style={{ padding: '0 20px 16px', margin: '0' }}>
            {featured.map((p) => (
              <div key={p.id} className="carousel-item" style={{ minWidth: '260px' }}>
                <ProductCard product={p} />
              </div>
            ))}
            <div style={{ width: '4px', flexShrink: 0 }} />
          </div>
        </div>

        {/* --- Desktop GSAP Animation --- */}
        <div className="desktop-only-gsap mwg_effect068" ref={gsapRootRef}>
          <div className="pin-height" ref={pinHeightRef}>
              <div className="gsap-container" ref={gsapContainerRef}>
                  {featured.map((p) => (
                      <div key={p.id} className="media">
                          <ProductCard product={p} />
                      </div>
                  ))}
              </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 'clamp(48px, 8vw, 96px)', marginTop: '60px' }}>
          <p ref={productsSubtextRef} style={{ 
            fontSize: '15px', 
            color: 'rgba(28,28,31,0.65)', 
            fontFamily: 'var(--font)', 
            maxWidth: '380px', 
            margin: '0 auto 30px',
            lineHeight: 1.5
          }}>
            Hay más historias esperando por ti. Explora todos nuestros diseños y encuentra tu próxima pieza favorita.
          </p>
          <Link to="/productos" className="btn btn-cream">Ver toda la colección</Link>
        </div>
      </section>

      {/* ── NEWSLETTER (transparent, hereda el fondo del wrapper) ── */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Newsletter />
      </div>

    </div>
  );
}

const styles = {
  heroSection: { position: 'relative', overflow: 'hidden' },
  heroBgWrap:  { position: 'absolute', inset: 0, zIndex: 0 },
  heroBgImg: {
    width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'center 20%', display: 'block',
  },
  heroBgOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(28,28,31,0.97) 25%, rgba(28,28,31,0.55) 65%, rgba(28,28,31,0.3) 100%)',
  },
  heroHeadline: {
    color: 'var(--acero)',
    fontSize: 'clamp(32px, 7vw, 56px)',
    lineHeight: 1.05, marginBottom: '16px',
  },
  heroSubtext: {
    color: 'rgba(242, 242, 242, 0.75)',
    fontSize: '16px', marginBottom: '24px',
    lineHeight: 1.4, fontFamily: 'var(--font)', textTransform: 'none',
  },
  heroBtn: {
    background: 'var(--rosa-neon)', color: 'var(--obsidiana)',
    borderRadius: '999px', padding: '16px 32px',
    border: 'none', textTransform: 'none',
    fontWeight: 700, fontSize: '16px', display: 'inline-flex',
  },
  eyebrow: {
    fontSize: '14px', marginBottom: '8px', color: 'rgba(28,28,31,0.5)',
    textTransform: 'none', fontFamily: 'var(--font)',
  },
};

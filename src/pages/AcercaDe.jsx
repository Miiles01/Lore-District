import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import TimelineHistory from '../components/TimelineHistory';

gsap.registerPlugin(ScrollTrigger);

const VALORES = ['Calidad duradera', 'Identidad personal', 'Cultura pop', 'Accesibilidad'];

const PILARES = [
  {
    nombre: 'Creativa',
    color: 'var(--rosa-neon)',
    texto: 'Diseños que mezclan nostalgia y cultura pop con técnica artesanal. Recontextualizamos referencias de cine de culto y animación clásica bajo procesos de bordado complejos de alta precisión.',
  },
  {
    nombre: 'Audaz',
    color: 'var(--azul-distrito)',
    texto: 'Sin miedo a lo diferente: cada prenda es una declaración de intenciones. Los cortes sobredimensionados y los parches masivos rompen el molde de la moda masiva.',
  },
  {
    nombre: 'Cercana',
    color: 'var(--selva)',
    texto: 'Hablamos tu idioma, compartimos tus referencias. Construimos comunidad alrededor de la pasión por los motores, la animación de culto y la nostalgia que nos formó.',
  },
];

export default function AcercaDe() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. Animación tipo Effect 046 (Letras aleatorias saliendo) para los títulos principales
      const animateTitle = (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          const split = new SplitType(element, { types: 'words, chars' });
          gsap.set(split.words, { overflow: 'hidden', display: 'inline-flex' });
          
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
            stagger: 0.025,
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          });
        });
      };

      // 2. Animación de palabras (Fade up suave) para párrafos
      const animateWords = (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          const split = new SplitType(element, { types: 'words' });
          gsap.from(split.words, {
            opacity: 0,
            y: 15,
            stagger: 0.03,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none reverse",
            }
          });
        });
      };

      // 3. Animación de tarjetas (Stagger fade up)
      const animateCards = (selector) => {
        const cards = document.querySelectorAll(selector);
        if (cards.length === 0) return;
        
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        });
      };

      // Ejecutar animaciones
      animateTitle('.gsap-title');
      animateWords('.gsap-text');
      animateCards('.gsap-card-mvv');
      animateCards('.gsap-card-pilar');

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ paddingBottom: '120px' }}>
      
      {/* Intro Gigante */}
      <section className="container" style={{ 
          textAlign: 'center', 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '80px'
      }}>
        <h1 className="gsap-title" style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 1.05, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--acero)', letterSpacing: '-0.02em', marginBottom: '40px' }}>
          Lore District
        </h1>
        <p className="gsap-text" style={{ fontSize: 'clamp(20px, 3.5vw, 40px)', color: 'var(--text-soft)', lineHeight: 1.4, maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font)' }}>
          Lore District nace para ofrecer prendas de algodón de alto gramaje con bordados de calidad, 
          inspiradas en <span style={{ color: 'var(--rosa-neon)' }}>cultura popular, íconos y estética caricaturesca</span> — con la intención de que cada 
          prenda sea duradera y cuente una historia.
        </p>
      </section>

      {/* Timeline Animado */}
      <TimelineHistory />

      {/* Misión / Visión / Valores */}
      <section className="container" style={{ ...styles.grid, marginTop: '120px' }}>
        <div className="gsap-card-mvv" style={styles.card}>
          <p style={styles.cardEyebrow}>Misión</p>
          <p className="gsap-text" style={styles.cardText}>
            Ofrecer prendas de algodón de alto gramaje con bordados de calidad inspirados en cultura pop,
            a un precio justo, diseñadas para durar y para que cada persona vista su identidad.
          </p>
        </div>
        <div className="gsap-card-mvv" style={styles.card}>
          <p style={styles.cardEyebrow}>Visión</p>
          <p className="gsap-text" style={styles.cardText}>
            Ser la marca de referencia en comercio electrónico de ropa urbana bordada en México,
            reconocida por su calidad excepcional y su estilo inconfundible.
          </p>
        </div>
        <div className="gsap-card-mvv" style={styles.card}>
          <p style={styles.cardEyebrow}>Valores</p>
          <ul style={styles.valuesList}>
            {VALORES.map((v) => (
              <li key={v} style={styles.valueItem}>
                <span className="gsap-text">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Lo que nos mueve */}
      <section className="container" style={{ marginTop: '200px' }}>
        <h2 className="gsap-title" style={{ fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.1, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--acero)', letterSpacing: '-0.02em', marginBottom: '48px', textAlign: 'center' }}>
          Lo que nos mueve
        </h2>
        <div style={styles.pilaresGrid}>
          {PILARES.map((p) => (
            <div key={p.nombre} className="gsap-card-pilar" style={styles.pilarCard}>
              <p style={styles.pilarNombre}>{p.nombre}</p>
              <p className="gsap-text" style={styles.cardText}>{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', marginTop: '160px' }}>
        <Link to="/productos" className="btn btn-primary" style={{ borderRadius: '999px', padding: '20px 48px', textTransform: 'none', fontWeight: 700, fontSize: '18px' }}>
          Explorar prendas
        </Link>
      </section>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
  },
  card: {
    padding: '0',
  },
  cardEyebrow: {
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '16px',
    fontFamily: 'var(--font)',
    color: 'var(--acero)',
  },
  cardText: {
    fontSize: '18px',
    lineHeight: 1.6,
    color: 'var(--text-soft)',
    fontFamily: 'var(--font)',
    margin: 0,
  },
  valuesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  valueItem: {
    fontSize: '18px',
    color: 'var(--text-soft)',
    fontFamily: 'var(--font)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  pilaresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
  },
  pilarCard: {
    padding: '0',
    position: 'relative',
  },
  pilarNombre: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: '24px',
    textTransform: 'uppercase',
    marginBottom: '16px',
    letterSpacing: '0.02em',
    color: 'var(--acero)',
  },
};

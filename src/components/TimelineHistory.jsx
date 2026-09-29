import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_DATA = [
  {
    year: '2023',
    label: '01/ Orígenes',
    title: 'El primer hilo',
    content: 'Lore District nació en un pequeño estudio, buscando la camiseta de algodón pesado perfecta. La nostalgia por la animación de los 90s y el cine de culto nos llevó a crear los primeros parches.',
    bgColor: 'var(--obsidiana)',
    textColor: 'var(--text-soft)',
    mainTitleColor: 'var(--acero)',
    labelColor: 'var(--rosa-neon)',
    giantColor: 'rgba(242, 242, 242, 0.03)',
  },
  {
    year: '2024',
    label: '02/ Evolución',
    title: 'Bordados masivos',
    content: 'Comenzamos a experimentar con procesos de bordado complejos de alta precisión. Las prendas dejaron de ser simples camisetas para convertirse en lienzos duraderos.',
    bgColor: 'var(--azul-distrito)',
    textColor: 'var(--acero)',
    mainTitleColor: 'var(--acero)',
    labelColor: 'var(--obsidiana)',
    giantColor: 'rgba(242, 242, 242, 0.15)',
  },
  {
    year: '2025',
    label: '03/ Comunidad',
    title: 'Cultura en las calles',
    content: 'Lanzamos nuestra primera colección oficial. La respuesta fue increíble. Construimos una comunidad unida por el amor a los cortes sobredimensionados y las referencias compartidas.',
    bgColor: 'var(--selva)',
    textColor: 'var(--acero)',
    mainTitleColor: 'var(--acero)',
    labelColor: 'var(--rosa-neon)',
    giantColor: 'rgba(242, 242, 242, 0.08)',
  },
  {
    year: '2026',
    label: '04/ Futuro',
    title: 'La historia continúa',
    content: 'Seguimos redefiniendo la moda urbana en México. Nuevas colaboraciones, mejores materiales y la misma audacia que nos vio nacer.',
    bgColor: 'var(--rosa-neon)',
    textColor: 'var(--obsidiana)',
    mainTitleColor: 'var(--obsidiana)',
    labelColor: 'var(--obsidiana)',
    giantColor: 'rgba(28, 28, 31, 0.1)',
  }
];

export default function TimelineHistory() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const pinHeight = document.querySelector('.mwg_effect073 .pin-height');
      const container = document.querySelector('.mwg_effect073 .container-anim');
      const titles = gsap.utils.toArray('.mwg_effect073 .title-anim');

      let mm = gsap.matchMedia();

      // Animación original (Horizontal + Rotación) solo en Desktop
      mm.add("(min-width: 769px)", () => {
        const scrollTween = gsap.to(container, {
            xPercent: -100,
            x: window.innerWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top',
                end: 'bottom bottom',
                pin: container,
                scrub: true
            }
        });

        titles.forEach(title => {
            gsap.to(title, {
                rotation: -90,
                x: window.innerWidth - title.offsetHeight,
                y: title.offsetHeight,
                ease: 'expo.inOut',
                scrollTrigger: {
                    trigger: title.parentNode,
                    containerAnimation: scrollTween,
                    start: 'left 0%',
                    end: 'left -100%',
                    scrub: true
                }
            });
            gsap.from(title, {
                rotation: 90,
                y: -window.innerHeight + title.offsetHeight,
                x: title.offsetHeight,
                ease: 'expo.inOut',
                scrollTrigger: {
                    trigger: title.parentNode,
                    containerAnimation: scrollTween,
                    start: 'left 100%',
                    end: 'left 0%',
                    scrub: true
                }
            });
        });
      });

      // En mobile, simplemente animamos las tarjetas apareciendo hacia arriba
      mm.add("(max-width: 768px)", () => {
         const sections = gsap.utils.toArray('.mwg_effect073 .section-anim');
         sections.forEach(sec => {
            gsap.from(sec, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sec,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
         });
      });

    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="mwg_effect073" ref={rootRef}>
        {/* Utilizamos 400vh porque son 4 secciones (100vh por sección) */}
        <div className="pin-height" style={{ height: '400vh', overflow: 'hidden' }}>
            <div className="container-anim" style={{ position: 'relative', height: '100vh', width: 'max-content', display: 'flex' }}>
                
                {/* Intro Section */}
                <div className="section-anim" style={{ backgroundColor: TIMELINE_DATA[0].bgColor }}>
                    <div className="left">
                        <p className="main-title" style={{ color: TIMELINE_DATA[0].mainTitleColor }}>Una breve<br/>historia del<br/>Distrito</p>
                        <p className="label" style={{ color: TIMELINE_DATA[0].textColor }}>Desliza para explorar</p>
                    </div>
                    <div className="right">
                        <p className="label" style={{ color: TIMELINE_DATA[0].labelColor }}>{TIMELINE_DATA[0].label}</p>
                        <p className="content" style={{ color: TIMELINE_DATA[0].textColor }}>{TIMELINE_DATA[0].content}</p>
                    </div>
                    <p className="title-anim" style={{ color: TIMELINE_DATA[0].giantColor }}>{TIMELINE_DATA[0].year}</p>
                </div>

                {/* Rest of the Sections */}
                {TIMELINE_DATA.slice(1).map((data, index) => (
                  <div className="section-anim" key={data.year} style={{ backgroundColor: data.bgColor }}>
                      <div className="left"></div>
                      <div className="right">
                          <p className="label" style={{ color: data.labelColor }}>{data.label}</p>
                          <p className="content" style={{ color: data.textColor }}>{data.content}</p>
                      </div>
                      <p className="title-anim" style={{ color: data.giantColor }}>{data.year}</p>
                  </div>
                ))}

            </div>
        </div>
    </section>
  );
}

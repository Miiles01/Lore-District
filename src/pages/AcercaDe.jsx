import { Link } from 'react-router-dom';

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
  return (
    <div style={{ paddingTop: '110px', paddingBottom: '60px' }}>
      <section className="container" style={{ marginBottom: '56px' }}>
        <p style={styles.eyebrow}>Nuestra historia</p>
        <h1 style={styles.headline}>
          La cultura <span style={{ color: 'var(--rosa-neon)' }}>se viste.</span><br />
          La historia continúa.
        </h1>
        <p style={styles.lead}>
          Lore District nace para ofrecer prendas de algodón de alto gramaje con bordados de calidad,
          inspiradas en cultura popular, íconos y estética caricaturesca — con la intención de que cada
          prenda sea duradera y cuente una historia.
        </p>
      </section>

      <section className="container" style={styles.grid}>
        <div style={styles.card}>
          <p style={{ ...styles.cardEyebrow, color: 'var(--rosa-neon)' }}>Misión</p>
          <p style={styles.cardText}>
            Ofrecer prendas de algodón de alto gramaje con bordados de calidad inspirados en cultura pop,
            a un precio justo, diseñadas para durar y para que cada persona vista su identidad.
          </p>
        </div>
        <div style={styles.card}>
          <p style={{ ...styles.cardEyebrow, color: 'var(--azul-distrito)' }}>Visión</p>
          <p style={styles.cardText}>
            Ser la marca de referencia en comercio electrónico de ropa urbana bordada en México,
            reconocida por su calidad excepcional y su estilo inconfundible.
          </p>
        </div>
        <div style={styles.card}>
          <p style={{ ...styles.cardEyebrow, color: 'var(--selva)' }}>Valores</p>
          <ul style={styles.valuesList}>
            {VALORES.map((v) => (
              <li key={v} style={styles.valueItem}>{v}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container" style={{ marginTop: '64px' }}>
        <h2 style={{ marginBottom: '28px' }}>Lo que nos mueve</h2>
        <div style={styles.pilaresGrid}>
          {PILARES.map((p) => (
            <div key={p.nombre} style={styles.pilarCard}>
              <p style={{ ...styles.pilarNombre, color: p.color }}>{p.nombre}</p>
              <p style={styles.cardText}>{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', marginTop: '64px' }}>
        <Link to="/productos" className="btn btn-primary" style={{ borderRadius: '999px', padding: '16px 32px' }}>
          Ver productos
        </Link>
      </section>
    </div>
  );
}

const styles = {
  eyebrow: {
    fontSize: '14px',
    color: 'var(--text-soft)',
    marginBottom: '10px',
    textTransform: 'none',
    fontFamily: 'var(--font)',
  },
  headline: {
    fontSize: 'clamp(32px, 6vw, 48px)',
    lineHeight: 1.08,
    marginBottom: '20px',
  },
  lead: {
    fontSize: '16px',
    color: 'var(--text-soft)',
    lineHeight: 1.6,
    maxWidth: '640px',
    fontFamily: 'var(--font)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#242428',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
  },
  cardEyebrow: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '12px',
    fontFamily: 'var(--font)',
  },
  cardText: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: 'var(--acero)',
    fontFamily: 'var(--font)',
  },
  valuesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  valueItem: {
    fontSize: '14px',
    color: 'var(--acero)',
    fontFamily: 'var(--font)',
  },
  pilaresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
  },
  pilarCard: {
    background: '#242428',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
  },
  pilarNombre: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '18px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
};

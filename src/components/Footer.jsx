export default function Footer() {
  return (
    <footer className="site-footer" style={styles.footer}>
      <div style={styles.logoRow}>
        <img src="/brand/logotipo-lore.svg" alt="Lore" style={styles.logo} />
        <span style={styles.district}>DISTRICT</span>
      </div>
      <p style={styles.text}>La cultura se viste. La historia continúa.</p>
      <p style={styles.small}>Envíos en México · © 2026 Lore District</p>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    background: 'var(--obsidiana)',
    color: 'var(--text)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    margin: '0 auto 48px',
  },
  logo: {
    width: 'min(60%, 320px)',
    height: 'auto',
    display: 'block',
  },
  district: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '14px',
    letterSpacing: '0.35em',
    color: 'var(--acero)',
  },
  text: {
    fontSize: '16px',
    marginBottom: '16px',
    color: 'var(--acero)',
  },

  small: {
    fontSize: '12px',
    opacity: 0.6,
  },
};

import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/loredistrict',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@loredistrict',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M14 3c0 2.8 2.2 5 5 5" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="site-footer" style={styles.footer}>
      <img src="/brand/logotipo-lore-district.svg" alt="Lore District" style={styles.logo} />
      <p style={styles.text}>La cultura se viste. La historia continúa.</p>

      <div style={styles.socialRow}>
        {SOCIAL_LINKS.map((s) => (
          <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} style={styles.socialLink}>
            {s.icon}
          </a>
        ))}
      </div>

      <div style={styles.legalRow}>
        <Link to="/terminos-y-condiciones" style={styles.legalLink}>Términos y condiciones</Link>
        <span style={styles.legalDot}>·</span>
        <Link to="/politica-de-privacidad" style={styles.legalLink}>Política de privacidad</Link>
      </div>

      <p style={styles.small}>Envíos en México · © 2026 Lore District</p>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    background: '#ffffff',
    color: '#1c1c1f',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 'min(50%, 260px)',
    height: 'auto',
    display: 'block',
    margin: '0 auto 48px',
  },
  text: {
    fontSize: '16px',
    marginBottom: '24px',
    color: '#1c1c1f',
  },
  socialRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  },
  socialLink: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid rgba(28, 28, 31, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1c1c1f',
    transition: 'background 0.15s, color 0.15s',
  },
  legalRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legalLink: {
    fontSize: '13px',
    color: 'rgba(28, 28, 31, 0.7)',
    textDecoration: 'underline',
  },
  legalDot: {
    fontSize: '13px',
    color: 'rgba(28, 28, 31, 0.4)',
  },
  small: {
    fontSize: '12px',
    opacity: 0.6,
    color: '#1c1c1f',
  },
};

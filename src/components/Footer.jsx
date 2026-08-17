import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';

export default function Footer() {
  return (
    <footer className="site-footer" style={styles.footer}>
      <img src="/brand/logotipo-lore-district.svg" alt="Lore District" style={styles.logo} />
      <p style={styles.text}>La cultura se viste. La historia continúa.</p>

      <SocialLinks containerStyle={styles.socialRow} linkStyle={styles.socialLink} />

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
    width: 'min(85%, 440px)',
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

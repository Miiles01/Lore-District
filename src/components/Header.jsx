import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import SocialLinks from './SocialLinks';

export default function Header() {
  const { count, setDrawerOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
      if (menuOpen) {
          document.body.style.overflow = "hidden";
      } else {
          document.body.style.overflow = "";
      }
      return () => {
          document.body.style.overflow = "";
      };
  }, [menuOpen]);

  // Framer Motion Transforms
  const widthRange = useTransform(scrollY, [0, 100], ["100%", "50%"]);
  const mobileWidthRange = useTransform(scrollY, [0, 100], ["100%", "96%"]);
  const borderRadiusRange = useTransform(scrollY, [0, 100], [0, 50]);
  const topRange = useTransform(scrollY, [0, 100], [0, 20]);
  
  // Fondo de transparente a Obsidiana sólida al hacer scroll: solo en el home, donde el header
  // se monta sobre el hero oscuro. En el resto de páginas (algunas con fondo blanco, ej. /productos)
  // el header es siempre sólido para no perder contraste con los íconos.
  const bgOpacityBase = useTransform(scrollY, [0, 50], [0, 1]);

  const springConfig = { stiffness: 400, damping: 40 };
  const animatedDesktopWidth = useSpring(widthRange, springConfig);
  const animatedMobileWidth = useSpring(mobileWidthRange, springConfig);
  const animatedRadius = useSpring(borderRadiusRange, springConfig);
  const animatedTop = useSpring(topRange, springConfig);

  const backgroundColor = useTransform(bgOpacityBase, (o) => `rgba(28, 28, 31, ${isHome ? o : 1})`);
  const backdropFilter = "none";
  const textColor = "#f2f2f2";
  const logoFilter = "none";
  const logoOpacity = 1;

  return (
    <>
      <motion.header
        style={{
            width: isMobile ? animatedMobileWidth : animatedDesktopWidth,
            borderRadius: animatedRadius,
            top: animatedTop,
            backgroundColor,
            backdropFilter,
            borderColor: 'transparent',
            position: 'fixed',
            left: '50%',
            x: '-50%',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            overflow: 'hidden', // Para contener el fondo blanco
        }}
        transition={{ duration: 0.3 }}
      >

        <motion.button
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((v) => !v)}
          style={{ background: 'none', border: 'none', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px' }}
          animate={{ color: textColor }}
          transition={{ duration: 0.3 }}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </motion.button>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', zIndex: 1 }} aria-label="Inicio">
          <motion.img
            src="/brand/logotipo-lore.svg"
            alt="Lore"
            style={{ height: '24px', opacity: logoOpacity }}
            animate={{ filter: logoFilter }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        <div style={{ display: 'flex', gap: '6px', zIndex: 1 }}>
          <motion.button
            aria-label={user ? 'Mi cuenta' : 'Iniciar sesión'}
            onClick={() => navigate(user ? '/cuenta' : '/iniciar-sesion')}
            style={{ background: 'none', border: 'none', padding: '6px', display: 'flex' }}
            animate={{ color: textColor }}
            transition={{ duration: 0.3 }}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </motion.button>
          <motion.button 
            aria-label="Carrito" 
            onClick={() => setDrawerOpen(true)} 
            style={{ background: 'none', border: 'none', padding: '6px', display: 'flex', position: 'relative' }}
            animate={{ color: textColor }}
            transition={{ duration: 0.3 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 8h12l-1.2 11a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            {count > 0 && <span className="header-badge" style={{ position: 'absolute', top: 0, right: 0, background: 'var(--charcoal)', color: '#fff', borderRadius: '999px', fontSize: '10px', minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{count}</span>}
          </motion.button>
        </div>
      </motion.header>

      {/* Menú desplegable: panel que cubre la mitad de la pantalla, no fullscreen */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
                onClick={() => setMenuOpen(false)}
                style={{
                    position: 'fixed', inset: 0, height: '100svh', width: '100%',
                    background: 'transparent', zIndex: 190, cursor: 'pointer'
                }}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: -15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'fixed', 
                    left: '50%',
                    x: '-50%',
                    top: animatedTop,
                    marginTop: '68px', // Espacio para el navbar (altura aprox 54px + gap 14px)
                    width: isMobile ? animatedMobileWidth : animatedDesktopWidth,
                    maxHeight: 'calc(100vh - 100px)',
                    backgroundColor: 'rgba(28, 28, 31, 0.85)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    zIndex: 200, 
                    display: 'flex', 
                    flexDirection: 'column',
                    overflowY: 'auto', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '32px',
                    boxShadow: '0 24px 70px rgba(0,0,0,0.4)',
                }}
            >
                <motion.div
                    className="menu-columns"
                    style={{ paddingTop: '40px', paddingBottom: '40px' }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } }
                    }}
                >
                    <nav style={styles.menuColNav}>
                        <MenuItem to="/" onClick={() => setMenuOpen(false)}>Inicio</MenuItem>
                        <MenuItem to="/productos" onClick={() => setMenuOpen(false)}>Productos</MenuItem>
                        <MenuItem to="/acerca-de" onClick={() => setMenuOpen(false)}>Acerca de</MenuItem>
                        <MenuItem to={user ? '/cuenta' : '/iniciar-sesion'} onClick={() => setMenuOpen(false)}>
                            {user ? 'Mi cuenta' : 'Iniciar sesión'}
                        </MenuItem>
                    </nav>

                    <div style={styles.menuColLegal}>
                        <MenuItem to="/politica-de-privacidad" small onClick={() => setMenuOpen(false)}>Política de privacidad</MenuItem>
                        <MenuItem to="/terminos-y-condiciones" small onClick={() => setMenuOpen(false)}>Términos y condiciones</MenuItem>
                        <motion.div variants={itemVariants}>
                            <SocialLinks containerStyle={styles.menuSocialRow} linkStyle={styles.menuSocialLink} />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const itemVariants = {
    hidden: { opacity: 0, x: -16, filter: 'blur(4px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

function MenuItem({ to, onClick, small, children }) {
    return (
        <motion.div variants={itemVariants}>
            <Link to={to} onClick={onClick} style={small ? legalLinkStyle : mobileMenuLinkStyle}>{children}</Link>
        </motion.div>
    );
}

const mobileMenuLinkStyle = {
    fontSize: 'clamp(28px, 5vw, 42px)',
    fontFamily: 'var(--font)',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    color: 'var(--acero)',
    display: 'block',
    textDecoration: 'none',
    transition: 'opacity 0.2s',
};

const legalLinkStyle = {
    fontSize: '14px',
    fontFamily: 'var(--font)',
    fontWeight: 400,
    color: 'var(--text-soft)',
    display: 'block',
    textDecoration: 'none',
};

const styles = {
    menuColNav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
    },
    menuColLegal: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    menuSocialRow: {
        display: 'flex',
        gap: '10px',
        marginTop: '8px',
    },
    menuSocialLink: {
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--acero)',
    },
};

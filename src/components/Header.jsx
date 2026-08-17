import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

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
  
  // Fondo de transparente a Obsidiana sólida al hacer scroll (tema oscuro)
  const bgOpacityBase = useTransform(scrollY, [0, 50], [0, 1]);

  const springConfig = { stiffness: 400, damping: 40 };
  const animatedDesktopWidth = useSpring(widthRange, springConfig);
  const animatedMobileWidth = useSpring(mobileWidthRange, springConfig);
  const animatedRadius = useSpring(borderRadiusRange, springConfig);
  const animatedTop = useSpring(topRange, springConfig);

  const backgroundColor = useTransform(bgOpacityBase, (o) => `rgba(28, 28, 31, ${o})`);
  const backdropFilter = "none";
  const borderColor = "transparent";
  const textColor = "#f2f2f2";
  const logoOpacity = 1;
  const logoFilter = "none";

  return (
    <>
      <motion.header
        style={{
            width: isMobile ? animatedMobileWidth : animatedDesktopWidth,
            borderRadius: animatedRadius,
            top: animatedTop,
            backgroundColor,
            backdropFilter,
            borderColor,
            position: 'fixed',
            left: '50%',
            x: '-50%',
            zIndex: 100,
            borderWidth: '1px',
            borderStyle: 'solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
        }}
      >
        <motion.button
          aria-label="Menú"
          onClick={() => setMenuOpen((v) => !v)}
          style={{ background: 'none', border: 'none', color: textColor, padding: '6px', display: 'flex' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </motion.button>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} aria-label="Inicio">
          <motion.img
            src="/brand/logotipo-lore.svg"
            alt="Lore"
            style={{ height: '22px', filter: logoFilter, opacity: logoOpacity }}
          />
          <motion.span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: textColor,
              opacity: logoOpacity,
            }}
          >
            DISTRICT
          </motion.span>
        </Link>

        <div style={{ display: 'flex', gap: '6px' }}>
          <motion.button
            aria-label={user ? 'Mi cuenta' : 'Iniciar sesión'}
            onClick={() => navigate(user ? '/cuenta' : '/iniciar-sesion')}
            style={{ background: 'none', border: 'none', color: textColor, padding: '6px', display: 'flex' }}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </motion.button>
          <motion.button 
            aria-label="Carrito" 
            onClick={() => setDrawerOpen(true)} 
            style={{ background: 'none', border: 'none', color: textColor, padding: '6px', display: 'flex', position: 'relative' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 8h12l-1.2 11a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            {count > 0 && <span className="header-badge" style={{ position: 'absolute', top: 0, right: 0, background: 'var(--charcoal)', color: '#fff', borderRadius: '999px', fontSize: '10px', minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{count}</span>}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu Full Screen Overlay - Replicating Vibe Weaver */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                  position: 'fixed', inset: 0, minHeight: '100svh', width: '100%', top: 0, left: 0,
                  backgroundColor: 'var(--obsidiana)', zIndex: 200, display: 'flex', flexDirection: 'column',
                  overflowY: 'auto', pointerEvents: 'auto'
              }}
          >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', width: '100%', marginTop: '16px' }}>
                  <img src="/brand/logotipo-lore.svg" alt="Lore District" style={{ height: '30px' }} />
                  <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', fontWeight: 500, color: 'var(--acero)' }}>
                      Cerrar
                  </button>
              </div>
              
              <motion.div 
                  style={{ display: 'flex', flexDirection: 'column', marginTop: '80px', padding: '0 32px', gap: '32px', perspective: '1000px' }}
                  initial="hidden"
                  animate="visible"
                  variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                  }}
              >
                  <motion.div variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
                  }}>
                      <Link to="/" onClick={() => setMenuOpen(false)} style={mobileMenuLinkStyle}>Inicio</Link>
                  </motion.div>
                  <motion.div variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
                  }}>
                      <Link to="/productos" onClick={() => setMenuOpen(false)} style={mobileMenuLinkStyle}>Productos</Link>
                  </motion.div>
                  <motion.div variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
                  }}>
                      {user ? (
                        <Link to="/cuenta" onClick={() => setMenuOpen(false)} style={mobileMenuLinkStyle}>Mi cuenta</Link>
                      ) : (
                        <Link to="/iniciar-sesion" onClick={() => setMenuOpen(false)} style={mobileMenuLinkStyle}>Iniciar sesión</Link>
                      )}
                  </motion.div>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const mobileMenuLinkStyle = {
    fontSize: '48px',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    color: 'var(--acero)',
    display: 'block',
    textDecoration: 'none'
};

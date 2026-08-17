import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { api } from '../../api';

const EyeOff = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const Eye = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

const tabs = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/costos', label: 'Costos' },
];

export default function AdminLayout() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('admin/me.php').then((data) => setIsAdmin(data.is_admin));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('admin/login.php', { password });
      setIsAdmin(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await api.post('admin/logout.php', {});
    setIsAdmin(false);
  }

  if (isAdmin === null) return null;

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f2f2f2', padding: '40px 20px' }}>
        <div style={{ background: '#fff', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '24px', fontWeight: 600, color: '#1c1c1f', textTransform: 'none', letterSpacing: 'normal', fontFamily: 'var(--font)' }}>Panel de administrador</h1>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            {error && <div className="error-msg">{error}</div>}
            <div className="field" style={{ position: 'relative' }}>
              <label style={{ color: '#666' }}>Contraseña</label>
              <input
                required
                type={showPassword ? "text" : "password"}
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px', background: '#fff', color: '#1c1c1f', border: '1px solid #ddd' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '38px', background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: 0, display: 'flex' }}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <button className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? 'ENTRANDO…' : 'ENTRAR'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel" style={{ minHeight: '100svh', background: '#FFFFFF' }}>
      <header style={styles.header}>
        <span style={styles.logo}>Lore District · Admin</span>
        <button
          className="btn btn-outline"
          style={{ padding: '8px 14px', fontSize: '13px' }}
          onClick={handleLogout}
        >
          Salir
        </button>
      </header>
      <nav style={styles.tabs}>
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            style={({ isActive }) => ({
              ...styles.tab,
              ...(isActive ? styles.tabActive : {}),
            })}
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
      <main className="container" style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    background: 'var(--charcoal)',
    color: '#fff',
  },
  logo: {
    fontFamily: 'var(--font)',
    fontSize: '18px',
  },
  tabs: {
    display: 'flex',
    overflowX: 'auto',
    borderBottom: '1px solid var(--border)',
    background: 'var(--white)',
  },
  tab: {
    padding: '14px 18px',
    fontSize: '14px',
    fontWeight: 400,
    color: 'var(--text-soft)',
    whiteSpace: 'nowrap',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: 'var(--charcoal)',
    borderBottomColor: 'var(--charcoal)',
  },
};

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EyeOff = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const Eye = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/cuenta');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--obsidiana)', padding: '40px 20px' }}>
      <div style={{ background: '#242428', border: '1px solid var(--border)', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '24px', fontWeight: 900, color: 'var(--acero)' }}>Iniciar sesión</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          {error && <div className="error-msg">{error}</div>}
          <div className="field">
            <label>Correo</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field" style={{ position: 'relative' }}>
            <label>Contraseña</label>
            <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: '40px' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '38px', background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', padding: 0, display: 'flex' }}>
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <button className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'ENTRANDO…' : 'ENTRAR'}
          </button>
        </form>
        <p style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-soft)' }}>
          ¿No tienes cuenta? <Link to="/crear-cuenta" style={{ color: 'var(--rosa-neon)', fontWeight: 500, textDecoration: 'underline' }}>Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}

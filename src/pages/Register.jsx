import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/cuenta');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '420px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Crear cuenta</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {error && <div className="error-msg">{error}</div>}
        <div className="field">
          <label>Nombre completo</label>
          <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div className="field">
          <label>Correo</label>
          <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
        <div className="field">
          <label>Teléfono</label>
          <input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input required type="password" value={form.password} onChange={(e) => update('password', e.target.value)} />
        </div>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creando…' : 'Crear cuenta'}
        </button>
      </form>
      <p style={{ marginTop: '18px', fontSize: '14px', color: 'var(--text-soft)' }}>
        ¿Ya tienes cuenta? <Link to="/iniciar-sesion" style={{ textDecoration: 'underline' }}>Iniciar sesión</Link>
      </p>
    </div>
  );
}

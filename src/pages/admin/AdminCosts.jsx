import { useEffect, useState } from 'react';
import { api } from '../../api';

export default function AdminCosts() {
  const [shippingZones, setShippingZones] = useState({});
  const [installationPrice, setInstallationPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    load();
  }, []);

  function load() {
    api.get('admin/settings.php')
      .then((data) => {
        setShippingZones(data.shipping_zones || {});
        setInstallationPrice(data.global_installation_price || '');
      })
      .finally(() => setLoading(false));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.put('admin/settings.php', {
        shipping_zones: shippingZones,
        global_installation_price: installationPrice,
      });
      setMessage('Configuración guardada correctamente.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  function updateZoneCost(prefix, cost) {
    setShippingZones(prev => ({
      ...prev,
      [prefix]: { ...prev[prefix], cost: Number(cost) || 0 }
    }));
  }

  if (loading) return <p style={{ color: 'var(--text-soft)' }}>Cargando configuración…</p>;

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 500 }}>Costos Globales</h2>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'GUARDANDO…' : 'GUARDAR CAMBIOS'}
        </button>
      </div>

      {message && <div style={{ background: '#d4edda', color: '#155724', padding: '10px 15px', borderRadius: '8px' }}>{message}</div>}

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Instalación</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-soft)', marginBottom: '16px' }}>Este costo será igual para todos los productos y se sumará automáticamente durante la compra cuando el cliente lo solicite.</p>
        
        <div className="field">
          <label>Costo de instalación ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={installationPrice}
            onChange={(e) => setInstallationPrice(e.target.value)}
            style={{ maxWidth: '200px' }}
          />
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Entrega (Por Código Postal y Zona)</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-soft)', marginBottom: '16px' }}>Los costos de envío se basan en la ubicación seleccionada (Ciudad de México y Estado de México).</p>
        
        {['Ciudad de México', 'Estado de México'].map(stateName => {
          const zones = Object.entries(shippingZones).filter(([_, info]) => (info.state || 'Ciudad de México') === stateName);
          if (zones.length === 0) return null;
          return (
            <div key={stateName} style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                {stateName}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {zones.map(([prefix, info]) => (
                  <div key={prefix} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px' }}>{info.name}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-soft)' }}>Prefijo: {prefix}XXX</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--text-soft)' }}>$</span>
                      <input
                        type="number"
                        min="0"
                        value={info.cost}
                        onChange={(e) => updateZoneCost(prefix, e.target.value)}
                        style={{ width: '80px', padding: '6px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}

const styles = {
  card: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid var(--border)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 500,
    marginBottom: '8px',
  },
};

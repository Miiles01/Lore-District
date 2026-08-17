import { useState, useEffect } from 'react';
import { useShipping } from '../context/ShippingContext';
import CustomSelect from './CustomSelect';

export default function ShippingModal() {
  const { groupedOptions, alcaldias, alcaldia, setAlcaldia } = useShipping();
  const [selected, setSelected] = useState('');

  // Bloquear scroll de la página mientras el modal está activo
  useEffect(() => {
    if (!alcaldia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [alcaldia]);

  if (alcaldia) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>Selecciona el lugar de entrega</p>
        <h2 style={styles.title}>¿De dónde nos visitas?</h2>
        <p style={styles.subtitle}>Esto nos ayuda a encontrar un repartidor cercano.</p>

        <CustomSelect
          value={selected}
          onChange={setSelected}
          options={groupedOptions.length > 0 ? groupedOptions : alcaldias.map(a => ({ label: a.name, value: a.name }))}
          placeholder="Selecciona tu alcaldía o municipio"
          searchable={true}
          triggerStyle={styles.select}
          containerStyle={{ marginBottom: '16px' }}
        />

        <button
          className="btn btn-primary btn-block"
          disabled={!selected}
          onClick={() => setAlcaldia(selected)}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'rgba(61, 68, 74, 0.35)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    touchAction: 'none',
    overscrollBehavior: 'contain',
  },
  card: {
    background: '#242428',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '32px 28px',
    maxWidth: '380px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  eyebrow: {
    fontSize: '11px',
    fontWeight: 400,
    color: 'var(--text-soft)',
    marginBottom: '10px',
  },
  title: {
    fontSize: '26px',
    marginBottom: '10px',
    color: 'var(--acero)',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-soft)',
    marginBottom: '22px',
  },
  select: {
    width: '100%',
    padding: '13px 14px',
    borderRadius: '12px',
    border: '1.5px solid var(--border)',
    background: 'var(--obsidiana)',
    color: 'var(--text)',
    fontSize: '15px',
    textAlign: 'left'
  },
};

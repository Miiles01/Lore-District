import { useEffect, useState } from 'react';
import { api } from '../../api';
import { money } from '../../utils';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get('admin/customers.php').then(setCustomers).catch(() => {});
  }, []);

  if (customers.length === 0) return <p style={{ color: 'var(--text-soft)' }}>Aún no hay clientes registrados.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {customers.map((c) => (
        <div key={c.id} style={styles.row}>
          <div>
            <p style={{ fontWeight: 400 }}>{c.name}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-soft)' }}>{c.email} · {c.phone || 'sin teléfono'}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 400 }}>{money(c.total_spent)}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-soft)' }}>{c.orders_count} pedidos</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'var(--white)',
    borderRadius: '14px',
    padding: '14px 16px',
    boxShadow: 'var(--shadow)',
  },
};

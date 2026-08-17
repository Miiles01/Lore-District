import { useEffect, useState } from 'react';
import { api } from '../../api';
import { money } from '../../utils';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('admin/stats.php').then(setStats).catch(() => {});
  }, []);

  if (!stats) return <p style={{ color: 'var(--text-soft)' }}>Cargando…</p>;

  const cards = [
    { label: 'Ventas totales', value: money(stats.total_revenue) },
    { label: 'Pedidos', value: stats.total_orders },
    { label: 'Pedidos pendientes', value: stats.pending_orders },
    { label: 'Clientes', value: stats.total_customers },
    { label: 'Productos activos', value: stats.total_products },
  ];

  const maxRevenue = Math.max(1, ...stats.last_7_days.map((d) => Number(d.revenue)));

  return (
    <div>
      <div style={styles.cardsGrid}>
        {cards.map((c) => (
          <div key={c.label} style={styles.card}>
            <p style={styles.cardLabel}>{c.label}</p>
            <p style={styles.cardValue}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h3 style={{ marginBottom: '14px' }}>Últimos 7 días</h3>
        <div style={styles.chart}>
          {stats.last_7_days.length === 0 ? (
            <p style={{ color: 'var(--text-soft)', fontSize: '14px' }}>Sin ventas todavía.</p>
          ) : (
            stats.last_7_days.map((d) => (
              <div key={d.d} style={styles.barCol}>
                <div style={{ ...styles.bar, height: `${(Number(d.revenue) / maxRevenue) * 100}px` }} />
                <span style={styles.barLabel}>{new Date(d.d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={{ marginBottom: '14px' }}>Productos más vendidos</h3>
        {stats.top_products.length === 0 ? (
          <p style={{ color: 'var(--text-soft)', fontSize: '14px' }}>Sin ventas todavía.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stats.top_products.map((p) => (
              <div key={p.product_name} style={styles.topRow}>
                <span>{p.product_name}</span>
                <span style={{ color: 'var(--text-soft)' }}>{p.units} uds · {money(p.revenue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  card: {
    background: 'var(--white)',
    borderRadius: 'var(--radius)',
    padding: '16px',
    boxShadow: 'var(--shadow)',
  },
  cardLabel: {
    fontSize: '12px',
    color: 'var(--text-soft)',
    marginBottom: '6px',
  },
  cardValue: {
    fontSize: '20px',
    fontWeight: 400,
    color: 'var(--charcoal)',
  },
  section: {
    background: 'var(--white)',
    borderRadius: 'var(--radius)',
    padding: '18px',
    boxShadow: 'var(--shadow)',
    marginBottom: '20px',
  },
  chart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '10px',
    height: '120px',
  },
  barCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    flex: 1,
  },
  bar: {
    width: '100%',
    background: 'var(--charcoal)',
    borderRadius: '6px 6px 0 0',
    minHeight: '4px',
  },
  barLabel: {
    fontSize: '11px',
    color: 'var(--text-soft)',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    padding: '6px 0',
    borderBottom: '1px solid var(--border)',
  },
};

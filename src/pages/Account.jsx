import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { money, STATUS_LABELS } from '../utils';

export default function Account() {
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      api.get('orders.php').then(setOrders).catch(() => {});
    }
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/iniciar-sesion" replace />;

  return (
    <div className="container" style={{ padding: '28px 20px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px' }}>Hola, {user.name.split(' ')[0]}</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-soft)' }}>{user.email}</p>
        </div>
        <button
          className="btn btn-outline"
          onClick={async () => { await logout(); navigate('/'); }}
          style={{ padding: '10px 16px', fontSize: '13px' }}
        >
          Salir
        </button>
      </div>

      <h3 style={{ marginBottom: '12px' }}>Mis pedidos</h3>
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-soft)', fontSize: '14px' }}>Aún no tienes pedidos.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map((order) => (
            <div key={order.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <strong>Pedido #{order.id}</strong>
                <span className={`badge badge-${order.status}`}>{STATUS_LABELS[order.status]}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-soft)', margin: '4px 0 8px' }}>
                {new Date(order.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              {order.items.map((i) => (
                <p key={i.id} style={{ fontSize: '14px' }}>{i.quantity} × {i.product_name}</p>
              ))}
              <p style={{ fontWeight: 400, marginTop: '8px' }}>{money(order.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--white)',
    borderRadius: 'var(--radius)',
    padding: '16px 18px',
    boxShadow: 'var(--shadow)',
    textAlign: 'left',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

import { useEffect, useState } from 'react';
import { api } from '../../api';
import { money, STATUS_LABELS } from '../../utils';

const COLUMNS = [
  { key: 'nuevos', title: 'Nuevos', color: 'var(--gold)', statuses: ['pendiente', 'confirmado', 'en_camino'], dropStatus: 'pendiente' },
  { key: 'entregados', title: 'Entregados', color: 'var(--success)', statuses: ['entregado'], dropStatus: 'entregado' },
  { key: 'cancelados', title: 'Cancelados', color: 'var(--danger)', statuses: ['cancelado'], dropStatus: 'cancelado' },
];

// En móvil no hay drag & drop táctil: cada tarjeta ofrece acciones rápidas
// para moverse entre columnas con un toque.
const QUICK_ACTIONS = {
  nuevos: [
    { label: '✓ Entregado', status: 'entregado', kind: 'ok' },
    { label: '✕ Cancelar', status: 'cancelado', kind: 'danger' },
  ],
  entregados: [
    { label: '↺ Regresar a nuevos', status: 'pendiente', kind: 'neutral' },
  ],
  cancelados: [
    { label: '↺ Reactivar pedido', status: 'pendiente', kind: 'neutral' },
  ],
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);
  const [activeCol, setActiveCol] = useState('nuevos');
  const isMobile = useIsMobile();

  useEffect(() => {
    load();
  }, []);

  function load() {
    api.get('admin/orders.php').then(setOrders).finally(() => setLoading(false));
  }

  async function updateStatus(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
    try {
      await api.put('admin/orders.php', { id, status });
    } catch {
      load();
    }
  }

  function handleDrop(col) {
    if (dragId != null) {
      const order = orders.find((o) => o.id === dragId);
      if (order && !col.statuses.includes(order.status)) {
        updateStatus(dragId, col.dropStatus);
      }
    }
    setDragId(null);
    setHoverCol(null);
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (loading) return <p style={{ color: 'var(--text-soft)' }}>Cargando…</p>;

  if (isMobile) {
    const col = COLUMNS.find((c) => c.key === activeCol);
    const colOrders = orders.filter((o) => col.statuses.includes(o.status));
    return (
      <>
        <div style={styles.segmented}>
          {COLUMNS.map((c) => {
            const n = orders.filter((o) => c.statuses.includes(o.status)).length;
            const active = c.key === activeCol;
            return (
              <button
                key={c.key}
                onClick={() => setActiveCol(c.key)}
                style={{ ...styles.segmentBtn, ...(active ? styles.segmentBtnActive : {}) }}
              >
                <span style={{ ...styles.dot, background: c.color }} />
                {c.title}
                <span style={{ ...styles.segmentCount, ...(active ? styles.segmentCountActive : {}) }}>{n}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {colOrders.length === 0 && <p style={styles.empty}>Sin pedidos en {col.title.toLowerCase()}</p>}
          {colOrders.map((order) => (
            <div key={order.id} style={styles.card} onClick={() => setSelected(order)}>
              <div style={styles.cardTop}>
                <strong style={{ fontSize: '14px' }}>Pedido #{order.id}</strong>
                <span style={styles.cardTotal}>{money(order.total)}</span>
              </div>
              <p style={styles.cardName}>{order.customer_name}</p>
              <p style={styles.cardDate}>{formatDate(order.created_at)}</p>
              <div style={styles.thumbRow}>
                {order.items.slice(0, 4).map((i) => (
                  <img key={i.id} src={i.product_image} alt={i.product_name} style={styles.thumb} />
                ))}
                {order.items.length > 4 && <span style={styles.thumbMore}>+{order.items.length - 4}</span>}
                <span style={styles.itemCount}>{order.items.reduce((acc, i) => acc + Number(i.quantity), 0)} art.</span>
              </div>
              {Boolean(order.needs_installation) && <span style={styles.tag}>Instalación</span>}

              <div style={styles.actionRow}>
                {QUICK_ACTIONS[activeCol].map((a) => (
                  <button
                    key={a.status}
                    onClick={(e) => { e.stopPropagation(); updateStatus(order.id, a.status); }}
                    style={{ ...styles.actionBtn, ...styles[`actionBtn_${a.kind}`] }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <OrderModal
            order={selected}
            onClose={() => setSelected(null)}
            onStatusChange={(status) => updateStatus(selected.id, status)}
            formatDate={formatDate}
            isMobile
          />
        )}
      </>
    );
  }

  return (
    <>
      <div style={styles.board}>
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => col.statuses.includes(o.status));
          const isHover = hoverCol === col.key;
          return (
            <div
              key={col.key}
              style={{ ...styles.column, ...(isHover ? styles.columnHover : {}) }}
              onDragOver={(e) => { e.preventDefault(); setHoverCol(col.key); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHoverCol(null); }}
              onDrop={() => handleDrop(col)}
            >
              <div style={styles.columnHeader}>
                <span style={{ ...styles.dot, background: col.color }} />
                <span style={styles.columnTitle}>{col.title}</span>
                <span style={styles.count}>{colOrders.length}</span>
              </div>

              <div style={styles.columnBody}>
                {colOrders.length === 0 && (
                  <p style={styles.empty}>Sin pedidos</p>
                )}
                {colOrders.map((order) => (
                  <div
                    key={order.id}
                    draggable
                    onDragStart={() => setDragId(order.id)}
                    onDragEnd={() => { setDragId(null); setHoverCol(null); }}
                    onClick={() => setSelected(order)}
                    style={{ ...styles.card, ...(dragId === order.id ? styles.cardDragging : {}) }}
                  >
                    <div style={styles.cardTop}>
                      <strong style={{ fontSize: '14px' }}>Pedido #{order.id}</strong>
                      <span style={styles.cardTotal}>{money(order.total)}</span>
                    </div>
                    <p style={styles.cardName}>{order.customer_name}</p>
                    <p style={styles.cardDate}>{formatDate(order.created_at)}</p>

                    <div style={styles.thumbRow}>
                      {order.items.slice(0, 4).map((i) => (
                        <img key={i.id} src={i.product_image} alt={i.product_name} style={styles.thumb} />
                      ))}
                      {order.items.length > 4 && (
                        <span style={styles.thumbMore}>+{order.items.length - 4}</span>
                      )}
                      <span style={styles.itemCount}>
                        {order.items.reduce((acc, i) => acc + Number(i.quantity), 0)} art.
                      </span>
                    </div>

                    {Boolean(order.needs_installation) && (
                      <span style={styles.tag}>Instalación</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(status) => updateStatus(selected.id, status)}
          formatDate={formatDate}
        />
      )}
    </>
  );
}

function OrderModal({ order, onClose, onStatusChange, formatDate, isMobile = false }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={{ fontSize: '20px', marginBottom: '2px' }}>Pedido #{order.id}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-soft)' }}>{formatDate(order.created_at)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={`badge badge-${order.status}`}>{STATUS_LABELS[order.status]}</span>
            <button onClick={onClose} style={styles.closeBtn} aria-label="Cerrar">✕</button>
          </div>
        </div>

        <div style={styles.modalBody} className="custom-scrollbar">
          <div style={{ ...styles.sectionGrid, ...(isMobile ? { gridTemplateColumns: '1fr' } : {}) }}>
            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Cliente</h3>
              <InfoRow label="Nombre" value={order.customer_name} />
              <InfoRow label="Teléfono" value={order.customer_phone} />
              <InfoRow label="Correo" value={order.customer_email} />
            </section>

            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Entrega</h3>
              <InfoRow
                label="Dirección"
                value={`${order.street} ${order.ext_no}${order.int_no ? `, Int. ${order.int_no}` : ''}`}
              />
              <InfoRow label="Alcaldía" value={order.alcaldia || order.neighborhood || '—'} />
              <InfoRow label="Ciudad" value={[order.city, order.state].filter(Boolean).join(', ') || '—'} />
              <InfoRow label="C.P." value={order.postal_code} />
              {order.references_notes && <InfoRow label="Referencias" value={order.references_notes} />}
              <InfoRow label="Instalación" value={order.needs_installation ? 'Sí, requiere instalación' : 'No'} />
            </section>
          </div>

          <section style={{ marginTop: '20px' }}>
            <h3 style={styles.sectionTitle}>Productos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {order.items.map((i) => (
                <div key={i.id} style={styles.productRow}>
                  <img src={i.product_image} alt={i.product_name} style={styles.productImg} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>{i.product_name}</p>
                    {i.options_text && (
                      <p style={{ fontSize: '12px', color: 'var(--text-soft)', marginTop: '1px' }}>{i.options_text}</p>
                    )}
                    <p style={{ fontSize: '13px', color: 'var(--text-soft)' }}>
                      {i.quantity} × {money(i.unit_price)}
                    </p>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{money(i.line_total)}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={styles.summaryBox}>
            <div style={styles.summaryRow}><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
            <div style={styles.summaryRow}><span>Envío</span><span>{money(order.shipping_fee)}</span></div>
            {order.installation_fee > 0 && (
              <div style={styles.summaryRow}><span>Instalación</span><span>{money(order.installation_fee)}</span></div>
            )}
            <div style={styles.summaryTotal}><span>Total</span><span>{money(order.total)}</span></div>
          </section>

          <div className="field" style={{ marginTop: '20px' }}>
            <label>Estatus del pedido</label>
            <select value={order.status} onChange={(e) => onStatusChange(e.target.value)}>
              {Object.keys(STATUS_LABELS).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

const styles = {
  segmented: {
    display: 'flex',
    gap: '4px',
    background: '#eceae6',
    borderRadius: '999px',
    padding: '4px',
    marginBottom: '16px',
    position: 'sticky',
    top: '8px',
    zIndex: 10,
  },
  segmentBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    border: 'none',
    background: 'transparent',
    borderRadius: '999px',
    padding: '9px 2px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-soft)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  segmentBtnActive: {
    background: 'var(--white)',
    color: 'var(--charcoal)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
  },
  segmentCount: {
    fontSize: '11px',
    fontWeight: 700,
    background: 'rgba(0,0,0,0.06)',
    borderRadius: '999px',
    padding: '1px 7px',
  },
  segmentCountActive: {
    background: 'var(--charcoal)',
    color: '#fff',
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    borderTop: '1px solid var(--border)',
    paddingTop: '12px',
  },
  actionBtn: {
    flex: 1,
    border: 'none',
    borderRadius: '8px',
    padding: '10px 8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  actionBtn_ok: {
    background: 'rgba(74, 124, 89, 0.14)',
    color: 'var(--success)',
  },
  actionBtn_danger: {
    background: 'rgba(181, 71, 58, 0.12)',
    color: 'var(--danger)',
  },
  actionBtn_neutral: {
    background: '#efece7',
    color: 'var(--charcoal)',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    alignItems: 'start',
  },
  column: {
    background: '#f0efed',
    borderRadius: '14px',
    padding: '12px',
    minHeight: '320px',
    transition: 'background 0.15s, box-shadow 0.15s',
  },
  columnHover: {
    background: '#e8e6e2',
    boxShadow: 'inset 0 0 0 2px var(--charcoal)',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 6px 12px',
  },
  dot: {
    width: '9px',
    height: '9px',
    borderRadius: '999px',
    flexShrink: 0,
  },
  columnTitle: {
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--charcoal)',
  },
  count: {
    marginLeft: 'auto',
    fontSize: '12px',
    fontWeight: 600,
    background: 'var(--white)',
    borderRadius: '999px',
    padding: '2px 9px',
    color: 'var(--text-soft)',
  },
  columnBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  empty: {
    fontSize: '13px',
    color: 'var(--text-soft)',
    textAlign: 'center',
    padding: '24px 0',
  },
  card: {
    background: 'var(--white)',
    borderRadius: '12px',
    padding: '14px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    cursor: 'grab',
    userSelect: 'none',
  },
  cardDragging: {
    opacity: 0.4,
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  cardTotal: {
    fontWeight: 600,
    fontSize: '14px',
  },
  cardName: {
    fontSize: '13px',
    color: 'var(--charcoal)',
  },
  cardDate: {
    fontSize: '12px',
    color: 'var(--text-soft)',
    marginBottom: '10px',
  },
  thumbRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  thumb: {
    width: '34px',
    height: '46px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid var(--border)',
  },
  thumbMore: {
    fontSize: '12px',
    color: 'var(--text-soft)',
    fontWeight: 600,
  },
  itemCount: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: 'var(--text-soft)',
  },
  tag: {
    display: 'inline-block',
    marginTop: '10px',
    fontSize: '11px',
    fontWeight: 600,
    background: 'rgba(58, 110, 181, 0.12)',
    color: '#3a6eb5',
    padding: '3px 8px',
    borderRadius: '6px',
  },

  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 300,
    background: 'rgba(30, 33, 36, 0.45)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    background: 'var(--white)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '640px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 22px',
    borderBottom: '1px solid var(--border)',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: 'var(--text-soft)',
    padding: '4px 8px',
    lineHeight: 1,
  },
  modalBody: {
    padding: '20px 22px',
    overflowY: 'auto',
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  section: {
    minWidth: 0,
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-soft)',
    marginBottom: '10px',
  },
  infoRow: {
    display: 'flex',
    gap: '10px',
    fontSize: '13px',
    padding: '4px 0',
  },
  infoLabel: {
    color: 'var(--text-soft)',
    flexShrink: 0,
    width: '86px',
  },
  infoValue: {
    color: 'var(--charcoal)',
    fontWeight: 500,
    overflowWrap: 'anywhere',
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#f7f6f4',
    borderRadius: '10px',
    padding: '10px 12px',
  },
  productImg: {
    width: '44px',
    height: '62px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    flexShrink: 0,
  },
  summaryBox: {
    marginTop: '20px',
    borderTop: '1px solid var(--border)',
    paddingTop: '14px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--text-soft)',
    padding: '3px 0',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: 700,
    marginTop: '8px',
    color: 'var(--charcoal)',
  },
};

import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { money } from '../utils';

export default function CartDrawer() {
  const { items, updateQuantity, removeItem, subtotal, drawerOpen, setDrawerOpen } = useCart();
  const navigate = useNavigate();

  if (!drawerOpen) return null;

  return (
    <div style={styles.overlay} onClick={() => setDrawerOpen(false)}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.headerRow}>
          <h3 style={styles.title}>Tu carrito</h3>
          <button style={styles.closeBtn} onClick={() => setDrawerOpen(false)}>✕</button>
        </div>

        {items.length === 0 ? (
          <p style={styles.empty}>Tu carrito está vacío.</p>
        ) : (
          <div style={styles.list}>
            {items.map((item) => (
              <div key={item.cartItemId} style={styles.item}>
                <img src={item.image_url} alt={item.name} style={styles.itemImg} />
                <div style={styles.itemInfo}>
                  <p style={styles.itemName}>{item.name}</p>
                  
                  {/* Display options if any */}
                  {item.options && Object.keys(item.options).length > 0 && (
                    <div style={styles.optionsList}>
                      {item.options.size && <span>Talla: {item.options.size}</span>}
                      {item.options.color && <span>Color: {item.options.color}</span>}
                    </div>
                  )}

                  <p style={styles.itemPrice}>{money(item.price)}</p>
                  <div style={styles.qtyRow}>
                    <button style={styles.qtyBtn} onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button style={styles.qtyBtn} onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                    <button style={styles.removeBtn} onClick={() => removeItem(item.cartItemId)}>Quitar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.subtotalRow}>
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => {
                setDrawerOpen(false);
                navigate('/pagar');
              }}
            >
              Ir a pagar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    background: 'var(--obsidiana)',
    width: '100%',
    maxWidth: '400px',
    height: '100vh',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 24px rgba(0,0,0,0.4)',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 400,
    letterSpacing: '-0.5px',
    color: 'var(--acero)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: 'var(--text-soft)',
  },
  empty: {
    padding: '30px 0',
    textAlign: 'center',
    color: 'var(--text-soft)',
  },
  list: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    paddingBottom: '10px',
  },
  item: {
    display: 'flex',
    gap: '12px',
  },
  itemImg: {
    width: '80px',
    height: '80px',
    borderRadius: '4px',
    objectFit: 'cover',
    background: '#242428',
    border: '1px solid var(--border)',
  },
  itemInfo: {
    flex: 1,
    textAlign: 'left',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: 400,
    marginBottom: '2px',
    color: 'var(--acero)',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '12px',
    color: 'var(--text-soft)',
    marginBottom: '4px',
  },
  itemPrice: {
    fontSize: '13px',
    color: 'var(--text-soft)',
    marginBottom: '6px',
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  qtyBtn: {
    width: '26px',
    height: '26px',
    borderRadius: '999px',
    border: '1px solid var(--border)',
    background: '#242428',
    color: 'var(--acero)',
  },
  removeBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    fontSize: '12px',
    color: 'var(--danger)',
    textDecoration: 'underline',
  },
  footer: {
    borderTop: '1px solid var(--border)',
    paddingTop: '24px',
    marginTop: 'auto',
  },
  subtotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    fontSize: '16px',
    fontWeight: 500,
  },
};

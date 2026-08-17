import { useEffect, useState } from 'react';
import { api } from '../../api';
import { money } from '../../utils';

const GARMENT_TYPES = ['playera', 'hoodie', 'gorra', 'sudadera', 'accesorio'];

const emptyForm = {
  id: null,
  category_id: '',
  name: '',
  description: '',
  image_url: '',
  stock: 500,
  active: true,
  featured: false,
  garment_type: '',
  discount_type: '',
  discount_value: '',
  sizes: [
    { name: 'S', price: 0 },
    { name: 'M', price: 0 },
    { name: 'L', price: 0 },
    { name: 'XL', price: 0 },
    { name: 'XXL', price: 0 }
  ],
  colors: [
    { name: 'Obsidiana', extra_cost: 0 },
    { name: 'Selva', extra_cost: 0 }
  ]
};

export default function AdminProducts() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
    api.get('categories.php').then(setCategories).catch(() => {});
  }, []);

  function load() {
    api.get('products.php').then(setProducts).catch(() => {});
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateArrayItem(field, index, subfield, value) {
    setForm((f) => {
      const arr = [...(f[field] || [])];
      arr[index] = { ...arr[index], [subfield]: value };
      return { ...f, [field]: arr };
    });
  }

  function addArrayItem(field, defaultItem) {
    setForm((f) => ({
      ...f,
      [field]: [...(f[field] || []), defaultItem]
    }));
  }

  function removeArrayItem(field, index) {
    setForm((f) => {
      const arr = [...(f[field] || [])];
      arr.splice(index, 1);
      return { ...f, [field]: arr };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form };
      if (payload.id) {
        await api.put('products.php', payload);
      } else {
        await api.post('products.php', payload);
      }
      setForm(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Ocultar este producto de productos?')) return;
    await api.del('products.php', { id });
    load();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3>Productos</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-primary" style={{ padding: '10px 16px', fontSize: '13px' }} onClick={() => setForm(emptyForm)}>
            + Nuevo producto
          </button>
        </div>
      </div>

      {form && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          {error && <div className="error-msg">{error}</div>}
          
          {/* 1. Información General */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>1. Información General</h4>
            <div className="field">
              <label>Categoría</label>
              <select required value={form.category_id || ''} onChange={(e) => update('category_id', e.target.value ? Number(e.target.value) : '')}>
                <option value="">Selecciona una categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Nombre del producto</label>
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div className="field">
              <label>Descripción</label>
              <textarea rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} />
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginTop: '8px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="field">
                  <label>URL de imagen</label>
                  <input value={form.image_url} onChange={(e) => update('image_url', e.target.value)} />
                </div>
                <div style={styles.row2}>
                  <div className="field">
                    <label>Existencias</label>
                    <input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Tipo de prenda (para filtros)</label>
                    <select value={form.garment_type} onChange={(e) => update('garment_type', e.target.value)}>
                      <option value="">Sin tipo definido</option>
                      {GARMENT_TYPES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ height: '160px', aspectRatio: '2/3', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0, background: '#f5f5f5' }}>
                {form.image_url ? (
                  <img src={form.image_url} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-soft)', fontSize: '12px', textAlign: 'center', padding: '10px' }}>
                    Sin imagen
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Tallas y precio */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>2. Tallas y precio</h4>
            <div style={styles.gridHeader}>
              <span>Talla</span>
              <span>Precio</span>
              <span></span>
            </div>
            {form.sizes.map((s, i) => (
              <div key={i} style={styles.gridRow}>
                <input value={s.name} onChange={(e) => updateArrayItem('sizes', i, 'name', e.target.value)} placeholder="Ej: M" required />
                <input type="number" step="0.01" value={s.price} onChange={(e) => updateArrayItem('sizes', i, 'price', e.target.value)} required />
                <button type="button" onClick={() => removeArrayItem('sizes', i)} style={styles.iconBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            ))}
            <button type="button" style={styles.addBtn} onClick={() => addArrayItem('sizes', { name: '', price: 0 })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Agregar otra talla
            </button>
          </div>

          {/* Descuento (Opcional) */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Descuento (Opcional)</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-soft)', marginBottom: '12px' }}>Aplica a todos los tamaños de este producto.</p>
            <div style={styles.row2}>
              <div className="field">
                <label>Tipo de descuento</label>
                <select value={form.discount_type || ''} onChange={(e) => update('discount_type', e.target.value)}>
                  <option value="">Ninguno</option>
                  <option value="fixed">Monto fijo ($)</option>
                  <option value="percentage">Porcentaje (%)</option>
                </select>
              </div>
              <div className="field">
                <label>Valor del descuento</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={form.discount_value || ''} 
                  onChange={(e) => update('discount_value', e.target.value)} 
                  disabled={!form.discount_type}
                />
              </div>
            </div>
          </div>

          {/* 3. Opciones de Color */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>3. Opciones de Color</h4>
            <div style={styles.gridHeader}>
              <span>Color</span>
              <span>Costo extra</span>
              <span></span>
            </div>
            {form.colors.map((opt, i) => (
              <div key={i} style={styles.gridRow}>
                <input value={opt.name} onChange={(e) => updateArrayItem('colors', i, 'name', e.target.value)} required />
                <input type="number" step="0.01" value={opt.extra_cost} onChange={(e) => updateArrayItem('colors', i, 'extra_cost', e.target.value)} required />
                <button type="button" onClick={() => removeArrayItem('colors', i)} style={styles.iconBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            ))}
            <button type="button" style={styles.addBtn} onClick={() => addArrayItem('colors', { name: '', extra_cost: 0 })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Agregar color
            </button>
          </div>

          {/* Visibilidad */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Visibilidad y estado</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <div style={{
                  width: '40px', height: '24px', background: form.featured ? '#000' : '#e0e0e0',
                  borderRadius: '12px', position: 'relative', transition: 'background 0.2s'
                }}>
                  <div style={{
                    width: '18px', height: '18px', background: '#fff', borderRadius: '50%',
                    position: 'absolute', top: '3px', left: form.featured ? '19px' : '3px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} />
                </div>
                <span style={{ fontSize: '14px' }}>Destacado en inicio</span>
                <input type="checkbox" checked={!!form.featured} onChange={(e) => update('featured', e.target.checked)} style={{ display: 'none' }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <div style={{
                  width: '40px', height: '24px', background: form.active ? '#000' : '#e0e0e0',
                  borderRadius: '12px', position: 'relative', transition: 'background 0.2s'
                }}>
                  <div style={{
                    width: '18px', height: '18px', background: '#fff', borderRadius: '50%',
                    position: 'absolute', top: '3px', left: form.active ? '19px' : '3px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} />
                </div>
                <span style={{ fontSize: '14px' }}>Activo (visible en la tienda)</span>
                <input type="checkbox" checked={!!form.active} onChange={(e) => update('active', e.target.checked)} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" type="submit">GUARDAR PRODUCTO</button>
            <button className="btn btn-outline" type="button" onClick={() => setForm(null)}>Cancelar</button>
          </div>
        </form>
      )}

      {!form && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {products.map((p) => {
            const minPrice = p.sizes?.[0]?.price || 0;
            return (
              <div key={p.id} style={styles.row}>
                <img src={p.image_url} alt={p.name} style={styles.thumb} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, margin: '0 0 4px 0' }}>{p.name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-soft)', margin: 0 }}>
                    Desde {money(minPrice)} · {p.sizes?.length} tallas · {p.stock} en stock
                  </p>
                </div>
                <button
                  className="btn btn-outline"
                  style={{ padding: '8px 12px', fontSize: '12px' }}
                  onClick={() => setForm({
                    ...p,
                    sizes: p.sizes || [],
                    colors: p.colors || [],
                  })}
                >
                  Editar
                </button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Ocultar</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    margin: '0 0 8px 0',
    color: 'var(--charcoal)',
  },
  gridHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 40px',
    gap: '10px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-soft)',
    paddingBottom: '4px',
    borderBottom: '1px solid var(--border)',
  },
  gridRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 40px',
    gap: '10px',
    alignItems: 'center',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-soft)',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    transition: 'color 0.15s',
  },
  addBtn: {
    background: '#f4f4f5',
    border: 'none',
    color: 'var(--charcoal)',
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 16px',
    borderRadius: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    width: 'fit-content',
    marginTop: '12px',
    transition: 'background 0.15s',
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--white)',
    borderRadius: '14px',
    padding: '12px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border)',
  },
  thumb: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    objectFit: 'cover',
    border: '1px solid var(--border)',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    fontSize: '12px',
    color: 'var(--danger)',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

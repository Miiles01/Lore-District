import { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import CustomSelect from '../components/CustomSelect';

const GARMENT_TYPES = [
  { value: '', label: 'Todas las prendas' },
  { value: 'playera', label: 'Playeras' },
  { value: 'hoodie', label: 'Hoodies' },
  { value: 'gorra', label: 'Gorras' },
  { value: 'sudadera', label: 'Sudaderas' },
  { value: 'accesorio', label: 'Accesorios' },
];

const emptyFilters = { garment_type: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(emptyFilters);
  const [visible, setVisible] = useState(true);
  const prevFilters = useRef(filters);

  useEffect(() => {
    // Fade out, fetch, then fade in
    setVisible(false);
    const timer = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.garment_type) params.set('garment_type', filters.garment_type);
      api.get(`products.php?${params.toString()}`)
        .then(data => {
          setProducts(data);
          setLoading(false);
          setVisible(true);
        })
        .catch(() => {
          setLoading(false);
          setVisible(true);
        });
    }, 200); // wait for fade-out before fetching
    return () => clearTimeout(timer);
  }, [filters]);

  const anyActive = !!filters.garment_type;

  return (
    <div style={styles.page}>
      <div className="container" style={{ padding: '110px 20px 48px' }}>
        <h1 style={styles.h1}>Productos</h1>

        <div style={styles.filters}>
          <CustomSelect
            value={filters.garment_type}
            onChange={(val) => setFilters((f) => ({ ...f, garment_type: val }))}
            options={GARMENT_TYPES}
            triggerStyle={styles.select}
            containerStyle={{ width: 'auto' }}
          />

          {anyActive && (
            <button type="button" onClick={() => setFilters(emptyFilters)} style={styles.clearBtn}>
              Limpiar filtros
            </button>
          )}
        </div>

        <div
          style={{
            opacity: visible && !loading ? 1 : 0,
            transition: 'opacity 0.3s ease',
            minHeight: '300px',
          }}
        >
          {products.length === 0 && !loading ? (
            <p style={styles.emptyText}>No hay productos con estos filtros.</p>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: '#ffffff',
    minHeight: '100vh',
  },
  h1: {
    fontSize: '26px',
    marginBottom: '18px',
    color: '#1c1c1f',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '22px',
  },
  select: {
    padding: '10px 14px',
    borderRadius: '999px',
    border: '1.5px solid rgba(28, 28, 31, 0.15)',
    background: '#ffffff',
    color: '#1c1c1f',
    fontSize: '14px',
  },
  clearBtn: {
    padding: '10px 14px',
    borderRadius: '999px',
    border: 'none',
    background: 'none',
    color: 'rgba(28, 28, 31, 0.6)',
    fontSize: '13px',
    textDecoration: 'underline',
  },
  emptyText: {
    color: 'rgba(28, 28, 31, 0.6)',
  },
};

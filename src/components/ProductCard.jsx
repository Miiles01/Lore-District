import { Link } from 'react-router-dom';
import { money } from '../utils';
import { useDisplayPrice } from '../useDisplayPrice';

export default function ProductCard({ product, dark = false }) {
  let basePrice = 0;
  if (product.sizes && product.sizes.length > 0) {
    const prices = product.sizes.map(s => Number(s.price)).filter(p => !isNaN(p) && p > 0);
    if (prices.length > 0) {
      basePrice = Math.min(...prices);
    }
  }

  let hasDiscount = false;
  let originalPrice = basePrice;
  let currentPrice = basePrice;

  if (product.discount_type === 'fixed') {
    hasDiscount = true;
    currentPrice -= Number(product.discount_value);
  } else if (product.discount_type === 'percentage') {
    hasDiscount = true;
    currentPrice -= currentPrice * (Number(product.discount_value) / 100);
  }

  const { price, shippingIncluded } = useDisplayPrice(currentPrice);
  const text = dark ? darkText : lightText;

  return (
    <Link to={`/producto/${product.slug}`} style={styles.card}>
      <div style={styles.imageWrap}>
        <img src={product.image_url} alt={product.name} style={styles.image} loading="lazy" />
        {hasDiscount && (
          <div style={{ ...styles.badge, background: dark ? '#f2f2f2' : '#1c1c1f', color: dark ? '#1c1c1f' : '#fff' }}>
            {product.discount_type === 'percentage' ? `-${product.discount_value}%` : 'OFERTA'}
          </div>
        )}
      </div>
      <div style={styles.info}>
        <h3 style={{ ...styles.name, color: text.strong }}>{product.name}</h3>
        <p style={{ ...styles.priceRow, color: text.soft }}>
          Desde <span style={{ ...styles.price, color: text.strong }}>{money(price)}</span>
          {hasDiscount && <span style={{ ...styles.originalPrice, color: text.soft }}>{money(originalPrice)}</span>}
        </p>
      </div>
    </Link>
  );
}

const lightText = { strong: '#1c1c1f', soft: 'rgba(28, 28, 31, 0.6)' };
const darkText = { strong: '#f2f2f2', soft: 'rgba(242, 242, 242, 0.6)' };

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: 'transparent',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s ease',
  },
  imageWrap: {
    position: 'relative',
    aspectRatio: '4 / 5',
    background: '#f2f2f2',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    padding: '12px 14px 16px',
    textAlign: 'left',
  },
  name: {
    fontSize: '15px',
    marginBottom: '6px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  price: {
    fontSize: '15px',
    fontWeight: 500,
  },
  originalPrice: {
    fontSize: '13px',
    textDecoration: 'line-through',
  },
  badge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    fontSize: '10px',
    fontWeight: 600,
    padding: '4px 8px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  }
};

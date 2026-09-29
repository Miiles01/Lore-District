import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { money } from '../utils';
import { useDisplayPrice } from '../useDisplayPrice';

function getColorSwatch(name, isSelected) {
  if (!name) return null;
  const norm = name.trim().toLowerCase();

  if (norm === 'obsidiana' || norm === 'negro') {
    return {
      bg: '#1c1c1f',
      border: isSelected ? '1.5px solid #ed4a9b' : '1.5px solid #555',
    };
  }
  if (norm === 'acero' || norm === 'blanco') {
    return {
      bg: '#f2f2f2',
      border: isSelected ? '1.5px solid #ed4a9b' : '1.5px solid #888888',
    };
  }
  if (norm === 'selva') {
    return {
      bg: '#0f4724',
      border: isSelected ? '1.5px solid #ed4a9b' : '1px solid rgba(255, 255, 255, 0.2)',
    };
  }
  if (norm === 'rosa neón' || norm === 'rosa neon') {
    return {
      bg: '#ed4a9b',
      border: isSelected ? '1.5px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
    };
  }
  if (norm === 'azul distrito' || norm === 'azul') {
    return {
      bg: '#0e4eb5',
      border: isSelected ? '1.5px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
    };
  }

  return null;
}

function ColorSwatchIcon({ name, isSelected }) {
  const swatch = getColorSwatch(name, isSelected);
  if (!swatch) return null;
  return (
    <span
      style={{
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: swatch.bg,
        border: swatch.border,
        display: 'inline-block',
        flexShrink: 0,
        marginRight: '8px',
        verticalAlign: 'middle',
        boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.12)',
      }}
    />
  );
}
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  
  // Opciones seleccionadas
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Galería e imagen activa
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const { addItem, setDrawerOpen } = useCart();
  const navigate = useNavigate();

  // Calcular precio actual
  let currentPrice = 0;
  let originalPrice = 0;
  let hasDiscount = false;

  if (product) {
    if (selectedSize) currentPrice += Number(selectedSize.price);
    if (selectedColor) currentPrice += Number(selectedColor.extra_cost);

    originalPrice = currentPrice;

    if (product.discount_type === 'fixed') {
      currentPrice -= Number(product.discount_value);
      hasDiscount = true;
    } else if (product.discount_type === 'percentage') {
      currentPrice -= currentPrice * (Number(product.discount_value) / 100);
      hasDiscount = true;
    }
    currentPrice = Math.max(0, currentPrice);
  }

  const { price, shippingIncluded } = useDisplayPrice(currentPrice);

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    setActiveImageIndex(0);
    window.scrollTo(0, 0);
    api.get(`products.php?slug=${encodeURIComponent(slug)}`)
      .then((data) => {
        setProduct(data);
        
        // Seleccionar valores por defecto
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors?.length > 0) {
          const defColor = data.colors[0];
          setSelectedColor(defColor);
          const normColor = defColor.name.trim().toLowerCase();
          const gal = (data.gallery && data.gallery.length > 0) ? data.gallery : [data.image_url];
          const idx = gal.findIndex(u => u.toLowerCase().includes(normColor));
          if (idx !== -1) setActiveImageIndex(idx);
        }

        return api.get('products.php');
      })
      .then((allProducts) => {
        if (allProducts && Array.isArray(allProducts)) {
          setRelatedProducts(allProducts.filter(p => p.slug !== slug).sort(() => 0.5 - Math.random()).slice(0, 5));
        }
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return <div className="container" style={{ padding: '40px 20px' }}><p>No encontramos este producto.</p></div>;
  }
  if (!product) {
    return <div className="container" style={{ padding: '40px 20px' }}><p style={{ color: 'var(--text-soft)' }}>Cargando…</p></div>;
  }

  function getOptionsObj() {
    return {
      size: selectedSize?.name || '',
      color: selectedColor?.name || '',
    };
  }

  function handleBuyNow() {
    addItem(product, qty, getOptionsObj(), currentPrice);
    setDrawerOpen(false);
    navigate('/pagar');
  }

  function handleAddToCart() {
    addItem(product, qty, getOptionsObj(), currentPrice);
  }

  const images = (product?.gallery && product.gallery.length > 0)
    ? product.gallery
    : (product?.image_url ? [product.image_url] : []);

  const activeImage = images[activeImageIndex] || product?.image_url;

  function handleColorChange(c) {
    setSelectedColor(c);
    if (!c || !c.name || !images.length) return;
    const normColor = c.name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const matchIdx = images.findIndex(imgUrl => {
      const normUrl = imgUrl.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normUrl.includes(normColor);
    });
    if (matchIdx !== -1) {
      setActiveImageIndex(matchIdx);
    }
  }

  function handlePrevImage() {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function handleNextImage() {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  function handleTouchStart(e) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e) {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      handleNextImage();
    } else if (diff < -40) {
      handlePrevImage();
    }
    setTouchStartX(null);
  }

  return (
    <div style={{ paddingBottom: '32px' }}>
      <div className="container product-detail-layout">
        
        {/* Lado izquierdo: Imagen y Galería */}
        <div className="product-image-container">
          <div 
            style={{ 
              position: 'relative', 
              borderRadius: '16px', 
              overflow: 'hidden',
              background: 'transparent',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)' 
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              src={activeImage} 
              alt={product.name} 
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '4 / 5',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '16px',
                transition: 'opacity 0.2s ease-in-out'
              }} 
            />
            
            {hasDiscount && (
              <div style={styles.badge}>
                {product.discount_type === 'percentage' ? `-${product.discount_value}%` : 'OFERTA'}
              </div>
            )}

            {/* Flechas de navegación: solo en mobile (en desktop/tablet se navega con las miniaturas) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  aria-label="Imagen anterior"
                  className="gallery-arrow gallery-arrow-prev"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.5))' }}>
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                <button
                  onClick={handleNextImage}
                  aria-label="Siguiente imagen"
                  className="gallery-arrow gallery-arrow-next"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.5))' }}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Miniaturas si hay más de 1 imagen: navegan la imagen grande */}
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`Ver imagen ${idx + 1}`}
                  className={`gallery-thumb${activeImageIndex === idx ? ' gallery-thumb-active' : ''}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} miniatura ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Lado derecho: Info y Opciones */}
        <div className="product-info-container" style={{ padding: '20px 0' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', marginBottom: '8px', fontWeight: 500, textTransform: 'none', letterSpacing: '-0.01em' }}>{product.name}</h2>
          <div style={styles.priceRow}>
            <span style={styles.price}>{money(price)}</span>
            {hasDiscount && <span style={styles.originalPrice}>{money(originalPrice)}</span>}
          </div>
          
          <div style={{ borderBottom: '1px solid var(--border)', margin: '20px 0' }}></div>

          {/* Talla */}
          {product.sizes?.length > 0 && (
            <div style={styles.optionSection}>
              <p style={styles.optionLabel}>Talla</p>
              <div style={styles.buttonGroup}>
                {product.sizes.map(s => (
                  <button
                    key={s.name}
                    style={{
                      ...styles.optionBtn,
                      ...(selectedSize?.name === s.name ? styles.optionBtnSelected : styles.optionBtnUnselected)
                    }}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {product.colors?.length > 0 && (
            <div style={styles.optionSection}>
              <p style={styles.optionLabel}>Color</p>
              <div style={styles.buttonGroup}>
                {product.colors.map((c) => {
                  const isSel = selectedColor?.name === c.name;
                  return (
                    <button
                      key={c.name}
                      style={{
                        ...styles.optionBtn,
                        ...(isSel ? styles.optionBtnSelected : styles.optionBtnUnselected)
                      }}
                      onClick={() => handleColorChange(c)}
                    >
                      <ColorSwatchIcon name={c.name} isSelected={isSel} />
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comprar ahora — acción principal */}
          <button style={styles.btnPrimary} onClick={handleBuyNow}>
            Comprar ahora
          </button>

          {/* Fila de Agregar al carrito — acción secundaria */}
          <div style={styles.addToCartRow}>
            <div style={styles.qtyControl}>
              <button style={styles.qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span style={{ minWidth: '16px', textAlign: 'center' }}>{qty}</span>
              <button style={styles.qtyBtn} onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            
            <button style={styles.btnSecondary} onClick={handleAddToCart}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', opacity: 0.7 }}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Agregar al carrito
            </button>
          </div>

          {/* Descripción al final (según mockup) */}
          <div style={{ marginTop: '30px' }}>
            {product.description && <p style={styles.description}>{product.description}</p>}
          </div>

        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <InfiniteCarousel products={relatedProducts} />
      )}
    </div>
  );
}

function InfiniteCarousel({ products }) {
  const trackRef = useRef(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Duplicamos 4 veces para asegurar que haya suficiente contenido para el scroll infinito
    setItems([...products, ...products, ...products, ...products]);
  }, [products]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    
    // Posicionar el scroll en el segundo set para poder scrollear a la izquierda
    const handleLoad = () => {
      const singleSetWidth = track.scrollWidth / 4;
      track.scrollLeft = singleSetWidth;
    };
    
    // Pequeño timeout para asegurar que el DOM midió los anchos
    setTimeout(handleLoad, 100);

    const handleScroll = () => {
      const singleSetWidth = track.scrollWidth / 4;
      // Si scrolleamos muy a la izquierda (dentro del primer set)
      if (track.scrollLeft < singleSetWidth * 0.5) {
        track.scrollLeft += singleSetWidth;
      }
      // Si scrolleamos muy a la derecha (dentro del último set)
      else if (track.scrollLeft > singleSetWidth * 2.5) {
        track.scrollLeft -= singleSetWidth;
      }
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [items]);

  return (
    <div className="carousel-section">
      <h2>La gente también compró</h2>
      <div 
        className="carousel-track" 
        ref={trackRef}
        style={{ scrollSnapType: 'none', scrollBehavior: 'auto' }}
      >
        {items.map((p, i) => (
          <div key={`${p.id}-${i}`} className="carousel-item">
            <ProductCard product={p} dark />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'contain',
  },
  badge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: 'var(--charcoal)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    padding: '6px 12px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
  },
  price: {
    fontSize: '20px',
    fontWeight: 500,
    color: 'var(--acero)',
  },
  originalPrice: {
    fontSize: '16px',
    color: 'var(--text-soft)',
    textDecoration: 'line-through',
  },
  shippingNote: {
    fontSize: '12px',
    color: 'var(--text-soft)',
    marginTop: '4px',
  },
  optionSection: {
    marginBottom: '24px',
  },
  optionLabel: {
    fontSize: '15px',
    marginBottom: '10px',
    color: 'var(--acero)',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  optionBtn: {
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 400,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBtnSelected: {
    background: 'var(--rosa-neon)',
    color: 'var(--obsidiana)',
    border: '1px solid var(--rosa-neon)',
  },
  optionBtnUnselected: {
    background: '#242428',
    color: 'var(--acero)',
    border: '1px solid var(--border)',
  },
  extraCost: {
    fontSize: '12px',
    opacity: 0.8,
  },
  addToCartRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    background: '#242428',
    minWidth: '120px',
    height: '52px',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: 'var(--text-soft)',
    padding: '0 8px',
  },
  btnPrimary: {
    width: '100%',
    height: '54px',
    borderRadius: '12px',
    background: 'var(--rosa-neon)',
    color: 'var(--obsidiana)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.15s',
    marginBottom: '10px',
    letterSpacing: '0.01em',
  },
  btnSecondary: {
    flex: 1,
    height: '52px',
    borderRadius: '12px',
    background: '#2e2e33',
    color: 'var(--acero)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s',
  },
  description: {
    fontSize: '15px',
    lineHeight: 1.65,
    color: 'var(--text-soft)',
  },
};

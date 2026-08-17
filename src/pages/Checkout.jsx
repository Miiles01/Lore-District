import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useShipping } from '../context/ShippingContext';
import { api } from '../api';
import { money } from '../utils';
import CustomSelect from '../components/CustomSelect';

const COUNTRY_CODES = [
  { value: '+52', label: '🇲🇽 +52 México' },
  { value: '+1-US', label: '🇺🇸 +1 Estados Unidos' },
  { value: '+1-CA', label: '🇨🇦 +1 Canadá' },
  { value: '+34', label: '🇪🇸 +34 España' },
  { value: '+57', label: '🇨🇴 +57 Colombia' },
  { value: '+54', label: '🇦🇷 +54 Argentina' },
  { value: '+56', label: '🇨🇱 +56 Chile' },
  { value: '+51', label: '🇵🇪 +51 Perú' },
  { value: '+55', label: '🇧🇷 +55 Brasil' },
  { value: '+502', label: '🇬🇹 +502 Guatemala' },
  { value: '+506', label: '🇨🇷 +506 Costa Rica' },
  { value: '+507', label: '🇵🇦 +507 Panamá' },
  { value: '+593', label: '🇪🇨 +593 Ecuador' },
  { value: '+503', label: '🇸🇻 +503 El Salvador' },
  { value: '+504', label: '🇭🇳 +504 Honduras' },
  { value: '+505', label: '🇳🇮 +505 Nicaragua' },
  { value: '+595', label: '🇵🇾 +595 Paraguay' },
  { value: '+598', label: '🇺🇾 +598 Uruguay' },
  { value: '+58', label: '🇻🇪 +58 Venezuela' },
  { value: '+591', label: '🇧🇴 +591 Bolivia' },
  { value: '+1-PR', label: '🇵🇷 +1 Puerto Rico' },
  { value: '+1-DO', label: '🇩🇴 +1 República Dominicana' },
  { value: '+44', label: '🇬🇧 +44 Reino Unido' },
  { value: '+49', label: '🇩🇪 +49 Alemania' },
  { value: '+33', label: '🇫🇷 +33 Francia' },
  { value: '+39', label: '🇮🇹 +39 Italia' },
];

const emptyForm = {
  name: '', email: '', phone: '', country_code: '+52',
  street: '', ext_no: '', int_no: '', neighborhood: '', city: '', state: '', postal_code: '',
  references_notes: '', needs_installation: false, needs_terminal_payment: false,
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { groupedOptions, alcaldias, alcaldia, setAlcaldia } = useShipping();
  const [settings, setSettings] = useState({ shipping_zones: {}, global_installation_price: 50 });
  const [form, setForm] = useState({
    ...emptyForm,
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country_code: '+52',
    neighborhood: alcaldia?.name || '',
  });
  const [step, setStep] = useState(1);
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('settings.php').then(setSettings).catch(console.error);
  }, []);

  function getShippingInfo(postalCode) {
    if (!postalCode || postalCode.length !== 5) return null;
    const prefix = postalCode.substring(0, 2);
    return settings.shipping_zones[prefix] || null;
  }

  const postalShippingInfo = getShippingInfo(form.postal_code);
  
  const shippingCost = postalShippingInfo 
    ? Number(postalShippingInfo.cost) 
    : (alcaldia ? Number(alcaldia.cost) : 0);

  const shippingLabel = postalShippingInfo 
    ? postalShippingInfo.name 
    : (alcaldia ? alcaldia.name : '');
  
  const installationFee = form.needs_installation ? Number(settings.global_installation_price) : 0;
  const total = subtotal + installationFee + shippingCost;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleAlcaldiaChange(name) {
    setAlcaldia(name);
    update('neighborhood', name);
  }

  function handleContinue() {
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    window.scrollTo(0, 0);
    setStep(2);
  }

  function formatVariant(options) {
    if (!options) return '';
    const parts = [options.color, options.size, options.lighting, options.base].filter(Boolean);
    return parts.join(' / ');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!postalShippingInfo && !alcaldia) {
      setError('Lo sentimos, no contamos con envíos para este código postal por el momento.');
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    try {
      const code = form.country_code ? form.country_code.split('-')[0] : '+52';
      let notes = form.references_notes || '';
      if (form.needs_terminal_payment) {
        notes = (notes ? notes + ' | ' : '') + 'Requiero pago con terminal';
      }

      const order = await api.post('checkout.php', {
        ...form,
        references_notes: notes,
        phone: `${code} ${form.phone}`,
        alcaldia: shippingLabel,
        items: items.map((i) => ({
          product_id: i.product_id, 
          quantity: i.quantity,
          options: i.options 
        })),
      });
      clearCart();
      navigate(`/pedido-confirmado/${order.id}`, { state: { order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-wrapper" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ marginBottom: '16px', fontSize: '18px', color: 'var(--text-soft)' }}>Tu carrito está vacío.</p>
        <Link to="/productos" className="btn btn-primary" style={{ padding: '12px 28px', borderRadius: '999px' }}>Ver productos</Link>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '28px' }}>
        Finaliza tu pedido
      </h1>

      <div className="checkout-grid">
        {/* Columna Izquierda: Formulario */}
        <form ref={formRef} onSubmit={handleSubmit} className="checkout-form-section">
          {error && <div className="error-msg">{error}</div>}

          {step === 1 && (
          <>
          <div>
            <h2 className="checkout-section-title">Contacto</h2>
            <div className="checkout-input-group">
              <div className="field">
                <label>Nombre y apellido</label>
                <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ej. Ana García" />
              </div>
              <div className="checkout-row-contact">
                <div className="field">
                  <label>Correo electrónico</label>
                  <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="tu@email.com" />
                </div>
                <div className="field">
                  <label>Teléfono</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'stretch' }}>
                    <CustomSelect
                      value={form.country_code || '+52'}
                      onChange={(val) => update('country_code', val)}
                      options={COUNTRY_CODES}
                      searchable={true}
                      placeholder="Código"
                      triggerStyle={{
                        padding: '13px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: 'var(--white)',
                        fontSize: '14px',
                        height: '100%',
                        whiteSpace: 'nowrap',
                      }}
                      containerStyle={{ flexShrink: 0, minWidth: '150px' }}
                    />
                    <input
                      required
                      type="tel"
                      placeholder="10 dígitos"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="checkout-section-title">Dirección de entrega</h2>
            <div className="checkout-input-group">
              <div className="field">
                <label>Calle</label>
                <input required value={form.street} onChange={(e) => update('street', e.target.value)} placeholder="Nombre de tu calle" />
              </div>
              <div className="checkout-row-2">
                <div className="field">
                  <label>No. exterior</label>
                  <input value={form.ext_no} onChange={(e) => update('ext_no', e.target.value)} placeholder="Ej. 123" />
                </div>
                <div className="field">
                  <label>No. interior (opcional)</label>
                  <input value={form.int_no} onChange={(e) => update('int_no', e.target.value)} placeholder="Ej. Depto 402" />
                </div>
              </div>
              <div className="field">
                <label>Alcaldía o municipio</label>
                <CustomSelect
                  value={form.neighborhood}
                  onChange={handleAlcaldiaChange}
                  options={groupedOptions.length > 0 ? groupedOptions : alcaldias.map((a) => ({ label: a.name, value: a.name }))}
                  placeholder="Selecciona tu alcaldía o municipio"
                  searchable={true}
                  triggerStyle={{
                    width: '100%',
                    padding: '13px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--white)',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div className="checkout-row-3">
                <div className="field">
                  <label>Código postal</label>
                  <input
                    required
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="01000"
                    value={form.postal_code}
                    onChange={(e) => update('postal_code', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="field">
                  <label>Ciudad</label>
                  <input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Ciudad" />
                </div>
                <div className="field">
                  <label>Estado</label>
                  <input value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="CDMX" />
                </div>
              </div>
              <div className="field">
                <label>Referencias de entrega (opcional)</label>
                <textarea rows={2} value={form.references_notes} onChange={(e) => update('references_notes', e.target.value)} placeholder="Entre qué calles, color de fachada, etc." />
              </div>
            </div>
          </div>

          <button type="button" className="btn btn-primary btn-block" onClick={handleContinue} style={{ padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 600, marginTop: '8px' }}>
            Continuar
          </button>
          </>
          )}

          {step === 2 && (
          <>
          <div>
            <h2 className="checkout-section-title">Método de pago</h2>
            <div style={styles.paymentBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
                <strong>Pago contra entrega</strong>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-soft)', margin: 0, lineHeight: 1.4 }}>
                Pagas en efectivo o con transferencia cuando recibas tu espejo a domicilio.
              </p>
            </div>
          </div>

          <div>
            <h2 className="checkout-section-title">Servicios adicionales</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={form.needs_installation}
                  onChange={(e) => update('needs_installation', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--charcoal)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: 'var(--charcoal)' }}>
                  Necesito ayuda con la instalación en muro o pared
                </span>
              </label>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={form.needs_terminal_payment}
                  onChange={(e) => update('needs_terminal_payment', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--charcoal)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: 'var(--charcoal)' }}>
                  Pago con terminal
                </span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn btn-outline" onClick={() => { window.scrollTo(0, 0); setStep(1); }} style={{ padding: '16px 20px', borderRadius: '12px', fontSize: '16px', fontWeight: 600 }}>
              Regresar
            </button>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading} style={{ padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 600 }}>
              {loading ? 'Enviando pedido…' : `Confirmar pedido · ${money(total)}`}
            </button>
          </div>
          </>
          )}
        </form>

        {/* Columna Derecha: Resumen de Compra estilo Shopify */}
        <div className="checkout-summary-box">
          <div className="checkout-items-list custom-scrollbar">
            {items.map((item) => {
              const variantText = formatVariant(item.options);
              return (
                <div key={item.cartItemId || item.product_id} className="checkout-item-row">
                  <div className="checkout-item-thumb-wrap">
                    <img src={item.image_url} alt={item.name} className="checkout-item-img" />
                    <span className="checkout-item-badge">{item.quantity}</span>
                  </div>
                  <div className="checkout-item-info">
                    <div className="checkout-item-name">{item.name}</div>
                    {variantText && <div className="checkout-item-variant">{variantText}</div>}
                  </div>
                  <div className="checkout-item-price">{money(item.price * item.quantity)}</div>
                </div>
              );
            })}
          </div>

          <div className="checkout-divider"></div>

          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <span style={{ fontWeight: 500, color: 'var(--charcoal)' }}>{money(subtotal)}</span>
          </div>

          <div className="checkout-summary-row">
            <span>Envío</span>
            <span style={{ fontWeight: 500, color: 'var(--charcoal)' }}>
              {shippingCost > 0 ? money(shippingCost) : 'Por calcular'}
            </span>
          </div>

          {installationFee > 0 && (
            <div className="checkout-summary-row">
              <span>Instalación</span>
              <span style={{ fontWeight: 500, color: 'var(--charcoal)' }}>{money(installationFee)}</span>
            </div>
          )}

          <div className="checkout-divider"></div>

          <div className="checkout-total-row">
            <span className="checkout-total-label">Total</span>
            <div>
              <span className="checkout-total-currency">MXN</span>
              <span className="checkout-total-amount">{money(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--white)',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    cursor: 'pointer',
  },
  paymentBox: {
    background: '#f4f4f4',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
};

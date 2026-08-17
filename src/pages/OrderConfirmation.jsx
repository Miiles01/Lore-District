import { Link } from 'react-router-dom';

export default function OrderConfirmation() {
  return (
    <div style={styles.wrapper}>
      <img src="/icon-success.svg" alt="Pedido confirmado" style={styles.check} />
      <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>¡Gracias por tu orden!</h1>
      <p style={{ color: 'var(--text-soft)', marginBottom: '28px' }}>
        Estamos preparando tu orden. Agradecemos tu propina.
      </p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '48px 20px',
  },
  check: {
    width: '64px',
    height: '64px',
    margin: '0 auto 18px',
    display: 'block',
  },
};

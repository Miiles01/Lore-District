export default function PoliticaPrivacidad() {
  return (
    <div className="container" style={styles.wrapper}>
      <h1 style={styles.h1}>Política de privacidad</h1>
      <p style={styles.updated}>Última actualización: agosto de 2026</p>

      <Section title="1. Datos que recopilamos">
        Cuando compras, creas una cuenta o te suscribes a nuestro newsletter, recopilamos: nombre,
        correo electrónico, teléfono y dirección de envío. Esta información es necesaria para
        procesar tu pedido y darte seguimiento.
      </Section>

      <Section title="2. Para qué usamos tus datos">
        Usamos tus datos para: procesar y entregar tu pedido, contactarte sobre el estado de tu
        compra, y —solo si te suscribes voluntariamente— enviarte novedades, lanzamientos y
        promociones por correo. Puedes darte de baja del newsletter cuando quieras.
      </Section>

      <Section title="3. Con quién compartimos tu información">
        No vendemos tus datos personales a terceros. Solo los compartimos con las empresas
        necesarias para completar tu compra: paquetería (para la entrega) y el procesador de pagos
        (para cobrar tu pedido de forma segura).
      </Section>

      <Section title="4. Cookies">
        El sitio usa almacenamiento local del navegador para recordar tu carrito de compras y tu
        sesión. No usamos cookies de rastreo publicitario de terceros.
      </Section>

      <Section title="5. Tus derechos (ARCO)">
        Puedes solicitar acceder, rectificar, cancelar u oponerte al uso de tus datos personales en
        cualquier momento, escribiendo a contacto@loredistrict.com. Atenderemos tu solicitud a la
        brevedad posible.
      </Section>

      <Section title="6. Seguridad">
        Tomamos medidas razonables para proteger tu información contra acceso no autorizado. El
        pago se procesa a través de proveedores externos; Lore District no almacena los datos
        completos de tu tarjeta.
      </Section>

      <Section title="7. Cambios a esta política">
        Podemos actualizar esta política conforme crece la tienda. La versión vigente siempre
        estará disponible en esta página.
      </Section>

      <Section title="8. Contacto">
        Para cualquier duda sobre el manejo de tus datos, escríbenos a contacto@loredistrict.com.
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>{title}</h2>
      <p style={styles.p}>{children}</p>
    </section>
  );
}

const styles = {
  wrapper: {
    paddingTop: '110px',
    paddingBottom: '60px',
    maxWidth: '720px',
  },
  h1: {
    fontSize: 'clamp(28px, 5vw, 40px)',
    marginBottom: '8px',
  },
  updated: {
    fontSize: '13px',
    color: 'var(--text-soft)',
    marginBottom: '40px',
    fontFamily: 'var(--font)',
  },
  section: {
    marginBottom: '28px',
  },
  h2: {
    fontSize: '16px',
    marginBottom: '10px',
    color: 'var(--acero)',
  },
  p: {
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'var(--text-soft)',
    fontFamily: 'var(--font)',
  },
};

export default function TerminosCondiciones() {
  return (
    <div className="container" style={styles.wrapper}>
      <h1 style={styles.h1}>Términos y condiciones</h1>
      <p style={styles.updated}>Última actualización: agosto de 2026</p>

      <Section title="1. Aceptación de los términos">
        Al usar el sitio de Lore District y realizar una compra, aceptas los términos y
        condiciones descritos a continuación. Si no estás de acuerdo, te pedimos no usar el sitio.
      </Section>

      <Section title="2. Productos y precios">
        Los precios se muestran en pesos mexicanos (MXN) e incluyen los impuestos aplicables,
        salvo que se indique lo contrario. Los precios y la disponibilidad de los productos pueden
        cambiar sin previo aviso. Hacemos nuestro mejor esfuerzo para que las imágenes y
        descripciones sean precisas; pueden existir variaciones menores de color por pantalla.
      </Section>

      <Section title="3. Proceso de compra y pago">
        Al confirmar un pedido, recibirás una notificación con el resumen de tu compra. Aceptamos
        los métodos de pago indicados al momento del checkout. Nos reservamos el derecho de
        cancelar un pedido en caso de error en el precio, falta de stock o sospecha de fraude,
        notificándote lo antes posible.
      </Section>

      <Section title="4. Envíos">
        Actualmente realizamos envíos dentro de México. El costo y tiempo de entrega dependen de
        la zona seleccionada al finalizar tu compra. Los tiempos son estimados y pueden variar por
        causas ajenas a Lore District (paquetería, condiciones climáticas, etc.).
      </Section>

      <Section title="5. Cambios y devoluciones">
        Si tu producto llega con algún defecto o no corresponde a lo solicitado, contáctanos dentro
        de los 5 días posteriores a la entrega para gestionar un cambio. Por higiene, no se aceptan
        devoluciones de prendas usadas o sin etiqueta.
      </Section>

      <Section title="6. Propiedad intelectual">
        El nombre, logotipo, diseños, bordados y contenido del sitio son propiedad de Lore
        District. Queda prohibida su reproducción total o parcial sin autorización previa.
      </Section>

      <Section title="7. Limitación de responsabilidad">
        Lore District no se hace responsable por retrasos o daños ocasionados por terceros
        (paqueterías, procesadores de pago) fuera de nuestro control razonable.
      </Section>

      <Section title="8. Modificaciones">
        Podemos actualizar estos términos en cualquier momento. La versión vigente siempre estará
        disponible en esta página.
      </Section>

      <Section title="9. Contacto">
        Para dudas sobre estos términos, escríbenos a contacto@loredistrict.com.
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

import { useCart } from './context/CartContext';
import { useShipping } from './context/ShippingContext';

// Estrategia de precio dinámico de envío:
// 1. Cuando el carrito está vacío (count === 0) y hay una alcaldía seleccionada,
//    el costo de envío (que se cobra 1 sola vez por pedido) se muestra integrado
//    en el precio visual del espejo en catálogo y detalle.
// 2. Al agregar 1+ productos al carrito, el costo de envío queda cubierto en el pedido,
//    por lo que los precios de productos siguientes muestran su precio base sin duplicar envío.
// 3. Al vaciar el carrito (count === 0), vuelve a integrarse visualmente el envío.
// 4. En Checkout (Finalizar pedido), el desglose SIEMPRE muestra Subtotal + Envío por separado.
export function useDisplayPrice(basePrice) {
  const { count } = useCart();
  const { alcaldia, shippingCost } = useShipping();

  if (alcaldia && count === 0) {
    return { price: basePrice + shippingCost, shippingIncluded: true };
  }
  return { price: basePrice, shippingIncluded: false };
}

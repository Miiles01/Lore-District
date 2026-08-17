# Aprendizajes del Proyecto (Lore District)

> Este proyecto se duplicó de Mar & Vic (mismo sistema de administración, productos, checkout y mailing). Estas reglas técnicas son universales y se conservan; las específicas de espejos (formas, iluminación, base plegable) se quitaron junto con ese modelo de producto.

## 1. Proporciones de Tarjetas de Producto (Mobile & Desktop)
- **Regla**: Usar `aspectRatio: '4 / 5'` en la envoltura de la imagen (`imageWrap`) de `ProductCard.jsx` y en la vista de detalle (`ProductDetail.jsx`).
- **Motivo**: Proporciones muy alargadas hacen que las imágenes se vean gigantes en mobile al hacer scroll.

## 2. Animaciones y CSS Grid en iOS Safari
- **Regla**: No aplicar `framer-motion` ni animaciones con `transform` directamente en el contenedor `.product-grid` o sus elementos inmediatos.
- **Motivo**: En iOS Safari, cuando la barra de direcciones se contrae durante el scroll, Safari recalcula el grid. Si hay `transform` activo en los items, pierde la referencia del ancho de columnas y expande las tarjetas al 100%. Usar transiciones de `opacity` lo resuelve.

## 3. Aislamiento de Scroll en Modales y Menús Desplegables
- **Regla**:
  - En listas scrollables dentro de un desplegable (`CustomSelect`), añadir `onTouchMove={(e) => e.stopPropagation()}` y `overscrollBehavior: 'contain'`.
  - En la capa superpuesta de un modal, aplicar `touchAction: 'none'` y `overscrollBehavior: 'contain'`.
- **Motivo**: Previene que el scroll táctil en iOS Safari se propague al `body` de fondo.

## 4. Tipografía de Marca (Unbounded + Archivo)
- **Regla**: `Unbounded` (900, mayúsculas, tracking negativo -2% a -4%) para títulos (H1-H4). `Archivo` para texto de cuerpo, descripciones de producto y UI. Nunca mezclar ambas en el mismo bloque de texto.
- **Motivo**: Mantiene la identidad "Gobernante" del manual de marca — asertiva en títulos, neutral y legible en contenido informativo.

## 5. Encapsulamiento Estricto de Media Queries para `position: sticky`
- **Regla**: Nunca definir la regla base `.clase { position: sticky; }` después de un `@media (max-width: ...)` que la desactive en móvil. Encapsular `position: sticky` dentro de `@media (min-width: 901px)`.
- **Motivo**: La cascada de CSS puede sobrescribir la propiedad si la especificidad es igual, pegando por error elementos al hacer scroll en celulares.

## 6. Prevención de Desbordamiento en Resúmenes de Compra Móviles
- **Regla**: `word-break: break-word` en nombres/variantes largas, `width: 100%; box-sizing: border-box` en la tarjeta contenedora.
- **Motivo**: Textos de variantes largos (ej. tallas + colores) sin salto de línea rompen el margen derecho en móviles.

## 7. Desplegable Buscable de Código de País en Teléfono
- **Regla**: `CustomSelect` con `searchable={true}` y `grid-template-columns: 1fr 1.45fr` para la fila de Correo y Teléfono.
- **Motivo**: Permite buscar países por nombre o clave internacional sin apretar el campo de teléfono.

## 8. Estrategia de Precios Dinámicos de Envío
- **Regla**: El costo de envío por alcaldía se suma visualmente al primer producto en carrito/tarjetas; productos adicionales muestran solo su precio base. En checkout siempre se desglosa el envío como línea independiente.
- **Motivo**: Transparencia sin duplicar cargos de envío por artículo.

## 9. Modelo de Producto: Tallas y Colores (JSON flexible)
- **Regla**: `sizes` (`[{name, price}]`) y `colors` (`[{name, extra_cost}]`) son arrays JSON en la tabla `products`, editables libremente desde el admin. `garment_type` (playera/hoodie/gorra/sudadera/accesorio) alimenta el filtro del catálogo.
- **Motivo**: El mismo esquema sirvió para variantes de espejos (medida + color de marco) en Mar & Vic; se reutiliza tal cual para tallas + color de prenda, sin tocar el backend.

## 10. Auto-Migración de Zonas de Envío y Búsqueda por Estado
- **Regla**: En `api/settings.php`, auto-migrar zonas faltantes directamente en la tabla `settings`. En `CustomSelect.jsx`, normalizar acentos (`normalize("NFD")`) y usar alias para buscar sin tilde, agrupando por estado.
- **Motivo**: Sincronización sin comandos manuales en producción y mejor usabilidad de búsqueda.

## 11. Testimonios: sin datos falsos
- **Regla**: No usar nombres/fotos de clientes reales de otra marca como "testimonios" de Lore District. El componente de Testimonials se quitó del clon; se vuelve a agregar solo con reseñas reales una vez que existan clientes.
- **Motivo**: Presentar reseñas de personas reales como si fueran de esta marca es engañoso, independientemente de que el sistema técnico sea reutilizable.

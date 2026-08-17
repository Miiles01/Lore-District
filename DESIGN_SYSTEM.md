# Sistema de Diseño — Lore District

Este documento es la referencia oficial de diseño del proyecto. Cualquier persona (o IA) que
siga construyendo sobre Lore District debe apegarse a estas reglas para mantener consistencia
visual, incluso si pasa tiempo entre sesiones de trabajo o cambia quién lo desarrolla.

Fuente original: Manual de Identidad de Marca v1.0 (brief de Miiles Studio). Ante cualquier duda
que este documento no resuelva, ese manual es la autoridad.

---

## 1. Marca en una frase

Ropa de algodón de alto gramaje con bordados de calidad, inspirada en cultura pop, íconos y
estética caricaturesca. Arquetipo **Gobernante**: autoridad, calidad superior, orden con estilo
callejero auténtico. Tono: creativa, audaz, cercana. Tagline: *"La cultura se viste. La historia
continúa."*

---

## 2. Paleta de color

| Nombre | Hex | Uso |
|---|---|---|
| Obsidiana | `#1C1C1F` | Fondo (negro). |
| Blanco | `#FFFFFF` | Fondo (claro). |
| Acero | `#F2F2F2` | Texto principal sobre fondo oscuro, neutro secundario. Nunca como fondo de sección grande. |
| Rosa Neón | `#ED4A9B` | Acento de alto voltaje: CTAs, precios destacados, bordados/gráficos de impacto. Nunca como fondo de sección. |
| Azul Distrito | `#0E4EB5` | Acento eléctrico: ediciones especiales, temas de motor/velocidad. Nunca como fondo de sección. |
| Selva | `#0F4724` | Acento tierra: colecciones clásicas, nostalgia militar/anime. Nunca como fondo de sección. |
| Degradado editorial | `#806C7B → #F0C5B4` | Solo para fondos editoriales con modelos/fotografía, nunca como fondo de UI. |

### Regla de fondos (2026-08-17, decisión firme del cliente)

**Los fondos de página/sección solo pueden ser Obsidiana (negro) o Blanco. Ningún otro color —
ni Rosa Neón, ni Azul Distrito, ni Selva, ni tonos mezclados/tintados de estos— se usa como
fondo, por ahora.** Esto aplica a fondos de `<section>`, wrappers de página, y cualquier efecto
de transición de fondo (ej. el efecto de scroll del home). Los acentos de marca (Rosa Neón, Azul
Distrito, Selva) se reservan exclusivamente para: texto, botones/CTAs, bordes, badges, íconos y
detalles puntuales — nunca para pintar un fondo grande.

**Reglas de aplicación adicionales:**
- Superficies elevadas dentro de un fondo Obsidiana (tarjetas, drawers, modales) usan `#242428`
  (Obsidiana +1 nivel, sigue siendo "negro"), no un tinte de color.
- El panel `/admin` sigue siendo la única zona con fondo blanco permanente (ver sección 5).
- El **Footer** tiene fondo blanco permanente (logotipo y texto en Obsidiana) — decisión del
  2026-08-17. El **Header/Navbar** sigue con el tema oscuro de la tienda en todas las páginas.
- Nunca pastel ni degradados arcoíris. La vibra es firme, directa, audaz.

### Logo: dos versiones según fondo
- `public/brand/logotipo-lore.svg` — solo el wordmark "Lore" (script), relleno **blanco**. Usar
  sobre fondo oscuro (Header, menú móvil).
- `public/brand/logotipo-lore-district.svg` — lockup completo "Lore" + "DISTRICT", relleno
  **negro**. Usar sobre fondo blanco (Footer).

### Fotografía de producto
**No usar fotos de catálogo de otras marcas/tiendas como fotos de producto de Lore District**,
aunque el sitio esté en etapa de demo — varias muestran logos reales de marcas de ropa (Jack&Jones®,
Reese Cooper®, etc.) y son fotografía con derechos de otro retailer. Mientras no haya fotografía
propia, usar los placeholders SVG on-brand en `public/products/` (fondo Obsidiana/Selva/Acero con
el nombre del producto).

Todas las variables viven en `src/index.css` como custom properties (`--obsidiana`, `--acero`, `--rosa-neon`, `--azul-distrito`, `--selva`, `--gradient-editorial`). Los alias heredados de la duplicación técnica (`--charcoal`, `--pink`, `--cream`, `--text`, `--text-soft`, `--gold`) apuntan a estos valores — úsalos en componentes nuevos para heredar el tema automáticamente en vez de hardcodear hex.

---

## 3. Tipografía

- **Unbounded 900 (bold) se reserva exclusivamente para H1 y H2** (mayúsculas, tracking negativo
  -2% a -4%) — decisión del 2026-08-17. H3/H4 y cualquier texto de descripción/etiqueta usan
  Unbounded en un peso ligero (500), sin mayúsculas forzadas. Nunca poner bold en párrafos de
  descripción o texto de cuerpo. Regla global ya aplicada vía CSS (`h1, h2` vs `h3, h4` en
  `src/index.css`), no hace falta repetirla por componente.
- **Archivo** — todo el cuerpo de texto: descripciones, UI, formularios, datos. Nunca menor a 12pt.
- No mezclar ambas tipografías dentro del mismo bloque de texto corrido.
- Ambas se cargan vía Google Fonts en `index.html` (`Unbounded:wght@400;700;900` + `Archivo:wght@400;500;600;700`).
- Variables CSS: `--font-display` (Unbounded) y `--font` (Archivo).

---

## 4. Logotipo

- Archivo maestro: `public/brand/logotipo-lore.svg` (wordmark cursivo "Lore", relleno blanco — pensado para fondo oscuro).
- Lockup completo de marca (Lore + "DISTRICT" en versalitas debajo) está documentado en el manual original; en el navbar y en el hero **solo se usa el wordmark "Lore" solo**, sin la palabra DISTRICT — decisión de producto tomada el 2026-08-17.
- Área de seguridad mínima: margen libre equivalente al ancho de la "O" del logotipo en todos los lados.
- Tamaño mínimo: 30mm en impresión, 120px de ancho en digital.
- Nunca estirar, rotar ni alterar las proporciones del archivo vectorial maestro.

---

## 5. Layout y componentes

### Tema por zona (importante, es intencional)
- **Tienda (storefront)**: tema oscuro completo (Obsidiana + Acero + acentos). Todo lo que el cliente ve — home, catálogo, detalle, carrito, checkout, login/cuenta — sigue este tema.
- **Panel `/admin`**: tema **claro** a propósito (back-office neutral, como Shopify Admin — no tiene que llevar la marca). Esto se logra escopando overrides de las variables de color dentro de la clase `.admin-panel` en `src/index.css`, para que los mismos componentes (`var(--text-soft)`, `var(--border)`, etc.) se vean bien en ambos contextos sin duplicar código. **No** conviertas el admin a oscuro sin que te lo pidan explícitamente.

### Botones (`src/index.css`)
- `.btn-primary`: fondo Rosa Neón, texto Obsidiana. Acción principal (comprar, agregar, entrar).
- `.btn-cream`: fondo Acero, texto Obsidiana. Acción secundaria.
- `.btn-outline`: transparente, borde sutil, texto `var(--text)`. Terciario.
- Todos mayúsculas, `letter-spacing: 0.1rem`, `border-radius: 4px` (o `999px` si es pill, como el CTA del hero).

### Tarjetas y superficies
- Fondo `#242428`, borde `1px solid var(--border)`, radio `12-16px`.
- Aplica a: `ProductCard`, `CartDrawer`, `ShippingModal`, tarjetas de `AcercaDe`, tarjetas de pedidos en `Account`, login del cliente.
- Nunca uses `var(--white)` como fondo de una tarjeta en la tienda — es el bug de contraste más común al portar componentes desde el diseño claro original (texto claro sobre fondo blanco = invisible). Si copias un patrón de Mar & Vic, revisa esto primero.

### Contenedores
- `.container`: `max-width: 1080px`, padding lateral `20px`.
- Grid de productos: 2 columnas en móvil, 3 en tablet (`640px`), 4 en desktop (`960px`).

---

## 6. Contenido y copy

- **Todo el texto de cara al usuario va en español, sin anglicismos** (ej. "Acerca de", no "About Us"; "Comprar ahora", no "Buy now"). Términos de industria ya asentados en el manual de marca (bordado, gramaje, alto gramaje) son la referencia de vocabulario.
- **Nunca inventar testimonios, reseñas o nombres/fotos de clientes.** El componente de testimonios de Mar & Vic se eliminó por completo al duplicar el proyecto porque usaba datos reales de otra marca — no reconstruir con datos falsos. Solo con reseñas reales de Lore District.
- Productos placeholder actuales (`api/seed.php`) son de relleno hasta tener fotografía/diseños reales — están marcados visualmente como placeholders (SVG con el nombre del producto), no como fotos reales de producto.

---

## 7. Dónde está cada cosa

- Paleta y tipografía: `src/index.css` (`:root`)
- Componentes de marca: `src/components/Header.jsx`, `Footer.jsx`
- Página de marca: `src/pages/AcercaDe.jsx`
- Aprendizajes técnicos (iOS Safari, sticky, scroll, etc.): `LEARNINGS.md`
- Manual de identidad original (PDF completo): fuera del repo, en `~/Downloads/Lore District.pdf` del usuario — pedirle que lo vuelva a compartir si hace falta consultarlo a detalle.

---

## 8. Cómo usar este archivo con un asistente de IA

Si le vas a pedir a una IA que siga construyendo la página, dile explícitamente:
*"Con base al sistema de diseño en `DESIGN_SYSTEM.md` de este repositorio, construye/ajusta [parte de la página]."*
Eso evita que reinvente colores, tipografías o patrones de componente distintos a los ya establecidos.

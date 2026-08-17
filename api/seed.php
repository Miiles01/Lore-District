<?php
require __DIR__ . '/bootstrap.php';

try {
    $db = db();

    // Zonas de envío (CDMX/Edomex) — mismos criterios que el resto del sistema.
    $default_shipping = json_encode([
        '01' => ['name' => 'Álvaro Obregón', 'cost' => 250, 'state' => 'Ciudad de México'],
        '02' => ['name' => 'Azcapotzalco', 'cost' => 300, 'state' => 'Ciudad de México'],
        '03' => ['name' => 'Benito Juárez', 'cost' => 200, 'state' => 'Ciudad de México'],
        '04' => ['name' => 'Coyoacán', 'cost' => 200, 'state' => 'Ciudad de México'],
        '05' => ['name' => 'Cuajimalpa', 'cost' => 350, 'state' => 'Ciudad de México'],
        '06' => ['name' => 'Cuauhtémoc', 'cost' => 200, 'state' => 'Ciudad de México'],
        '07' => ['name' => 'Gustavo A. Madero', 'cost' => 200, 'state' => 'Ciudad de México'],
        '08' => ['name' => 'Iztacalco', 'cost' => 200, 'state' => 'Ciudad de México'],
        '09' => ['name' => 'Iztapalapa', 'cost' => 200, 'state' => 'Ciudad de México'],
        '10' => ['name' => 'La Magdalena Contreras', 'cost' => 350, 'state' => 'Ciudad de México'],
        '11' => ['name' => 'Miguel Hidalgo', 'cost' => 250, 'state' => 'Ciudad de México'],
        '12' => ['name' => 'Milpa Alta', 'cost' => 300, 'state' => 'Ciudad de México'],
        '13' => ['name' => 'Tláhuac', 'cost' => 200, 'state' => 'Ciudad de México'],
        '14' => ['name' => 'Tlalpan', 'cost' => 300, 'state' => 'Ciudad de México'],
        '15' => ['name' => 'Venustiano Carranza', 'cost' => 200, 'state' => 'Ciudad de México'],
        '16' => ['name' => 'Xochimilco', 'cost' => 200, 'state' => 'Ciudad de México'],
        '50' => ['name' => 'Nezahualcóyotl', 'cost' => 200, 'state' => 'Estado de México'],
        '58' => ['name' => 'Ecatepec de Morelos', 'cost' => 300, 'state' => 'Estado de México'],
        '59' => ['name' => 'Tlalnepantla de Baz', 'cost' => 350, 'state' => 'Estado de México'],
        '60' => ['name' => 'Naucalpan de Juárez', 'cost' => 350, 'state' => 'Estado de México'],
    ], JSON_UNESCAPED_UNICODE);

    $db->exec("INSERT IGNORE INTO settings (skey, svalue) VALUES ('shipping_zones', '$default_shipping')");

    // Categorías
    $cats = [
        'Playeras' => 'playeras',
        'Hoodies' => 'hoodies',
        'Gorras' => 'gorras',
    ];
    $cat_ids = [];
    foreach ($cats as $name => $slug) {
        $st = $db->query("SELECT id FROM categories WHERE slug = '$slug'");
        $cat = $st->fetch();
        if (!$cat) {
            $db->exec("INSERT INTO categories (name, slug, position) VALUES ('$name', '$slug', 1)");
            $cat_ids[$slug] = $db->lastInsertId();
        } else {
            $cat_ids[$slug] = $cat['id'];
        }
    }

    // Tallas estándar (mismo precio en todas; el precio real se ajusta por prenda)
    function tallas($precio) {
        return json_encode([
            ['name' => 'S', 'price' => $precio],
            ['name' => 'M', 'price' => $precio],
            ['name' => 'L', 'price' => $precio],
            ['name' => 'XL', 'price' => $precio],
            ['name' => 'XXL', 'price' => $precio],
        ], JSON_UNESCAPED_UNICODE);
    }

    $colores_obsidiana_selva = json_encode([
        ['name' => 'Obsidiana', 'extra_cost' => 0],
        ['name' => 'Selva', 'extra_cost' => 0],
    ], JSON_UNESCAPED_UNICODE);
    $colores_obsidiana_acero = json_encode([
        ['name' => 'Obsidiana', 'extra_cost' => 0],
        ['name' => 'Acero', 'extra_cost' => 0],
    ], JSON_UNESCAPED_UNICODE);
    $colores_solo_obsidiana = json_encode([
        ['name' => 'Obsidiana', 'extra_cost' => 0],
    ], JSON_UNESCAPED_UNICODE);

    $examples = [
        [
            'name' => 'Playera Arcade Bordada',
            'slug' => 'playera-arcade-bordada',
            'cat' => 'playeras',
            'description' => 'Playera de algodón de alto gramaje con bordado arcade retro en el pecho. Cultura pop, corte oversize, tela que aguanta lavadas sin perder forma.',
            'image_url' => '/products/placeholder-playera-arcade.svg',
            'garment_type' => 'playera',
            'sizes' => tallas(650),
            'colors' => $colores_obsidiana_selva,
        ],
        [
            'name' => 'Playera Culto Bordada',
            'slug' => 'playera-culto-bordada',
            'cat' => 'playeras',
            'description' => 'Playera oversize inspirada en cine de culto, bordado de alta precisión en manga. Algodón pesado, silueta amplia.',
            'image_url' => '/products/placeholder-playera-culto.svg',
            'garment_type' => 'playera',
            'sizes' => tallas(680),
            'colors' => $colores_obsidiana_acero,
        ],
        [
            'name' => 'Hoodie Selva Bordado',
            'slug' => 'hoodie-selva-bordado',
            'cat' => 'hoodies',
            'description' => 'Hoodie de felpa gruesa con bordado nostalgia militar en el pecho. Corte sobredimensionado, bolsillo canguro, gorro forrado.',
            'image_url' => '/products/fotos/hoodie-selva-01.png',
            'garment_type' => 'hoodie',
            'sizes' => tallas(1250),
            'colors' => $colores_obsidiana_selva,
        ],
        [
            'name' => 'Hoodie Distrito Bordado',
            'slug' => 'hoodie-distrito-bordado',
            'cat' => 'hoodies',
            'description' => 'Hoodie de edición especial con bordado inspirado en motor y velocidad. Algodón de alto gramaje, cierre en costuras vivas.',
            'image_url' => '/products/fotos/hoodie-distrito-01.png',
            'garment_type' => 'hoodie',
            'sizes' => tallas(1350),
            'colors' => $colores_obsidiana_acero,
        ],
        [
            'name' => 'Gorra Lore Bordada',
            'slug' => 'gorra-lore-bordada',
            'cat' => 'gorras',
            'description' => 'Gorra de 6 paneles con el logotipo Lore bordado al frente. Ajuste trasero, mezclilla resistente.',
            'image_url' => '/products/placeholder-gorra-lore.svg',
            'garment_type' => 'gorra',
            'sizes' => json_encode([['name' => 'Única', 'price' => 480]], JSON_UNESCAPED_UNICODE),
            'colors' => $colores_solo_obsidiana,
        ],
        [
            'name' => 'Playera 1UP Bordada',
            'slug' => 'playera-1up-bordada',
            'cat' => 'playeras',
            'description' => 'Playera con parche bordado estilo videojuego retro "1UP". Corte oversize, algodón grueso, ideal para capas.',
            'image_url' => '/products/placeholder-playera-1up.svg',
            'garment_type' => 'playera',
            'sizes' => tallas(650),
            'colors' => $colores_obsidiana_acero,
        ],
    ];

    foreach ($examples as $p) {
        $cat_id = $cat_ids[$p['cat']];

        $st_check = $db->prepare("SELECT id FROM products WHERE slug = ?");
        $st_check->execute([$p['slug']]);
        $existing = $st_check->fetch();

        if ($existing) {
            $st_upd = $db->prepare("UPDATE products SET
                category_id = ?, name = ?, description = ?, image_url = ?, garment_type = ?,
                sizes = ?, colors = ?
                WHERE id = ?");
            $st_upd->execute([
                $cat_id,
                $p['name'],
                $p['description'],
                $p['image_url'],
                $p['garment_type'],
                $p['sizes'],
                $p['colors'],
                $existing['id']
            ]);
        } else {
            $st_ins = $db->prepare("INSERT INTO products
                (category_id, name, slug, description, image_url, gallery, stock, active, featured, garment_type, sizes, colors)
                VALUES (?, ?, ?, ?, ?, '[]', 500, 1, 1, ?, ?, ?)");
            $st_ins->execute([
                $cat_id,
                $p['name'],
                $p['slug'],
                $p['description'],
                $p['image_url'],
                $p['garment_type'],
                $p['sizes'],
                $p['colors'],
            ]);
        }
    }

    if (php_sapi_name() === 'cli') {
        echo "✅ Productos de Lore District sembrados exitosamente.\n";
    }
} catch (Exception $e) {
    if (php_sapi_name() === 'cli') {
        echo "❌ Error: " . $e->getMessage() . "\n";
    }
}

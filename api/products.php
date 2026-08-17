<?php
require __DIR__ . '/bootstrap.php';

function out_product(array $p): array
{
    $p['discount_value'] = $p['discount_value'] !== null ? (float) $p['discount_value'] : null;
    $p['active'] = (bool) $p['active'];
    $p['featured'] = (bool) $p['featured'];
    $p['stock'] = (int) $p['stock'];
    $p['gallery'] = json_decode($p['gallery'] ?: '[]', true) ?: [];
    $sizes = json_decode($p['sizes'] ?: '[]', true) ?: [];
    usort($sizes, function($a, $b) {
        return (float)($a['price'] ?? 0) <=> (float)($b['price'] ?? 0);
    });
    $p['sizes'] = $sizes;
    $p['colors'] = json_decode($p['colors'] ?: '[]', true) ?: [];
    return $p;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (!empty($_GET['slug'])) {
        $st = db()->prepare('SELECT * FROM products WHERE slug = ? AND active = 1');
        $st->execute([$_GET['slug']]);
        $product = $st->fetch();
        if (!$product) {
            fail('Producto no encontrado', 404);
        }
        respond(out_product($product));
    }

    $where = ['active = 1'];
    $params = [];
    if (!empty($_GET['category'])) {
        $where[] = 'category_id = (SELECT id FROM categories WHERE slug = ?)';
        $params[] = $_GET['category'];
    }
    if (!empty($_GET['featured'])) {
        $where[] = 'featured = 1';
    }
    if (!empty($_GET['garment_type'])) {
        $where[] = 'garment_type = ?';
        $params[] = $_GET['garment_type'];
    }
    $sql = 'SELECT * FROM products WHERE ' . implode(' AND ', $where) . ' ORDER BY position ASC, created_at DESC';
    $st = db()->prepare($sql);
    $st->execute($params);
    respond(array_map('out_product', $st->fetchAll()));
}

// Altas/edición/borrado: solo administrador
require_admin();
$data = json_input();

if ($method === 'POST') {
    $name = trim((string) ($data['name'] ?? ''));
    if ($name === '') {
        fail('El nombre es obligatorio');
    }
    $slug = slugify($name);
    $base = $slug;
    $i = 2;
    while (true) {
        $st = db()->prepare('SELECT id FROM products WHERE slug = ?');
        $st->execute([$slug]);
        if (!$st->fetch()) {
            break;
        }
        $slug = $base . '-' . $i++;
    }

    $st = db()->prepare('INSERT INTO products
        (category_id, name, slug, description, discount_type, discount_value, image_url, gallery, stock, active, featured, garment_type, position, sizes, colors)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $st->execute([
        $data['category_id'] ?? null,
        $name,
        $slug,
        (string) ($data['description'] ?? ''),
        isset($data['discount_type']) && in_array($data['discount_type'], ['fixed', 'percentage']) ? $data['discount_type'] : null,
        isset($data['discount_value']) && $data['discount_value'] !== '' ? (float) $data['discount_value'] : null,
        (string) ($data['image_url'] ?? ''),
        json_encode($data['gallery'] ?? [], JSON_UNESCAPED_UNICODE),
        (int) ($data['stock'] ?? 0),
        !empty($data['active']) ? 1 : 0,
        !empty($data['featured']) ? 1 : 0,
        (string) ($data['garment_type'] ?? ''),
        (int) ($data['position'] ?? 0),
        json_encode($data['sizes'] ?? [], JSON_UNESCAPED_UNICODE),
        json_encode($data['colors'] ?? [], JSON_UNESCAPED_UNICODE),
    ]);
    respond(['id' => (int) db()->lastInsertId(), 'slug' => $slug], 201);
}

if ($method === 'PUT') {
    $id = (int) ($data['id'] ?? 0);
    if (!$id) {
        fail('Falta el id del producto');
    }
    $st = db()->prepare('SELECT id FROM products WHERE id = ?');
    $st->execute([$id]);
    if (!$st->fetch()) {
        fail('Producto no encontrado', 404);
    }

    $st = db()->prepare('UPDATE products SET
        category_id = ?, name = ?, description = ?, discount_type = ?, discount_value = ?, image_url = ?, gallery = ?,
        stock = ?, active = ?, featured = ?, garment_type = ?, position = ?,
        sizes = ?, colors = ?
        WHERE id = ?');
    $st->execute([
        $data['category_id'] ?? null,
        trim((string) ($data['name'] ?? '')),
        (string) ($data['description'] ?? ''),
        isset($data['discount_type']) && in_array($data['discount_type'], ['fixed', 'percentage']) ? $data['discount_type'] : null,
        isset($data['discount_value']) && $data['discount_value'] !== '' ? (float) $data['discount_value'] : null,
        (string) ($data['image_url'] ?? ''),
        json_encode($data['gallery'] ?? [], JSON_UNESCAPED_UNICODE),
        (int) ($data['stock'] ?? 0),
        !empty($data['active']) ? 1 : 0,
        !empty($data['featured']) ? 1 : 0,
        (string) ($data['garment_type'] ?? ''),
        (int) ($data['position'] ?? 0),
        json_encode($data['sizes'] ?? [], JSON_UNESCAPED_UNICODE),
        json_encode($data['colors'] ?? [], JSON_UNESCAPED_UNICODE),
        $id,
    ]);
    respond(['ok' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($data['id'] ?? ($_GET['id'] ?? 0));
    if (!$id) {
        fail('Falta el id del producto');
    }
    db()->prepare('UPDATE products SET active = 0 WHERE id = ?')->execute([$id]);
    respond(['ok' => true]);
}

fail('Método no soportado', 405);

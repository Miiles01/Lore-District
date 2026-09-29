<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Método no soportado', 405);
}

$data = json_input();
$items = $data['items'] ?? [];
if (!is_array($items) || count($items) === 0) {
    fail('Tu carrito está vacío');
}

$name = trim((string) ($data['name'] ?? ''));
$email = mb_strtolower(trim((string) ($data['email'] ?? '')));
$phone = trim((string) ($data['phone'] ?? ''));
$street = trim((string) ($data['street'] ?? ''));
$extNo = trim((string) ($data['ext_no'] ?? ''));
$intNo = trim((string) ($data['int_no'] ?? ''));
$neighborhood = trim((string) ($data['neighborhood'] ?? ''));
$city = trim((string) ($data['city'] ?? ''));
$state = trim((string) ($data['state'] ?? ''));
$postalCode = trim((string) ($data['postal_code'] ?? ''));
$referencesNotes = trim((string) ($data['references_notes'] ?? ''));
$needsInstallation = !empty($data['needs_installation']);
$alcaldia = trim((string) ($data['alcaldia'] ?? ''));

if (mb_strlen($name) < 2) {
    fail('Escribe tu nombre completo');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Correo inválido');
}
if (mb_strlen(preg_replace('/\D+/', '', $phone)) < 10) {
    fail('Escribe un teléfono a 10 dígitos');
}
if ($street === '') {
    fail('Escribe tu calle');
}
if (!preg_match('/^\d{5}$/', $postalCode)) {
    fail('El código postal debe tener 5 dígitos');
}

// El costo de envío y la configuración global se leen de la BD
$st = db()->query('SELECT skey, svalue FROM settings WHERE skey IN ("shipping_zones", "global_installation_price")');
$settings = [];
foreach ($st->fetchAll() as $row) {
    $settings[$row['skey']] = $row['svalue'];
}
$zipRanges = json_decode($settings['shipping_zones'] ?? '{}', true) ?: [];
$globalInstallation = (float) ($settings['global_installation_price'] ?? 50);

$prefix = substr($postalCode, 0, 2);
if (!isset($zipRanges[$prefix])) {
    fail('Lo sentimos, no contamos con envíos para este código postal por el momento.');
}
$shippingFee = (float) $zipRanges[$prefix]['cost'];
$alcaldia = $zipRanges[$prefix]['name'];

// Identidad del comprador: reutiliza la sesión si ya inició sesión; si no,
// busca cuenta existente por correo o crea una nueva (estilo Shopify: los
// datos de pago/entrega dan de alta la cuenta, sin pedir contraseña antes).
$user = current_user();
if (!$user) {
    $st = db()->prepare('SELECT id, name, email, phone FROM users WHERE email = ?');
    $st->execute([$email]);
    $existing = $st->fetch();
    if ($existing) {
        $user = $existing;
    } else {
        $randomPassword = bin2hex(random_bytes(16));
        $st = db()->prepare("INSERT INTO users (role, name, email, phone, password_hash) VALUES ('customer', ?, ?, ?, ?)");
        $st->execute([$name, $email, $phone, password_hash($randomPassword, PASSWORD_BCRYPT)]);
        $uid = (int) db()->lastInsertId();
        session_regenerate_id(true);
        $_SESSION['uid'] = $uid;
        $user = current_user();
    }
}

// Precios y disponibilidad siempre se validan en servidor, nunca se confía en el cliente.
$productIds = array_map(fn($i) => (int) ($i['product_id'] ?? 0), $items);
$placeholders = implode(',', array_fill(0, count($productIds), '?'));
$st = db()->prepare("SELECT * FROM products WHERE id IN ($placeholders) AND active = 1");
$st->execute($productIds);
$products = [];
foreach ($st->fetchAll() as $p) {
    $products[(int) $p['id']] = $p;
}

$subtotal = 0.0;
$installationFee = 0.0;
$orderItems = [];

// Instalación global
if ($needsInstallation) {
    $installationFee = $globalInstallation;
}

foreach ($items as $item) {
    $pid = (int) ($item['product_id'] ?? 0);
    $qty = max(1, (int) ($item['quantity'] ?? 1));
    $options = $item['options'] ?? [];
    
    if (!isset($products[$pid])) {
        fail('Uno de los productos ya no está disponible');
    }
    $p = $products[$pid];
    
    // Parse JSON options
    $db_sizes = json_decode($p['sizes'] ?: '[]', true) ?: [];
    $db_lighting = json_decode($p['lighting_options'] ?: '[]', true) ?: [];
    $db_base = json_decode($p['folding_base_options'] ?: '[]', true) ?: [];
    $db_colors = json_decode($p['frame_colors'] ?: '[]', true) ?: [];
    
    $unitPrice = 0.0;
    
    // Size base price
    $sel_size = $options['size'] ?? '';
    $found_size = false;
    foreach ($db_sizes as $s) {
        if ($s['name'] === $sel_size) {
            $unitPrice += (float) $s['price'];
            $found_size = true;
            break;
        }
    }
    if (!$found_size && count($db_sizes) > 0) {
        $unitPrice += (float) $db_sizes[0]['price']; // fallback
    }
    
    // Lighting extra
    $sel_lighting = $options['lighting'] ?? '';
    foreach ($db_lighting as $l) {
        if ($l['name'] === $sel_lighting) {
            $unitPrice += (float) $l['extra_cost'];
            break;
        }
    }
    
    // Base extra
    $sel_base = $options['base'] ?? '';
    foreach ($db_base as $b) {
        if ($b['name'] === $sel_base) {
            $unitPrice += (float) $b['extra_cost'];
            break;
        }
    }
    
    // Color extra
    $sel_color = $options['color'] ?? '';
    foreach ($db_colors as $c) {
        if ($c['name'] === $sel_color) {
            $unitPrice += (float) $c['extra_cost'];
            break;
        }
    }
    
    // Discount
    if ($p['discount_type'] === 'fixed') {
        $unitPrice -= (float) $p['discount_value'];
    } elseif ($p['discount_type'] === 'percentage') {
        $unitPrice -= $unitPrice * ((float) $p['discount_value'] / 100);
    }
    
    $unitPrice = max(0, $unitPrice); // No negative prices

    $lineTotal = $unitPrice * $qty;
    $subtotal += $lineTotal;

    // Texto legible de las opciones elegidas (color de marco, tamaño, iluminación, base)
    $optionsParts = array_filter([$sel_color, $sel_size, $sel_lighting, $sel_base], fn($v) => $v !== '');
    $optionsText = implode(' / ', $optionsParts);

    $orderItems[] = [
        'product_id' => $pid,
        'product_name' => $p['name'],
        'product_image' => $p['image_url'],
        'unit_price' => $unitPrice,
        'quantity' => $qty,
        'options_text' => $optionsText,
        'line_total' => $lineTotal,
    ];
}

$total = $subtotal + $installationFee + $shippingFee;

$st = db()->prepare('INSERT INTO orders
    (user_id, customer_name, customer_email, customer_phone, street, ext_no, int_no, neighborhood, city, state, postal_code, references_notes, needs_installation, alcaldia, payment_method, status, subtotal, installation_fee, shipping_fee, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
$st->execute([
    $user['id'], $name, $email, $phone,
    $street, $extNo, $intNo, $neighborhood, $city, $state, $postalCode, $referencesNotes,
    $needsInstallation ? 1 : 0, $alcaldia,
    'contra_entrega', 'pendiente',
    $subtotal, $installationFee, $shippingFee, $total,
]);
$orderId = (int) db()->lastInsertId();

$stItem = db()->prepare('INSERT INTO order_items (order_id, product_id, product_name, product_image, unit_price, quantity, options_text, line_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
foreach ($orderItems as $oi) {
    $stItem->execute([$orderId, $oi['product_id'], $oi['product_name'], $oi['product_image'], $oi['unit_price'], $oi['quantity'], $oi['options_text'], $oi['line_total']]);
}

$order = [
    'id' => $orderId,
    'items' => $orderItems,
    'subtotal' => $subtotal,
    'installation_fee' => $installationFee,
    'shipping_fee' => $shippingFee,
    'total' => $total,
    'needs_installation' => $needsInstallation,
    'alcaldia' => $alcaldia,
    'customer_name' => $name,
    'customer_phone' => $phone,
    'customer_email' => $email,
    'street' => $street,
    'ext_no' => $extNo,
    'int_no' => $intNo,
    'neighborhood' => $neighborhood,
    'city' => $city,
    'state' => $state,
    'references_notes' => $referencesNotes,
    'postal_code' => $postalCode,
];

notify_new_order($order);

respond($order, 201);

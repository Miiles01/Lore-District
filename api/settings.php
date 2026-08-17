<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    fail('Método no soportado', 405);
}

$st = db()->query('SELECT skey, svalue FROM settings WHERE skey IN ("shipping_zones", "global_installation_price")');
$settings = [];
foreach ($st->fetchAll() as $row) {
    $settings[$row['skey']] = $row['svalue'];
}

$zones = json_decode($settings['shipping_zones'] ?? '{}', true) ?: [];

$defaultEdomex = [
    '50' => ['name' => 'Nezahualcóyotl', 'cost' => 200, 'state' => 'Estado de México'],
    '51' => ['name' => 'Chimalhuacán', 'cost' => 250, 'state' => 'Estado de México'],
    '52' => ['name' => 'La Paz', 'cost' => 200, 'state' => 'Estado de México'],
    '53' => ['name' => 'Chicoloapan', 'cost' => 250, 'state' => 'Estado de México'],
    '54' => ['name' => 'Texcoco', 'cost' => 300, 'state' => 'Estado de México'],
    '55' => ['name' => 'Valle de Chalco Solidaridad', 'cost' => 250, 'state' => 'Estado de México'],
    '56' => ['name' => 'Ixtapaluca', 'cost' => 300, 'state' => 'Estado de México'],
    '57' => ['name' => 'Chalco', 'cost' => 250, 'state' => 'Estado de México'],
    '58' => ['name' => 'Ecatepec de Morelos', 'cost' => 300, 'state' => 'Estado de México'],
    '59' => ['name' => 'Tlalnepantla de Baz', 'cost' => 350, 'state' => 'Estado de México'],
    '60' => ['name' => 'Naucalpan de Juárez', 'cost' => 350, 'state' => 'Estado de México'],
    '61' => ['name' => 'Atizapán de Zaragoza', 'cost' => 400, 'state' => 'Estado de México'],
    '62' => ['name' => 'Nicolás Romero', 'cost' => 400, 'state' => 'Estado de México'],
    '63' => ['name' => 'Cuautitlán Izcalli', 'cost' => 400, 'state' => 'Estado de México'],
    '64' => ['name' => 'Tultitlán', 'cost' => 350, 'state' => 'Estado de México']
];

// Ensure CDMX entries have state set
foreach ($zones as $k => &$z) {
    if (empty($z['state'])) {
        $z['state'] = 'Ciudad de México';
    }
}
unset($z);

// Auto-heal production DB: if EDOMEX missing, merge & save to DB
$needsSave = false;
foreach ($defaultEdomex as $k => $v) {
    if (!isset($zones[$k])) {
        $zones[$k] = $v;
        $needsSave = true;
    }
}

if ($needsSave) {
    try {
        $stSave = db()->prepare('UPDATE settings SET svalue = ? WHERE skey = "shipping_zones"');
        $stSave->execute([json_encode($zones, JSON_UNESCAPED_UNICODE)]);
    } catch (Exception $e) {
        // Ignore DB write errors
    }
}

$response = [];
$response['shipping_zones'] = $zones;
$response['global_installation_price'] = (float) ($settings['global_installation_price'] ?? 50);

respond($response);

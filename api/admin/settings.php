<?php
require dirname(__DIR__) . '/bootstrap.php';
require_admin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $st = db()->query('SELECT skey, svalue FROM settings');
    $settings = [];
    foreach ($st->fetchAll() as $row) {
        $settings[$row['skey']] = $row['svalue'];
    }
    
    // Parse json settings if needed
    if (isset($settings['shipping_zones'])) {
        $settings['shipping_zones'] = json_decode($settings['shipping_zones'], true);
    }
    if (isset($settings['global_installation_price'])) {
        $settings['global_installation_price'] = (float) $settings['global_installation_price'];
    }
    
    respond($settings);
}

if ($method === 'PUT') {
    $data = json_input();
    
    $st = db()->prepare('INSERT INTO settings (skey, svalue) VALUES (?, ?) ON DUPLICATE KEY UPDATE svalue = VALUES(svalue)');
    
    if (isset($data['shipping_zones'])) {
        $st->execute(['shipping_zones', json_encode($data['shipping_zones'], JSON_UNESCAPED_UNICODE)]);
    }
    
    if (isset($data['global_installation_price'])) {
        $st->execute(['global_installation_price', (string) ((float) $data['global_installation_price'])]);
    }
    
    respond(['ok' => true]);
}

fail('Método no soportado', 405);

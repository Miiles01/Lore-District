<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    fail('Método no soportado', 405);
}

$user = require_auth();

$st = db()->prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
$st->execute([$user['id']]);
$orders = $st->fetchAll();

$stItems = db()->prepare('SELECT * FROM order_items WHERE order_id = ?');
foreach ($orders as &$order) {
    $order['subtotal'] = (float) $order['subtotal'];
    $order['installation_fee'] = (float) $order['installation_fee'];
    $order['shipping_fee'] = (float) $order['shipping_fee'];
    $order['total'] = (float) $order['total'];
    $order['needs_installation'] = (bool) $order['needs_installation'];
    $stItems->execute([$order['id']]);
    $order['items'] = $stItems->fetchAll();
}

respond($orders);

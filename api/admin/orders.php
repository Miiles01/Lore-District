<?php
require __DIR__ . '/../bootstrap.php';
require_admin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $orders = db()->query('SELECT * FROM orders ORDER BY created_at DESC')->fetchAll();
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
}

if ($method === 'PUT') {
    $data = json_input();
    $id = (int) ($data['id'] ?? 0);
    $status = (string) ($data['status'] ?? '');
    $allowed = ['pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado'];
    if (!$id || !in_array($status, $allowed, true)) {
        fail('Datos inválidos');
    }
    db()->prepare('UPDATE orders SET status = ? WHERE id = ?')->execute([$status, $id]);
    respond(['ok' => true]);
}

fail('Método no soportado', 405);

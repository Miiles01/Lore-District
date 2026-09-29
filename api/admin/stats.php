<?php
require __DIR__ . '/../bootstrap.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    fail('Método no soportado', 405);
}

$totalOrders = (int) db()->query('SELECT COUNT(*) c FROM orders')->fetch()['c'];
$totalRevenue = (float) db()->query("SELECT COALESCE(SUM(total),0) t FROM orders WHERE status != 'cancelado'")->fetch()['t'];
$pendingOrders = (int) db()->query("SELECT COUNT(*) c FROM orders WHERE status = 'pendiente'")->fetch()['c'];
$totalCustomers = (int) db()->query("SELECT COUNT(*) c FROM users WHERE role = 'customer'")->fetch()['c'];
$totalProducts = (int) db()->query('SELECT COUNT(*) c FROM products WHERE active = 1')->fetch()['c'];

$last7 = db()->query("
    SELECT DATE(created_at) d, COUNT(*) orders, COALESCE(SUM(total),0) revenue
    FROM orders
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND status != 'cancelado'
    GROUP BY DATE(created_at)
    ORDER BY d ASC
")->fetchAll();

$topProducts = db()->query("
    SELECT product_name, SUM(quantity) units, SUM(line_total) revenue
    FROM order_items
    GROUP BY product_name
    ORDER BY units DESC
    LIMIT 5
")->fetchAll();

respond([
    'total_orders' => $totalOrders,
    'total_revenue' => $totalRevenue,
    'pending_orders' => $pendingOrders,
    'total_customers' => $totalCustomers,
    'total_products' => $totalProducts,
    'last_7_days' => $last7,
    'top_products' => $topProducts,
]);

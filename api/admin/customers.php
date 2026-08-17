<?php
require __DIR__ . '/../bootstrap.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    fail('Método no soportado', 405);
}

$rows = db()->query("
    SELECT u.id, u.name, u.email, u.phone, u.created_at,
           COUNT(o.id) orders_count, COALESCE(SUM(CASE WHEN o.status != 'cancelado' THEN o.total ELSE 0 END),0) total_spent
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    WHERE u.role = 'customer'
    GROUP BY u.id
    ORDER BY u.created_at DESC
")->fetchAll();

foreach ($rows as &$r) {
    $r['orders_count'] = (int) $r['orders_count'];
    $r['total_spent'] = (float) $r['total_spent'];
}

respond($rows);

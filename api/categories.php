<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    fail('Método no soportado', 405);
}

respond(db()->query('SELECT id, name, slug FROM categories ORDER BY position ASC, name ASC')->fetchAll());

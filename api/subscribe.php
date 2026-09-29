<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Método no soportado', 405);
}

$data = json_input();
$email = mb_strtolower(trim((string) ($data['email'] ?? '')));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Escribe un correo válido');
}

$st = db()->prepare('INSERT IGNORE INTO subscribers (email) VALUES (?)');
$st->execute([$email]);

respond(['ok' => true]);

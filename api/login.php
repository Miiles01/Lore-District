<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Método no soportado', 405);
}

$data = json_input();
$email = mb_strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');

$st = db()->prepare('SELECT id, password_hash FROM users WHERE email = ?');
$st->execute([$email]);
$row = $st->fetch();

if (!$row || !password_verify($password, $row['password_hash'])) {
    fail('Correo o contraseña incorrectos', 401);
}

session_regenerate_id(true);
$_SESSION['uid'] = (int) $row['id'];

respond(current_user());

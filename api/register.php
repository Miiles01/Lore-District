<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Método no soportado', 405);
}

$data = json_input();
$name = trim((string) ($data['name'] ?? ''));
$email = mb_strtolower(trim((string) ($data['email'] ?? '')));
$phone = trim((string) ($data['phone'] ?? ''));
$password = (string) ($data['password'] ?? '');

if (mb_strlen($name) < 2) {
    fail('Escribe tu nombre completo');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Correo inválido');
}
if (mb_strlen($password) < 6) {
    fail('La contraseña necesita al menos 6 caracteres');
}

$st = db()->prepare('SELECT id FROM users WHERE email = ?');
$st->execute([$email]);
if ($st->fetch()) {
    fail('Ya existe una cuenta con ese correo');
}

$st = db()->prepare("INSERT INTO users (role, name, email, phone, password_hash) VALUES ('customer', ?, ?, ?, ?)");
$st->execute([$name, $email, $phone, password_hash($password, PASSWORD_BCRYPT)]);
$uid = (int) db()->lastInsertId();

session_regenerate_id(true);
$_SESSION['uid'] = $uid;

respond(current_user(), 201);

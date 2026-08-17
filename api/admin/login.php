<?php
require __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Método no soportado', 405);
}

$data = json_input();
$password = (string) ($data['password'] ?? '');
$hash = $GLOBALS['config']['admin_password_hash'] ?? '';

if ($hash === '' || $hash === 'GENERA_TU_HASH_AQUI' || !password_verify($password, $hash)) {
    fail('Contraseña incorrecta', 401);
}

session_regenerate_id(true);
$_SESSION['is_admin'] = true;

respond(['ok' => true]);

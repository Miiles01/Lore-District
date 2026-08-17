<?php
declare(strict_types=1);

// config.local.php (ignorado por git) tiene prioridad: es la config de desarrollo local.
// config.php es la configuración de producción (Hostinger).
$configFile = file_exists(__DIR__ . '/config.local.php')
    ? __DIR__ . '/config.local.php'
    : __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    error_log('Lore District: falta api/config.php (copia api/config.example.php y llena tus datos)');
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Estamos terminando de configurar el sitio. Intenta de nuevo en unos minutos.'], JSON_UNESCAPED_UNICODE);
    exit;
}
$GLOBALS['config'] = require $configFile;

date_default_timezone_set($GLOBALS['config']['timezone'] ?? 'America/Mexico_City');

ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

set_exception_handler(function (Throwable $e) {
    error_log('Lore District: ' . $e->getMessage());
    http_response_code(500);
    $out = ['error' => 'Algo salió mal de nuestro lado. Intenta de nuevo en unos minutos.'];
    if (!empty($GLOBALS['config']['debug'])) {
        $out['detail'] = $e->getMessage();
    }
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
});

session_name('loredistrict_session');
session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
    'secure'   => !empty($_SERVER['HTTPS']),
    'path'     => '/',
]);
session_start();

function respond($data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(string $message, int $code = 400): void
{
    respond(['error' => $message], $code);
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '[]', true);
    return is_array($data) ? $data : [];
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }
    $config = $GLOBALS['config'];
    $pdo = new PDO(
        sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['db_host'], $config['db_name']),
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    return $pdo;
}

function slugify(string $text): string
{
    $text = mb_strtolower(trim($text));
    $text = preg_replace('/[áàäâ]/u', 'a', $text);
    $text = preg_replace('/[éèëê]/u', 'e', $text);
    $text = preg_replace('/[íìïî]/u', 'i', $text);
    $text = preg_replace('/[óòöô]/u', 'o', $text);
    $text = preg_replace('/[úùüû]/u', 'u', $text);
    $text = preg_replace('/ñ/u', 'n', $text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    return trim($text, '-') ?: 'producto';
}

function current_user(): ?array
{
    if (empty($_SESSION['uid'])) {
        return null;
    }
    $st = db()->prepare('SELECT id, role, name, email, phone FROM users WHERE id = ?');
    $st->execute([$_SESSION['uid']]);
    $user = $st->fetch();
    return $user ?: null;
}

function require_auth(): array
{
    $user = current_user();
    if (!$user) {
        fail('No has iniciado sesión', 401);
    }
    return $user;
}

// El panel de administrador usa una sola contraseña compartida (ver
// api/admin/login.php), independiente de las cuentas de clientes.
function require_admin(): void
{
    if (empty($_SESSION['is_admin'])) {
        fail('Acceso no autorizado', 401);
    }
}

// Costos de envío por alcaldía (CDMX). Debe coincidir con src/alcaldias.js.
// Valores de marcador de posición — reemplazar por los costos reales.
function alcaldias(): array
{
    return [
        'Álvaro Obregón' => 150.0,
        'Azcapotzalco' => 200.0,
        'Benito Juárez' => 100.0,
        'Coyoacán' => 150.0,
        'Cuajimalpa de Morelos' => 250.0,
        'Cuauhtémoc' => 100.0,
        'Gustavo A. Madero' => 200.0,
        'Iztacalco' => 180.0,
        'Iztapalapa' => 220.0,
        'La Magdalena Contreras' => 200.0,
        'Miguel Hidalgo' => 120.0,
        'Milpa Alta' => 250.0,
        'Tláhuac' => 220.0,
        'Tlalpan' => 180.0,
        'Venustiano Carranza' => 150.0,
        'Xochimilco' => 200.0,
    ];
}

function setting(string $key, string $default = ''): string
{
    $st = db()->prepare('SELECT svalue FROM settings WHERE skey = ?');
    $st->execute([$key]);
    $row = $st->fetch();
    return $row ? $row['svalue'] : $default;
}

// Envío del correo de "nuevo pedido" vía SMTP (PHPMailer). Nunca debe tirar
// el checkout: cualquier fallo solo se registra en el log del servidor.
function notify_new_order(array $order): void
{
    $config = $GLOBALS['config'];
    $to = $config['notify_email'] ?? '';
    if ($to === '') {
        return;
    }

    $host = $config['smtp_host'] ?? '';
    $user = $config['smtp_user'] ?? '';
    $pass = $config['smtp_pass'] ?? '';
    if ($host === '' || $user === '' || $pass === '') {
        error_log('Lore District: pedido #' . $order['id'] . ' registrado, correo omitido (SMTP sin configurar en config.php)');
        return;
    }

    try {
        require_once __DIR__ . '/email_new_order.php';
        require_once __DIR__ . '/lib/phpmailer/Exception.php';
        require_once __DIR__ . '/lib/phpmailer/PHPMailer.php';
        require_once __DIR__ . '/lib/phpmailer/SMTP.php';

        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $user;
        $mail->Password = $pass;
        $port = (int) ($config['smtp_port'] ?? 465);
        $mail->Port = $port;
        $mail->SMTPSecure = $port === 465
            ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($user, 'Lore District · Pedidos');
        $mail->addAddress($to);
        $mail->addReplyTo($order['customer_email'] ?? $user, $order['customer_name'] ?? '');

        $mail->isHTML(true);
        $mail->Subject = 'Nuevo pedido #' . $order['id'] . ' · ' . ($order['customer_name'] ?? '') . ' · $' . number_format((float) $order['total'], 0);
        $mail->Body = render_new_order_email($order, $config);
        $mail->AltBody = render_new_order_email_text($order);
        $mail->send();
    } catch (Throwable $e) {
        error_log('Lore District: error enviando correo del pedido #' . ($order['id'] ?? '?') . ': ' . $e->getMessage());
    }
}

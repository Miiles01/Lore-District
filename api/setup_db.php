<?php
$config = @include __DIR__ . '/config.php';
if (!$config) {
    $config = @include __DIR__ . '/config.local.php';
}

if (!$config) {
    die("Falta el archivo config.php con tus credenciales.");
}

try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $sql = file_get_contents(__DIR__ . '/setup.sql');
    if ($sql === false) {
        die("No se pudo leer setup.sql");
    }

    // Ejecutar múltiples consultas
    $pdo->exec($sql);
    echo "<h1>¡Éxito!</h1>";
    echo "<p>Base de datos configurada correctamente. Los productos y tablas han sido creados en Hostinger.</p>";
    echo "<p><a href='/'>Volver al inicio</a></p>";
} catch (Exception $e) {
    die("Error en la conexión o ejecución: " . $e->getMessage());
}

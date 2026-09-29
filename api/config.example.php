<?php
// Copia este archivo como config.php y llena tus datos reales.
// config.local.php (desarrollo local) NUNCA se sube a GitHub (está en .gitignore).
return [
    // Datos de la base MySQL que creas en hPanel → Bases de datos
    'db_host' => 'localhost',
    'db_name' => 'uXXXXXXXXX_loredistrict',
    'db_user' => 'uXXXXXXXXX_admin',
    'db_pass' => 'TU_PASSWORD_DE_MYSQL',

    // Contraseña del panel /admin: genera el hash con
    // php -r 'echo password_hash("tu-contraseña", PASSWORD_BCRYPT);'
    'admin_password_hash' => 'GENERA_TU_HASH_AQUI',

    // URL pública del sitio (sin diagonal final), para las imágenes del correo
    'site_url' => '',

    // A dónde llega el correo de "nuevo pedido"
    'notify_email' => 'contmanuel77@gmail.com',
    // Cuenta creada en hPanel → Correos electrónicos (ej. pedidos@tudominio.com)
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_user' => '',
    'smtp_pass' => '',
    'smtp_port' => 465,

    'timezone' => 'America/Mexico_City',

    // true muestra detalles de errores (solo para desarrollo)
    'debug' => false,
];

-- Esquema de producción (MySQL / Hostinger). El desarrollo local usa MySQL
-- también (mismo motor), ver api/config.local.php para las credenciales locales.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
    name VARCHAR(150) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL DEFAULT '',
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    position INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NULL REFERENCES categories(id),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL DEFAULT '',
    gallery TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    active TINYINT(1) NOT NULL DEFAULT 1,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    garment_type VARCHAR(30) NOT NULL DEFAULT '',
    discount_type ENUM('fixed','percentage') NULL,
    discount_value DECIMAL(10,2) NULL,
    sizes TEXT NOT NULL,
    colors TEXT NOT NULL,
    position INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(190) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    street VARCHAR(200) NOT NULL,
    ext_no VARCHAR(20) NOT NULL DEFAULT '',
    int_no VARCHAR(20) NOT NULL DEFAULT '',
    neighborhood VARCHAR(150) NOT NULL DEFAULT '',
    city VARCHAR(150) NOT NULL DEFAULT '',
    state VARCHAR(150) NOT NULL DEFAULT '',
    postal_code VARCHAR(10) NOT NULL,
    references_notes VARCHAR(300) NOT NULL DEFAULT '',
    needs_installation TINYINT(1) NOT NULL DEFAULT 0,
    alcaldia VARCHAR(100) NOT NULL DEFAULT '',
    payment_method VARCHAR(30) NOT NULL DEFAULT 'contra_entrega',
    status ENUM('pendiente','confirmado','en_camino','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    installation_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    notified TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id),
    product_id INT NULL REFERENCES products(id),
    product_name VARCHAR(150) NOT NULL,
    product_image VARCHAR(500) NOT NULL DEFAULT '',
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    quantity INT NOT NULL DEFAULT 1,
    options_text VARCHAR(300) NOT NULL DEFAULT '',
    line_total DECIMAL(10,2) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS settings (
    skey VARCHAR(100) PRIMARY KEY,
    svalue TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- NesRent Database Setup Script
-- Run this file to initialize the database
-- ============================================

-- 1. Create Database
-- ============================================
CREATE DATABASE IF NOT EXISTS myapp_db;
USE myapp_db;

-- ============================================
-- 2. Drop existing tables (if any)
-- ============================================
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- ============================================
-- 3. Create Users Table
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nim VARCHAR(50) UNIQUE NOT NULL,
    faculty VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('pending', 'verified', 'blacklist') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 4. Create Products Table
-- ============================================
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 5. Create Bookings Table
-- ============================================
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- 6. Seed Users Table
-- ============================================
INSERT INTO users (name, email, password, nim, role, status) VALUES
('Admin NesRent', 'admin@nesrent.ac.id', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYz5f7N3nTO', '0000000001', 'admin', 'verified'),
('Test User', 'test@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYz5f7N3nTO', '1111111111', 'user', 'verified');

-- Note: The password hash above is for 'password123' - bcrypt with 12 rounds

-- ============================================
-- 7. Seed Products Table
-- ============================================
INSERT INTO products (product_name, description, price, image_url) VALUES
('Kamera Canon EOS', 'Kamera Canon EOS dengan sensor full-frame 24.2MP. Cocok untuk fotografi dan videografi mahasiswa.', 1500.00, 'kamera.png'),
('Jas Pria Navy', 'Jas formal untuk keperluan kampus dan seminar. Tersedia semua ukuran.', 120.00, 'jas.png'),
('Honda Vario 125', 'Motor matik premium untuk transportasi sehari-hari.irit bahan bakar.', 50.00, 'motor.png'),
('Proyektor Mini', 'Proyektor LED portable untuk presentasi小组 Project.', 75.00, 'proyektor.png'),
('Laptop ASUS VivoBook', 'Laptop ringan untuk tugas kuliah. Spesifikasi: Intel i5, 8GB RAM, 512GB SSD.', 200.00, 'laptop.png');

-- ============================================
-- 8. Seed Bookings Table (sample transactions)
-- ============================================
INSERT INTO bookings (user_id, product_id, start_date, end_date, total_price, notes, status) VALUES
(1, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 4500.00, 'Untuk Tugas Fotografi', 'approved'),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 480.00, 'Untuk Seminar KP', 'pending');

-- ============================================
-- 9. Create Indexes for Performance
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nim ON users(nim);
CREATE INDEX idx_products_name ON products(product_name);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_product ON bookings(product_id);

-- ============================================
-- 10. Create Views for Common Queries
-- ============================================
CREATE OR REPLACE VIEW user_bookings AS
SELECT
    b.id AS booking_id,
    b.start_date,
    b.end_date,
    b.total_price,
    b.status AS booking_status,
    b.notes,
    u.name AS user_name,
    u.email AS user_email,
    p.product_name,
    p.description AS product_description
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN products p ON b.product_id = p.id;

-- ============================================
-- Setup Complete!
-- ============================================
-- Login credentials:
--   Admin: admin@nesrent.ac.id / password123
--   User:  test@test.com / password123

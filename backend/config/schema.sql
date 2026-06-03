-- NesRent Database Schema
-- Run this SQL to set up the database

CREATE DATABASE IF NOT EXISTS nesrent;
USE nesrent;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nim VARCHAR(20) UNIQUE NOT NULL,
  faculty VARCHAR(100),
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  status ENUM('pending', 'verified', 'rejected', 'blacklist') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_nim (nim),
  INDEX idx_status (status)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  condition ENUM('Sangat Baik', 'Baik', 'Cukup') DEFAULT 'Baik',
  price_per_day DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 1,
  description TEXT,
  specifications TEXT,
  image VARCHAR(500),
  owner_id INT NOT NULL,
  status ENUM('available', 'unavailable') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_owner (owner_id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_product (product_id),
  INDEX idx_status (status)
);

-- Blacklist table
CREATE TABLE IF NOT EXISTS blacklist (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  reason TEXT,
  added_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, nim, role, status) VALUES
('Admin NesRent', 'admin@nesrent.ac.id', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYz5f7N3nTO', '0000000001', 'admin', 'verified');

-- Insert sample categories
INSERT INTO products (name, category, condition, price_per_day, stock, description, specifications, owner_id) VALUES
('Kamera Canon EOS 800D', 'Elektronik', 'Sangat Baik', 250000, 2, 'Kamera DSLR untuk fotografi dan videografi', '24MP, WiFi, Lensa Kit 18-55mm', 1),
('Vario 150 eSP', 'Kendaraan', 'Baik', 75000, 1, 'Motor matik cocok untuk mahasiswa', '150cc, Body mulus, Servis lengkap', 1),
('Proyektor Epson', 'Elektronik', 'Baik', 50000, 1, 'Proyektor untuk presentasi', '3000 lumens, HDMI, USB', 1),
('Tenda Dome 4 Orang', 'Alat Camping', 'Baik', 35000, 3, 'Tenda camping untuk keluarga kecil', 'Waterproof, Mudah dipasang', 1);
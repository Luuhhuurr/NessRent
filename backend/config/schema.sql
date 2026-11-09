-- =============================================================================
-- NesRent — canonical schema
--
-- This is the single source of truth for a fresh database. For a database
-- that already exists, apply the incremental changes in config/migrations/
-- instead (npm run migrate).
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `myapp_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE `myapp_db`;

-- -----------------------------------------------------------------------------
-- users — students renting from and lending to each other
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nim` varchar(50) NOT NULL,
  `faculty` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `status` enum('pending','verified','rejected','blacklist') NOT NULL DEFAULT 'pending',
  `identity_document` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_nim` (`nim`),
  KEY `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------------------------------
-- products — items available for rent, priced per day
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `condition` varchar(50) DEFAULT 'Baik',
  `price` decimal(10,2) NOT NULL COMMENT 'Daily price, stored in thousands of rupiah',
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('available','unavailable','rented') NOT NULL DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_products_owner` (`owner_id`),
  KEY `idx_products_category` (`category`),
  CONSTRAINT `fk_products_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------------------------------
-- bookings — a rental of one product by one user for a date range
--
--   user_id  = the renter
--   owner_id = the seller of the rented item (denormalised from products)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `booking_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `notes` text DEFAULT NULL COMMENT 'Pickup location',
  `status` enum('pending','confirmed','cancelled','approved','rejected','completed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_bookings_renter` (`user_id`),
  KEY `idx_bookings_product` (`product_id`),
  KEY `idx_bookings_owner` (`owner_id`),
  KEY `idx_bookings_status` (`status`),
  CONSTRAINT `fk_bookings_renter` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bookings_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------------------------------
-- blacklist — audit trail for blocked accounts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `reason` text DEFAULT NULL,
  `added_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_blacklist_user` (`user_id`),
  CONSTRAINT `fk_blacklist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_blacklist_added_by` FOREIGN KEY (`added_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

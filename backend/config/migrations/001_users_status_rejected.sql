-- Allows an admin to mark a registration as rejected.
-- The application was already writing 'rejected' while the column only
-- accepted pending / verified / blacklist, so every reject request failed.
ALTER TABLE `users`
  MODIFY COLUMN `status` enum('pending','verified','rejected','blacklist') NOT NULL DEFAULT 'pending';

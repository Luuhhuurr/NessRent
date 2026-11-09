-- The identity upload endpoint writes to users.identity_document, but the
-- column did not exist in the live database.
ALTER TABLE `users`
  ADD COLUMN `identity_document` varchar(255) DEFAULT NULL AFTER `status`;

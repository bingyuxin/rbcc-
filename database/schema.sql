CREATE DATABASE IF NOT EXISTS rbcc
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rbcc;

CREATE TABLE IF NOT EXISTS board_item (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  item_type VARCHAR(40) NOT NULL,
  payload LONGTEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_board_item_type_order (item_type, sort_order, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

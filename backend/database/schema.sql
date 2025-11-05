-- Create database
CREATE DATABASE IF NOT EXISTS carousell_db;
USE carousell_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_picture_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  `condition` VARCHAR(50),
  location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url VARCHAR(500),
  seller_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages table for chat feature
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  product_id INT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Test user (password is 'password123' hashed with bcrypt)
INSERT INTO users (username, email, password, profile_picture_url) VALUES
('testuser', 'testuser@example.com', '$2b$10$kDeQu4.wRiXHl4406gdSkuwtWzJBtrVdDf3T43Ru5GofNRRH2QDAm', 'https://ui-avatars.com/api/?name=Test+User&background=eb8f0d&color=fff')
ON DUPLICATE KEY UPDATE username=username;

-- Sample products (optional)
INSERT INTO products (title, description, price, image_url, seller_id) VALUES
('Vintage Camera', 'Classic vintage camera in excellent condition', 299.99, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400', 1),
('Leather Jacket', 'Premium leather jacket, size M', 149.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 1),
('Gaming Console', 'Latest generation gaming console with controller', 499.99, 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400', 1),
('Wireless Headphones', 'High quality wireless headphones with noise cancellation', 179.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 1),
('Smart Watch', 'Fitness tracking smart watch', 249.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 1),
('Backpack', 'Durable travel backpack with laptop compartment', 79.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 1);

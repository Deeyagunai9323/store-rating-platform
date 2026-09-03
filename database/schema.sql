CREATE DATABASE IF NOT EXISTS store_rating_db;

USE store_rating_db;


-- =========================================
-- ROLES TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(50) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- USERS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(60) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    address VARCHAR(400),

    role_id INT UNSIGNED NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);


-- =========================================
-- STORES TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS stores (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    address VARCHAR(400) NOT NULL,

    owner_id INT UNSIGNED NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_store_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- =========================================
-- RATINGS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS ratings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    store_id INT UNSIGNED NOT NULL,

    rating TINYINT UNSIGNED NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_rating
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT fk_rating_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_rating_store
        FOREIGN KEY (store_id)
        REFERENCES stores(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT unique_user_store_rating
        UNIQUE (user_id, store_id)
);


-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX idx_users_name
ON users(name);

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_users_role
ON users(role_id);

CREATE INDEX idx_stores_name
ON stores(name);

CREATE INDEX idx_stores_address
ON stores(address);

CREATE INDEX idx_ratings_store
ON ratings(store_id);

CREATE INDEX idx_ratings_user
ON ratings(user_id);
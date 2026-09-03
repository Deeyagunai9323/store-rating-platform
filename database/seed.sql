USE store_rating_db;


-- =========================================
-- ROLES
-- =========================================

INSERT INTO roles (name)
VALUES
('ADMIN'),
('USER'),
('STORE_OWNER');


-- =========================================
-- CHECK ROLES
-- =========================================

SELECT * FROM roles;
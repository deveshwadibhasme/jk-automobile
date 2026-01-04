CREATE TABLE IF NOT EXISTS `transaction` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    module_id INT,
    price VARCHAR(50),
    order_id VARCHAR(250),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_transaction FOREIGN KEY (user_id) REFERENCES user (id)
);

-- ALTER TABLE `transaction`
-- ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
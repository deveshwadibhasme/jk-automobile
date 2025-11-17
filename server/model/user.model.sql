-- use jk_automobile;

create table if not exists user (
    id int PRIMARY key auto_increment,
    name VARCHAR(150) NOT null,
    email VARCHAR(40),
    password VARCHAR(255) NOT null,
    mobile_no VARCHAR(10) NOT null UNIQUE,
    address TEXT NOT null,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ALTER TABLE user
-- MODIFY COLUMN address TEXT NULL;

-- alter table user
-- add COLUMN city VARCHAR(50) null;

-- alter table user
-- add COLUMN pincode VARCHAR(10) null;
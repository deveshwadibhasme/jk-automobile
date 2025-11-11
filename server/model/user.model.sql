use jk_automobile;

create table if not exist user (
    id int PRIMARY key auto_increment,
    name VARCHAR(150) NOT null,
    email VARCHAR(40),
    password VARCHAR(255) NOT null,
    addhar_no VARCHAR(12) NOT null UNIQUE,
    mobile_no VARCHAR(10) NOT null UNIQUE,
    address TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

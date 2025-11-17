-- use jk_automobile;

create table if not exists otp_store (
    email VARCHAR(40) PRIMARY KEY UNIQUE,
    otp VARCHAR(10) NOT null,
    expire_at TIMESTAMP DEFAULT (NOW() + INTERVAL 5 MINUTE)
);
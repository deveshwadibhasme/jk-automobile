-- use jk_automobile;

create table if not exists otp_store (
    email VARCHAR(40) PRIMARY KEY UNIQUE,
    otp VARCHAR(10) NOT NULL,
    expire_at DATETIME NOT NULL
);
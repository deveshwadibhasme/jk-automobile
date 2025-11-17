-- use jk_automobile;

create table if not exists otp_store (
    email VARCHAR(40) PRIMARY KEY UNIQUE,
    otp VARCHAR(10) NOT null,
    expire_at TIMESTAMP
);

-- INSERT INTO otp_store (expire_at) 
-- VALUES (NOW() + INTERVAL 5 MINUTE);

ALTER TABLE otp_store 
MODIFY expire_at DATETIME NOT NULL;
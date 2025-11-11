use jk_automobile;

create table if not exists admin (
    id int PRIMARY key auto_increment,
    name VARCHAR(150) NOT null,
    email VARCHAR(40) UNIQUE,
    password VARCHAR(255) NOT null
);

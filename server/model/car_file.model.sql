-- use jk_automobile;
create table if not exists car_file (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_file_id INT NOT NULL,
    file_status VARCHAR(100),
    file_price VARCHAR(100),
    CONSTRAINT fk_car_file_list FOREIGN KEY (car_file_id) REFERENCES car_list(id)
);


create table if not exists file_store (
    id int PRIMARY KEY AUTO_INCREMENT,
    car_info_id int,
    file_url VARCHAR(300),
    file_name VARCHAR(255),
    archive_size VARCHAR(100),
    file_price VARCHAR(100),
    file_number VARCHAR(100),
    CONSTRAINT Foreign Key (car_info_id) REFERENCES car_file(id)
)

alter table file_store
add COLUMN file_id TEXT after file_url
-- use jk_automobile;

create table if not exists car_file (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_file_id INT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    archive_size VARCHAR(100),
    file_status VARCHAR(100),
    file_price VARCHAR(100),
    file_number VARCHAR(100),
    CONSTRAINT fk_car_file_list FOREIGN KEY (car_file_id) REFERENCES car_list(id)
);
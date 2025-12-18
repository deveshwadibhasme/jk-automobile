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
    car_id int,
    file_url VARCHAR(300),
    file_id TEXT,
    file_name VARCHAR(255),
    archive_size VARCHAR(100),
    file_price VARCHAR(100),
    file_number VARCHAR(100),
    CONSTRAINT Foreign Key (car_id) REFERENCES car_list(id)
);

-- alter table file_store
-- rename COLUMN car_info_id to car_id;

-- ALTER TABLE file_store
-- DROP FOREIGN KEY file_store_ibfk_1;

-- ALTER TABLE file_store
-- ADD CONSTRAINT fk_file_store_car
-- FOREIGN KEY (car_id)
-- REFERENCES car_list(id)
-- ON DELETE CASCADE
-- ON UPDATE CASCADE;

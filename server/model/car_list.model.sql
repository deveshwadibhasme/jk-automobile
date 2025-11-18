create table if not exists car_list (
    id int PRIMARY key AUTO_INCREMENT,
    brand VARCHAR(100) not null ,
    model VARCHAR(100) not null,
    year YEAR not null,
    module VARCHAR(40) ,
    memory VARCHAR(100),
    block_number VARCHAR(100),
    file_type ENUM('Eeprom','Flash','Full'),
    admin_id INT,
    CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES admin(id)
);

-- ALTER TABLE car_list
-- ADD COLUMN admin_id INT,
-- ADD CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES admin(id);
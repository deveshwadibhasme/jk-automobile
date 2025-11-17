-- use jk_automobile;

create table if not exists car_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    module_type VARCHAR(100),
    photo_of_the_module VARCHAR(255),
    km_miles VARCHAR(50),
    engine_type VARCHAR(100),
    transmission VARCHAR(100),
    module_number VARCHAR(100),
    sticker_photo VARCHAR(255),
    notes TEXT,
    CONSTRAINT fk_car_list FOREIGN KEY (car_id) REFERENCES car_list(id)
);

create table if not exists img_store (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    file_url TEXT,
    file_id TEXT,
    CONSTRAINT fk_img_car FOREIGN KEY (car_id) REFERENCES car_list(id)
);

create table if not exists transaction (
    id int PRIMARY key AUTO_INCREMENT,
    order_id VARCHAR(250),
    user_id int,
    module_id int,
    price VARCHAR(50),
    constraint fk_user_transaction FOREIGN KEY(user_id) REFERENCES user(id)
)
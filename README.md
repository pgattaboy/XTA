# XTA
An Web Based Marketplace.It is a online buy and sell cite.

Here MariaDB data base has been used and all the query are given below.

#creating user table

CREATE TABLE `project_xta`.`user` ( `roll` INT(10) NOT NULL , `fname` VARCHAR(40) NOT NULL , `lname` VARCHAR(40) NOT NULL , `dob` VARCHAR(20) NOT NULL , `gender` VARCHAR(10) NOT NULL , `email` VARCHAR(100) NOT NULL , `password` VARCHAR(255) NOT NULL , `location` VARCHAR(50) NOT NULL , `profile_picture` VARCHAR(255) NOT NULL , PRIMARY KEY (`roll`)) ENGINE = InnoDB;


#creating posts table (having foreign key roll from user table)

CREATE TABLE posts(
    id int NOT NULL AUTO_INCREMENT,
    roll int(10),
    product_type varchar(35),
    brand varchar(50),
    model varchar(50),
    name varchar(100),
    author varchar(100),
    price numeric,
    location varchar(50),
    spoint varchar(100),
    epoint varchar(100),
    starting_time varchar(100),
    total_product int,
    sold varchar(15),
    dop varchar(30),
    description varchar(101),
    img1 varchar(255),
    img2 varchar(255),
    product_condition varchar(15),
    negotiation varchar(20),
    ticket_type varchar(10),
    PRIMARY KEY(id),
    FOREIGN KEY(roll) REFERENCES user(roll)
    
)

#creating chatroom
CREATE TABLE `1703067_chatroom` (
    room_id INT NOT NULL ,
    host_roll INT NOT NULL ,
	date varchar(15) NOT NULL ,
    FOREIGN KEY (room_id) REFERENCES posts(id)
)

#creating messages table 

CREATE TABLE messages (
	serial INT NOT NULL AUTO_INCREMENT ,
    id int NOT NULL,
    host int,
    sender varchar(50),
    senderRoll int,
    sendingtime varchar(30),
    message varchar(600),
    PRIMARY KEY (serial)
)
#resetting AI
SET @count = 0;
UPDATE posts SET posts.id = @count:= @count + 1;
ALTER TABLE posts AUTO_INCREMENT = 1;

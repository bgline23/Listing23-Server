
DROP TABLE IF EXISTS Appointment;
DROP TABLE IF EXISTS Listing;
DROP TABLE IF EXISTS Images;
DROP TABLE IF EXISTS Property;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS UserType;


-- ************************************** UserType

CREATE TABLE IF NOT EXISTS UserType
(
    user_type_id SMALLINT NOT NULL ,
    description  VARCHAR(50) NOT NULL ,
    type_name    ENUM('agent','buyer') NOT NULL ,

    PRIMARY KEY (user_type_id)
);

-- ************************************** User

CREATE TABLE IF NOT EXISTS User
(
    user_id      INT NOT NULL AUTO_INCREMENT ,
    username     VARCHAR(18) NOT NULL ,
    first_name   VARCHAR(40) NOT NULL ,
    user_type_id SMALLINT NOT NULL ,
    last_name    VARCHAR(40) NOT NULL ,
    email        VARCHAR(40) NOT NULL ,
    cellphone    VARCHAR(15) NOT NULL ,
    password     CHAR(32) NOT NULL ,

    PRIMARY KEY (user_id),
    FOREIGN KEY fk_user_type_id (user_type_id) REFERENCES UserType (user_type_id)
);

-- ************************************** Property

CREATE TABLE IF NOT EXISTS Property
(
    property_id INT NOT NULL AUTO_INCREMENT,
    title       VARCHAR(80) NOT NULL ,
    description VARCHAR(300) NOT NULL ,
    price       INT NOT NULL ,
    address     VARCHAR(200)  ,
    coordinates VARCHAR(100) NOT NULL ,
    date_created    DATETIME DEFAULT CURRENT_TIMESTAMP ,

    PRIMARY KEY (property_id)
);



-- ************************************** Images

CREATE TABLE IF NOT EXISTS Image
(
    image_id        INT NOT NULL AUTO_INCREMENT ,
    blob_data       LONGBLOB NOT NULL ,
    property_id     INT NOT NULL ,
    description     VARCHAR(100) ,
    is_banner_photo BIT,

    PRIMARY KEY (image_id),
    FOREIGN KEY fk_property_id (property_id) REFERENCES Property (property_id)
);


-- ************************************** Listing

CREATE TABLE IF NOT EXISTS Listing
(
    listing_id      INT NOT NULL AUTO_INCREMENT ,
    date_listed     DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    property_id     INT NOT NULL ,
    user_id         INT NOT NULL ,
   


    PRIMARY KEY (listing_id),
    FOREIGN KEY fk_property_id (property_id) REFERENCES Property (property_id),
    FOREIGN KEY fk_user_id (user_id) REFERENCES User (user_id)
);


-- ************************************** Appointment

CREATE TABLE IF NOT EXISTS Appointment
(
    appointment_id INT NOT NULL ,
    scheduled_date DATETIME NOT NULL ,
    listing_id     INT NOT NULL ,
    status         ENUM( 'accepted', 'declined', 'postponed', 'pending' ) DEFAULT('pending') NOT NULL ,

    PRIMARY KEY (appointment_id),
    FOREIGN KEY fk_listing_id (listing_id) REFERENCES Listing (listing_id)
);


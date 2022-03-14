DELIMITER $$


DROP PROCEDURE IF EXISTS GetAuthenticatedUser;

CREATE PROCEDURE GetAuthenticatedUser(IN username VARCHAR(100), IN password CHAR(32))
BEGIN
    SELECT  u.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.cellphone,
            u.username
    FROM    User u
    WHERE   (u.username = username OR u.email = username)
    AND     u.password = password;
END $$

-- **************************************

DROP PROCEDURE IF EXISTS CreateProperty;

CREATE PROCEDURE CreateProperty
(
    IN title VARCHAR(80), 
    IN description VARCHAR(300), 
    IN price INT,
    IN address VARCHAR(200)  ,
    IN coordinates VARCHAR(100),
    IN auto_create_listing BIT,
    IN user_id INT,
    OUT new_property INT
)
BEGIN
    INSERT INTO Property
    (
        title , 
        description , 
        price ,
        address   ,
        coordinates 
    )
    VALUES
    (
        title,
        description, 
        price,
        address  ,
        coordinates 
    );

    SET new_property=LAST_INSERT_ID();

    IF  auto_create_listing = 1 THEN
        INSERT INTO Listing
        (
            property_id,
            user_id
        )
        VALUES
        (
            new_property,
            user_id
        );
    END IF;

END $$

-- **************************************

DROP PROCEDURE IF EXISTS AddPropertyImage;

CREATE PROCEDURE AddPropertyImage
(
    IN property_id INT,
    IN blob_data LONGBLOB
)
BEGIN

--  Use first photo as banner photo
    IF EXISTS 
    (
        SELECT i.property_id 
        FROM Image i
        WHERE i.property_id = property_id
        AND i.is_banner_photo  =  1
    ) 
    THEN

        SET @is_banner = 0;

    ELSE
        SET @is_banner = 1;
    
    END IF;

    INSERT INTO Image
    (
        property_id,
        blob_data , 
        is_banner_photo
    )
    VALUES
    (
        property_id, 
        blob_data,
        @is_banner
    );

   SELECT TRUE AS SUCCESS;

END $$

-- **************************************

DROP PROCEDURE IF EXISTS GetListings;

CREATE PROCEDURE GetListings
(
    IN user_id INT,
    IN page_size INT,
    IN skip_rows INT
)
BEGIN

    
    IF user_id = -1 THEN
            
-- show all listings
        SELECT      ls.property_id,
                    ls.date_listed,
                    pt.title,
                    pt.price,
                    im.blob_data                        
        FROM        Listing ls
        INNER JOIN  Property pt ON pt.property_id = ls.property_id
        LEFT JOIN   Image im ON (im.property_id = pt.property_id) AND im.is_banner_photo = 1
        LIMIT       skip_rows, page_size;

    ELSE

--  
        SELECT      ls.property_id,
                    ls.date_listed,
                    pt.title,
                    pt.price,
                    im.blob_data                        
        FROM        Listing ls
        INNER JOIN  Property pt ON pt.property_id = ls.property_id
        LEFT JOIN   Image im ON (im.property_id = pt.property_id) AND im.is_banner_photo = 1
        WHERE       ls.user_id = user_id
        LIMIT       skip_rows, page_size;

    END IF;

END $$

DELIMITER ;
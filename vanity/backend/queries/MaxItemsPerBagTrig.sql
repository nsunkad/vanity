-- GCP MySQL Trigger limiting a User's BagItems to max 20. Follows ECA rule
DELIMITER //
CREATE TRIGGER MaxItemsPerBagTrig 
    BEFORE INSERT ON BagItems -- Event
    FOR EACH ROW 
    BEGIN 
        SET @num_items = (SELECT Account.NumItemsPerUser FROM (SELECT UserId, COUNT(*) AS NumItemsPerUser 
                            FROM BagItems GROUP BY UserId) Account WHERE Account.UserId = new.UserId); 
        IF @num_items IS NOT NULL AND @num_items = 20 -- Condition
            THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User already has max 20 items in their bag'; -- Action
        END IF; 
    END//
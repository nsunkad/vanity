
DELIMITER //
CREATE TRIGGER MaxItemsPerBagTrig 
    BEFORE INSERT ON BagItems
    FOR EACH ROW 
    BEGIN 
        SET @num_items = (SELECT Account.NumItemsPerUser FROM (SELECT UserId, COUNT(*) AS NumItemsPerUser 
                            FROM BagItems GROUP BY UserId) Account WHERE Account.UserId = new.UserId); 
        IF @num_items IS NOT NULL AND @num_items = 20 
            THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User already has max 20 items in their bag'; 
        END IF; 
    END//
DELIMITER $$ 
CREATE TRIGGER MaxBagItems 
    BEFORE INSERT ON BagItems
    FOR EACH ROW 
    BEGIN 
        SET @num_items = (SELECT Account.NumItems FROM (SELECT UserId, COUNT(*) AS NumItems FROM BagItems GROUP BY UserId) Account WHERE Account.UserId = NEW.UserId); 
        IF @num_items IS NOT NULL THEN 
            IF @num_items >= 20 THEN SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Cannot have more than 20 items in bag at a time'; 
            END IF; 
        END IF; 
    END$$ 
DELIMITER ;

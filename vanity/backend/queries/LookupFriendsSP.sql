-- This is the SQL CREATE PROCEDURE command that was run in the GCP database to create the LookupFriendsSP stored procedure

DELIMITER //

create procedure LookupFriendsSP(IN curr_username VARCHAR(64), IN search_string varchar(255))

begin
    declare done int default 0;
    declare currstd varchar(64);
    declare num_prod int default 0;
    declare same_products int default 0;
    declare user_products int default 0;
    declare simi int default 0;
    declare ord int default 0;
    declare stdcur cursor for SELECT UserName FROM Users
                    ORDER BY LEAST(LEVENSHTEIN(UserName, search_string), LEVENSHTEIN(FirstName, search_string), LEVENSHTEIN(LastName, search_string))
                    LIMIT 15;
    declare continue handler for not found set done = 1;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    drop table if exists NewTable;
    
    create table NewTable (
        Ord int primary key,
        UserName varchar(64),
        NumProductsInBag int,
        Similarity int
    );

    select count(ProductId) into user_products
    from Users left outer join BagItems on Users.UserId = BagItems.UserId
    where UserName = curr_username
    group by UserName;

    open stdcur;
    
    std_loop:repeat
        fetch stdcur into currstd;

        select count(ProductId) into num_prod
        from Users left outer JOIN BagItems ON Users.UserId = BagItems.UserId
        where UserName = currstd
        group by UserName;

        select count(ProductId) into same_products
        from (
            select ProductId
            from Users LEFT OUTER JOIN BagItems ON Users.UserId = BagItems.UserId
            where UserName = currstd
            intersect
            select ProductId
            from Users LEFT OUTER JOIN BagItems on Users.UserId = BagItems.UserId
            where UserName = curr_username
        ) as subquery;

        if user_products = 0 then set simi = 1;
        elseif same_products / user_products > 0.85 then set simi = 5;
        elseif same_products / user_products > 0.65 then set simi = 4;
        elseif same_products / user_products > 0.5 then set simi = 3;
        elseif same_products / user_products > 0.35 then set simi = 2;
        else set simi = 1;
        end if;

        set ord = ord + 1;
        
        insert ignore into NewTable values (ord, currstd, num_prod, simi);
        
    until done
    end repeat std_loop;
    
    close stdcur;
    
    COMMIT;
    
    select UserName, NumProductsInBag, Similarity from NewTable order by Ord;
    drop table NewTable;

end //

DELIMITER ;

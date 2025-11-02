-- Task 1 - Write SQL Statements
-- *Whenever writing a SELECT, UPDATE or DELETE query for a single record, use the primary key value in the "WHERE" clause to avoid changing or selecting the incorrect record.*

-- 5.1. Insert the following new record to the account table:
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) VALUES ('Tony', 'Stark', 'tony@starkent.com', 'IamIronM@n');

-- 5.2. Modify the Tony Stark record to change the account_type to 'Admin':
UPDATE public.account SET account_type = 'Admin' WHERE account_id = 1;

-- 5.3. Delete the Tony Stark record from the account table:
DELETE FROM public.account WHERE account_id = 1;

-- 5.4. Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query. 
UPDATE public.inventory 
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')  
WHERE inv_id = 10;

-- 5.5. Use an inner join to select the make and model fields form the inventory table and the classification name field form the classification table for inventory ites that belong to the "Sport" category.
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory AS i
INNER JOIN public.classification AS c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 5.6 Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail coumns using a single query.
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
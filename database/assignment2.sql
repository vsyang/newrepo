-- Task 1 - Write SQL Statements
-- *Whenever writing a SELECT, UPDATE or DELETE query for a single record, use the primary key value in the "WHERE" clause to avoid changing or selecting the incorrect record.*
-- 5.1. Insert the following new record to the account table:
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) VALUES ('Tony', 'Stark', 'tony@starkent.com', 'IamIronM@n');

-- 5.2. Modify the Tony Stark record to change the account_type to 'Admin':
UPDATE public.account SET account_type = 'Admin' WHERE account_email = '';
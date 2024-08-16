CREATE DATABASE capstone;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone CHAR(10) NOT NULL UNIQUE,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users
ADD CONSTRAINT name_not_empty CHECK (name <> '');
ALTER TABLE users
ADD CONSTRAINT email_not_empty CHECK (email <> '');
ALTER TABLE users
ADD CONSTRAINT password_not_empty CHECK (password <> '');
ALTER TABLE users
ADD CONSTRAINT phone_not_empty CHECK (phone <> '');
ALTER TABLE users
ADD CONSTRAINT role_not_empty CHECK (role <> '');
ALTER TABLE users
ADD CONSTRAINT password_length CHECK (length(password) >= 8);
TRUNCATE TABLE users;
CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_address VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL references users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION public.add_company(
        _company_name VARCHAR,
        _company_address VARCHAR
    ) RETURNS VOID AS $$
DECLARE _owner_id INT;
BEGIN -- Extract userid from the JWT claims
_owner_id := current_setting('jwt.claims.user_id')::INTEGER;
-- Insert the new company record
INSERT INTO company (company_name, company_address, owner_id)
VALUES (_company_name, _company_address, _owner_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.add_company(_company_name VARCHAR, _company_address VARCHAR) TO company;
CREATE POLICY select_own_user_info ON users FOR
SELECT USING (
        id = current_setting('jwt.claims.user_id')::INTEGER
    );
CREATE POLICY select_own_companies ON company FOR
SELECT USING (
        owner_id = current_setting('jwt.claims.user_id')::INTEGER
    );
DROP POLICY select_own_user_info ON users;
CREATE TYPE public.jwt_token AS (
    role TEXT,
    user_id INTEGER,
    name TEXT
);
-- anonymous role for signup and login
CREATE ROLE anonymous;
GRANT anonymous TO current_user;
CREATE ROLE admin;
GRANT admin TO current_user;
CREATE ROLE company;
GRANT company TO current_user;
CREATE ROLE customer;
GRANT customer TO current_user;
-- -----------------------------
-- Create extension for jwt
create extension if not exists "pgcrypto";
-- Signup function
DROP FUNCTION SIGNUP(
    input_name TEXT,
    input_email TEXT,
    input_password TEXT,
    input_phone TEXT,
    input_role TEXT
) CREATE FUNCTION SIGNUP(
    input_name TEXT,
    input_email TEXT,
    input_password TEXT,
    input_phone TEXT,
    input_role TEXT
) RETURNS jwt_token AS $$
DECLARE token_information jwt_token;
BEGIN
INSERT INTO users (name, email, password, phone, role)
VALUES (
        input_name,
        input_email,
        crypt(input_password, gen_salt('bf', 8)),
        input_phone,
        input_role
    );
IF(input_role = 'company') THEN
SELECT 'company',
    id,
    users.name INTO token_information
FROM users
WHERE users.email = email;
RETURN token_information::jwt_token;
ELSIF(input_role = 'customer') THEN
SELECT 'customer',
    id,
    users.name INTO token_information
FROM users
WHERE users.email = email;
RETURN token_information::jwt_token;
ELSE RAISE EXCEPTION 'Invalid role';
END IF;
END;
$$ LANGUAGE PLPGSQL VOLATILE SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION SIGNUP(
        name TEXT,
        email TEXT,
        password TEXT,
        phone TEXT,
        role TEXT
    ) TO anonymous;
-- Login function
CREATE FUNCTION SIGNIN(email TEXT, password TEXT) RETURNS jwt_token AS $$
DECLARE token_information jwt_token;
BEGIN
SELECT role,
    id,
    name INTO token_information
FROM users
WHERE users.email = $1
    AND users.password = crypt($2, users.password);
RETURN token_information::jwt_token;
END;
$$ LANGUAGE PLPGSQL VOLATILE STRICT SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION SIGNIN(email TEXT, password TEXT) TO anonymous;
DROP DATABASE IF EXISTS tailors;
TRUNCATE TABLE users;
CREATE ROLE company;
GRANT company TO current_user;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE users TO company;
GRANT SELECT ON TABLE company TO company;
CREATE TABLE prices(
    id SERIAL PRIMARY KEY,
    shirt_price INT NOT NULL,
    pant_price INT NOT NULL,
    sherwani_price INT NOT NULL,
    suit_price INT NOT NULL,
    coat_price INT NOT NULL,
    company_id INT NOT NULL references company(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP CONSTRAINT check_empty CHECK (
        shirt_price <> 0
        AND pant_price <> 0
        AND sherwani_price <> 0
        AND suit_price <> 0
        AND coat_price <> 0
    )
);
GRANT INSERT ON TABLE prices TO company;
GRANT UPDATE ON TABLE prices TO company;
GRANT USAGE,
    SELECT ON SEQUENCE prices_id_seq TO company;
CREATE POLICY select_prices_for_own_company ON prices FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM company
            WHERE company.id = prices.company_id
                AND company.owner_id = current_setting('jwt.claims.user_id')::INTEGER
        )
    );
DROP POLICY select_prices_for_own_company ON prices;
CREATE POLICY insert_prices_for_own_company ON prices FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM company
            WHERE company.id = prices.company_id
                AND company.owner_id = current_setting('jwt.claims.user_id')::INTEGER
        )
    );
CREATE POLICY update_prices_for_own_company ON prices FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM company
            WHERE company.id = prices.company_id
                AND company.owner_id = current_setting('jwt.claims.user_id')::INTEGER
        )
    );
DROP POLICY update_prices_for_own_company ON prices;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices
ADD CONSTRAINT unique_company_id UNIQUE (company_id);
TRUNCATE TABLE prices;
CREATE TABLE customers(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) UNIQUE NOT NULL,
    phone CHAR(10) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    company_id INT NOT NULL references company(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE customers
ADD CONSTRAINT phone_format_check CHECK (phone ~ '^[0-9]{10}$'),
    ADD CONSTRAINT email_format_check CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    );
delete from customers
where id = 44;
ALTER TABLE customers DROP CONSTRAINT customers_last_name_key,
    DROP CONSTRAINT customers_phone_key,
    DROP CONSTRAINT customers_email_key;
ALTER TABLE customers
ADD CONSTRAINT unique_email_phone_company UNIQUE (email, phone, company_id);
TRUNCATE TABLE customers;
ALTER TABLE customers
ADD CONSTRAINT check_empty CHECK (
        first_name <> ''
        AND last_name <> ''
        AND phone <> ''
        AND address <> ''
        AND email <> ''
    );
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON TABLE customers TO company;
GRANT SELECT ON TABLE customers TO company;
GRANT USAGE,
    SELECT ON SEQUENCE customers_id_seq TO company;
CREATE POLICY insert_customers_for_own_company ON customers FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM company
            WHERE company.id = customers.company_id
                AND company.owner_id = current_setting('jwt.claims.user_id')::INTEGER
        )
    );
CREATE POLICY select_customers_for_own_company ON customers FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM company
            WHERE company.id = customers.company_id
                AND company.owner_id = current_setting('jwt.claims.user_id')::INTEGER
        )
    );
CREATE TABLE customer_measurments(
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL references customers(id),
    shirt JSONB NOT NULL,
    pant JSONB NOT NULL,
    sherwani JSONB NOT NULL,
    suit JSONB NOT NULL,
    coat JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
TRUNCATE TABLE customer_measurments;
ALTER TABLE customer_measurments
ADD CONSTRAINT check_empty CHECK (
        shirt <> '{}'
        OR pant <> '{}'
        OR sherwani <> '{}'
        OR suit <> '{}'
        OR coat <> '{}'
    );
ALTER TABLE customer_measurments
ADD CONSTRAINT only_One_Measurment UNIQUE (customer_id);
ALTER TABLE customer_measurments DROP CONSTRAINT check_empty;
ALTER TABLE customer_measurments ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON TABLE customer_measurments TO company;
GRANT SELECT ON TABLE customer_measurments TO company;
GRANT UPDATE ON TABLE customer_measurments TO company;
GRANT USAGE,
    SELECT ON SEQUENCE customer_measurments_id_seq TO company;
CREATE POLICY insert_customer_measurments_for_own_company ON customer_measurments FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM customers
                JOIN company ON customers.company_id = company.id
            WHERE customers.id = customer_measurments.customer_id
                AND company.owner_id = current_setting('jwt.claims.user_id')::INTEGER
        )
    );
DROP POLICY insert_customer_measurments_for_own_company ON customer_measurments;
CREATE POLICY update_customer_measurments_for_own_company ON customer_measurments FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM customers
                JOIN company ON customers.company_id = company.id
            WHERE customers.id = customer_measurments.customer_id
                AND company.owner_id = current_setting('jwt.claims.user_id')::INTEGER
        )
    );
CREATE POLICY select_customer_measurments_for_own_company ON customer_measurments FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM customers
                JOIN company ON customers.company_id = company.id
            WHERE customers.id = customer_measurments.customer_id
                AND company.owner_id = current_setting('jwt.claims.user_id')::INTEGER
        )
    );
DROP POLICY select_customer_measurments_for_own_company ON customer_measurments;
CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL references customers(id),
    company_id INT NOT NULL references company(id),
    shirt INT,
    pant INT,
    sherwani INT,
    suit INT,
    coat INT,
    total_counts INT,
    total_price INT,
    order_status VARCHAR(255) NOT NULL DEFAULT 'pending',
    delivery_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION calculate_order_totals() RETURNS TRIGGER AS $$
DECLARE price_record prices %ROWTYPE;
BEGIN -- Fetch the prices for the company
SELECT * INTO price_record
FROM prices
WHERE company_id = NEW.company_id;
IF NOT FOUND THEN RAISE EXCEPTION 'Prices not found for company';
END IF;
-- Calculate total counts
NEW.total_counts := NEW.shirt + NEW.pant + NEW.sherwani + NEW.suit + NEW.coat;
-- Calculate total price
NEW.total_price := NEW.shirt * price_record.shirt_price + NEW.pant * price_record.pant_price + NEW.sherwani * price_record.sherwani_price + NEW.suit * price_record.suit_price + NEW.coat * price_record.coat_price;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER orders_before_insert ON orders;
DROP FUNCTION calculate_order_totals();
CREATE TRIGGER orders_before_insert BEFORE
INSERT ON orders FOR EACH ROW EXECUTE FUNCTION calculate_order_totals();
GRANT EXECUTE ON FUNCTION calculate_order_totals() TO company;
ALTER TABLE orders
ADD CONSTRAINT check_empty CHECK (
        shirt <> 0
        OR pant <> 0
        OR sherwani <> 0
        OR suit <> 0
        OR coat <> 0
    );
GRANT INSERT ON TABLE orders TO company;
GRANT SELECT ON TABLE orders TO company;
GRANT USAGE,
    SELECT ON SEQUENCE orders_id_seq TO company;
CREATE POLICY insert_orders_for_own_company ON orders FOR
INSERT WITH CHECK (
        -- Check for company and customer relationship
        EXISTS (
            SELECT 1
            FROM company
                JOIN customers ON company.id = customers.company_id
            WHERE company.id = orders.company_id
                AND customers.id = orders.customer_id
                AND company.owner_id = current_setting('jwt.claims.user_id')::INTEGER
        )
        AND -- Check for shirt measurement if shirt count is greater than 0
        (
            orders.shirt = 0
            OR EXISTS (
                SELECT 1
                FROM customer_measurments
                WHERE customer_measurments.customer_id = orders.customer_id
                    AND customer_measurments.shirt <> '{}'
            )
        )
        AND -- Repeat checks for pant, coat, suit, sherwani
        (
            orders.pant = 0
            OR EXISTS (
                SELECT 1
                FROM customer_measurments
                WHERE customer_measurments.customer_id = orders.customer_id
                    AND customer_measurments.pant <> '{}'
            )
        )
        AND (
            orders.coat = 0
            OR EXISTS (
                SELECT 1
                FROM customer_measurments
                WHERE customer_measurments.customer_id = orders.customer_id
                    AND customer_measurments.coat <> '{}'
            )
        )
        AND (
            orders.suit = 0
            OR EXISTS (
                SELECT 1
                FROM customer_measurments
                WHERE customer_measurments.customer_id = orders.customer_id
                    AND customer_measurments.suit <> '{}'
            )
        )
        AND (
            orders.sherwani = 0
            OR EXISTS (
                SELECT 1
                FROM customer_measurments
                WHERE customer_measurments.customer_id = orders.customer_id
                    AND customer_measurments.sherwani <> '{}'
            )
        )
    );
CREATE POLICY select_orders_for_own_company ON orders FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM company
                JOIN customers ON company.id = customers.company_id
            WHERE company.id = orders.company_id
                AND customers.id = orders.customer_id
                AND company.owner_id = current_setting('jwt.claims.user_id')::INTEGER
        )
    );
CREATE POLICY update_orders_for_own_company ON orders FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM company
                JOIN customers ON company.id = customers.company_id
            WHERE company.id = orders.company_id
                AND customers.id = orders.customer_id
                AND company.owner_id = current_setting('jwt.claims.user_id')::INTEGER
        )
    );
GRANT UPDATE ON TABLE orders TO company;
DROP POLICY select_orders_for_own_company ON orders;
DROP POLICY insert_orders_for_own_company ON orders;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
TRUNCATE TABLE orders;
CREATE TABLE bills (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL references orders(id),
    company_id INT NOT NULL references company(id),
    customer_id INT NOT NULL references customers(id),
    delivery_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
UPDATE customer_measurments
SET shirt = '{"neck": 15, "chest": 40, "waist": 30, "sleeve": 25, "length": 30}'
WHERE customer_id = 23;
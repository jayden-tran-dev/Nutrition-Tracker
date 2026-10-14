{/* use IDENTITY>SERIAL */}
CREATE TABLE food_logs (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    food_name VARCHAR(100) NOT NULL,
    grams NUMERIC(7, 2) NOT NULL,
    calories NUMERIC(8, 2) NOT NULL,
	carbs NUMERIC(7, 2) NOT NULL,
    protein NUMERIC(7, 2) NOT NULL,
    fat NUMERIC(7, 2) NOT NULL,
    meal VARCHAR(20) NOT NULL, 
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

{/* to see what is within food_logs */}

select * from food_logs

{/* food_logs info within () is optional but good practice so do it */}
INSERT INTO food_logs (
    food_name, grams, calories, protein, carbs, fat, meal
)
VALUES (
    'Chicken breast', 150, 248, 46.5, 0, 5.4, 'Lunch'
);

{/* Create a table for each user */}
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

{/* Create a column named user_id in food_logs and each user_id must exist in the users table */}
ALTER TABLE food_logs
ADD COLUMN user_id INTEGER REFERENCES users(id);
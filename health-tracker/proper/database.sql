CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    height NUMERIC(5, 2),
    weight NUMERIC(5, 1)
);

CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL,
    calories NUMERIC(10, 2) NOT NULL,
    protein NUMERIC(10, 2) NOT NULL,
    carbs NUMERIC(10, 2) NOT NULL,
    fats NUMERIC(10, 2) NOT NULL
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    exercise_name VARCHAR(255) NOT NULL;
    duration NUMERIC(10, 2) NOT NULL;
    calories_burnt NUMERIC(10, 2) NOT NULL; 
);

INSERT INTO users (ligma@gogurt.mlr, gogurt, passwordlol, 0.3, 69);

INSERT INTO foods ("human food", 420.69, 1000.2, 123456.789, 3);

INSERT INTO exercises ("bonesmashing", 48, 23.4);
 

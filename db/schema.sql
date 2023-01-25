DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE movies(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    movie_name VARCHAR(50) NOT NULL
);

CREATE TABLE reviews(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    movie_ID INT,
    review TEXT NOT NULL,
    FOREIGN KEY (movie_db)
    REFERENCES movies(id)
    ON DELETE SET NULL
);

DROP TABLE IF EXISTS Movielibrary;


CREATE TABLE IF NOT EXISTS Movielibrary(
 id SERIAL PRIMARY KEY,
 title varchar(255),
 poster_path varchar(255),
 overview varchar(10000)
);
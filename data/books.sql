DROP TABLE IF EXISTS books;

CREATE TABLE books(
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn10 VARCHAR(255),
  isbn13 VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(255)
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES ('steven', 'religion', '11111111111111', 'unavailable', 'css is awesome', 'bookshelf tes');
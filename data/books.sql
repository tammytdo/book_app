DROP TABLE IF EXISTS books_app;

CREATE TABLE books_app(
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description VARCHAR(255),
  bookshelf VARCHAR(255)
);

INSERT INTO books_app (author, title, isbn, image_url, description, bookshelf) VALUES ('steven', 'religion', '11111111111111', 'unavailable', 'css is awesome', 'bookshelf tes');
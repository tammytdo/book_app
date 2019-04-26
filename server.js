'use strict';

require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

//Postgres
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

//SQL
const SQL = {};
SQL.getAll = 'SELECT * FROM book;';
SQL.getById = 'SELECT * FROM saved_books WHERE id=$1;';

app.use(express.static('./public'));

// Application Middleware
app.use(express.urlencoded({extended: true}));
app.use(methodOverride((request, response) => {
  if(request.body && request.body._method){
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))
// Set the view engine for server-side templating
app.set('view-engine', 'ejs');


// API Routes
// Renders the search form

app.get('/', (request, response) => {
  response.render('pages/index.ejs');
})

// app.get('/newBookSearch', (request, response) => {
//   response.render('pages/searches/new.ejs');
// })

app.get('/bookData', (request, response) => {
  response.render('pages/index.ejs');
})

// Renders the home page on load //

app.post('/add-book', (request, response) => {
  console.log(request.body);
  const body = request.body;

  client.query('INSERT INTO books (author, title, isbn10, isbn13, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6, $7)', [body.bookAuthor, body.bookTitle, body.publishedDate, body.isbn10, body.isbn13, body.description, body.thumbnail]);

  //redirect them to home
  response.redirect('/');
})

app.get('/', (request, response) => {
  client.query(SQL.getAll).then(result =>{
    response.render('pages/index.ejs', {book: result.rows});
  })
    .catch(error => errorHandler(error, response));
});

app.get('/specificBook/:bookID', (request, response) => {
  client.query('SELECT * FROM book WHERE id=$1', [request.params.bookID]).then(result =>{
    console.log(result.rows); 
    response.render('pages/searches/show.ejs', {book: result.rows[0]});
  })
    .catch(error => errorHandler(error, response));
});

app.get('*', (request, response) => {
response.render('pages/index.ejs');
})




// Creates a new search to the Google Books API
app.post('/searches', (request, response) => {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  console.log(request.body);
  superagent.get(`${url}+intitle:${request.body.search[0]}`)
  .then(result => {
    let returnedSearches = result.body.items;
    let numBooksReturned = returnedSearches.map(item => {
      return new Books(item);
    })
    // console.log(numBooksReturned);
    // client.query(SQL.insertBooks, [returnedSearches, bookAuthor, publishedDate, isbn10, isbn13, description, thumbnail]);
    response.render('pages/searches/show.ejs', {data:numBooksReturned});
  })
  .catch(error => errorHandler(error, response));
})

// Catch-all



// Book constructor
function Books(dataObj) {
  this.bookTitle = dataObj.volumeInfo.title || "Title unavailable";
  this.bookAuthor = dataObj.volumeInfo.authors || "Author unavailable";
  this.publishedDate = dataObj.volumeInfo.publishedDate.slice(0, 4) || "Published Date unavailable";
  this.isbn10 = dataObj.volumeInfo.industryIdentifiers[0].identifier || "ISBN10 unavailable";
  this.isbn13 = dataObj.volumeInfo.industryIdentifiers[1].identifier || "ISBN13 unavailable";
  this.description = dataObj.volumeInfo.description || "Description unavailable" 
  this.thumbnail = dataObj.volumeInfo.imageLinks.thumbnail || "Image unavailable";
};


// HELPER FUNCTIONS

//handles error
function errorHandler(error, response){
  response.render('pages/error.ejs', {status: 500, message: 'Something went wrong.'});
  console.log('Something went wrong.');
  console.error(error);
}

// No API key required
// Console.log request.body and request.body.search

app.listen(PORT, () => console.log('app is up on port ' + PORT));
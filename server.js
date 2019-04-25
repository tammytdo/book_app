'use strict';

require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');


// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

app.use(express.static('./public'));

// Application Middleware
app.use(express.urlencoded({extended: true}));

// Set the view engine for server-side templating
app.set('view-engine', 'ejs');

// API Routes
// Renders the search form
app.get('*', (request, response) => {
  response.render('pages/index.ejs');
})

app.get('/bookData', (request, response) => {
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
    console.log(numBooksReturned);
    response.render('pages/searches/show.ejs', {data:numBooksReturned});
  })
})

// Catch-all


// HELPER FUNCTIONS
// Book constructor
function Books(dataObj) {
  this.bookTitle = dataObj.volumeInfo.title || "Title unavailable";
  this.bookAuthor = dataObj.volumeInfo.authors || "Author unavailable";
  this.publishedDate = dataObj.volumeInfo.publishedDate || "Published Date unavailable";
  this.isbn10 = dataObj.volumeInfo.industryIdentifiers[0].identifier || "ISBN10 unavailable";
  this.description = dataObj.volumeInfo.description || "Description unavailable" 
  // this.isbn13 = dataObj.volumeInfo.industryIdentifiers[1].identifier || "ISBN13 unavailable";
  // Come back and edit the rendering
  this.thumbnail = dataObj.volumeInfo.imageLinks.thumbnail || "Image unavailable";
};



// No API key required
// Console.log request.body and request.body.search

app.listen(PORT, () => console.log('app is up on port ' + PORT));
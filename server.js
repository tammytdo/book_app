'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./public'));

// Application Middleware
app.use(express.urlencoded({extended: true}));

// Set the view engine for server-side templating
app.set('view-engine', 'ejs');

// API Routes
// Renders the search form
app.get('/', (request, response) => {
  response.render('pages/index.ejs');
})

app.get('/test', (request, response) => {
  response.render('pages/index.ejs');
})


// Creates a new search to the Google Books API

let url = 'https://www.googleapis.com/books/v1/volumes?q=';

app.post('/searches', (request, response) => {
  superagent.get(`${url}+intitle:${request.body.search.slice(0,9)}`)
  .then(result => {
    // console.log(result.body);
    let returnedSearches = result.body.items;
    let tenBooks = returnedSearches.map(item => {
      new GetBook(item);
    })
    // console.log(returnedSearches)
    response.send(tenBooks);
    console.log(tenBooks)
  })
    // .catch(console.error);
  // console.log(request.body.search);
})

// Catch-all


// HELPER FUNCTIONS
// Book constructor
function GetBook(dataObj) {
  this.bookTitle = dataObj.volumeInfo.title || "Title unavailable";
  this.bookAuthor = dataObj.volumeInfo.authors || "Author unavailable";
  this.publishedDate = dataObj.volumeInfo.publishedDate || "Published Date unavailable";
  // this.thumbnail = dataObj. || "Image unavailable";
};



// No API key required
// Console.log request.body and request.body.search

app.listen(PORT, () => console.log('app is up on port ' + PORT));
'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Application Middleware
app.use(express.urlencoded({extended: true}));

// Set the view engine for server-side templating
app.set('view-engine', 'ejs');

// API Routes
// Renders the search form
app.get('/', (request, response) => {
  response.render('pages/index.ejs');
})

// Creates a new search to the Google Books API
app.post('/searches', (request, response) => {
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=+intitle:${request.body.search[0]}`).then(result => {
    console.log(result.body);
    response.send(result.body.items[0].volumeInfo.title);
  })
  console.log(request.body);
})

// Catch-all


// HELPER FUNCTIONS
// Book constructor




// No API key required
// Console.log request.body and request.body.search

app.listen(PORT, () => console.log('app is up on port ' + PORT));
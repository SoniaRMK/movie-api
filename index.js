const express = require('express');
  morgan = require('morgan');
  bodyParser = require('body-parser'),
  uuid = require('uuid');

  const app = express();

  app.use(bodyParser.json());


let movies = [
  {
    title: 'Titanic',
    director: 'James Cameron',
    genre: 'disaster'
  },
  {
    title: 'The Notebook',
    director: 'Nick Cassavetes',
    genre: 'romance'
  },
  {
    title: 'Brokeback Mountain',
    director: 'Ang Lee',
    genre: 'romance'
  },
  {
    title: 'Moonlight',
    director: 'Barry Jenkins',
    genre: 'drama'
  },
  {
    title: 'Malcolm X',
    director: 'Spike Lee',
    genre: 'biography'
  },
  {
    title: 'Forest Gump',
     director: 'Robert Zemeckis',
     genre: 'drama'
  },
  {
    title: 'Cast Away',
     director: 'Robert Zemeckis',
     genre: 'disaster'

  },
  {
    title: 'Francis Ha',
    director: 'Greta Gerwig',
    genre: 'comedy'
  },
  {
    title: 'If Beale Street Could Talk',
    director: 'Barry Jenkins',
    genre: 'romance'
  },
  {
    title: 'Harriet',
    director: 'Kasi Lemmons',
    genre: 'biography'
  }
];

//middleware functions--log url data & error handling
app.use(morgan('common'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my film society!');
});

app.get('/public/documentation', (req, res) => {
  app.use(express.static('public'));
  res.sendFile('/public/documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

// allows user to find a specific movie
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.title === req.params.title }));
});

//returns a list of movie genres
app.get('/genres', (req, res) => {
  res.send('Successful GET request returning data on all the genres');
});

//returns a list of directors
app.get('/directors', (req, res) => {
  res.send('Successful GET request returning data on all the directors');
});

//allows users to create a user profile with username
app.post('/users', (req, res) => {
  res.send('Successful POST request returning user profile');
});

//allows user to make changes to profile with username
app.put ('/users/:username', (req, res) => {
  res.send('Successful PUT request, profile updated');
});

//allows user to add or delete movies to their list of favorites
app.put('/users/:username/:favoritesList', (req, res) => {
  res.send('Successful PUT request, movies was added');
});

app.delete('/users/:username/:favoritesList', (req, res) => {
  res.send('Successful POST request, movies was deleted');
});

//deletes users profile
app.delete('/users/:username', (req, res) => {
  res.send('Successful DELETE request, user was deleted');
});


// listen for requests
app.listen(80, () =>{
  console.log('Your app is listening on port 8080');
});

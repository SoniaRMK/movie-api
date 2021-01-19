const express = require('express');
  morgan = require('morgan');

const app = express();


let topMovies = [
  {
    title: 'Titanic'
  },
  {
    title: 'The Notebook'
  },
  {
    title: 'Brokeback Mountain'
  },
  {
    title: 'Moonlight'
  },
  {
    title: 'Malcolm X'
  },
  {
    title: 'Forest Gump'
  },
  {
    title: 'Cast Away'
  },
  {
    title: 'Francis Ha'
  },
  {
    title: 'If Beale Street Could Talk'
  },
  {
    title: 'Harriet'
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
  res.json(topMovies);
});

// listen for requests
app.listen(8080, () =>{
  console.log('Your app is listening on port 8080');
});

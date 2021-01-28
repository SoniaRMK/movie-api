const express = require('express');
  morgan = require('morgan');
  bodyParser = require('body-parser');
  uuid = require('uuid');


const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test',
{ useNewUrlParser: true, useUnifiedTopology: true });

//set this to use "findOneAndUpdate" and "findOneAndRemove"
mongoose.set('useFindAndModify', false);


  const app = express();

  app.use(bodyParser.json());

  let auth = require('./auth')(app);

  const passport = require('passport');
    require('./passport');


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

app.get('/documentation', (req, res) => {
  app.use(express.static('public'));
  res.sendFile('/public/documentation.html', {root: __dirname});
});

app.get('/movies', passport.authenticate('jwt',
{ session: false }), (req, res) => {
  Movies.find().then(movies => res.json(movies));
});

// allows user to find a specific movie
app.get('/movies/:Title', passport.authenticate('jwt',
{ session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title})
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//returns a list of movie genres by name
app.get('/movies/genres/:Name', passport.authenticate('jwt',
{ session: false }), (req, res) => {
  Movies.findOne({'Genre.Name': req.params.Name})
    .then((movie) => {
      res.status(201).json(movie.Genre.Name + ': ' + movie.Genre.Description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//returns a list of directors by name
app.get('/movies/directors/:Name', passport.authenticate('jwt',
{ session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then((movie) => {
      res.status(201).json(movie.Director.Name + ': ' + movie.Director.Bio);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//allows users to create a user profile with username
app.post('/users', passport.authenticate('jwt',
{ session: false }), (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {
            res.status(201).json(user)
           })
          .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
      });
  });

  //get list of all Users
  app.get('/users', passport.authenticate('jwt',
  { session: false }), (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//find and update user information
  app.put('/users/:Username', passport.authenticate('jwt',
  { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username
    }, { $set:
        {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
    },
    { new: true },
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

//add a new movie to the favorites list, by id
  app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt',
  { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username
    }, {
          $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

//remove movie from favorites list by id
  app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt',
  { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username
    }, {
          $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

//delete user profile
  app.delete('/users/:Username', passport.authenticate('jwt',
  { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username
    })
        .then((user) => {
          if (!user) {
            res.status(400).send(req.params.Username + ' was not found');
          } else {
            res.status(200).send(req.params.Username + ' was deleted.');
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
    });

// listen for requests
app.listen(8080, () =>{
  console.log('Your app is listening on port 8080');
});

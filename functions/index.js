const functions = require("firebase-functions");

const app = require('express')();

const FBAuth = require('./utility/fbAuth');

const { getAllTournaments, postOneTournament } = require('./handlers/tournaments');
const { signup, login, uploadImage } = require('./handlers/users');


// TOURNAMENTS ROUTE
// get all the tournaments route
app.get('/tournaments', getAllTournaments);
// create tournament route
app.post('/tournament', FBAuth, postOneTournament);

// USERS ROUTE
// sign up route
app.post('/signup', signup);
// login route
app.post('/login', login);

//upload image
app.post('/user/image', FBAuth, uploadImage);


exports.api = functions.region('europe-west1').https.onRequest(app);
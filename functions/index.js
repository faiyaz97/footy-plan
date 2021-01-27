const functions = require("firebase-functions");

const app = require('express')();

const FBAuth = require('./utility/fbAuth');

const { getAllTournaments, postOneTournament, getTournament, commentOnTournament } = require('./handlers/tournaments');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');


// TOURNAMENTS ROUTE
// get all the tournaments route
app.get('/tournaments', getAllTournaments);
// create tournament route
app.post('/tournament', FBAuth, postOneTournament);

// get a tournament and its comments
app.get('/tournament/:tournamentId', getTournament);
// comment in a tournament
app.post('/tournament/:tournamentId/comment', FBAuth, commentOnTournament);

// USERS ROUTE
// sign up route
app.post('/signup', signup);
// login route
app.post('/login', login);

// upload image
app.post('/user/image', FBAuth, uploadImage);

// add user details
app.post('/user', FBAuth, addUserDetails);

//
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.region('europe-west1').https.onRequest(app);
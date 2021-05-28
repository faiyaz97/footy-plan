const functions = require("firebase-functions");
const app = require('express')();
const FBAuth = require('./utility/fbAuth');
const { db } = require('./utility/admin');


const { getAllTournaments, postOneTournament, getTournament, commentOnTournament, deleteTournament } = require('./handlers/tournaments');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead } = require('./handlers/users');


// TOURNAMENTS ROUTES
// get all the tournaments route
app.get('/tournaments', getAllTournaments);
// create tournament route
app.post('/tournament', FBAuth, postOneTournament);
// delete tournament
app.delete('/tournament/:tournamentId', FBAuth, deleteTournament);
// get a tournament and its comments
app.get('/tournament/:tournamentId', getTournament);
// comment in a tournament
app.post('/tournament/:tournamentId/comment', FBAuth, commentOnTournament);

// USERS ROUTES
// sign up route
app.post('/signup', signup);
// login route
app.post('/login', login);
// upload image
app.post('/user/image', FBAuth, uploadImage);
// add user details
app.post('/user', FBAuth, addUserDetails);
// get user details
app.get('/user/:handle', getUserDetails);

// function that updates the user image URL in any document when the profile picture is changed 
exports.api = functions.region('europe-west1').https.onRequest(app);
  exports.onUserImageChange = functions
  .region('europe-west1')
  .firestore.document('/users/{userId}')
  .onUpdate((change) => {
    // if the image url is different from the new url then it will  updates the user image URL in any document
    // otherwise return true
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      // initialize batch used for performing multiple writes as a single atomic operation
      const batch = db.batch();
      // returns tournaments collection where the username of the match is the same 
      // of the username of user that's updating the image
      return db
        .collection('tournaments')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const tournament = db.doc(`/tournaments/${doc.id}`);
            batch.update(tournament, { userImage: change.after.data().imageUrl });
          });
          // returns all the comment that user did
          return db
            .collection('comments')
            .where('userHandle', '==', change.before.data().handle)
            .get()
        })
        .then((data) => {
          // update the image URL stored in each comment documents of that user
          data.forEach((doc) => {
            const comment = db.doc(`/comments/${doc.id}`);
            batch.update(comment, { userImage: change.after.data().imageUrl });
          });
          // commits all of the writes in this write batch as a single atomic unit
          return batch.commit();
        });
    } else return true;
  });

  // function that deletes all the comments linked to the tournament deleted
  exports.onTournamentDelete = functions
  .region('europe-west1')
  .firestore.document('/tournaments/{tournamentId}')
  .onDelete((snapshot, context) => {
  const tournamentId = context.params.tournamentId;
  // initialize batch used for performing multiple writes as a single atomic operation
  const batch = db.batch();
  // returns all the comments on that tournament using the tounamentId
  return db
      .collection('comments')
      .where('tournamentId', '==', tournamentId)
      .get()
      .then((data) => {
        // deletes all the tournaments comment returned from the query
        data.forEach((doc) => {
        batch.delete(db.doc(`/comments/${doc.id}`));
      });
      // commits all of the writes in this write batch as a single atomic unit
      return batch.commit();
      })
      // if any error prints the error
      .catch((err) => console.error(err));
  });
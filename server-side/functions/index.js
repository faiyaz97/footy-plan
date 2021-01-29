const functions = require("firebase-functions");

const app = require('express')();
const FBAuth = require('./utility/fbAuth');

const { db } = require('./utility/admin');


const { getAllTournaments, postOneTournament, getTournament, commentOnTournament, deleteTournament } = require('./handlers/tournaments');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead } = require('./handlers/users');


// TOURNAMENTS ROUTE
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
// get user details
app.get('/user/:handle', getUserDetails);
// mark notifications read
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnComment = functions
  .region('europe-west1')
  .firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/tournaments/${snapshot.data().tournamentId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            tournamentId: doc.id
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

  exports.onUserImageChange = functions
  .region('europe-west1')
  .firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('tournaments')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const tournament = db.doc(`/tournaments/${doc.id}`);
            batch.update(tournament, { userImage: change.after.data().imageUrl });
          });
          //return batch.commit();
          return db
            .collection('comments')
            .where('userHandle', '==', change.before.data().handle)
            .get()
        })
        .then((data) => {
          data.forEach((doc) => {
            const comment = db.doc(`/comments/${doc.id}`);
            batch.update(comment, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });

    } else return true;
  });

    exports.onTournamentDelete = functions
    .region('europe-west1')
    .firestore.document('/tournaments/{tournamentId}')
    .onDelete((snapshot, context) => {
    const tournamentId = context.params.tournamentId;
    const batch = db.batch();
    return db
        .collection('comments')
        .where('tournamentId', '==', tournamentId)
        .get()
        .then((data) => {
        data.forEach((doc) => {
            batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
            .collection('likes')
            .where('tournamentId', '==', tournamentId)
            .get();
        })
        .then((data) => {
        data.forEach((doc) => {
            batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
            .collection('notifications')
            .where('tournamentId', '==', tournamentId)
            .get();
        })
        .then((data) => {
        data.forEach((doc) => {
            batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
        })
        .catch((err) => console.error(err));
    });
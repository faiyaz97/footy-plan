const functions = require("firebase-functions");
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

const firebaseConfig = {
  apiKey: "AIzaSyAqraIKDVcUqPtEsO7yjEKAZ3rb8uR8O7g",
  authDomain: "football-tournament-ffu.firebaseapp.com",
  databaseURL: "https://football-tournament-ffu-default-rtdb.firebaseio.com",
  projectId: "football-tournament-ffu",
  storageBucket: "football-tournament-ffu.appspot.com",
  messagingSenderId: "353319706198",
  appId: "1:353319706198:web:37e291767e60a6d0f6e5f7",
  measurementId: "G-X4WQQPKRXZ"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();


app.get('/tournaments',  (req, res) => {
  db
    .collection('tournaments')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let tournaments = [];
      data.forEach(doc => {
        tournaments.push({
          tournamentId: doc.id,
          name: doc.data().name,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(tournaments);
    })
    .catch(err =>console.error(err));
})


app.post('/tournament', (req, res) => {

  const newTournament = {
    name: req.body.name,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  db
    .collection('tournaments')
    .add(newTournament)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully`})
    })
    .catch(err => {
      res.status(500).json({error: 'something went wrong'})
      console.error(err);
    });
  
});

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email.match(emailRegEx)) return true;
  else return false;
}

const isEmpty = (string) => {
  if(string.trim() == '') return true;
  else return false;
}

//sign up route
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  let errors = {};

  if(isEmpty(newUser.email)) {
    errors.email = 'Email must not be empty'
  } else if(!isEmail(newUser.email)){
    errors.email = 'Must be a valid email address'
  }

  if(isEmpty(newUser.password)) errors.password = 'Must not be empty'
  if(newUser.password !==  newUser.confirmPassword) errors.confirmPassword = 'Password must match'
  if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty'

  if(Object.keys(errors).length > 0) return res.status(400).json(errors);

  // TODO: Validate data


  let token, userId;
  db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
      if(doc.exists){
        return res.status(400).json({handle: 'this handle is already taken'});
      } else {
        return firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if(err.code == 'auth/email-already-in-use'){
        return res.status(400).json({email: 'Email is already in use'})
      } else {
      return res.status(500).json({ error: err.code});
      }
    })
});





exports.api = functions.region('europe-west1').https.onRequest(app);
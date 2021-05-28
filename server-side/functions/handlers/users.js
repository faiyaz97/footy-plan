const { admin, db } = require('../utility/admin');

const firebaseConfig = require('../utility/firebaseConfig')

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../utility/validators');


// singup handler
exports.signup = (req, res) => {
  // user data object
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  // validate the data object
  const { valid, errors } = validateSignupData(newUser);
  // if it is not valid return json object with errors
  if(!valid) return res.status(400).json(errors);
  // initialize default image
  const noImg = 'logo.png';
  let token, userId;
  db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
      // check if the username is already taken
      if(doc.exists){
        return res.status(400).json({handle: 'this handle is already taken'});
      } else {
        return firebase
          .auth()
          // create users on Firebase Auth
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      // get the user id
      userId = data.user.uid;
      // return id token
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      // user data object
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
        userId
      };
      // store user object in the database
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      // return the token id
      return res.status(201).json({ token });
    })
    .catch(err => {
      // error handling
      console.error(err);
      // check if the email is already used
      if(err.code == 'auth/email-already-in-use'){
        return res.status(400).json({email: 'Email is already in use'})
      } else {
      // reutrn error message for any other different error
      return res.status(500).json({ general: 'Something went wrong, please try again'});
      }
    })
  };



  // login handler
  exports.login = (req, res) => {
    // login data object
    const user = {
      email: req.body.email,
      password: req.body.password
    };

    // validate login data
    const { valid, errors } = validateLoginData(user);
    // if not valid return error
    if(!valid) return res.status(400).json(errors);
    // login with firebase auth
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        // get token
        return data.user.getIdToken();
      })
      .then(token => {
        // return token
        return res.json({token});
      })
      .catch(err => {
        // catch error
        console.error(err);
        // return error
        return res
          .status(403)
          .json({general: 'Wrong credentials, please try again'});
      });
  };


  // getUsersDetails handler
  exports.getUserDetails = (req, res) => {
    let userData = {};
    // document location
    db.doc(`/users/${req.params.handle}`)
      .get()
      .then((doc) => {
        // check if the document exists
        if (doc.exists) {
          userData.user = doc.data();
          // return all the tournaments of that user
          return db
            .collection("tournaments")
            .where("userHandle", "==", req.params.handle)
            .orderBy("createdAt", "desc")
            .get();
        } else {
          // return error if user not found
          return res.status(404).json({ error: "User not found" });
        }
      })
      .then((data) => {
        userData.tournaments = [];
        data.forEach((doc) => {
          // push this user tournaments in the object
          userData.tournaments.push({
            name: doc.data().name,
            createdAt: doc.data().createdAt,
            userHandle: doc.data().userHandle,
            userImage: doc.data().userImage,
            commentCount: doc.data().commentCount,
            tournamentId: doc.id,
          });
        });
        // return json object with all the user data
        return res.json(userData);
      })
      .catch((err) => {
        // reuturn error message for any other different error
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };

  


  // upload image on the storage
  exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers:req.headers});

    // initialize imageFileName variable and imageToBeUploaded array
    let imageFileName;
    let imageToBeUploaded = {};

    // busboy works on file
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      // allows only jpeg and pn format t be stored
      if(mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
        return res.status(400).json({ error : 'Wrong file type submitted'});
      }
      // get image file type
      const imageExtenstion = filename.split('.')[filename.split('.').length -1];
      // generate image file name
      imageFileName = `${Math.round(Math.random() * 1000000000000)}.${imageExtenstion}`;
      // filepath
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      // streams to get access to the file data as it arrives
      file.pipe(fs.createWriteStream(filepath));
    });

    // busboy works when the file is ready
    busboy.on('finish', () => {
      // store the file in storage
      admin.storage().bucket().upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        // generate the image url
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        // updates the user imageUrl
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl: imageUrl });
      })
      .then(() => {
        // return a message of success
        return res.json({message: 'Image uploaded successfully'});
      })
      .catch(err => {
        // if any errors are caught, returns the errors
        console.error(err);
        return res.status(500).json({ error: err.code })
      });
    });
    // end busboy
    busboy.end(req.rawBody);
  };
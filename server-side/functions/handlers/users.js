const { admin, db } = require('../utility/admin');

const firebaseConfig = require('../utility/firebaseConfig')

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../utility/validators');

exports.signup = (req, res) => {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      handle: req.body.handle
    };

    const { valid, errors } = validateSignupData(newUser);
  
    if(!valid) return res.status(400).json(errors);

    const noImg = 'logo.png';
  
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
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
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
        return res.status(500).json({ general: 'Something went wrong, please try again'});
        }
      })
  };




  exports.login = (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    };

    const { valid, errors } = validateLoginData(user);
  
    if(!valid) return res.status(400).json(errors);
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        return data.user.getIdToken();
      })
      .then(token => {
        return res.json({token});
      })
      .catch(err => {
        console.error(err);
        return res
          .status(403)
          .json({general: 'Wrong credentials, please try again'});
      });
  };


  exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
      .then(() => {
        return res.json({ message: 'Details added successfully'});
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({error: err.code});
      })

  };


  exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          userData.user = doc.data();
          return db
            .collection("tournaments")
            .where("userHandle", "==", req.params.handle)
            .orderBy("createdAt", "desc")
            .get();
        } else {
          return res.status(404).json({ error: "User not found" });
        }
      })
      .then((data) => {
        userData.tournaments = [];
        data.forEach((doc) => {
          userData.tournaments.push({
            name: doc.data().name,
            createdAt: doc.data().createdAt,
            userHandle: doc.data().userHandle,
            userImage: doc.data().userImage,
            commentCount: doc.data().commentCount,
            tournamentId: doc.id,
          });
        });
        return res.json(userData);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };

  exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
      .then(doc => {
        if(doc.exists) {
          userData.credentials = doc.data();
          return db.collection('likes').where('userHandle', '==', req.user.handle).get();
        }
    })
    .then((data) => {
      userData.comments = [];
      data.forEach((doc) => {
        userData.comments.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          tournamentId: doc.data().tournamentId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};



  exports.uploadImage =(req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers:req.headers});

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      if(mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
        return res.status(400).json({ error : 'Wrong file type submitted'});
      }
      // image.png
      const imageExtenstion = filename.split('.')[filename.split('.').length -1];
      imageFileName = `${Math.round(Math.random() * 1000000000000)}.${imageExtenstion}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));


    });

    busboy.on('finish', () => {
      admin.storage().bucket().upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl: imageUrl });
      })
      .then(() => {
        return res.json({message: 'Image uploaded successfully'});
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code })
      });
    });
    busboy.end(req.rawBody);
  };


  exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach(notificationId => {
      const notification = db.doc(`/notifications/${notificationId}`);
      batch.update(notification, {read: true});
    });
    batch.commit()
    .then(() => {
      return res.json({ message: 'Notifications marked read'});
    })
    .catch(err => {
      connsole.error(err);
      return res.status(500).json({ error: err.code});
    });
  };
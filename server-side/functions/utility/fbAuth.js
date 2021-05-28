const { admin, db } = require('./admin');
// user authentication
module.exports = (req, res, next) => {
    let idToken;
    // check if the token is in the headers
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      // token not found errore message
      console.error('No token found')
      return res.status(403).json({error: 'Unauthorized'});
    }
    
    // authenticate the user through the id token
    admin.auth().verifyIdToken(idToken)
      .then(decodedToken => {
        // decode the token to retrive the user id
        req.user = decodedToken;
        //console.log(decodedToken);
        // retrieve the user data document for the users collection
        return db.collection('users')
          .where('userId', '==', req.user.uid)
          .limit(1)
          .get();
      })
      .then(data => {
        // username and image url are taken from the document
        req.user.handle = data.docs[0].data().handle;
        req.user.imageUrl = data.docs[0].data().imageUrl;
        // returns next
        return next();
      })
      .catch(err => {
        // if any error, send errors as response
        console.error('Error while verifying token ', err);
        return res.status(403).json(err);
      })
  }
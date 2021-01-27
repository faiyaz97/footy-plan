const { db } = require('../utility/admin');

exports.getAllTournaments = (req, res) => {
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
  }


  exports.postOneTournament = (req, res) => {

    //TODO: add input validation
    if(req.body.name.trim() === '') {
      return res.status(400).json({ name: 'Name must not be empty'});
    }
  
    const newTournament = {
      name: req.body.name,
      userHandle: req.user.handle,
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
    
  }



  exports.getTournament = (req, res) => {
    let tournamentData = {};
    db.doc(`/tournaments/${req.params.tournamentId}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).json({ error: 'Tournament not found' });
        }
        tournamentData = doc.data();
        tournamentData.tournamentId = doc.id;
        return db
          .collection('comments')
          .orderBy('createdAt', 'desc')
          .where('tournamentId', '==', req.params.tournamentId)
          .get();
      })
      .then((data) => {
        tournamentData.comments = [];
        data.forEach((doc) => {
          tournamentData.comments.push(doc.data());
        });
        return res.json(tournamentData);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.code });
      });
  };


  exports.commentOnTournament = (req, res) => {
    if (req.body.body.trim() === '')
      return res.status(400).json({ comment: 'Must not be empty' });
      
  
    console.log("IMAGE: ", req.user);
    const newComment = {
      body: req.body.body,
      createdAt: new Date().toISOString(),
      tournamentId: req.params.tournamentId,
      userHandle: req.user.handle,
      userImage: req.user.imageUrl
    };
    console.log(newComment);
  
    db.doc(`/tournaments/${req.params.tournamentId}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).json({ error: 'Tournament not found' });
        }
        return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
      })
      .then(() => {
        return db.collection('comments').add(newComment);
      })
      .then(() => {
        res.json(newComment);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  };
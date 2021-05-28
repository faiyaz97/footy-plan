const { db } = require('../utility/admin');

// get all tournament data in a array
exports.getAllTournaments = (req, res) => {
    // retireve all the documents from the tournaments collection
    db
      .collection('tournaments')
      .orderBy('createdAt', 'desc')
      .get()
      .then(data => {
        let tournaments = [];
        // each date is a tournament document and is pushed into the array as a object
        data.forEach(doc => {
          tournaments.push({
            tournamentId: doc.id,
            name: doc.data().name,
            userHandle: doc.data().userHandle,
            createdAt: doc.data().createdAt,
            commentCount: doc.data().commentCount,
            userImage: doc.data().userImage,
            teamsN: doc.data().teamsN,
            type: doc.data().type,
            format: doc.data().format,
            location: doc.data().location,
            description: doc.data().description,
            date: doc.data().date,
          });
        });
        // send the tournaments array in json format as repsonse
        return res.json(tournaments);
      })
      // in case of errore send the error as response
      .catch(err =>console.error(err));
  }

  // post one tournament
  exports.postOneTournament = (req, res) => {
    // input validation
    // check if the tile of the tournament is empty
    if(req.body.name.trim() === '') {
      return res.status(400).json({ name: 'Name must not be empty'});
    }
    // check if the location of the tournament is empty
    if(req.body.location.trim() === '') {
      return res.status(400).json({ location: 'Location must not be empty'});
    }
    // check if the date of the tournament is empty
    if(req.body.date.trim() === '') {
      return res.status(400).json({ date: 'Date must not be empty'});
    }
    // check if the description of the tournament is empty
    if(req.body.description.trim() === '') {
      return res.status(400).json({ description: 'Description must not be empty'});
    }
    // object that contains all the tournament data
    const newTournament = {
      name: req.body.name,
      location: req.body.location,
      date: req.body.date,
      description: req.body.description,
      teamsN: req.body.teamsN,
      type: req.body.type,
      format: req.body.format,
      logo: req.body.logo,
      userHandle: req.user.handle,
      userImage: req.user.imageUrl,
      createdAt: new Date().toISOString(),
      commentCount: 0
    };
    // post a new document on the tournaments collection
    db
      .collection('tournaments')
      .add(newTournament)
      .then(doc => {
        const resTournament = newTournament;
        resTournament.tournamentId = doc.id;
        // response with the tournament data just created in json format
        res.json(resTournament);
      })
      .catch(err => {
        // if any error, returns the error
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
      })
      .then(() => {
        return db
          .collection('matches')
          .where('tournamentId', '==', req.params.tournamentId)
          .get();
      })
      .then((data) => {
        tournamentData.matches = [];
        data.forEach((doc) => {
          tournamentData.matches.push(doc.data());
        });
      })
      .then(() => {
        return db
          .collection('teams')
          .where('tournamentId', '==', req.params.tournamentId)
          .get();
      })
      .then((data) => {
        tournamentData.teams = [];
        data.forEach((doc) => {
          tournamentData.teams.push(doc.data());
        });
        return res.json(tournamentData);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.code });
      });
  };

  // add comment on a tournament
  exports.commentOnTournament = (req, res) => {
    // check if the comment is empty
    if (req.body.body.trim() === '')
      return res.status(400).json({ comment: 'Must not be empty' });
      
  
    // created an object with comment data
    const newComment = {
      body: req.body.body,
      createdAt: new Date().toISOString(),
      tournamentId: req.params.tournamentId,
      userHandle: req.user.handle,
      userImage: req.user.imageUrl
    };

    console.log(newComment);
  
    // request path
    db.doc(`/tournaments/${req.params.tournamentId}`)
      .get()
      .then((doc) => {
        // check if the tournament exist
        if (!doc.exists) {
          return res.status(404).json({ error: 'Tournament not found' });
        }
        // increment comment count
        return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
      })
      .then(() => {
        // create comment document in the comements collection
        return db.collection('comments').add(newComment);
      })
      .then(() => {
        // send comment data in json format as response
        res.json(newComment);
      })
      .catch((err) => {
        // if any error, send errors as response
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  };

  
  // deletes tournament
  exports.deleteTournament = (req, res) => {
    // request path
    const document = db.doc(`/tournaments/${req.params.tournamentId}`);
    document
      .get()
      .then((doc) => {
        // check if the document exist
        if (!doc.exists) {
          return res.status(404).json({ error: 'Tournament not found' });
        }
        // check if the user who is trying to delete the tournament is same one to  who have created it
        // if true, the document can be deleted, otherwise will send Unauthorized as a response
        if (doc.data().userHandle !== req.user.handle) {
          return res.status(403).json({ error: 'Unauthorized' });
        } else {
          // deteles the tournament
          return document.delete();
        }
      })
      .then(() => {
        // send success message as repsonse
        res.json({ message: 'Tournament deleted successfully' });
      })
      .catch((err) => {
        // if any error, send errors as response
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };
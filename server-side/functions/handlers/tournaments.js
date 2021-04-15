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
        return res.json(tournaments);
      })
      .catch(err =>console.error(err));
  }


  exports.postOneTournament = (req, res) => {

    //TODO: add input validation
    if(req.body.name.trim() === '') {
      return res.status(400).json({ name: 'Name must not be empty'});
    }
    if(req.body.location.trim() === '') {
      return res.status(400).json({ location: 'Location must not be empty'});
    }
    if(req.body.date.trim() === '') {
      return res.status(400).json({ date: 'Date must not be empty'});
    }
    if(req.body.description.trim() === '') {
      return res.status(400).json({ description: 'Description must not be empty'});
    }
    
  
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
  
    db
      .collection('tournaments')
      .add(newTournament)
      .then(doc => {
        const resTournament = newTournament;
        resTournament.tournamentId = doc.id;
        res.json(resTournament);
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


  exports.deleteTournament = (req, res) => {
    const document = db.doc(`/tournaments/${req.params.tournamentId}`);
    document
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).json({ error: 'Tournament not found' });
        }
        if (doc.data().userHandle !== req.user.handle) {
          return res.status(403).json({ error: 'Unauthorized' });
        } else {
          return document.delete();
        }
      })
      .then(() => {
        res.json({ message: 'Tournament deleted successfully' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };
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
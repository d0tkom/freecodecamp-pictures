var Picture = require('../models/picture');
var User = require('../models/user');

module.exports = function(app, passport) {
  app.get('/api/pictures', function(req, res) {
    Picture.find().sort('-dateAdded').exec((err, pictures) => {
      if (err) {
        res.status(500).send(err);
      }
      res.json({ pictures });
    });
  });

  app.get('/api/pictures/my', isLoggedIn, function(req, res) {
    var userId = req.user.twitter.id;
    Picture.find({userId: userId}).sort('-dateAdded').exec((err, pictures) => {
      if (err) {
        res.status(500).send(err);
      }
      res.json({ pictures });
    });
  });

  app.get('/api/pictures/:id', function(req, res) {
    var userId = req.params.id;
    Picture.find({userId: userId}).sort('-dateAdded').exec((err, pictures) => {
      if (err) {
        res.status(500).send(err);
      }
      res.json({ pictures });
    });
  });

  app.post('/api/pictures', isLoggedIn, function(req, res) {
    if (!req.body.picture.url) {
      res.status(403).end();
    }

    var url = req.body.picture.url;
    var userId = req.user.twitter.id;
    var userName = req.user.twitter.username || req.user.twitter.id;

    var picture = new Picture({url: url, userId: userId, userName: userName});
    picture.save((err, saved) => {
      if (err) {
        res.status(500).send(err);
      }
      res.send(saved);
    })
  });

  app.delete('/api/pictures/:id', isLoggedIn, function(req, res) {
    var picId = req.params.id;
    var userId = req.user.twitter.id;
    Picture.remove({_id: picId, userId: userId}).exec((err) => {
      if (err) {
        res.status(500).send(err);
      }
      res.send("deleted");
    });
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
          return next(); 
        }
        // if they aren't redirect them to the home page
        res.redirect('/');
    }
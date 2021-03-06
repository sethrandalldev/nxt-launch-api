const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.Promise = Promise;

const dbUrl = 'mongodb+srv://user:39h89r3@learning-node.lbsjp.mongodb.net/test?retryWrites=true&w=majority'

const User = mongoose.model('User', {
  email: String,
  password: String,
});

app.use(cors({
  origin: 'http://localhost:59360'
}));
app.use(express.urlencoded({ extended: false }));

app.post('/login', async(req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    console.log(user);
    bcrypt.compare(req.body.password, user.password, function(err, result) {
      if (result) res.send({ id: user._id, email: user.email });
      else res.sendStatus(404);
    });
  });
});

app.post('/register', async(req, res) => {
  User.findOne({email: req.body.email}, function (err, user) {
    if (user && Object.keys(user).length) {
      return res.sendStatus(409);
    } else {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        try {
          user.save().then(savedUser => res.send(savedUser));
        } catch (error) {
          res.sendStatus(500);
          console.error(error);
        }
        
      });  
    }
  });
   
});

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  console.log('mongodb connection', err);
});

app.listen(3000);
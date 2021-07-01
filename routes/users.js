const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require ('passport');

// bring in user Model
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// reigster Process

router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  console.log(req.body);    

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Passworld is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors:errors
    });
  } else {
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'You are now registerd and can log in');
            res.redirect('/users/login');  
          }
        });
      });
    });
  }
});
// login form 
router.get('/login', function(req, res){
  res.render('login');
});

// login process

router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
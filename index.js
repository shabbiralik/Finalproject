const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');


mongoose.connect(config.database);
let db = mongoose.connection;

// check for connection

db.once('open', function(){
    console.log('connected to MongoDB');
});

// Check for DB Error

db.on('error', function(err){
    console.log(err);
});


// initial app

const app = express();

// bring in models

let Article = require('./models/article');
let User = require('./models/user');




// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// set public folder

app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
  
  // Express Messages Middleware
  app.use(require('connect-flash')());
  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });
  
  // Express Validator Middleware
  app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
  
      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  }));

// passport config

require('./config/passport')(passport);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Home Route

app.get('/', function(req, res){
      
   Article.find({}, function(err, articles){
       if(err){
           console.log(err);
       } else {
          res.render('index', {
              title:'Article',
              articles: articles.map(a=> {
                return {
                  _id: a._id,
                  title: a.title,
                  createdOn: a.createdOn,
                  author: User.findById(a.author).then(u=> u).name
                }
              })
          });
        }
      })
});

// route files

let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

// start server
app.listen(3000, function() {
    console.log('Server Started on Port 3000...');
});
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
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



// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// set public folder

app.use(express.static(path.join(__dirname, 'public')));


// Home Route

app.get('/', function(req, res){
    Article.find({}, function(err, articles){
       console.log(articles); 
       if(err){
           console.log(err);
       } else {
            res.render('index', {
                title:'Article',
                articles: articles
            });
        }
    });
});
// add article route

app.get('/articles/add', function(req, res){
    res.render('add_article', {
        title: 'Add Article'
    });
});

//add submit POST ROUT

app.post('/articles/add', function(req, res){
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        } else{
            res.redirect('/');
        }
    });
});

app.listen(3000, function() {
    console.log('Server Started on Port 3000...');
});
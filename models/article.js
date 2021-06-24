let mongoose = require('mongoose');

// article schemas

let articlesSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    author: {
        type: String,
        require: true,
    },
    body: {
        type: String,
        rquire: true,
    }
});

let Article = module.exports = mongoose.model('Article', articlesSchema);
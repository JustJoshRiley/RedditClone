const express = require('express')
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const post = require('./models/post');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const checkAuth = require('./middleware/checkAuth');
const jwt = require('jsonwebtoken');
// const posts = require('./controllers/posts');

// const posts = require('./controllers/posts');

const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    // helpers: {
    //     if_eq: function (a, b, opts) {
    //         // return a === b
    //         if (a === b) {
    //             return opts.fn(this);
    //         }
    //         return opts.inverse(this);
    //     },
    // },
});


const app = express();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(cookieParser());
app.use(checkAuth);
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CSS
app.use(express.static(path.join(__dirname, '/public')));

require('./controllers/posts')(app)
require('./data/reddit-db');
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);

// app.get('/', (req, res) => {
//     post.find({}).lean()
//     .then((posts) => res.render('posts-index', { posts }))
//     .catch((err) => {
//     console.log(err.message);
//     })
// })
app.get('/', (req, res) => {
    const { user } = req;

    // console.log(req.cookies);
    const token = req.cookies.nToken;
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            console.log(err)
            // redirect to login if not logged in
            post.find({}).lean().populate('author')
            .then((posts) => res.render('posts-index', {posts}))
            
        }
        const currentUser = user;
        // next();
        
    
    post.find({}).lean().populate('author')
        .then((posts) => res.render('posts-index', { posts, currentUser }))
        
        .catch((err) => {
        console.log(err.message);
        });
        })
    } else {
        post.find({}).lean().populate('author')
        .then((posts) => res.render('posts-index', {posts}))
    }
});

const port = process.env.PORT || 3000

app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('App listening on ' + port)
})

module.exports = app;
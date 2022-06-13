const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
// const { count } = require('../models/post');

module.exports = (app) => {

    app.get('/posts/new', (req, res) => {
        res.render('posts-new', {})
    });
    // Create post
    app.post('/posts/new', (req, res) => {
    const post = new Post(req.body);
    post.author = req.user._id;
    post.upVotes = [];
    post.downVotes = [];
    post.voteScore = 0;
    if (req.user) {
        const userId = req.user._id;
        const post = new Post(req.body);
        post.author = userId;

        post
            .save()
            .then(() => User.findById(userId))
            .then((user) => {
            user.posts.unshift(post);
            user.save();
            // REDIRECT TO THE NEW POST
            return res.redirect(`/posts/${post._id}`);
            })
            .catch((err) => {
            console.log(err.message);
            });
        } else {
        return res.status(401); // UNAUTHORIZED
        }
    });

    app.get('/posts/:id', (req, res) => {
    const currentUser = req.user;
    Post.findById(req.params.id).populate('comments').lean()
    .then((post) => res.render('posts-show', { post, currentUser }))
    .catch((err) => {
    console.log(err.message);
    });
    });
    

    // SUBREDDIT
    app.get('/n/:subreddit', (req, res) => {
    // const { user } = req;
    const currentUser = req.user;
    Post.find({ subreddit: req.params.subreddit }).lean()
        .then((posts) => res.render('posts-index', { posts, currentUser }))
        .catch((err) => {
        console.log(err);
        });
    });

    app.put('/posts/:id/vote-up', (req, res) => {
    Post.findById(req.params.id).then(post => {
        post.upVotes.push(req.user._id);
        post.voteScore = post.upVotes.length - post.downVotes.length;
        post.save();

        return res.render('posts-show', {post});
    }).catch(err => {
        console.log(err);
    })
    });

    app.put('/posts/:id/vote-down', (req, res) => {
    Post.findById(req.params.id).then(post => {
        post.downVotes.push(req.user._id);
        post.voteScore = post.upVotes.length - post.downVotes.length;
        post.save();

        return res.render('posts-show', {post});
    }).catch(err => {
        console.log(err);
    });
    });
}

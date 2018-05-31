const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validatePostInput = require('../../validation/post.js');

//Load models
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');


//@route GET api/posts/test
//@ desc Tests posts route
//@access Public
router.get('/test', (req,res)=> {
    res.json({msg: 'Post route works'});
})


//@route POST api/posts/
//@ desc Create new post
//@access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req,res)=> {
    const {errors, isValid} = validatePostInput(req.body);
    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }
    //create newPost obj.
    const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar
    });
    //save it
    new Post(newPost).save().then(post=>res.json(post));
});


//@route GET api/posts/
//@ desc Get all posts
//@access Public
router.get('/', (req,res)=> {
    Post.find()
        .sort({date: -1})
        .then(posts=> res.json(posts))
        .catch(err=>res.status(404).json({posts: 'There are no posts'}));
});

//@route GET api/posts/:id
//@ desc Get single post
//@access Public
router.get('/:id', (req,res)=> {
    Post.findById(req.params.id)
        .then(post=> res.json(post))
        .catch(err=>res.status(404).json({post: 'There is no such post'}));
});

//@route DELETE api/posts/:id
//@ desc Delete a post
//@access Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req,res)=> {
    Profile.findOne({user: req.user.id})
        .then(profile=> {
            Post.findById(req.params.id)
                .then(post=> {
                    //check for post ownership
                    if(post.user.toString() !== req.user.id) {
                        return res.status(401).json({notauth: 'You can\'t delete this post'});
                    }
                    //delete
                    post.remove().then(()=> res.json({success: true}));
                })
                .catch(err=>res.status(404).json({post: 'There is no such post'}));
        })
});


//@route POST api/posts/like/:id
//@ desc Like a post
//@access Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req,res)=> {
    Post.findById(req.params.id)
        .then(post=> {
            if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0) {
                return res.status(400).json({alreadyliked: 'User already liked this post'});
            }
            //Add user ID to likes array
            post.likes.unshift({user: req.user.id});
            post.save().then(post=>res.json(post));
        })
        .catch(err=>res.status(404).json({postnotfound: 'Post not found'}));
});


//@route POST api/posts/unlike/:id
//@ desc Unlike a post (or remove a like)
//@access Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req,res)=> {
    Post.findById(req.params.id)
        .then(post=> {
            if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0) {
                return res.status(400).json({notliked: 'You have not yet liked this post'});
            }
            //Get remove index
            const removeIndex = post.likes
                .map(like=>like.user.toString())
                .indexOf(req.user.id);

            post.likes.splice(removeIndex, 1);
            post.save().then(post=>res.json(post));
        })
        .catch(err=>res.status(404).json({postnotfound: 'Post not found'}));
});


//@route POST api/posts/comment/:id
//@ desc Leave a comment on a post
//@access Private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req,res)=> {
    const {errors, isValid} = validatePostInput(req.body);
    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post=> {
            const newComment = {
                user: req.user.id,
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar
            };

            post.comments.unshift(newComment);
            post.save().then(post=>res.json(post));
        })
        .catch(err=>res.status(404).json({postnotfound: 'Post not found'}));
});


//@route DELETE api/posts/comment/:id/:comment_id
//@ desc Delete a comment on a post
//@access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req,res)=> {
    Post.findById(req.params.id)
        .then(post=> {
            // const items = post.comments.filter(comment=>comment.user);
            // console.log(items);
            //check if comment exists; is there an ID in the array the same as the one in the URL?
            if(post.comments.filter(comment=> comment._id.toString()===req.params.comment_id).length===0) {
                return res.status(404).json({nocomment: 'Comment does not exist'});
            }

            //check comment ownership
            if(post.comments.filter(comment=> comment.user.toString()===req.user.id).length===0) {
                return res.status(401).json({notauth: 'Not authorized'});
            } else {
                //get removeIndex
                const removeIndex = post.comments
                .map(comment=>comment._id.toString())
                .indexOf(req.params.comment_id);

                post.comments.splice(removeIndex,1);
                post.save().then(post=>res.json(post));
            }
        })
        .catch(err=>res.status(404).json({postnotfound: 'Post not found'}));
});

module.exports = router;

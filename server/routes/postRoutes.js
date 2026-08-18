const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
});

// GET posts saved by a specific user (IMPORTANT: Place this before any generic /:id routes)
router.get('/saved/:userId', async (req, res) => {
  try {
    const savedPosts = await Post.find({ savedBy: req.params.userId }).sort({ createdAt: -1 });
    res.json(savedPosts);
  } catch (err) {
    console.error('Error fetching saved posts:', err);
    res.status(500).json({ error: 'Server error while fetching saved posts' });
  }
});

// GET all campus users (for tagging)
router.get('/users/all', async (req, res) => {
  try {
    const users = await User.find({}, 'name role');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
});

// CREATE a new post
router.post('/', async (req, res) => {
  try {
    const { authorId, authorName, authorAvatar, authorRole, caption, media, mediaType, taggedUsers } = req.body;

    if (!caption && !media) {
      return res.status(400).json({ error: 'Post must contain a caption or media.' });
    }

    const newPost = new Post({
      author: authorId,
      authorName,
      authorAvatar,
      authorRole,
      caption,
      media,
      mediaType,
      taggedUsers: taggedUsers || [],
      likes: [],
      comments: [],
      savedBy: []
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Server error while creating post' });
  }
});

// TOGGLE LIKE
router.put('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const index = post.likes.indexOf(userId);
    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ADD COMMENT
router.post('/:id/comments', async (req, res) => {
  try {
    const { userId, authorName, authorAvatar, text } = req.body;
    if (!text) return res.status(400).json({ error: 'Comment text is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({
      authorId: userId,
      authorName,
      authorAvatar,
      text
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// TOGGLE SAVE / BOOKMARK
router.put('/:id/save', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const index = post.savedBy.indexOf(userId);
    if (index > -1) {
      post.savedBy.splice(index, 1);
    } else {
      post.savedBy.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Error saving post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
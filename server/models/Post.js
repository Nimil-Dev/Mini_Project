const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String },
  authorRole: { type: String, required: true },
  caption: { type: String },
  media: { type: String },
  mediaType: { type: String, enum: ['image', 'video'] },
  taggedUsers: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: String,
    authorAvatar: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // <--- MUST BE HERE
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiPlus, FiAlertCircle } from 'react-icons/fi';
import postService from '../../services/postService';
import PostCard from '../../components/cards/PostCard';

const CampusFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Post Creator State
  const [newPostText, setNewPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data.results || data); // Accommodate both list array and paginated standard structures
    } catch (err) {
      setError('Could not retrieve campus updates. Please reload feed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedFile) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('content', newPostText);
    if (selectedFile) {
      formData.append('media', selectedFile);
    }

    try {
      const createdPost = await postService.createPost(formData);
      setPosts((prev) => [createdPost, ...prev]);
      
      // Reset Creator UI States
      setNewPostText('');
      setSelectedFile(null);
      setFilePreview(null);
    } catch (err) {
      alert('Post publishing failed. Please check file properties and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeUpdate = async (postId) => {
    try {
      const updatedLikeState = await postService.toggleLike(postId);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, is_liked: updatedLikeState.is_liked, likes_count: updatedLikeState.likes_count }
            : post
        )
      );
    } catch (err) {
      console.error("Like operation failed", err);
    }
  };

  const handleBookmarkUpdate = async (postId) => {
    try {
      const updatedBookmarkState = await postService.toggleBookmark(postId);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, is_bookmarked: updatedBookmarkState.is_bookmarked }
            : post
        )
      );
    } catch (err) {
      console.error("Bookmark status toggle failed", err);
    }
  };

  const handleCommentSubmit = async (postId, content) => {
    try {
      const newComment = await postService.addComment(postId, content);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...(post.comments || []), newComment] }
            : post
        )
      );
    } catch (err) {
      console.error("Failed to upload comment", err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) return;
    try {
      await postService.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (err) {
      console.error("Post cleanup failure", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      
      {/* Post Creator Box */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 mb-6 shadow-sm"
      >
        <form onSubmit={handlePostSubmit} className="space-y-3">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Share what's happening on campus..."
            className="w-full bg-transparent resize-none border-none outline-none text-slate-800 dark:text-slate-100 text-sm h-20 placeholder-slate-400"
          />

          {/* Media upload preview frame */}
          {filePreview && (
            <div className="relative max-h-40 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
              <img src={filePreview} alt="Preview attachment" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                className="absolute top-2 right-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
            {/* Attachment inputs */}
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-500 cursor-pointer transition">
              <FiImage className="w-5 h-5 text-blue-500" />
              <span>Add Media</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting || (!newPostText.trim() && !selectedFile)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-500/10 flex items-center gap-1 disabled:opacity-50"
            >
              <FiPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Posting...' : 'Publish'}</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Post Timeline */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white/40 dark:bg-slate-900/40 rounded-2xl h-48 animate-pulse border border-slate-200/20" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500 flex flex-col items-center gap-2">
          <FiAlertCircle className="w-8 h-8" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLikeUpdate}
                onBookmark={handleBookmarkUpdate}
                onComment={handleCommentSubmit}
                onDelete={handleDeletePost}
              />
            ))}
          </AnimatePresence>
          {posts.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              No campus posts yet. Share something to kickstart the timeline!
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default CampusFeed;
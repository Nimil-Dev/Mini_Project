import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { FiImage, FiSend, FiUser, FiTag, FiX, FiHeart, FiMessageSquare, FiBookmark } from 'react-icons/fi';

const HomePage = () => {
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const currentUserId = currentUser.id || currentUser._id;
  const fileInputRef = useRef(null);
  
  const [posts, setPosts] = useState([]);
  const [campusUsers, setCampusUsers] = useState([]);
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Comment input state tracked per post ID
  const [commentInputs, setCommentInputs] = useState({});
  // Track open comment sections per post ID
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchCampusUsers();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  };

  const fetchCampusUsers = async () => {
    try {
      const res = await api.get('/posts/users/all');
      setCampusUsers(res.data.filter(u => u.name !== currentUser.name));
    } catch (err) {
      console.error('Failed to fetch campus users', err);
    }
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError('File size must be less than 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(reader.result);
        setMediaType(file.type.startsWith('video') ? 'video' : 'image');
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagUser = (userName) => {
    if (!selectedTags.includes(userName)) {
      setSelectedTags([...selectedTags, userName]);
    }
    setShowTagDropdown(false);
  };

  const removeTag = (userName) => {
    setSelectedTags(selectedTags.filter(t => t !== userName));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!caption && !media) {
      setError('Please add a caption or upload media to post.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/posts', {
        authorId: currentUserId,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorRole: currentUser.role,
        caption,
        media,
        mediaType,
        taggedUsers: selectedTags
      });

      setCaption('');
      setMedia('');
      setMediaType('');
      setSelectedTags([]);
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  // Like Action
  const handleLike = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}/like`, { userId: currentUserId });
      setPosts(posts.map(p => p._id === postId ? res.data : p));
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  // Save / Bookmark Action
  const handleSave = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}/save`, { userId: currentUserId });
      setPosts(posts.map(p => p._id === postId ? res.data : p));
    } catch (err) {
      console.error('Failed to save post', err);
    }
  };

  // Add Comment Action
  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        userId: currentUserId,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        text
      });
      setPosts(posts.map(p => p._id === postId ? res.data : p));
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left Sidebar: User Profile Card */}
      <div className="md:col-span-1">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-sm sticky top-20">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-3 flex items-center justify-center">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <FiUser className="text-3xl text-slate-400" />
            )}
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">{currentUser.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">{currentUser.role}</p>
        </div>
      </div>

      {/* Main Feed Area */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Create Post Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          {error && <div className="mb-3 p-2 bg-red-50 text-red-600 text-xs rounded-xl">{error}</div>}
          
          <form onSubmit={handleCreatePost}>
            <textarea
              rows="3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening on campus today?"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-white resize-none"
            />

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleMediaUpload} 
              accept="image/*,video/*" 
              className="hidden" 
            />

            {media && (
              <div className="relative mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black max-h-60 flex items-center justify-center">
                {mediaType === 'video' ? (
                  <video src={media} controls className="max-h-60 w-full object-contain" />
                ) : (
                  <img src={media} alt="Upload Preview" className="max-h-60 w-full object-contain" />
                )}
                <button 
                  type="button" 
                  onClick={() => { setMedia(''); setMediaType(''); }}
                  className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                >
                  <FiX />
                </button>
              </div>
            )}

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedTags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-[11px] px-2.5 py-1 rounded-lg">
                    @{tag}
                    <button type="button" onClick={() => removeTag(tag)}><FiX className="text-xs" /></button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 relative">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer"
                >
                  <FiImage className="text-base text-blue-500" />
                  <span>Photo/Video</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600"
                >
                  <FiTag className="text-base text-indigo-500" />
                  <span>Tag Users</span>
                </button>

                {showTagDropdown && (
                  <div className="absolute top-8 left-24 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-20 max-h-40 overflow-y-auto p-1">
                    {campusUsers.length === 0 ? (
                      <div className="p-2 text-[11px] text-slate-400 text-center">No other users found</div>
                    ) : (
                      campusUsers.map((u) => (
                        <div 
                          key={u._id}
                          onClick={() => handleTagUser(u.name)}
                          className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer flex items-center justify-between"
                        >
                          <span>{u.name}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{u.role}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                <FiSend />
                <span>{loading ? 'Posting...' : 'Share Post'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Feed Stream */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No campus posts yet. Be the first to share something!
            </div>
          ) : (
            posts.map((post) => {
              const isLiked = post.likes && post.likes.includes(currentUserId);
              const isSaved = post.savedBy && post.savedBy.includes(currentUserId);
              const showComments = activeCommentPostId === post._id;

              return (
                <div key={post._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                  {/* Author Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        {post.authorAvatar ? (
                          <img src={post.authorAvatar} alt="Author" className="w-full h-full object-cover" />
                        ) : (
                          <FiUser className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-xs">{post.authorName}</h4>
                        <p className="text-[10px] text-slate-400 capitalize">{post.authorRole} • {new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Save / Bookmark Button */}
                    <button 
                      onClick={() => handleSave(post._id)}
                      className={`p-2 rounded-xl transition-colors ${isSaved ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' : 'text-slate-400 hover:text-slate-600'}`}
                      title="Save Post"
                    >
                      <FiBookmark className={`text-base ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Caption & Tagged Users */}
                  {post.caption && <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 whitespace-pre-wrap">{post.caption}</p>}
                  
                  {post.taggedUsers && post.taggedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.taggedUsers.map((tag, idx) => (
                        <span key={idx} className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">@{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Media Attachment */}
                  {post.media && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black flex items-center justify-center max-h-96 mb-3">
                      {post.mediaType === 'video' ? (
                        <video src={post.media} controls className="max-h-96 w-full object-contain" />
                      ) : (
                        <img src={post.media} alt="Post media" className="max-h-96 w-full object-contain" />
                      )}
                    </div>
                  )}

                  {/* Post Actions (Like & Comment triggers) */}
                  <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    <button 
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'}`}
                    >
                      <FiHeart className={`text-base ${isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes ? post.likes.length : 0} Likes</span>
                    </button>

                    <button 
                      onClick={() => setActiveCommentPostId(showComments ? null : post._id)}
                      className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
                    >
                      <FiMessageSquare className="text-base" />
                      <span>{post.comments ? post.comments.length : 0} Comments</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {showComments && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      {/* Comment Input */}
                      <form onSubmit={(e) => handleAddComment(post._id, e)} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInputs[post._id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold">
                          Post
                        </button>
                      </form>

                      {/* Comments List */}
                      <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                        {post.comments && post.comments.length === 0 ? (
                          <p className="text-[11px] text-slate-400 text-center py-2">No comments yet. Start the conversation!</p>
                        ) : (
                          post.comments?.map((comment, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60 text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-800 dark:text-white text-[11px]">{comment.authorName}</span>
                                <span className="text-[9px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 text-[11px]">{comment.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Right Sidebar */}
      <div className="md:col-span-1 hidden md:block">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm sticky top-20">
          <h4 className="font-bold text-slate-800 dark:text-white text-xs mb-2">🔥 Trending on Campus</h4>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">#InterCollegeFest2026</p>
          <span className="text-[10px] text-slate-400">Active now</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
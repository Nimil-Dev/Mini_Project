import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { FiUser, FiBookmark, FiHeart, FiMessageSquare } from 'react-icons/fi';

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const currentUserId = currentUser.id || currentUser._id;
  const fileInputRef = useRef(null);

  const [name, setName] = useState(currentUser.name || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [role, setRole] = useState(currentUser.role || 'student');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Saved posts states
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);

  useEffect(() => {
    if (currentUserId) {
      fetchSavedPosts();
    }
  }, [currentUserId]);

  const fetchSavedPosts = async () => {
    try {
      setSavedLoading(true);
      const res = await api.get(`/posts/saved/${currentUserId}`);
      setSavedPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch saved posts', err);
    } finally {
      setSavedLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Avatar file size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.put(`/users/${currentUserId}`, {
        name,
        avatar,
        role
      });
      const updatedUser = res.data.user || { ...currentUser, name, avatar, role };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (postId) => {
    try {
      await api.put(`/posts/${postId}/save`, { userId: currentUserId });
      setSavedPosts(savedPosts.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Failed to unsave post', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      {/* Existing Account Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Account Profile</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage your account settings and personal details</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl">{error}</div>}
        {message && <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-xs rounded-xl">{message}</div>}

        <form onSubmit={handleSaveProfile} className="space-y-5">
          {/* Avatar Section */}
          <div className="text-center">
            <div 
              onClick={() => fileInputRef.current.click()}
              className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer group relative flex items-center justify-center mb-1"
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
              ) : (
                <FiUser className="text-4xl text-slate-400" />
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            <p className="text-[11px] text-slate-400 cursor-pointer hover:text-blue-600" onClick={() => fileInputRef.current.click()}>
              Click image to change avatar
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3 text-slate-400 text-sm" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          {/* Email Address (Locked) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address (Locked)</label>
            <input
              type="email"
              value={currentUser.email || ''}
              disabled
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-400 dark:text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 capitalize"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Save Profile Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Added Saved Contents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
            <FiBookmark className="text-blue-600" />
            <span>Saved Contents ({savedPosts.length})</span>
          </h3>
        </div>

        {savedLoading ? (
          <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            Loading saved posts...
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No saved posts yet. Bookmark posts from the home feed to see them here!
          </div>
        ) : (
          savedPosts.map((post) => (
            <div key={post._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
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

                <button 
                  onClick={() => handleUnsave(post._id)}
                  className="p-2 rounded-xl text-blue-600 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 transition-colors"
                  title="Remove from Saved"
                >
                  <FiBookmark className="text-sm fill-current" />
                </button>
              </div>

              {post.caption && <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.caption}</p>}
              
              {post.media && (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black flex items-center justify-center max-h-80">
                  {post.mediaType === 'video' ? (
                    <video src={post.media} controls className="max-h-80 w-full object-contain" />
                  ) : (
                    <img src={post.media} alt="Post media" className="max-h-80 w-full object-contain" />
                  )}
                </div>
              )}

              <div className="flex items-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <FiHeart className="text-sm" />
                  <span>{post.likes ? post.likes.length : 0} Likes</span>
                </span>
                <span className="flex items-center gap-1">
                  <FiMessageSquare className="text-sm" />
                  <span>{post.comments ? post.comments.length : 0} Comments</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
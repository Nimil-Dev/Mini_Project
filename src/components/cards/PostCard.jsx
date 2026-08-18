import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, FiMessageCircle, FiBookmark, FiShare2, FiTrash, FiSend 
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import dateFormatter from '../../utils/dateFormatter';

const PostCard = ({ post, onLike, onBookmark, onComment, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await onLike(post.id);
    setIsLiking(false);
  };

  const handleBookmarkClick = async () => {
    if (isBookmarking) return;
    setIsBookmarking(true);
    await onBookmark(post.id);
    setIsBookmarking(false);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await onComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm hover:shadow-md transition-all p-5 mb-6"
    >
      {/* Card Header: Author Meta */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={post.author.profile_picture || '/fallback-avatar.png'} 
            alt={post.author.full_name} 
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white hover:underline cursor-pointer">
                {post.author.full_name}
              </span>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">
                {post.author.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {post.author.department} • {dateFormatter(post.created_at)}
            </p>
          </div>
        </div>
        
        {/* Delete button wrapper */}
        {user?.id === post.author.id && (
          <button 
            onClick={() => onDelete(post.id)}
            className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition"
          >
            <FiTrash className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content Body */}
      <p className="text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Optional Post Media Attachment */}
      {post.media_url && (
        <div className="relative rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
          <img 
            src={post.media_url} 
            alt="Post Attachment" 
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Action Utility Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-slate-500 dark:text-slate-400">
        <button 
          onClick={handleLikeClick}
          className={`flex items-center gap-1.5 text-sm font-medium hover:text-red-500 transition ${post.is_liked ? 'text-red-500' : ''}`}
        >
          <FiHeart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
          <span>{post.likes_count}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 text-sm font-medium hover:text-blue-500 transition ${showComments ? 'text-blue-500' : ''}`}
        >
          <FiMessageCircle className="w-5 h-5" />
          <span>{post.comments?.length || 0}</span>
        </button>

        <button 
          onClick={handleBookmarkClick}
          className={`flex items-center gap-1.5 text-sm font-medium hover:text-amber-500 transition ${post.is_bookmarked ? 'text-amber-500' : ''}`}
        >
          <FiBookmark className={`w-5 h-5 ${post.is_bookmarked ? 'fill-current' : ''}`} />
        </button>

        <button 
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
            alert('Post link copied to clipboard!');
          }}
          className="flex items-center gap-1.5 text-sm font-medium hover:text-emerald-500 transition"
        >
          <FiShare2 className="w-5 h-5" />
        </button>
      </div>

      {/* Expanding Comments Block */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80"
          >
            {/* Direct Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100 transition"
              />
              <button 
                type="submit"
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition flex items-center justify-center shrink-0"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </form>

            {/* List of Comments */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5 items-start bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl text-xs">
                    <img 
                      src={comment.author.profile_picture || '/fallback-avatar.png'} 
                      alt={comment.author.full_name} 
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-slate-900 dark:text-white">{comment.author.full_name}</span>
                        <span className="text-[10px] text-slate-400">{dateFormatter(comment.created_at)}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-slate-400 py-2">No comments yet. Be the first to start the discussion!</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
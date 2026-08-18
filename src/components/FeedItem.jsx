import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';

const FeedItem = ({ post }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-md dark:bg-gray-800/70 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-5 mb-6 border border-gray-100 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <img src={post.authorAvatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{post.authorName}</h4>
          <p className="text-xs text-gray-500">{post.timeAgo} • {post.department}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800 dark:text-gray-200 mb-4">
        {post.content}
      </p>
      
      {post.image && (
        <img src={post.image} alt="post media" className="w-full h-auto rounded-xl mb-4 object-cover" />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 text-gray-500">
        <button className="flex items-center space-x-2 hover:text-blue-500 transition">
          <FiHeart className="w-5 h-5" /> <span>{post.likes}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-blue-500 transition">
          <FiMessageCircle className="w-5 h-5" /> <span>{post.comments}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-blue-500 transition">
          <FiShare2 className="w-5 h-5" /> <span>Share</span>
        </button>
      </div>
    </motion.div>
  );
};

export default FeedItem;
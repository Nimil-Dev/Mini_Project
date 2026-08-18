import api from './api';

const postService = {
  // Fetch all posts with support for simple infinite scroll / pagination
  getPosts: async (page = 1) => {
    const response = await api.get(`/feed/posts/?page=${page}`);
    return response.data; // Expected format: { results: [...], next: null/url }
  },

  // Create a new post (supports multipart form data for image uploads)
  createPost: async (postData) => {
    const response = await api.post('/feed/posts/', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Toggle Like state
  toggleLike: async (postId) => {
    const response = await api.post(`/feed/posts/${postId}/like/`);
    return response.data; // Returns updated like count and isLiked status
  },

  // Toggle Bookmark state
  toggleBookmark: async (postId) => {
    const response = await api.post(`/feed/posts/${postId}/bookmark/`);
    return response.data; // Returns isBookmarked status
  },

  // Add Comment to post
  addComment: async (postId, content) => {
    const response = await api.post(`/feed/posts/${postId}/comments/`, { content });
    return response.data; // Returns the newly created comment object
  },

  // Delete Post (Only if authorized owner/admin)
  deletePost: async (postId) => {
    const response = await api.delete(`/feed/posts/${postId}/`);
    return response.data;
  }
};

export default postService;
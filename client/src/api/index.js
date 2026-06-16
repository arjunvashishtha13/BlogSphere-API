import api from './client';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyEmail: (token) => api.get(`/auth/verify/${token}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  resendVerification: () => api.post('/auth/resend-verification'),
};

export const postsApi = {
  list: (params) => api.get('/posts', { params }),
  featured: () => api.get('/posts/featured'),
  trending: () => api.get('/posts/trending'),
  categories: () => api.get('/posts/categories'),
  getById: (id) => api.get(`/posts/${id}`),
  related: (id) => api.get(`/posts/${id}/related`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.post(`/posts/${id}/like`),
  unlike: (id) => api.post(`/posts/${id}/unlike`),
};

export const commentsApi = {
  list: (postId, params) => api.get(`/comments/${postId}`, { params }),
  create: (postId, data) => api.post(`/comments/${postId}`, typeof data === 'string' ? { text: data } : data),
  edit: (id, text) => api.put(`/comments/${id}`, { text }),
  delete: (id) => api.delete(`/comments/${id}`),
  count: (postId) => api.get(`/comments/${postId}/count`),
};

export const usersApi = {
  profile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  posts: (params) => api.get('/users/posts', { params }),
  publicProfile: (id) => api.get(`/users/${id}`),
  bookmarks: () => api.get('/users/bookmarks'),
  toggleBookmark: (postId) => api.post(`/users/bookmarks/${postId}`),
  history: () => api.get('/users/history'),
  analytics: () => api.get('/users/analytics'),
  recommendations: () => api.get('/users/recommendations'),
};

export const uploadApi = {
  image: (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    });
  },
};

export const searchApi = {
  suggestions: (q) => api.get('/search/suggestions', { params: { q } }),
};

export const notificationsApi = {
  list: (params) => api.get('/notifications', { params }),
  unreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const adminApi = {
  stats: () => api.get('/admin/stats'),
  users: (params) => api.get('/admin/users', { params }),
  banUser: (id) => api.put(`/admin/users/${id}/ban`),
  unbanUser: (id) => api.put(`/admin/users/${id}/unban`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),
  featurePost: (id) => api.put(`/admin/posts/${id}/feature`),
  deleteComment: (id) => api.delete(`/admin/comments/${id}`),
  analytics: () => api.get('/admin/analytics'),
};

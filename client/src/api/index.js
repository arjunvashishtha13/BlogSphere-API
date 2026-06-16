import api from './client';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
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
  list: (postId) => api.get(`/comments/${postId}`),
  create: (postId, text) => api.post(`/comments/${postId}`, { text }),
  delete: (id) => api.delete(`/comments/${id}`),
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

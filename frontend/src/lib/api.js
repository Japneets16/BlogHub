// (Removed misplaced updateProfile export)
const API_BASE = 'http://localhost:5000/user';

// Auth helper to get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('blogToken');
};

// Auth helper to set token
export const setAuthToken = (token) => {
  localStorage.setItem('blogToken', token);
};

// Auth helper to remove token
export const removeAuthToken = () => {
  localStorage.removeItem('blogToken');
};

// API request helper with auth
export const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// API request helper for form data (file uploads)
export const apiFormRequest = async (
  endpoint,
  formData,
  options = {}
) => {
  const token = getAuthToken();
  const headers = {};

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    ...options,
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// Auth API calls
export const authAPI = {
  signup: (userData) => {
    // Map username to name for backend compatibility
    const backendData = {
      name: userData.username,
      email: userData.email,
      password: userData.password,
    };
    return apiRequest('/signup', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  },

  login: (credentials) =>
    apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => apiRequest('/me'),

  uploadAvatar: (avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return apiFormRequest('/avatar', formData, { method: 'PUT' });
  },

  updateProfile: (profileData) =>
    apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

};

// Blog API calls
export const blogAPI = {
  getAllBlogs: () => apiRequest('/getallblogs'),
  
  getSingleBlog: (id) => apiRequest(`/getsingleblog/${id}`),
  
  getUserBlogs: () => apiRequest('/getuserblogs'),
  
  addBlog: (blogData) => {
    // Send as FormData for file upload compatibility
    return apiFormRequest('/addblog', blogData);
  },
  
  updateBlog: (id, blogData) => 
    apiFormRequest(`/updateblog/${id}`, blogData, { method: 'PUT' }),
  
  deleteBlog: (id) => apiRequest(`/deleteblog/${id}`, { method: 'POST' }),
  
  likeBlog: (id) => apiRequest(`/likes/${id}`, { method: 'PUT' }),
};


// Comments API calls
export const commentAPI = {
  getComments: (blogId) => apiRequest(`/getallcomments/${blogId}`),
  addComment: (blogId, content) =>
    apiRequest(`/addcomment/${blogId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  editComment: (commentId, content) =>
    apiRequest(`/editcomment/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),
  deleteComment: (commentId) =>
    apiRequest(`/deletecomment/${commentId}`, { method: 'DELETE' }),
};

// Admin API calls
export const adminAPI = {
  getUsers: () => apiRequest('/admin/users'),
  
  promoteUser: (id) =>
    apiRequest(`/admin/promote/${id}`, { method: 'PUT' }),
  
  deleteUser: (id) =>
    apiRequest(`/admin/user/${id}`, { method: 'DELETE' }),
  
  getAnalytics: () => apiRequest('/admin/analytics'),
};

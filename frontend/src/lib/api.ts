const API_BASE = 'http://localhost:5000/user';

// Auth helper to get token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('blogToken');
};

// Auth helper to set token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('blogToken', token);
};

// Auth helper to remove token
export const removeAuthToken = (): void => {
  localStorage.removeItem('blogToken');
};

// API request helper with auth
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
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
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {};

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
  signup: (userData: { username: string; email: string; password: string; confirmPassword: string }) => {
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

  login: (credentials: { email: string; password: string }) =>
    apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => apiRequest('/me'),

  uploadAvatar: (avatarFile: File) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return apiFormRequest('/avatar', formData, { method: 'PUT' });
  },
};

// Blog API calls
export const blogAPI = {
  getAllBlogs: () => apiRequest('/getallblogs'),
  
  getSingleBlog: (id: string) => apiRequest(`/getsingleblog/${id}`),
  
  getUserBlogs: () => apiRequest('/getuserblogs'),
  
  addBlog: (blogData: FormData) => {
    // Send as FormData for file upload compatibility
    return apiFormRequest('/addblog', blogData);
  },
  
  updateBlog: (id: string, blogData: FormData) => 
    apiFormRequest(`/updateblog/${id}`, blogData, { method: 'PUT' }),
  
  deleteBlog: (id: string) => apiRequest(`/deleteblog/${id}`, { method: 'POST' }),
  
  likeBlog: (id: string) => apiRequest(`/likes/${id}`, { method: 'PUT' }),
};

// Comments API calls
export const commentAPI = {
  getComments: (blogId: string) => apiRequest(`/getallcomments/${blogId}`),
  
  addComment: (blogId: string, content: string) =>
    apiRequest(`/addcomment/${blogId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  
  editComment: (commentId: string, content: string) =>
    apiRequest(`/editcomment/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),
  
  deleteComment: (commentId: string) =>
    apiRequest(`/deletecomment/${commentId}`, { method: 'DELETE' }),
};

// Notifications API calls
export const notificationAPI = {
  getNotifications: () => apiRequest('/notifications'),
  
  markAsRead: (id: string) =>
    apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
};

// Admin API calls
export const adminAPI = {
  getUsers: () => apiRequest('/admin/users'),
  
  promoteUser: (id: string) =>
    apiRequest(`/admin/promote/${id}`, { method: 'PUT' }),
  
  deleteUser: (id: string) =>
    apiRequest(`/admin/user/${id}`, { method: 'DELETE' }),
  
  getAnalytics: () => apiRequest('/admin/analytics'),
};
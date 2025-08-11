// User types
export interface User {
  id: string;
  name: string;
  username?: string; // For backward compatibility
  email: string;
  avatar?: string;
  role?: 'user' | 'admin';
  createdAt?: string;
}

// Blog types
export interface Blog {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  author: User;
  authorId: string;
  likes: number;
  views?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  commentCount?: number;
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  author: User;
  authorId: string;
  blogId: string;
  createdAt: string;
  updatedAt: string;
  isHidden?: boolean;
}

// Notification type removed
}

// Auth types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Form types
export interface BlogFormData {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  image?: File;
}

// Analytics types (for admin)
export interface AnalyticsData {
  totalUsers: number;
  totalBlogs: number;
  totalComments: number;
  totalLikes: number;
  recentActivity: {
    date: string;
    users: number;
    blogs: number;
    comments: number;
  }[];
}
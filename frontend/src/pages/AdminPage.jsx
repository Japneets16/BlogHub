import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, BarChart3, Shield, Trash2, Crown, UserCheck, FileText, Edit, Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI, blogAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    fetchAdminData();
  }, [isAuthenticated, user, navigate, toast, location.pathname]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersResponse, analyticsResponse, blogsResponse] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getAnalytics(),
        blogAPI.getAllBlogs(),
      ]);
      
      setUsers(usersResponse.users || []);
      setAnalytics(analyticsResponse);
      setBlogs(blogsResponse.blogs || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch admin data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a refresh function that can be called from other components
  const refreshData = () => {
    fetchAdminData();
  };

  const handlePromoteUser = async (userId) => {
    try {
      await adminAPI.promoteUser(userId);
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role: 'admin' }
          : user
      ));
      toast({
        title: "Success",
        description: "User promoted to admin.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      await blogAPI.deleteBlog(blogId);
      setBlogs(prev => prev.filter(blog => blog.id !== blogId));
      // Refresh analytics to update counts
      const analyticsResponse = await adminAPI.getAnalytics();
      setAnalytics(analyticsResponse);
      toast({
        title: "Success",
        description: "Blog post deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your platform and users</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Admin Access</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalBlogs || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +12.3% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalComments || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +8.7% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalLikes || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +15.2% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.recentActivity?.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">
                            {activity.users} new users, {activity.blogs} new posts
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Blog Posts Management</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline" onClick={() => navigate('/create-blog')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Post
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {blog.image && (
                          <img
                            src={`http://localhost:5000${blog.image}`}
                            alt={blog.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{blog.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {blog.content.substring(0, 100)}...
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              By {blog.author?.name || 'Unknown'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {blog.views || 0} views
                            </span>
                            {blog.tags && blog.tags.length > 0 && (
                              <div className="flex space-x-1">
                                {blog.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/blog/${blog.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/edit-blog/${blog.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteBlog(blog.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {blogs.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No blog posts found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button variant="outline">
                <UserCheck className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {user.role === 'admin' && (
                              <Badge variant="secondary">
                                <Crown className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.role !== 'admin' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePromoteUser(user.id)}
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Promote
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Detailed Analytics</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Detailed analytics and reporting features will be implemented soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <h2 className="text-2xl font-bold">Content Moderation</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Content moderation tools will be implemented soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Camera, Edit3, Save, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI, blogAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import BlogCard from '@/components/blog/BlogCard';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchUserBlogs();
  }, [isAuthenticated, navigate, location.pathname]);

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getUserBlogs();
      setUserBlogs(response.blogs || []);
    } catch (error) {
      console.error('Failed to fetch user blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    try {
      await authAPI.uploadAvatar(avatarFile);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast({
        title: "Success",
        description: "Avatar updated successfully.",
      });
      // Refresh user data
      // In a real app, you'd update the user context with new avatar URL
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Persist changes to backend
      await authAPI.updateProfile({
        name: formData.username,
        email: formData.email,
      });
      // Update local user context
      updateUser({ ...user, name: formData.username, email: formData.email });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (blogId) => {
    try {
      await blogAPI.likeBlog(blogId);
      setUserBlogs(prev => prev.map(blog => 
        blog.id === blogId 
          ? { 
              ...blog, 
              likes: blog.isLiked ? blog.likes - 1 : blog.likes + 1,
              isLiked: !blog.isLiked 
            }
          : blog
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like the post.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage 
                      src={avatarPreview || user?.avatar} 
                      alt={user?.name || user?.username} 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {(user?.name || user?.username)?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                 <input
                   id="avatar-upload"
                   type="file"
                   accept="image/*"
                   onChange={handleAvatarChange}
                   className="hidden"
                 />
                 
                 {avatarPreview && (
                   <div className="flex gap-2 justify-center mt-2">
                     <Button size="sm" onClick={handleAvatarUpload}>
                       <Save className="h-4 w-4 mr-2" />
                       Save
                     </Button>
                     <Button 
                       size="sm" 
                       variant="outline"
                       onClick={() => {
                         setAvatarFile(null);
                         setAvatarPreview(null);
                       }}
                     >
                       <X className="h-4 w-4 mr-2" />
                       Cancel
                     </Button>
                   </div>
                 )}

                 <CardTitle className="text-xl">{user?.name || user?.username}</CardTitle>
                <p className="text-muted-foreground">{user?.email}</p>
                {user?.role === 'admin' && (
                  <Badge variant="secondary" className="mt-2">
                    Admin
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Member since removed */}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Posts</span>
                  <span className="text-sm font-medium">{userBlogs.length}</span>
                </div>

                <Separator />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
              </CardContent>
            </Card>

            {/* Edit Profile Form */}
            {isEditing && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">My Posts</h2>
                  <Button onClick={() => navigate('/create-blog')}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Write New Post
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your posts...</p>
                  </div>
                ) : userBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userBlogs.map((blog) => (
                      <BlogCard
                        key={blog.id}
                        blog={blog}
                        onLike={handleLike}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start writing your first blog post to share your thoughts with the world.
                      </p>
                      <Button onClick={() => navigate('/create-blog')}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Write Your First Post
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

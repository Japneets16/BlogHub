import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BlogCard from '@/components/blog/BlogCard';
import { Blog } from '@/lib/types';
import { blogAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const HomePage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAllBlogs();
      // Transform the data to match frontend expectations
      const transformedBlogs = (response.blogs || []).map((blog: any) => ({
        ...blog,
        likes: Array.isArray(blog.likes) ? blog.likes.length : (blog.likes || 0),
        isLiked: false, // This would be determined by checking if current user liked it
        commentCount: 0, // This would be fetched separately
      }));
      setBlogs(transformedBlogs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blogs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (blogId: string) => {
    try {
      await blogAPI.likeBlog(blogId);
      setBlogs(prev => prev.map(blog => 
        blog._id === blogId || blog.id === blogId
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
        description: "Failed to like the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingBlogs = [...blogs].sort((a, b) => b.likes - a.likes).slice(0, 6);
  const recentBlogs = [...blogs].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-blog-gradient-subtle py-20 transition-colors duration-300">
        <div className="container max-w-4xl mx-auto text-center px-4 stagger-children">
          <h1 className="text-4xl md:text-6xl font-bold blog-gradient-text mb-6">
            Discover Amazing Stories
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of writers and readers. Share your thoughts, discover new perspectives, 
            and engage with stories that matter.
          </p>
          
          {/* Hero Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for articles, authors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="blog-input pl-12 h-12 text-base"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="blog" size="blog-hero">
              Start Reading
            </Button>
            <Button variant="blog-outline" size="blog-hero">
              Write Your Story
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <Tabs defaultValue="recent" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="recent" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="featured" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Featured
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recent" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                {(searchQuery ? filteredBlogs : recentBlogs).map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    onLike={handleLike}
                  />
                ))}
              </div>
              
              {(searchQuery ? filteredBlogs : recentBlogs).length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No blogs found matching your search.' : 'No recent blogs available.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="trending" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                {trendingBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    onLike={handleLike}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured" className="space-y-8">
              <Card className="text-center py-12">
                <CardHeader>
                  <CardTitle>Featured Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Featured content will be curated by our editorial team.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
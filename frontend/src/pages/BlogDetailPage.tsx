import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Blog, Comment, User as UserType } from '@/lib/types';
import { blogAPI, commentAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog();
      fetchComments();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getSingleBlog(id!);
      // Transform the data to match frontend expectations
      const transformedBlog = {
        ...response.blog,
        likes: Array.isArray(response.blog.likes) ? response.blog.likes.length : (response.blog.likes || 0),
        isLiked: false, // This would be determined by checking if current user liked it
        commentCount: 0, // This would be fetched separately
      };
      setBlog(transformedBlog);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog post.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getComments(id!);
      setComments(response.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      await blogAPI.likeBlog(id!);
      setBlog(prev => prev ? {
        ...prev,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
        isLiked: !prev.isLiked
      } : null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like the post.",
        variant: "destructive",
      });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment.",
        variant: "destructive",
      });
      return;
    }

    if (!commentContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingComment(true);
      await commentAPI.addComment(id!, commentContent);
      setCommentContent('');
      await fetchComments();
      toast({
        title: "Success",
        description: "Comment added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Blog Header */}
        <Card className="mb-8">
          {blog.image && (
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader className="pb-4">
            <div className="space-y-4">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {blog.title}
              </h1>
              
                             {/* Author and Meta Info */}
               <div className="flex items-center space-x-4">
                 <Avatar className="h-12 w-12">
                                    <AvatarImage src={blog.author?.avatar} alt={blog.author?.name || 'Unknown'} />
                 <AvatarFallback className="bg-primary text-primary-foreground">
                   {(blog.author?.name || 'U').charAt(0).toUpperCase()}
                 </AvatarFallback>
               </Avatar>
               <div className="flex-1">
                 <p className="font-semibold">{blog.author?.name || 'Unknown Author'}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{getReadingTime(blog.content)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>

          {/* Blog Content */}
          <CardContent className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed">
              {blog.content}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                blog.isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart className={`h-5 w-5 ${blog.isLiked ? 'fill-current' : ''}`} />
              <span>{blog.likes} likes</span>
            </Button>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MessageCircle className="h-5 w-5" />
              <span>{comments.length} comments</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <Separator className="my-8" />

        {/* Comments Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>
          
          {/* Add Comment */}
          {isAuthenticated && (
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Write a comment..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          type="submit"
                          disabled={submittingComment || !commentContent.trim()}
                        >
                          {submittingComment ? 'Posting...' : 'Post Comment'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {comment.author.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">{comment.author.username}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {comments.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No comments yet. Be the first to comment!
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage; 
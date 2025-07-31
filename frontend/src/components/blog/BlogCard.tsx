import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, MessageCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Blog } from '@/lib/types';

interface BlogCardProps {
  blog: Blog;
  onLike?: (blogId: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onLike }) => {
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.(blog.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  return (
    <Link to={`/blog/${blog._id || blog.id}`}>
      <Card className="blog-card group cursor-pointer overflow-hidden">
        {blog.image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <CardContent className="p-6">
          {/* Author Info */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={blog.author?.avatar} alt={blog.author?.name || 'Unknown'} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {(blog.author?.name || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {blog.author?.name || 'Unknown Author'}
              </p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(blog.createdAt)}</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{getReadingTime(blog.content)}</span>
              </div>
            </div>
          </div>

          {/* Title and Excerpt */}
          <div className="space-y-2 mb-4">
            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
              {blog.title}
            </h3>
            {blog.excerpt && (
              <p className="text-muted-foreground line-clamp-2">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {blog.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{blog.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{Array.isArray(blog.likes) ? blog.likes.length : (blog.likes || 0)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{blog.commentCount || 0}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`transition-colors ${
                blog.isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${blog.isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PenTool, User, LogOut, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blog-gradient">
            <PenTool className="h-4 w-4 text-white" />
          </div>
          <span className="blog-gradient-text text-xl font-bold">BlogHub</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Write Button: only show if not on profile page */}
              {location.pathname !== '/profile' && (
                <Button
                  variant="blog"
                  size="blog-card"
                  onClick={() => navigate('/create-blog')}
                  className="hidden sm:flex"
                >
                  <Plus className="h-4 w-4" />
                  Write
                </Button>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notification bell and dropdown removed */}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name || user?.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {(user?.name || user?.username)?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name || user?.username}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/create-blog')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Theme Toggle for non-authenticated users */}
              <ThemeToggle />
              <Button variant="blog-ghost" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button variant="blog" size="blog-card" onClick={() => navigate('/signup')}>
                Sign up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
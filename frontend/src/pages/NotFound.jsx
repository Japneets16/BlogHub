import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blog-gradient-subtle p-4">
      {/* Theme Toggle for 404 page */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="blog-card w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="text-6xl font-bold blog-gradient-text mb-4">404</div>
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="blog" asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="blog-outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

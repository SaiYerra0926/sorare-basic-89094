import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div 
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundColor: '#FFFEF7'
      }}
    >
      {/* Navigation */}
      <nav 
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#FFFEF7',
          borderBottom: 'none'
        }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6 lg:gap-8">
              <Link to="/" className="flex items-center gap-3">
                <span 
                  className="text-xl font-normal"
                  style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    color: '#36454F'
                  }}
                >
                  The Worx
                </span>
              </Link>
              <Link 
                to="/" 
                className="text-base font-normal no-underline hover:opacity-70 transition-opacity"
                style={{ 
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  color: '#36454F'
                }}
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 lg:px-8 py-16 md:py-24 flex-1 flex items-center justify-center animate-fadeIn">
        <Card className="max-w-2xl w-full border-2 border-border/50 dark:border-border/70 shadow-xl rounded-2xl bg-card/80 dark:bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-destructive/10 rounded-full">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-destructive via-orange-500 to-red-500 bg-clip-text text-transparent">
              404
            </CardTitle>
            <CardDescription className="text-lg md:text-xl text-muted-foreground">
              Page Not Found
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-base md:text-lg text-foreground/80 dark:text-foreground/90 leading-relaxed">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-muted-foreground">
              Requested path: <code className="px-2 py-1 bg-muted rounded text-xs">{location.pathname}</code>
            </p>
            <div className="pt-4">
              <Link to="/">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200">
                  <Home size={18} />
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-background via-background to-background/95 dark:from-background dark:via-background dark:to-background/98 border-t border-border/40 dark:border-border/60 py-10 md:py-12 mt-auto">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-sm md:text-base text-foreground/60 dark:text-foreground/70 font-medium">
              © {new Date().getFullYear()} The Worx. All rights reserved.
            </p>
            <p className="text-xs text-foreground/50 dark:text-foreground/60">
              Supporting recovery journeys with comprehensive care and community partnerships
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;

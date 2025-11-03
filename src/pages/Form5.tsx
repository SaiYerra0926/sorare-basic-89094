import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FileText, Home, BookOpen, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import worxLogo from '@/assets/worx-logo.png';

const Form5 = () => {
  return (
    <>
      <Helmet>
        <title>Form5 - The Worx</title>
        <meta name="description" content="Form5 - Submit and manage your information." />
      </Helmet>
      
      <div className="min-h-screen bg-background w-full flex flex-col">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-background/80 dark:bg-background/90 backdrop-blur-xl border-b border-border/40 dark:border-border/60 shadow-lg shadow-black/5 dark:shadow-black/20">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4 lg:gap-6">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 hover:scale-105">
                  <img src={worxLogo} alt="The Worx Logo" className="h-10 w-auto drop-shadow-md" />
                </Link>
                <Link to="/">
                  <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent/50 transition-all duration-200 hover:scale-105">
                    <Home size={18} />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>
                <Link to="/beginners-guide">
                  <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent/50 transition-all duration-200 hover:scale-105">
                    <BookOpen size={18} />
                    <span className="hidden sm:inline">Beginners Guide</span>
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent/50 transition-all duration-200 hover:scale-105">
                    <BarChart3 size={18} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 lg:px-8 py-8 md:py-12 flex-1 animate-fadeIn">
          {/* Header */}
          <header className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="p-4 md:p-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                <FileText size={32} className="text-white md:w-10 md:h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 text-foreground bg-gradient-to-r from-foreground to-foreground/70 dark:from-foreground dark:to-foreground/80 bg-clip-text text-transparent">
              Form5
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-foreground/80 dark:text-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Submit and manage your information
            </p>
          </header>

          {/* Form Content */}
          <Card className="border-border/50 dark:border-border/70 shadow-lg rounded-2xl bg-card/80 dark:bg-card/90 backdrop-blur-sm max-w-4xl mx-auto">
            <CardHeader className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10">
              <CardTitle className="text-2xl md:text-3xl font-extrabold">Form5 Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-4 text-foreground/85 dark:text-foreground/90">
                <p className="text-center py-12 text-base md:text-lg">
                  Form5 content will be displayed here. This form can be customized based on your specific requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-t from-background via-background to-background/95 dark:from-background dark:via-background dark:to-background/98 border-t border-border/40 dark:border-border/60 py-10 md:py-12 mt-auto">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src={worxLogo} alt="The Worx Logo" className="h-8 w-auto opacity-70" />
              </div>
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
    </>
  );
};

export default Form5;

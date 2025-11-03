import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FileText, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Form2 = () => {
  return (
    <>
      <Helmet>
        <title>Form2 - The Worx</title>
        <meta name="description" content="Form2 - Submit and manage your information." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="bg-background/95 dark:bg-background/98 backdrop-blur-md border-b border-border/50 dark:border-border/70 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity">
                The Worx
              </Link>
              <div className="flex items-center gap-8">
                <Link to="/" className="text-sm font-medium text-foreground/70 dark:text-foreground/80 hover:text-foreground dark:hover:text-foreground transition-colors">
                  Home
                </Link>
                <span className="text-sm font-medium text-foreground dark:text-foreground/90">
                  Form2
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-slate-500 rounded-xl">
                <FileText size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Form2
            </h1>
            <p className="text-xl text-foreground/70 dark:text-foreground/80 max-w-3xl mx-auto">
              Submit and manage your information
            </p>
          </header>

          {/* Form Content */}
          <Card className="border-border/50 dark:border-border/70 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Form2 Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-foreground/85 dark:text-foreground/90">
                <p className="text-center py-12">
                  Form2 content will be displayed here. This form can be customized based on your specific requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="bg-background dark:bg-background/98 border-t border-border/50 dark:border-border/70 py-8 mt-16">
          <div className="container mx-auto px-6 lg:px-8 text-center">
            <p className="text-sm text-foreground/70 dark:text-foreground/80">
              © {new Date().getFullYear()} The Worx. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Form2;


import React, { useState } from 'react';
import { Home, BookOpen, BarChart3 } from 'lucide-react';
import { ToolCard } from './ToolCard';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from './ThemeToggle';
import { ConsentForm } from './ConsentForm';
import { tools } from '@/data/tools';
import { toast } from 'sonner';
import worxLogo from '@/assets/worx-logo.png';
import worxBannerLogo from '@/assets/Worx-logo (2).png';

export const WorxLanding = () => {
  const [showConsentForm, setShowConsentForm] = useState(false);

  const handleConsentFormClick = () => {
    setShowConsentForm(true);
  };

  const handleConsentAccept = () => {
    localStorage.setItem('worx-consent-accepted', 'true');
    localStorage.setItem('worx-consent-date', new Date().toISOString());
    setShowConsentForm(false);
    toast.success('Consent recorded', {
      description: 'Thank you for accepting the consent form.',
    });
  };

  const handleConsentDecline = () => {
    setShowConsentForm(false);
    toast.info('Consent declined', {
      description: 'You can review and accept the consent form anytime.',
    });
  };

  return <div className="min-h-screen bg-background w-full flex flex-col">
      <ConsentForm
        open={showConsentForm}
        onOpenChange={setShowConsentForm}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 dark:bg-background/98 backdrop-blur-md border-b border-border/50 dark:border-border/70 shadow-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src={worxLogo} alt="The Worx Logo" className="h-10 w-auto" />
              </Link>
              <Button variant="ghost" size="lg" className="gap-2 font-medium">
                <Home size={18} />
                Home
              </Button>
              <Link to="/beginners-guide">
                <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent">
                  <BookOpen size={18} />
                  Beginners Guide
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent">
                  <BarChart3 size={18} />
                  Dashboard
                </Button>
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 lg:px-8 pb-24 flex-1">
        {/* Hero Section */}
        <header className="text-center pt-20 pb-16 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <img src={worxBannerLogo} alt="The Worx Banner Logo" className="w-full max-w-4xl h-auto rounded-lg shadow-xl" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-primary dark:via-purple-400 dark:to-pink-400">
              The Worx
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 dark:text-foreground/95 leading-relaxed font-light max-w-4xl mx-auto">
          The Worx! operates with a holistic approach, integrating physical, mental, and social health to support individuals in their recovery journey. By maintaining a continuum of care and fostering community partnerships, we ensure that services are streamlined and effective. Here are some of the additional resources and adjunct services available in the community that will strengthen our initiative and assist the individuals we serve.
          </p>
        </header>

        {/* Forms Section */}
        <section className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground dark:text-foreground/95">
            Forms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {tools.map(tool => <ToolCard key={tool.name} name={tool.name} description={tool.description} url={tool.url} icon={tool.icon} iconColor={tool.iconColor} comingSoon={tool.comingSoon} isSupport={tool.isSupport} isInternal={tool.isInternal} isConsentForm={tool.isConsentForm} onConsentFormClick={handleConsentFormClick} />)}
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="bg-background dark:bg-background/98 border-t border-border/50 dark:border-border/70 py-8 mt-auto">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm text-foreground/70 dark:text-foreground/80">
            © {new Date().getFullYear()} The Worx. All rights reserved.
          </p>
        </div>
      </footer>
    </div>;
};
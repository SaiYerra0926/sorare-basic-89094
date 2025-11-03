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
      <nav className="sticky top-0 z-50 bg-background/80 dark:bg-background/90 backdrop-blur-xl border-b border-border/40 dark:border-border/60 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4 lg:gap-6">
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 hover:scale-105">
                <img src={worxLogo} alt="The Worx Logo" className="h-10 w-auto drop-shadow-md" />
              </Link>
              <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent/50 transition-all duration-200 hover:scale-105">
                <Home size={18} />
                <span className="hidden sm:inline">Home</span>
              </Button>
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
      
      <div className="container mx-auto px-6 lg:px-8 pb-24 flex-1">
        {/* Hero Section */}
        <header className="text-center pt-16 md:pt-24 pb-12 md:pb-20 max-w-5xl mx-auto animate-fadeIn">
          <div className="flex justify-center mb-8 md:mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full opacity-50 animate-pulse"></div>
            <img src={worxBannerLogo} alt="The Worx Banner Logo" className="w-full max-w-4xl h-auto rounded-2xl shadow-2xl relative z-10 transform hover:scale-[1.02] transition-transform duration-500" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 md:mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-primary dark:via-purple-400 dark:to-pink-400 animate-fadeIn">
              The Worx
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-foreground/80 dark:text-foreground/90 leading-relaxed font-normal max-w-4xl mx-auto px-4 animate-fadeIn">
            The Worx! operates with a holistic approach, integrating physical, mental, and social health to support individuals in their recovery journey. By maintaining a continuum of care and fostering community partnerships, we ensure that services are streamlined and effective. Here are some of the additional resources and adjunct services available in the community that will strengthen our initiative and assist the individuals we serve.
          </p>
        </header>

        {/* Forms Section */}
        <section className="mb-16 md:mb-20 animate-fadeIn">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-foreground dark:text-foreground/95 bg-gradient-to-r from-foreground to-foreground/70 dark:from-foreground dark:to-foreground/80 bg-clip-text text-transparent">
              Forms & Resources
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Access our comprehensive collection of forms and resources designed to support your recovery journey
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {tools.map((tool, index) => (
              <div key={tool.name} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <ToolCard 
                  name={tool.name} 
                  description={tool.description} 
                  url={tool.url} 
                  icon={tool.icon} 
                  iconColor={tool.iconColor} 
                  comingSoon={tool.comingSoon} 
                  isSupport={tool.isSupport} 
                  isInternal={tool.isInternal} 
                  isConsentForm={tool.isConsentForm} 
                  onConsentFormClick={handleConsentFormClick} 
                />
              </div>
            ))}
          </div>
        </section>
      </div>
      
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
    </div>;
};
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, BookOpen, BarChart3, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SnapAssessmentForm } from '@/components/forms/SnapAssessmentForm';
import worxLogo from '@/assets/Worx-logo (2).png';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Form3 = () => {
  useScrollToTop();
  
  return (
    <>
      <Helmet>
        <title>SNAP Assessment Form - The Worx</title>
        <meta name="description" content="SNAP Assessment Form - Evaluate strengths, needs, abilities, and preferences for service planning." />
      </Helmet>
      
      <div 
        className="min-h-screen w-full flex flex-col"
        style={{
          background: '#FFFEF7'
        }}
      >
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4 lg:gap-6">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 hover:scale-105">
                  <img src={worxLogo} alt="The Worx Logo" className="h-10 w-auto drop-shadow-md" />
                </Link>
                <Link to="/">
                  <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-green-50 transition-all duration-200 hover:scale-105">
                    <Home size={18} />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>
                <Link to="/beginners-guide">
                  <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-green-50 transition-all duration-200 hover:scale-105">
                    <BookOpen size={18} />
                    <span className="hidden sm:inline">Beginners Guide</span>
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-green-50 transition-all duration-200 hover:scale-105">
                    <BarChart3 size={18} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <Link to="/billing">
                  <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-green-50 transition-all duration-200 hover:scale-105">
                    <Receipt size={18} />
                    <span className="hidden sm:inline">Billing</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <SnapAssessmentForm />
        </main>

        {/* Footer */}
        <footer 
          className="py-12 md:py-16 mt-auto"
          style={{
            background: 'linear-gradient(to bottom, #7A6B5A, #2F3F2F)'
          }}
        >
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src={worxLogo} alt="The Worx Logo" className="h-8 w-auto" />
                <div className="flex flex-col">
                  <span 
                    className="text-xl font-serif text-white font-bold leading-none"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    The Worx
                  </span>
                  <span 
                    className="text-xs font-sans text-white uppercase tracking-wider mt-1"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    GROUP
                  </span>
                </div>
              </div>
              <p 
                className="text-sm text-gray-300"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                © {new Date().getFullYear()} The Worx Group. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Form3;

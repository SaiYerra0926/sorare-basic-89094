import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, BookOpen, BarChart3, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecoveryReferralForm } from '@/components/forms/RecoveryReferralForm';
import worxLogo from '@/assets/Worx-logo (2).png';

const ReferralForms = () => {
  return (
    <>
      <Helmet>
        <title>Referral Forms - Recovery Support Worx</title>
        <meta name="description" content="Submit referrals for recovery support services." />
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

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <RecoveryReferralForm />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ReferralForms;


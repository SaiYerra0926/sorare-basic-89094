import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BookOpen, Home, BarChart3 } from 'lucide-react';
import worxLogo from '@/assets/Worx-logo (2).png';
import { ParticipantHandbookForm } from '@/components/forms/ParticipantHandbookForm';

const Handbook = () => {
  return (
    <>
      <Helmet>
        <title>Participant Handbook - The Worx</title>
        <meta name="description" content="Complete all participant handbook forms including consent, privacy, screening tools, and acknowledgments." />
      </Helmet>
      
      <div 
        className="min-h-screen w-full flex flex-col"
        style={{
          background: '#FFFEF7'
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
                  <img src={worxLogo} alt="The Worx Logo" className="h-10 w-auto" />
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
                <Link 
                  to="/beginners-guide"
                  className="text-base font-normal no-underline hover:opacity-70 transition-opacity"
                  style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    color: '#36454F'
                  }}
                >
                  Beginners Guide
                </Link>
                <Link 
                  to="/dashboard"
                  className="text-base font-normal no-underline hover:opacity-70 transition-opacity"
                  style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    color: '#36454F'
                  }}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/billing"
                  className="text-base font-normal no-underline hover:opacity-70 transition-opacity"
                  style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    color: '#36454F'
                  }}
                >
                  Billing
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <ParticipantHandbookForm />
        </main>
      </div>
    </>
  );
};

export default Handbook;


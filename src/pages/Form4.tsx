import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, BookOpen, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import worxLogo from '@/assets/Worx-logo (2).png';

const Form4 = () => {
  return (
    <>
      <Helmet>
        <title>Form4 - The Worx</title>
        <meta name="description" content="Form4 - Submit and manage your information." />
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
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1 animate-fadeIn max-w-4xl">
          <Card 
            className="shadow-xl border-0 bg-white"
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="p-6 md:p-8 lg:p-10">
              <div className="mb-8">
                <h1 
                  className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Form4
                </h1>
              </div>

              <div className="mb-6">
                <h2 
                  className="text-lg font-bold text-gray-800 mb-2 uppercase"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  FORM4 INFORMATION
                </h2>
                <p 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Submit and manage your information
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-sm font-semibold text-gray-800 mb-2"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      Form Field:
                    </label>
                    <Input 
                      placeholder="Input form field information"
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm font-semibold text-gray-800 mb-2"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      Additional Information:
                    </label>
                    <Textarea 
                      placeholder="Input additional information"
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-2 rounded-lg shadow-md"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    <span className="text-sm font-medium">Submit</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
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

export default Form4;

import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import worxLogo from '@/assets/Worx-logo (2).png';
// Import the images
import mentorImage from '@/assets/mentor-image.webp';
import bottomsImage from '@/assets/bottoms-image.webp';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const BeginnersGuide = () => {
  useScrollToTop();
  
  return <>
      <Helmet>
        <title>The Worx - Complete Guide</title>
        <meta name="description" content="Complete guide to The Worx services and programs. Learn about our recovery support services, housing assistance, and community resources." />
        <meta name="keywords" content="The Worx, recovery support, housing assistance, community resources, Allegheny County" />
        <link rel="canonical" href="/beginners-guide" />
        <meta property="og:title" content="The Worx - Complete Guide" />
        <meta property="og:description" content="Complete guide to The Worx services and programs in Allegheny County." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="/beginners-guide" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Worx - Complete Guide" />
        <meta name="twitter:description" content="Complete guide to The Worx services and programs" />
      </Helmet>
      
      <div 
        className="min-h-screen w-full flex flex-col"
        style={{
          background: '#FFFEF0'
        }}
      >
        {/* Navigation */}
        <nav 
          className="sticky top-0 z-50"
          style={{
            backgroundColor: '#FFFEF0',
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
                <span 
                  className="text-base font-normal"
                  style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    color: '#36454F'
                  }}
                >
                  Beginners Guide
                </span>
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

        <main className="flex-1 animate-fadeIn">
          {/* Hero Images Section - Top of Page */}
          <section className="w-full py-8 md:py-12 lg:py-16" style={{ backgroundColor: '#FFFEF0' }}>
            <div className="container mx-auto px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
                  {/* MENTOR Image Card */}
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-20"></div>
                    <div className="relative rounded-3xl shadow-2xl p-4 md:p-6 border-4 overflow-hidden transform group-hover:scale-[1.02] transition-all duration-300" style={{ borderColor: '#1e3a8a', backgroundColor: '#FFFEF0' }}>
                      <div className="absolute top-4 left-4 right-4 z-10">
                        <h2 
                          className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1"
                          style={{ 
                            fontFamily: 'Georgia, serif',
                            color: '#1e3a8a',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                          }}
                        >
                          MENTOR
                        </h2>
                        <p 
                          className="text-sm md:text-base text-gray-700 font-semibold"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          An experienced and trusted adviser.
                        </p>
                      </div>
                      <div className="relative mt-16 md:mt-20">
                        <div className="absolute inset-0 rounded-2xl blur-2xl opacity-20" style={{ backgroundColor: '#1e3a8a' }}></div>
                        <img 
                          src={mentorImage} 
                          alt="MENTOR - An experienced and trusted adviser"
                          className="w-full h-auto rounded-2xl shadow-xl relative z-10"
                          style={{
                            border: '3px solid #1e3a8a',
                            backgroundColor: '#f5f5dc'
                          }}
                        />
                      </div>
                      {/* Floating badges */}
                      <div className="absolute bottom-4 right-4 flex flex-wrap gap-2 z-10">
                        {['TRAINING', 'GOAL', 'SUCCESS'].map((badge, i) => (
                          <span
                            key={i}
                            className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* B.O.T.T.O.M.S Image Card */}
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300 opacity-20"></div>
                    <div className="relative rounded-3xl shadow-2xl p-4 md:p-6 border-4 overflow-hidden transform group-hover:scale-[1.02] transition-all duration-300" style={{ borderColor: '#1e3a8a', backgroundColor: '#FFFEF0' }}>
                      <div className="absolute top-4 left-4 right-4 z-10">
                        <h2 
                          className="text-xl md:text-2xl lg:text-3xl font-bold mb-1"
                          style={{ 
                            fontFamily: 'Georgia, serif',
                            color: '#1e3a8a',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                          }}
                        >
                          Starting from the B.O.T.T.O.M.S
                        </h2>
                        <p 
                          className="text-xs md:text-sm text-gray-800 font-semibold"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Better Opportunities To Transition, Overcome, Manifest and Succeed.
                        </p>
                      </div>
                      <div className="relative mt-16 md:mt-20">
                        <div className="absolute inset-0 rounded-2xl blur-2xl opacity-20" style={{ backgroundColor: '#1e3a8a' }}></div>
                        <img 
                          src={bottomsImage} 
                          alt="B.O.T.T.O.M.S - Better Opportunities To Transition, Overcome, Manifest and Succeed"
                          className="w-full h-auto rounded-2xl shadow-xl relative z-10"
                          style={{
                            border: '3px solid #1e3a8a'
                          }}
                        />
                      </div>
                      {/* Services count badge */}
                      <div className="absolute bottom-4 right-4 z-10">
                        <span
                          className="bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          8 Services Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="container mx-auto px-6 lg:px-8 py-8 md:py-12">
            {/* Header */}
            <header className="pt-8 md:pt-12 pb-12 md:pb-16 max-w-5xl mx-auto">
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 tracking-tight leading-tight text-gray-800 text-center"
                style={{ 
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Complete Guide about The Worx
              </h1>
              <div className="max-w-4xl mx-auto">
                <div className="rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200" style={{ backgroundColor: '#FFFEF0' }}>
                  <p 
                    className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 font-normal text-left"
                    style={{
                      fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                      lineHeight: '1.8'
                    }}
                  >
                    Our staff has over 35 years of experience, devoting themselves to enhancing the well-being others.  Our flexibility has allowed us to engage in a range of positions, both volunteer and work related; thus, heightening our overall experience.  We have been committed to providing and coordinating services for the vulnerable/high risk populations throughout Allegheny County.  The Worx, currently provides a vast majority of services to individuals in community corrections/halfway house, treatment facilities and throughout the community.  Our staff is skilled in working with minority and marginalized communities.  We work closely with those individuals who identify as black, brown and LGBTQIA+.  To date, The Worx, provides services in the following neighborhoods; McKees Rocks, Braddock, Beltzhoover, North Side, Hazelwood, Mt. Oliver, Knoxville, Homestead, Mon Valley and surrounding areas within Allegheny  County.   Our strong verbal and written communication skills allow us to effectively advocate for the individuals and families we serve.  Here at The Worx, we work diligently to support and promote self-sufficiency, by facilitating mentoring psychotherapy or psycho-education groups and/or workshops.  It is important to us to focus on the person not the problem.  Combined our staff offers academia expertise in social work, child development, family relations, sociology, trauma informed care, case management, housing and lived experience around intimate partner violence, mental health, substance use and the criminal justice system.  Here at The Worx, our support staff displays Accountability and Motivation as they empower our participants to play an active role in their recovery and long-term success.
                  </p>
                </div>
              </div>
            </header>

          {/* What is The Worx Section */}
          <article className="py-12 md:py-16 lg:py-20 animate-fadeIn max-w-5xl mx-auto">
            <div className="mb-12 md:mb-16">
              <div className="rounded-3xl p-8 md:p-12 shadow-xl border-2 border-gray-200" style={{ backgroundColor: '#FFFEF0' }}>
                <h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 tracking-tight text-gray-800 text-center"
                  style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  What is The Worx?
                </h2>
                <div className="max-w-4xl mx-auto">
                  <p 
                    className="text-base md:text-lg lg:text-xl text-gray-700 font-normal leading-relaxed text-left"
                    style={{
                      fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                      lineHeight: '1.8'
                    }}
                  >
                    The WORX! is comprised of Recovery Support Worx Co. (RSW) and WillSTAN Housing.  We are an affiliate of Trans YOUniting and partnered with several other community resources including The Office of Vocational Rehabilitation Services (OVR) and the Allegheny County Housing Authority.  We are a community-based program that offers Certified Recovery Specialist Training, peer/recovery support services, drug and alcohol level of care assessments, case management, resource coordination, LGBTQ+ capital, forensic support, housing assistance, health/wellness and workforce development.  The Worx! is geared towards empowering individuals and families while they safely transition and address needs.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* MENTOR Core Values Section */}
          <section className="py-12 md:py-16 lg:py-20 animate-fadeIn max-w-7xl mx-auto">
            <div className="rounded-3xl shadow-2xl p-6 md:p-10 lg:p-14 border-4 overflow-hidden" style={{ borderColor: '#1e3a8a', backgroundColor: '#FFFEF0' }}>
              <div className="text-center mb-10 md:mb-12">
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
                  style={{ 
                    fontFamily: 'Georgia, serif',
                    color: '#1e3a8a',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  MENTOR Core Values
                </h2>
                <p 
                  className="text-xl md:text-2xl text-gray-700 font-semibold"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  The essential pillars of our mentoring approach
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                {[
                  { label: 'TRAINING', color: 'bg-orange-500', hover: 'hover:bg-orange-600', icon: '🎓' },
                  { label: 'GOAL', color: 'bg-red-600', hover: 'hover:bg-red-700', icon: '🎯' },
                  { label: 'MOTIVATION', color: 'bg-red-500', hover: 'hover:bg-red-600', icon: '💪' },
                  { label: 'ADVICE', color: 'bg-green-400', hover: 'hover:bg-green-500', icon: '💡' },
                  { label: 'SUPPORT', color: 'bg-blue-300', hover: 'hover:bg-blue-400', icon: '🤝' },
                  { label: 'COACHING', color: 'bg-yellow-400', hover: 'hover:bg-yellow-500', icon: '🏆' },
                  { label: 'SUCCESS', color: 'bg-green-500', hover: 'hover:bg-green-600', icon: '✨' },
                  { label: 'DIRECTION', color: 'bg-blue-500', hover: 'hover:bg-blue-600', icon: '🧭' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`${item.color} ${item.hover} text-white p-6 md:p-8 rounded-2xl text-center font-bold text-sm md:text-base lg:text-lg shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-default group`}
                    style={{ 
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      minHeight: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span className="text-3xl md:text-4xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* B.O.T.T.O.M.S Services Section */}
          <section className="py-12 md:py-16 lg:py-20 animate-fadeIn max-w-7xl mx-auto">
            <div className="rounded-3xl shadow-2xl p-6 md:p-10 lg:p-14 border-4 overflow-hidden" style={{ borderColor: '#1e3a8a', backgroundColor: '#FFFEF0' }}>
              <div className="text-center mb-10 md:mb-12">
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
                  style={{ 
                    fontFamily: 'Georgia, serif',
                    color: '#1e3a8a',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Our Services
                </h2>
                <p 
                  className="text-xl md:text-2xl text-gray-800 font-semibold mb-2"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Comprehensive support for your journey
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {[
                    'Mentor Services (CPS & CRS)',
                    'Forensic Support',
                    'Groups/Workshops',
                    'Housing Liaison',
                    'Service Linkage/Referrals',
                    'Training and Development',
                    'Transportation',
                    'Wellness Management'
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="rounded-xl p-5 md:p-6 shadow-lg border-2 border-amber-200 group hover:border-amber-400 hover:shadow-xl hover:scale-105 transition-all duration-300"
                      style={{ backgroundColor: '#FFFEF0' }}
                    >
                      <div className="flex items-start gap-4">
                        <span 
                          className="text-3xl mt-1 group-hover:scale-125 transition-transform duration-300"
                          style={{ color: '#1e3a8a' }}
                        >
                          ◆
                        </span>
                        <span 
                          className="text-lg md:text-xl text-gray-800 font-semibold flex-1"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          {service}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          </div>
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
    </>;
};
export default BeginnersGuide;
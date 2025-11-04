import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import worxLogo from '@/assets/Worx-logo (2).png';

const BeginnersGuide = () => {
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
          background: '#FDFBEF'
        }}
      >
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-background/80 dark:bg-background/90 backdrop-blur-xl border-b border-border/40 dark:border-border/60 shadow-lg shadow-black/5 dark:shadow-black/20">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4 lg:gap-6">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 hover:scale-105">
                  <img src={worxLogo} alt="The Worx Logo" className="h-10 w-auto drop-shadow-md" />
                </Link>
                <Link to="/">
                  <Button variant="ghost" size="lg" className="font-medium hover:bg-accent/50 transition-all duration-200" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span>Home</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="font-medium hover:bg-accent/50 transition-all duration-200 bg-accent/30" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <span>Beginners Guide</span>
                </Button>
                <Link to="/dashboard">
                  <Button variant="ghost" size="lg" className="font-medium hover:bg-accent/50 transition-all duration-200" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <span>Dashboard</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 lg:px-8 py-8 md:py-12 flex-1 animate-fadeIn">
          {/* Header */}
          <header className="pt-8 md:pt-12 pb-8 md:pb-12 max-w-5xl mx-auto">
            <h1 
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 md:mb-6 tracking-tight leading-tight text-gray-800 text-center"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              Complete Guide about The Worx
            </h1>
            <div className="max-w-4xl mx-auto">
              <p 
                className="text-sm md:text-base lg:text-lg leading-relaxed text-gray-700 font-normal text-left"
                style={{
                  fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.01em'
                }}
              >
                Our staff has over 35 years of experience, devoting themselves to enhancing the well-being others.  Our flexibility has allowed us to engage in a range of positions, both volunteer and work related; thus, heightening our overall experience.  We have been committed to providing and coordinating services for the vulnerable/high risk populations throughout Allegheny County.  The Worx, currently provides a vast majority of services to individuals in community corrections/halfway house, treatment facilities and throughout the community.  Our staff is skilled in working with minority and marginalized communities.  We work closely with those individuals who identify as black, brown and LGBTQIA+.  To date, The Worx, provides services in the following neighborhoods; McKees Rocks, Braddock, Beltzhoover, North Side, Hazelwood, Mt. Oliver, Knoxville, Homestead, Mon Valley and surrounding areas within Allegheny  County.   Our strong verbal and written communication skills allow us to effectively advocate for the individuals and families we serve.  Here at The Worx, we work diligently to support and promote self-sufficiency, by facilitating mentoring psychotherapy or psycho-education groups and/or workshops.  It is important to us to focus on the person not the problem.  Combined our staff offers academia expertise in social work, child development, family relations, sociology, trauma informed care, case management, housing and lived experience around intimate partner violence, mental health, substance use and the criminal justice system.  Here at The Worx, our support staff displays Accountability and Motivation as they empower our participants to play an active role in their recovery and long-term success.
              </p>
            </div>
          </header>

          {/* What is The Worx Section */}
          <article className="py-12 md:py-16 lg:py-20 animate-fadeIn max-w-5xl mx-auto">
            <div className="mb-12 md:mb-16">
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 md:mb-6 tracking-tight text-gray-800 text-center"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                What is The Worx?
              </h2>
              <div className="max-w-4xl mx-auto">
                <p 
                  className="text-sm md:text-base lg:text-lg text-gray-700 font-normal leading-relaxed text-left"
                  style={{
                    fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontWeight: 400,
                    letterSpacing: '0.01em'
                  }}
                >
                  The WORX! is comprised of Recovery Support Worx Co. (RSW) and WillSTAN Housing.  We are an affiliate of Trans YOUniting and partnered with several other community resources including The Office of Vocational Rehabilitation Services (OVR) and the Allegheny County Housing Authority.  We are a community-based program that offers Certified Recovery Specialist Training, peer/recovery support services, drug and alcohol level of care assessments, case management, resource coordination, LGBTQ+ capital, forensic support, housing assistance, health/wellness and workforce development.  The Worx! is geared towards empowering individuals and families while they safely transition and address needs.
                </p>
              </div>
            </div>
          </article>
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
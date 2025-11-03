import { BookOpen, Home, BarChart3 } from 'lucide-react';
import { Link } from "react-router-dom";
import { ThemeToggle } from '@/components/ThemeToggle';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import worxLogo from '@/assets/worx-logo.png';

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
                <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent/50 transition-all duration-200 hover:scale-105 bg-accent/30">
                  <BookOpen size={18} />
                  <span className="hidden sm:inline">Beginners Guide</span>
                </Button>
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
          <header className="pt-8 md:pt-12 pb-8 md:pb-12 text-center max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 md:mb-8 tracking-tight leading-tight">
              Complete Guide about <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-primary dark:via-purple-400 dark:to-pink-400">
                The Worx
              </span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed text-foreground/80 dark:text-foreground/90 font-normal px-4">
            Our staff has over 35 years of experience, devoting themselves to enhancing the well-being others.  Our flexibility has allowed us to engage in a range of positions, both volunteer and work related; thus, heightening our overall experience.  We have been committed to providing and coordinating services for the vulnerable/high risk populations throughout Allegheny County.  The Worx, currently provides a vast majority of services to individuals in community corrections/halfway house, treatment facilities and throughout the community.  Our staff is skilled in working with minority and marginalized communities.  We work closely with those individuals who identify as black, brown and LGBTQIA+.  To date, The Worx, provides services in the following neighborhoods; McKees Rocks, Braddock, Beltzhoover, North Side, Hazelwood, Mt. Oliver, Knoxville, Homestead, Mon Valley and surrounding areas within Allegheny  County.   Our strong verbal and written communication skills allow us to effectively advocate for the individuals and families we serve.  Here at The Worx, we work diligently to support and promote self-sufficiency, by facilitating mentoring psychotherapy or psycho-education groups and/or workshops.  It is important to us to focus on the person not the problem.  Combined our staff offers academia expertise in social work, child development, family relations, sociology, trauma informed care, case management, housing and lived experience around intimate partner violence, mental health, substance use and the criminal justice system.  Here at The Worx, our support staff displays Accountability and Motivation as they empower our participants to play an active role in their recovery and long-term success.
            </p>
          </header>

          {/* What is The Worx Section */}
          <article className="py-12 md:py-16 lg:py-20 animate-fadeIn max-w-5xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 tracking-tight text-foreground">
                What is The Worx?
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-foreground/80 dark:text-foreground/90 max-w-4xl mx-auto font-normal leading-relaxed px-4">
              The WORX! is comprised of Recovery Support Worx Co. (RSW) and WillSTAN Housing.  We are an affiliate of Trans YOUniting and partnered with several other community resources including The Office of Vocational Rehabilitation Services (OVR) and the Allegheny County Housing Authority.  We are a community-based program that offers Certified Recovery Specialist Training, peer/recovery support services, drug and alcohol level of care assessments, case management, resource coordination, LGBTQ+ capital, forensic support, housing assistance, health/wellness and workforce development.  The Worx! is geared towards empowering individuals and families while they safely transition and address needs.
              </p>
            </div>
          </article>
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
    </>;
};
export default BeginnersGuide;
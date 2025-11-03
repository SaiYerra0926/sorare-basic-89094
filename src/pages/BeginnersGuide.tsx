import { BookOpen } from 'lucide-react';
import { Link } from "react-router-dom";
import { ThemeToggle } from '@/components/ThemeToggle';
import { Helmet } from 'react-helmet-async';

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
                  Beginners Guide
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <header className="pt-16 pb-12 text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Complete Guide about <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-primary dark:via-purple-400 dark:to-pink-400">
                The Worx
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-foreground/90 dark:text-foreground/95 font-light">
            Our staff has over 35 years of experience, devoting themselves to enhancing the well-being others.  Our flexibility has allowed us to engage in a range of positions, both volunteer and work related; thus, heightening our overall experience.  We have been committed to providing and coordinating services for the vulnerable/high risk populations throughout Allegheny County.  The Worx, currently provides a vast majority of services to individuals in community corrections/halfway house, treatment facilities and throughout the community.  Our staff is skilled in working with minority and marginalized communities.  We work closely with those individuals who identify as black, brown and LGBTQIA+.  To date, The Worx, provides services in the following neighborhoods; McKees Rocks, Braddock, Beltzhoover, North Side, Hazelwood, Mt. Oliver, Knoxville, Homestead, Mon Valley and surrounding areas within Allegheny  County.   Our strong verbal and written communication skills allow us to effectively advocate for the individuals and families we serve.  Here at The Worx, we work diligently to support and promote self-sufficiency, by facilitating mentoring psychotherapy or psycho-education groups and/or workshops.  It is important to us to focus on the person not the problem.  Combined our staff offers academia expertise in social work, child development, family relations, sociology, trauma informed care, case management, housing and lived experience around intimate partner violence, mental health, substance use and the criminal justice system.  Here at The Worx, our support staff displays Accountability and Motivation as they empower our participants to play an active role in their recovery and long-term success.
            </p>
          </header>

          {/* What is The Worx Section */}
          <article className="py-20 animate-fade-in">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">
                What is The Worx?
              </h2>
              <p className="text-lg md:text-xl text-foreground/85 dark:text-foreground/90 max-w-2xl mx-auto font-light leading-relaxed">
              The WORX! is comprised of Recovery Support Worx Co. (RSW) and WillSTAN Housing.  We are an affiliate of Trans YOUniting and partnered with several other community resources including The Office of Vocational Rehabilitation Services (OVR) and the Allegheny County Housing Authority.  We are a community-based program that offers Certified Recovery Specialist Training, peer/recovery support services, drug and alcohol level of care assessments, case management, resource coordination, LGBTQ+ capital, forensic support, housing assistance, health/wellness and workforce development.  The Worx! is geared towards empowering individuals and families while they safely transition and address needs.
              </p>
            </div>
          </article>
        </main>
        
        {/* Footer Spacer */}
        <div className="h-16"></div>
      </div>
    </>;
};
export default BeginnersGuide;
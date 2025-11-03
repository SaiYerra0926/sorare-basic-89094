import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BookOpen, Home, FileText, Users, HeartHandshake, Briefcase, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import worxLogo from '@/assets/worx-logo.png';

const Handbook = () => {
  return (
    <>
      <Helmet>
        <title>Handbook - The Worx</title>
        <meta name="description" content="Comprehensive handbook with resources, guidelines, and information for recovery support services." />
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

        <main className="container mx-auto px-6 lg:px-8 py-8 md:py-12 flex-1 animate-fadeIn">
          {/* Header */}
          <header className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="p-4 md:p-5 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
                <BookOpen size={32} className="text-white md:w-10 md:h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 text-foreground bg-gradient-to-r from-foreground to-foreground/70 dark:from-foreground dark:to-foreground/80 bg-clip-text text-transparent">
              Handbook
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-foreground/80 dark:text-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Comprehensive resources, guidelines, and information for recovery support services
            </p>
          </header>

          {/* Handbook Content */}
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12 md:mb-16">
            {/* Services Section */}
            <Card className="border-border/50 dark:border-border/70 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-card/80 dark:bg-card/90 backdrop-blur-sm hover:scale-[1.02] hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <HeartHandshake className="text-blue-500" size={24} />
                  </div>
                  <CardTitle className="text-xl">Our Services</CardTitle>
                </div>
                <CardDescription>
                  Comprehensive recovery support services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground/80 dark:text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Certified Recovery Specialist Training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Peer/Recovery Support Services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Drug and Alcohol Level of Care Assessments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Case Management & Resource Coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Housing Assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Health/Wellness & Workforce Development</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Resources Section */}
            <Card className="border-border/50 dark:border-border/70 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-card/80 dark:bg-card/90 backdrop-blur-sm hover:scale-[1.02] hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <FileText className="text-purple-500" size={24} />
                  </div>
                  <CardTitle className="text-xl">Resources</CardTitle>
                </div>
                <CardDescription>
                  Essential resources and partnerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground/80 dark:text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Office of Vocational Rehabilitation Services (OVR)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Allegheny County Housing Authority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Trans YOUniting Partnership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Community Resource Coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>LGBTQ+ Support Services</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Service Areas Section */}
            <Card className="border-border/50 dark:border-border/70 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-card/80 dark:bg-card/90 backdrop-blur-sm hover:scale-[1.02] hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Users className="text-green-500" size={24} />
                  </div>
                  <CardTitle className="text-xl">Service Areas</CardTitle>
                </div>
                <CardDescription>
                  Communities we serve
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground/80 dark:text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>McKees Rocks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Braddock</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Beltzhoover</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>North Side</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Hazelwood</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Mt. Oliver, Knoxville, Homestead</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Mon Valley & Surrounding Areas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card className="border-border/50 dark:border-border/70 shadow-lg mb-8 md:mb-12 rounded-2xl bg-card/80 dark:bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Briefcase className="text-orange-500" size={24} />
                </div>
                <CardTitle className="text-xl">About The Worx</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-foreground/85 dark:text-foreground/90">
                <p>
                  The WORX! is comprised of Recovery Support Worx Co. (RSW) and WillSTAN Housing. We are an affiliate of Trans YOUniting and partnered with several other community resources including The Office of Vocational Rehabilitation Services (OVR) and the Allegheny County Housing Authority.
                </p>
                <p>
                  We are a community-based program that offers comprehensive recovery support services designed to empower individuals and families while they safely transition and address their needs.
                </p>
                <p>
                  Our staff has over 35 years of combined experience, devoting themselves to enhancing the well-being of others. We work closely with minority and marginalized communities, including those who identify as black, brown, and LGBTQIA+.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-border/50 dark:border-border/70 shadow-lg bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10 rounded-2xl border-2 border-primary/20 dark:border-primary/30">
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-foreground/85 dark:text-foreground/90">
                <p><strong>Location:</strong> 300 Catherine Street, 1st Floor, McKees Rocks, PA 15136</p>
                <p><strong>Email:</strong> <a href="mailto:info@theworx.us" className="text-primary hover:underline">info@theworx.us</a></p>
                <p className="mt-4 text-sm text-foreground/70 dark:text-foreground/75">
                  For referrals or inquiries, please use our referral form or contact us directly.
                </p>
              </div>
            </CardContent>
          </Card>
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
    </>
  );
};

export default Handbook;


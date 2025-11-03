import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BookOpen, Home, FileText, Users, HeartHandshake, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Handbook = () => {
  return (
    <>
      <Helmet>
        <title>Handbook - The Worx</title>
        <meta name="description" content="Comprehensive handbook with resources, guidelines, and information for recovery support services." />
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
                  Handbook
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-500 rounded-xl">
                <BookOpen size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Handbook
            </h1>
            <p className="text-xl text-foreground/70 dark:text-foreground/80 max-w-3xl mx-auto">
              Comprehensive resources, guidelines, and information for recovery support services
            </p>
          </header>

          {/* Handbook Content */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {/* Services Section */}
            <Card className="border-border/50 dark:border-border/70 shadow-lg hover:shadow-xl transition-shadow">
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
            <Card className="border-border/50 dark:border-border/70 shadow-lg hover:shadow-xl transition-shadow">
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
            <Card className="border-border/50 dark:border-border/70 shadow-lg hover:shadow-xl transition-shadow">
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
          <Card className="border-border/50 dark:border-border/70 shadow-lg mb-8">
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
          <Card className="border-border/50 dark:border-border/70 shadow-lg bg-primary/5 dark:bg-primary/10">
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
        <footer className="bg-background dark:bg-background/98 border-t border-border/50 dark:border-border/70 py-8 mt-16">
          <div className="container mx-auto px-6 lg:px-8 text-center">
            <p className="text-sm text-foreground/70 dark:text-foreground/80">
              © {new Date().getFullYear()} The Worx. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Handbook;


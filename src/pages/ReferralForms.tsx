import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, FileCheck, HeartHandshake } from 'lucide-react';
import worxLogo from '@/assets/worx-logo.png';
import { RecoveryReferralForm } from '@/components/forms/RecoveryReferralForm';
import { CaseManagementForm } from '@/components/forms/CaseManagementForm';
import { SupportServicesForm } from '@/components/forms/SupportServicesForm';

const ReferralForms = () => {
  const [activeTab, setActiveTab] = useState('recovery');

  return (
    <>
      <Helmet>
        <title>Referral Forms - WORX Recovery Support</title>
        <meta name="description" content="Submit referrals for recovery support, case management, and certified recovery support services at WORX." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={worxLogo} alt="WORX Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Recovery Support WORX</h1>
                <p className="text-sm text-muted-foreground">Referral Services Portal</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Introduction Card */}
            <Card className="mb-8 border-primary/20 shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Submit a Referral
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Choose the appropriate service and complete the referral form. All submissions are secure and confidential.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>Location:</strong> 300 Catherine Street, 1st Floor, McKees Rocks, PA 15136 | 
                    <strong className="ml-2">Email:</strong> info@theworx.us
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Forms Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-card/50 backdrop-blur-sm">
                <TabsTrigger 
                  value="recovery" 
                  className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <UserPlus className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-semibold">Recovery Support</div>
                    <div className="text-xs opacity-80">D/A Assessment & Support</div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="case" 
                  className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <FileCheck className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-semibold">Case Management</div>
                    <div className="text-xs opacity-80">Resource Coordination</div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="support" 
                  className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <HeartHandshake className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-semibold">Certified Support</div>
                    <div className="text-xs opacity-80">Specialized Services</div>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recovery" className="mt-6">
                <RecoveryReferralForm />
              </TabsContent>

              <TabsContent value="case" className="mt-6">
                <CaseManagementForm />
              </TabsContent>

              <TabsContent value="support" className="mt-6">
                <SupportServicesForm />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Recovery Support WORX. All rights reserved.</p>
            <p className="mt-1">Confidential referral services for recovery and support.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ReferralForms;

import { Helmet } from 'react-helmet-async';
import { RecoveryReferralForm } from '@/components/forms/RecoveryReferralForm';

const ReferralForms = () => {
  return (
    <>
      <Helmet>
        <title>Referral Forms - Recovery Support Worx</title>
        <meta name="description" content="Submit referrals for recovery support services." />
      </Helmet>
      
      <div className="min-h-screen bg-background w-full">
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <RecoveryReferralForm />
          </div>
        </main>
      </div>
    </>
  );
};

export default ReferralForms;


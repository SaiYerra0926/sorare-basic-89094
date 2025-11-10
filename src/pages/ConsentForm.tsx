import { Helmet } from 'react-helmet-async';
import { ConsentFormPage } from '@/components/forms/ConsentFormPage';

const ConsentForm = () => {
  return (
    <>
      <Helmet>
        <title>Consent Form - Recovery Support Worx</title>
        <meta name="description" content="Submit consent form for information disclosure authorization." />
      </Helmet>
      
      <div 
        className="min-h-screen w-full"
        style={{
          background: '#FFFEF7'
        }}
      >
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <ConsentFormPage />
          </div>
        </main>
      </div>
    </>
  );
};

export default ConsentForm;


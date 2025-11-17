import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Receipt } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Billing = () => {
  useScrollToTop();
  
  return (
    <>
      <Helmet>
        <title>Billing - The Worx</title>
        <meta name="description" content="Billing and payment management" />
      </Helmet>
      
      <div 
        className="min-h-screen w-full py-8 px-4"
        style={{
          background: '#FFFEF7'
        }}
      >
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8">
            <div className="text-center">
              <Receipt className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h1 
                className="text-3xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Billing
              </h1>
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Billing and payment management system
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Billing;


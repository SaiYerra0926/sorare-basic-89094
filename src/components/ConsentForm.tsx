import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ConsentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onDecline?: () => void;
}

export const ConsentForm = ({ open, onOpenChange, onAccept, onDecline }: ConsentFormProps) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [dataProcessing, setDataProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleAccept = () => {
    if (consentGiven && dataProcessing && termsAccepted) {
      onAccept();
      onOpenChange(false);
      // Reset form
      setConsentGiven(false);
      setDataProcessing(false);
      setTermsAccepted(false);
    }
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    }
    onOpenChange(false);
    // Reset form
    setConsentGiven(false);
    setDataProcessing(false);
    setTermsAccepted(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] rounded-xl p-0 border-0 shadow-xl bg-transparent"
        style={{
          background: 'transparent'
        }}
      >
        <div 
          className="bg-white rounded-xl p-6 md:p-8 relative"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Icon and Title */}
          <DialogHeader className="text-center pt-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-600 rounded-xl">
                <FileText size={24} className="text-white" />
              </div>
            </div>
            <DialogTitle 
              className="text-2xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              Consent Form
            </DialogTitle>
            <DialogDescription 
              className="text-sm text-gray-600 mt-2"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              Please review and accept the terms to continue
            </DialogDescription>
          </DialogHeader>

          {/* Consent Form Content */}
          <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <div className="mb-6">
              <h2 
                className="text-lg font-bold text-gray-800 mb-2 uppercase"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                CONSENT INFORMATION
              </h2>
              <p 
                className="text-sm text-gray-600"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Provide your consent to continue with the form
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200">
                <Checkbox
                  id="consent"
                  checked={consentGiven}
                  onCheckedChange={(checked) => setConsentGiven(checked === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="consent"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  I consent to the collection and processing of my personal information for the purposes of referral processing and service delivery.
                </label>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200">
                <Checkbox
                  id="data-processing"
                  checked={dataProcessing}
                  onCheckedChange={(checked) => setDataProcessing(checked === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="data-processing"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  I understand that my data will be securely stored and shared with authorized personnel only for the purpose of providing recovery support services.
                </label>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  I have read and agree to the terms and conditions, privacy policy, and understand my rights regarding data access and withdrawal of consent.
                </label>
              </div>
            </div>

            {/* Terms Details */}
            <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p 
                className="text-xs text-gray-600 leading-relaxed"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                <strong className="text-gray-800">Your Rights:</strong> You have the right to access, modify, or request deletion of your personal information at any time. You may withdraw consent at any time by contacting The Worx at info@theworx.us.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter className="flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handleDecline}
              className="w-full sm:w-auto text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!consentGiven || !dataProcessing || !termsAccepted}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg shadow-md"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              Accept & Continue
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};


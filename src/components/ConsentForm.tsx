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
      <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 border border-border/50 dark:border-border/70 shadow-xl">
        <div className="bg-card rounded-2xl p-6 md:p-8 relative">
          {/* Icon and Title */}
          <DialogHeader className="text-center pt-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-pink-500 rounded-xl">
                <FileText size={24} className="text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground dark:text-foreground/95">
              Consent Form
            </DialogTitle>
            <DialogDescription className="text-foreground/70 dark:text-foreground/80 mt-2">
              Please review and accept the terms to continue
            </DialogDescription>
          </DialogHeader>

          {/* Consent Form Content */}
          <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 dark:bg-muted/30 border border-border/30">
                <Checkbox
                  id="consent"
                  checked={consentGiven}
                  onCheckedChange={(checked) => setConsentGiven(checked === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="consent"
                  className="text-sm text-foreground/90 dark:text-foreground/85 leading-relaxed cursor-pointer"
                >
                  I consent to the collection and processing of my personal information for the purposes of referral processing and service delivery.
                </label>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 dark:bg-muted/30 border border-border/30">
                <Checkbox
                  id="data-processing"
                  checked={dataProcessing}
                  onCheckedChange={(checked) => setDataProcessing(checked === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="data-processing"
                  className="text-sm text-foreground/90 dark:text-foreground/85 leading-relaxed cursor-pointer"
                >
                  I understand that my data will be securely stored and shared with authorized personnel only for the purpose of providing recovery support services.
                </label>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 dark:bg-muted/30 border border-border/30">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-foreground/90 dark:text-foreground/85 leading-relaxed cursor-pointer"
                >
                  I have read and agree to the terms and conditions, privacy policy, and understand my rights regarding data access and withdrawal of consent.
                </label>
              </div>
            </div>

            {/* Terms Details */}
            <div className="mt-6 p-4 rounded-lg bg-background/50 dark:bg-background/30 border border-border/20">
              <p className="text-xs text-foreground/70 dark:text-foreground/75 leading-relaxed">
                <strong className="text-foreground/90 dark:text-foreground/90">Your Rights:</strong> You have the right to access, modify, or request deletion of your personal information at any time. You may withdraw consent at any time by contacting The Worx at info@theworx.us.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleDecline}
              className="w-full sm:w-auto border-border/50 dark:border-border/70"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!consentGiven || !dataProcessing || !termsAccepted}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept & Continue
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};


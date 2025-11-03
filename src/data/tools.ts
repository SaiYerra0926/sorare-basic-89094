import { BookOpen, FileText } from 'lucide-react';

export const tools = [{
  name: 'Referral Form',
  description: 'Submit a referral form for recovery support services. Complete the form to get started with your referral.',
  url: '/referrals',
  icon: FileText,
  iconColor: 'bg-blue-500',
  isInternal: true
}, {
  name: 'Consent Form',
  description: 'Review and accept the consent form for data collection and processing to use our services.',
  url: '#consent',
  icon: FileText,
  iconColor: 'bg-pink-500',
  isInternal: true,
  isConsentForm: true
}, {
  name: 'Handbook Form',
  description: 'Access our comprehensive handbook with resources, guidelines, and information for recovery support services.',
  url: '/handbook',
  icon: BookOpen,
  iconColor: 'bg-blue-500',
  isInternal: true
}, {
  name: 'Form1',
  description: 'Access Form1 to submit and manage your information.',
  url: '/form1',
  icon: FileText,
  iconColor: 'bg-purple-500',
  isInternal: true
}, {
  name: 'Form2',
  description: 'Access Form2 to submit and manage your information.',
  url: '/form2',
  icon: FileText,
  iconColor: 'bg-slate-500',
  isInternal: true
}, {
  name: 'Form3',
  description: 'Access Form3 to submit and manage your information.',
  url: '/form3',
  icon: FileText,
  iconColor: 'bg-pink-500',
  isInternal: true
}, {
  name: 'Form4',
  description: 'Access Form4 to submit and manage your information.',
  url: '/form4',
  icon: FileText,
  iconColor: 'bg-blue-500',
  isInternal: true
}, {
  name: 'Form5',
  description: 'Access Form5 to submit and manage your information.',
  url: '/form5',
  icon: FileText,
  iconColor: 'bg-purple-500',
  isInternal: true
}];
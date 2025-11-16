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
  url: '/consent-form',
  icon: FileText,
  iconColor: 'bg-pink-500',
  isInternal: true
}, {
  name: 'Handbook Form',
  description: 'Access our comprehensive handbook with resources, guidelines, and information for recovery support services.',
  url: '/handbook',
  icon: BookOpen,
  iconColor: 'bg-blue-500',
  isInternal: true
}, {
  name: 'Encounter Form',
  description: 'Submit an individual encounter form to record participant interactions and services received.',
  url: '/form1',
  icon: FileText,
  iconColor: 'bg-purple-500',
  isInternal: true
}, {
  name: 'Individual Service Plan Form',
  description: 'Create and manage recovery peer-based individualized service plans with goals, objectives, and monitoring criteria.',
  url: '/form2',
  icon: FileText,
  iconColor: 'bg-slate-500',
  isInternal: true
}, {
  name: 'Snap Assessment Form',
  description: 'Complete a SNAP Assessment to evaluate strengths, needs, abilities, and preferences for service planning.',
  url: '/form3',
  icon: FileText,
  iconColor: 'bg-pink-500',
  isInternal: true
}, {
  name: 'Discharge Form',
  description: 'Complete a Discharge Summary Form to record participant discharge information and aftercare planning.',
  url: '/form4',
  icon: FileText,
  iconColor: 'bg-blue-500',
  isInternal: true
}, {
  name: 'Wrap Plan Form',
  description: 'Complete a Wellness Recovery Action Plan (WRAP) using the Traffic Light system for mental health planning.',
  url: '/form5',
  icon: FileText,
  iconColor: 'bg-purple-500',
  isInternal: true
}];
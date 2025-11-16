import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { SignaturePad } from '@/components/ui/signature-pad';

const formSchema = z.object({
  // Header
  participantName: z.string().trim().min(1, 'Participant name is required').max(100),
  todaysDate: z.string().min(1, 'Date is required'),
  
  // Strengths
  strengths: z.array(z.string()).default([]),
  strengthsOther: z.string().trim().max(500).optional(),
  
  // Needs
  needs: z.array(z.string()).default([]),
  needsOther: z.string().trim().max(500).optional(),
  
  // Abilities
  abilities: z.array(z.string()).default([]),
  abilitiesOther: z.string().trim().max(500).optional(),
  
  // Preferences
  preferences: z.array(z.string()).default([]),
  preferencesLearnBetter: z.string().optional(),
  preferencesLivingSituation: z.string().optional(),
  preferencesLivingSituationOther: z.string().trim().max(500).optional(),
  preferencesInterestedIn: z.array(z.string()).default([]),
  preferencesInterestedInOther: z.string().trim().max(500).optional(),
  
  // Signatures
  participantSignature: z.string().optional(),
  participantSignatureDate: z.string().optional(),
  staffSignature: z.string().optional(),
  staffTitle: z.string().trim().max(200).optional(),
  staffSignatureDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Master data for options
const strengthsOptions = [
  'open-minded',
  'friendly',
  'creative',
  'good-listener',
  'quick-learner',
  'good-grooming',
  'organized',
  'takes-personal-responsibility',
  'strong-personal-or-spiritual-values',
  'independent',
  'assertive',
  'hard-worker',
  'able-to-learn-from-experiences',
  'can-collaborate-work-with-others',
  'good-problem-solver',
  'good-decision-maker',
  'dependable',
  'motivation',
  'good-health',
];

const needsOptions = [
  'increase-knowledge-of-resources',
  'referral-to-resources-job-training-education',
  'access-to-medical-care',
  'staying-in-sober-environment',
  'gain-knowledge-mental-health-diagnosis',
  'gain-knowledge-medications',
  'gain-knowledge-symptoms-behaviors',
  'get-help-to-stop-smoking',
  'learn-how-to-empower-myself',
  'increasing-effective-communication-skills',
  'learn-how-to-talk-about-concerns',
  'practice-coping-skills',
  'learn-coping-skills-improving-sleep',
  'learn-coping-skills-reducing-anxiety',
  'learn-coping-skills-managing-depression',
  'learn-coping-skills-leisure-skills',
  'learn-coping-skills-organizing-daily-activities',
  'learn-coping-skills-managing-anger',
  'learn-coping-skills-mood-regulation',
  'learn-coping-skills-improving-reality-based-thinking',
  'learn-coping-skills-eating-healthy',
];

const abilitiesOptions = [
  'basic-ability-to-read-and-write',
  'computer-knowledge-and-skills',
  'ability-to-work-effectively-with-others',
  'knowledge-or-tools-to-manage-emotions',
  'ability-to-have-positive-relationships',
  'ability-to-make-healthy-decisions',
  'job-skills',
  'education-training',
  'leisure-skills',
  'ability-to-manage-time-and-structure-daily-activities',
];

const preferencesLearnBetterOptions = [
  'face-to-face',
  'hands-on-instruction-and-practice',
  'reading-written-material',
  'alone',
  'in-discussion-with-others',
];

const preferencesLivingSituationOptions = [
  'independently-on-my-own',
  'independently-with-community-support',
  'with-others',
];

const preferencesInterestedInOptions = [
  'outpatient-programming',
  'community-resources',
];

// Display labels mapping
const optionLabels: Record<string, string> = {
  // Strengths
  'open-minded': 'Open minded',
  'friendly': 'Friendly',
  'creative': 'Creative',
  'good-listener': 'Good Listener',
  'quick-learner': 'Quick Learner',
  'good-grooming': 'Good Grooming',
  'organized': 'Organized',
  'takes-personal-responsibility': 'Takes personal responsibility',
  'strong-personal-or-spiritual-values': 'Strong personal or spiritual values',
  'independent': 'Independent',
  'assertive': 'Assertive',
  'hard-worker': 'Hard Worker',
  'able-to-learn-from-experiences': 'Able to learn from my experiences',
  'can-collaborate-work-with-others': 'Can collaborate/ work with others',
  'good-problem-solver': 'Good Problem Solver',
  'good-decision-maker': 'Good Decision Maker',
  'dependable': 'Dependable',
  'motivation': 'Motivation',
  'good-health': 'Good health',
  
  // Needs
  'increase-knowledge-of-resources': 'Increase my knowledge of resources that provide me with support',
  'referral-to-resources-job-training-education': 'Referral to resources for job training or education',
  'access-to-medical-care': 'Access to medical care for health related concerns',
  'staying-in-sober-environment': 'Staying in a sober environment to help me not use drugs and or alcohol',
  'gain-knowledge-mental-health-diagnosis': 'Gain more knowledge and understanding about: My mental health diagnosis',
  'gain-knowledge-medications': 'Gain more knowledge and understanding about: My medication(s)',
  'gain-knowledge-symptoms-behaviors': 'Gain more knowledge and understanding about: My symptoms / behaviors related to my mental health diagnosis',
  'get-help-to-stop-smoking': 'Get help to stop smoking',
  'learn-how-to-empower-myself': 'Learn how to empower myself to take a more active role in my treatment',
  'increasing-effective-communication-skills': 'Increasing effective communication skills to improve my relationships with others',
  'learn-how-to-talk-about-concerns': 'Learn how to talk about my concerns/issues/feelings',
  'practice-coping-skills': 'Practice my coping skills in a safe environment',
  'learn-coping-skills-improving-sleep': 'Learn more about effective coping skills related to: Improving my sleep',
  'learn-coping-skills-reducing-anxiety': 'Learn more about effective coping skills related to: Reducing anxiety and using relaxation',
  'learn-coping-skills-managing-depression': 'Learn more about effective coping skills related to: Managing my depression',
  'learn-coping-skills-leisure-skills': 'Learn more about effective coping skills related to: Leisure skills',
  'learn-coping-skills-organizing-daily-activities': 'Learn more about effective coping skills related to: Organizing daily activities',
  'learn-coping-skills-managing-anger': 'Learn more about effective coping skills related to: Managing anger',
  'learn-coping-skills-mood-regulation': 'Learn more about effective coping skills related to: Mood Regulation',
  'learn-coping-skills-improving-reality-based-thinking': 'Learn more about effective coping skills related to: Improving reality-based thinking',
  'learn-coping-skills-eating-healthy': 'Learn more about effective coping skills related to: Eating Healthy',
  
  // Abilities
  'basic-ability-to-read-and-write': 'Basic ability to read and write',
  'computer-knowledge-and-skills': 'Computer knowledge and skills',
  'ability-to-work-effectively-with-others': 'Ability to work effectively with others',
  'knowledge-or-tools-to-manage-emotions': 'Knowledge or tools that I use to help me manage my emotions',
  'ability-to-have-positive-relationships': 'Ability to have positive relationships with others',
  'ability-to-make-healthy-decisions': 'Ability to make healthy decisions about my life',
  'job-skills': 'Job Skills',
  'education-training': 'Education / Training',
  'leisure-skills': 'Leisure Skills',
  'ability-to-manage-time-and-structure-daily-activities': 'Ability to manage my time and structure my daily activities',
  
  // Preferences
  'face-to-face': 'Face to face',
  'hands-on-instruction-and-practice': 'Hands on instruction and practice',
  'reading-written-material': 'Reading written material',
  'alone': 'Alone',
  'in-discussion-with-others': 'In discussion with others',
  'independently-on-my-own': 'Independently, on my own',
  'independently-with-community-support': 'Independently, with community support',
  'with-others': 'With others',
  'outpatient-programming': 'Outpatient programming',
  'community-resources': 'Community resources',
};

export const SnapAssessmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      strengths: [],
      needs: [],
      abilities: [],
      preferences: [],
      preferencesInterestedIn: [],
      todaysDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log('SNAP Assessment form submitted with data:', data);
      
      const response = await api.submitSnapAssessment(data);
      
      if (response.success) {
        toast.success('SNAP Assessment submitted successfully!', {
          description: `Your assessment has been saved. Reference ID: ${response.data?.assessmentId || 'N/A'}`,
          duration: 3000,
        });
        
        // Reset form after successful submission
        form.reset();
        form.setValue('todaysDate', new Date().toISOString().split('T')[0]);
      } else {
        throw new Error(response.message || 'Failed to submit SNAP Assessment');
      }
    } catch (error: any) {
      console.error('Error submitting SNAP Assessment:', error);
      const errorMessage = error?.message || error?.error || 'Please check your connection and try again.';
      toast.error('Failed to submit SNAP Assessment', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCheckboxGroup = (
    name: keyof FormValues,
    options: string[],
    indentLevel: number = 0
  ) => {
    return (
      <FormField
        control={form.control}
        name={name as any}
        render={() => (
          <FormItem>
            <FormControl>
              <div className="space-y-2">
                {options.map((option) => (
                  <FormField
                    key={option}
                    control={form.control}
                    name={name as any}
                    render={({ field }) => {
                      const isChecked = Array.isArray(field.value) && field.value.includes(option);
                      return (
                        <FormItem
                          key={option}
                          className={`flex items-start space-x-3 space-y-0 ${indentLevel > 0 ? 'ml-6' : ''}`}
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const currentValue = Array.isArray(field.value) ? field.value : [];
                                if (checked) {
                                  field.onChange([...currentValue, option]);
                                } else {
                                  field.onChange(currentValue.filter((v) => v !== option));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel 
                            className="text-sm font-normal cursor-pointer text-gray-700 leading-relaxed"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            {optionLabels[option] || option}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div 
      className="relative w-full min-h-screen py-8 md:py-12"
      style={{
        background: '#FFFEF7'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Card 
          className="shadow-xl border-0 bg-white"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="p-6 md:p-8 lg:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 uppercase"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                SNAP Assessment
              </h1>
              <p 
                className="text-sm text-gray-600 italic max-w-3xl mx-auto leading-relaxed"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                This form is used to evaluate an individual's Strengths, Needs, Abilities, and Preferences to determine the most appropriate service plan for their specific situation. There are four parts to the assessment. Please check and/or list all that applies.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Header Information */}
                <div className="grid gap-4 md:grid-cols-2 pb-6 border-b border-gray-200">
                  <FormField
                    control={form.control}
                    name="participantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel 
                          className="text-sm font-semibold text-gray-800"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Participant's Print Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="todaysDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel 
                          className="text-sm font-semibold text-gray-800"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Today's Date
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date"
                            {...field} 
                            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 1: STRENGTHS */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-2 uppercase"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    STRENGTHS
                  </h2>
                  <p 
                    className="text-sm font-semibold text-gray-700 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    What personal qualities do you have which we can build upon in treatment?
                  </p>
                  
                  {renderCheckboxGroup('strengths', strengthsOptions)}
                  
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="strengthsOther"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Other (Please List)
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 2: NEEDS */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-2 uppercase"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    NEEDS
                  </h2>
                  <p 
                    className="text-sm font-semibold text-gray-700 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    What would help you achieve your goals? Please, check your most important needs. (Prioritize your top three)
                  </p>
                  
                  {renderCheckboxGroup('needs', needsOptions)}
                  
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="needsOther"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Other (Please List)
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 3: ABILITIES */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-2 uppercase"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    ABILITIES
                  </h2>
                  <p 
                    className="text-sm font-semibold text-gray-700 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    What skills do you possess?
                  </p>
                  
                  {renderCheckboxGroup('abilities', abilitiesOptions)}
                  
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="abilitiesOther"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Other (Please List)
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 4: PREFERENCES */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-2 uppercase"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    PREFERENCES
                  </h2>
                  <p 
                    className="text-sm font-semibold text-gray-700 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    How do you want your treatment?
                  </p>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="preferences"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <div className="space-y-2">
                              <FormField
                                control={form.control}
                                name="preferences"
                                render={({ field }) => (
                                  <FormItem className="flex items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={Array.isArray(field.value) && field.value.includes('family-friends-involved')}
                                        onCheckedChange={(checked) => {
                                          const currentValue = Array.isArray(field.value) ? field.value : [];
                                          if (checked) {
                                            field.onChange([...currentValue, 'family-friends-involved']);
                                          } else {
                                            field.onChange(currentValue.filter((v) => v !== 'family-friends-involved'));
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel 
                                      className="text-sm font-normal cursor-pointer text-gray-700"
                                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                    >
                                      I prefer my family or friends to be involved in my treatment
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="preferences"
                                render={({ field }) => (
                                  <FormItem className="flex items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={Array.isArray(field.value) && field.value.includes('family-meeting')}
                                        onCheckedChange={(checked) => {
                                          const currentValue = Array.isArray(field.value) ? field.value : [];
                                          if (checked) {
                                            field.onChange([...currentValue, 'family-meeting']);
                                          } else {
                                            field.onChange(currentValue.filter((v) => v !== 'family-meeting'));
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel 
                                      className="text-sm font-normal cursor-pointer text-gray-700"
                                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                    >
                                      I would like to have a family meeting
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="ml-6 space-y-2">
                      <p 
                        className="text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      >
                        I learn new information better:
                      </p>
                      {renderCheckboxGroup('preferencesLearnBetter', preferencesLearnBetterOptions, 1)}
                    </div>

                    <FormField
                      control={form.control}
                      name="preferences"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={Array.isArray(field.value) && field.value.includes('sharing-information-group')}
                              onCheckedChange={(checked) => {
                                const currentValue = Array.isArray(field.value) ? field.value : [];
                                if (checked) {
                                  field.onChange([...currentValue, 'sharing-information-group']);
                                } else {
                                  field.onChange(currentValue.filter((v) => v !== 'sharing-information-group'));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel 
                            className="text-sm font-normal cursor-pointer text-gray-700"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Sharing information in a group of my peers
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <div className="ml-6 space-y-2">
                      <p 
                        className="text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      >
                        I would like to live:
                      </p>
                      {renderCheckboxGroup('preferencesLivingSituation', preferencesLivingSituationOptions, 1)}
                      
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name="preferencesLivingSituationOther"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel 
                                className="text-sm font-semibold text-gray-800"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              >
                                Other ideas I have about my living situation (Please List)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="ml-6 space-y-2">
                      <p 
                        className="text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      >
                        I am interested in learning more about:
                      </p>
                      {renderCheckboxGroup('preferencesInterestedIn', preferencesInterestedInOptions, 1)}
                      
                      <FormField
                        control={form.control}
                        name="preferences"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0 ml-6">
                            <FormControl>
                              <Checkbox
                                checked={Array.isArray(field.value) && field.value.includes('other-areas-of-interest')}
                                onCheckedChange={(checked) => {
                                  const currentValue = Array.isArray(field.value) ? field.value : [];
                                  if (checked) {
                                    field.onChange([...currentValue, 'other-areas-of-interest']);
                                  } else {
                                    field.onChange(currentValue.filter((v) => v !== 'other-areas-of-interest'));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel 
                              className="text-sm font-normal cursor-pointer text-gray-700"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Other areas of interest
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <div className="mt-2 ml-6">
                        <FormField
                          control={form.control}
                          name="preferencesInterestedInOther"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel 
                                className="text-sm font-semibold text-gray-800"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              >
                                (Please List)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signatures Section */}
                <div className="space-y-6 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4 uppercase"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Signatures
                  </h2>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="participantSignature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Participant Signature
                            </FormLabel>
                            <FormControl>
                              <SignaturePad
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                onBlur={field.onBlur}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="participantSignatureDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Date
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="date"
                                {...field} 
                                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="staffSignature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Staff Signature/Title
                            </FormLabel>
                            <FormControl>
                              <SignaturePad
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                onBlur={field.onBlur}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="staffTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Staff Title
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="staffSignatureDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Date
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="date"
                                {...field} 
                                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-8 py-2 rounded-lg shadow-md"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">Submitting...</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium">Submit SNAP Assessment</span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};


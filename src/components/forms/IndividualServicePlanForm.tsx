import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { SignaturePad } from '@/components/ui/signature-pad';

const formSchema = z.object({
  // Step 1: Participant Information
  ispType: z.enum(['initial', 'update']).default('initial'),
  participantName: z.string().trim().min(1, 'Participant name is required').max(100),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  contactInformation: z.string().trim().max(200).optional(),
  dateOfISP: z.string().min(1, 'Date of ISP is required'),
  
  // Goals and Objectives
  goal1: z.string().trim().min(1, 'Goal 1 is required').max(500),
  objective1_1: z.string().trim().max(500).optional(),
  objective1_2: z.string().trim().max(500).optional(),
  
  goal2: z.string().trim().min(1, 'Goal 2 is required').max(500),
  objective2_1: z.string().trim().max(500).optional(),
  objective2_2: z.string().trim().max(500).optional(),
  
  goal3: z.string().trim().min(1, 'Goal 3 is required').max(500),
  objective3_1: z.string().trim().max(500).optional(),
  objective3_2: z.string().trim().max(500).optional(),
  
  goal4: z.string().trim().min(1, 'Goal 4 is required').max(500),
  objective4_1: z.string().trim().max(500).optional(),
  objective4_2: z.string().trim().max(500).optional(),
  objective4_3: z.string().trim().max(500).optional(),
  
  // Step 2: Strengths and Resources
  participantStrengths: z.string().trim().max(1000).optional(),
  supportNetwork: z.string().trim().max(1000).optional(),
  communityResources: z.string().trim().max(1000).optional(),
  
  // Activities and Interventions
  activity1: z.string().trim().max(500).optional(),
  activity2: z.string().trim().max(500).optional(),
  
  // Monitoring and Evaluation
  methodOfMonitoring: z.string().trim().max(500).optional(),
  frequencyOfMonitoring: z.string().trim().max(200).optional(),
  criteriaForSuccess: z.string().trim().max(500).optional(),
  
  // Step 3: Signatures
  participantSignature: z.string().optional(),
  participantSignatureDate: z.string().optional(),
  recoveryPeerSignature: z.string().optional(),
  recoveryPeerSignatureDate: z.string().optional(),
  crsSupervisorSignature: z.string().optional(),
  crsSupervisorSignatureDate: z.string().optional(),
  nextReviewDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const IndividualServicePlanForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ispType: 'initial',
      dateOfISP: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log('ISP Form submitted with data:', data);
      
      toast.success('Individual Service Plan submitted successfully!', {
        description: 'Your ISP has been saved.',
        duration: 3000,
      });
      
      // Optionally reset form or redirect
      // setTimeout(() => {
      //   window.location.href = '/';
      // }, 1500);
    } catch (error: any) {
      console.error('Error submitting ISP form:', error);
      const errorMessage = error?.message || error?.error || 'Please check your connection and try again.';
      toast.error('Failed to submit ISP form', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['participantName', 'dateOfBirth', 'dateOfISP', 'goal1', 'goal2', 'goal3', 'goal4'];
    } else if (currentStep === 2) {
      fieldsToValidate = [];
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderProgressIndicator = () => {
    const steps = [
      { number: 1, label: 'Participant Info & Goals' },
      { number: 2, label: 'Strengths & Activities' },
      { number: 3, label: 'Signatures & Review' },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  style={{
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                >
                  {step.number}
                </div>
                <span
                  className={`mt-2 text-xs text-center ${
                    currentStep >= step.number
                      ? 'text-gray-800 font-medium'
                      : 'text-gray-400'
                  }`}
                  style={{
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 uppercase"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          Recovery Peer-Based Individualized Service Plan (ISP)
        </h1>
      </div>

      {/* Participant Information */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h2 
          className="text-lg font-bold text-gray-800 mb-4"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          Participant Information
        </h2>
        
        <div className="mb-4">
          <p 
            className="text-sm font-semibold text-gray-800 mb-3"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            (Please Check One):
          </p>
          <div className="flex gap-6">
            <FormField
              control={form.control}
              name="ispType"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value === 'initial'}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 'initial' : 'update');
                      }}
                    />
                  </FormControl>
                  <FormLabel 
                    className="text-sm font-normal cursor-pointer text-gray-700"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Initial ISP
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ispType"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value === 'update'}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 'update' : 'initial');
                      }}
                    />
                  </FormControl>
                  <FormLabel 
                    className="text-sm font-normal cursor-pointer text-gray-700"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    ISP Update
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="participantName"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Name
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
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Date of Birth
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

          <FormField
            control={form.control}
            name="contactInformation"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Contact Information
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(Phone) | (Email)"
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
            name="dateOfISP"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Date of ISP
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

      {/* Goals and Objectives */}
      <div className="space-y-6">
        <h2 
          className="text-lg font-bold text-gray-800 mb-4"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          Goals and Objectives
        </h2>

        {/* Goal 1 */}
        <div className="space-y-3 pb-4 border-b border-gray-200">
          <FormField
            control={form.control}
            name="goal1"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-bold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Goal 1:
                </FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter goal 1"
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="ml-4 space-y-2">
            <FormField
              control={form.control}
              name="objective1_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Objective 1.1:
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter objective 1.1"
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-16"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objective1_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Objective 1.2:
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter objective 1.2"
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-16"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Goal 2 */}
        <div className="space-y-3 pb-4 border-b border-gray-200">
          <FormField
            control={form.control}
            name="goal2"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-bold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Goal 2:
                </FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter goal 2"
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="ml-4 space-y-2">
            <FormField
              control={form.control}
              name="objective2_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Objective 2.1:
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter objective 2.1"
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-16"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objective2_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Objective 2.2:
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter objective 2.2"
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-16"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Goal 3 */}
        <div className="space-y-3 pb-4 border-b border-gray-200">
          <FormField
            control={form.control}
            name="goal3"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-bold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Goal 3:
                </FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter goal 3"
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="ml-4 space-y-2">
            <FormField
              control={form.control}
              name="objective3_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Objective 3.1:
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter objective 3.1"
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-16"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objective3_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Objective 3.2:
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter objective 3.2"
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-16"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Goal 4 */}
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="goal4"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-bold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Goal 4:
                </FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter goal 4"
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="ml-4 space-y-2">
            <FormField
              control={form.control}
              name="objective4_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Objective 4.1:
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter objective 4.1"
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-16"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objective4_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Objective 4.2:
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter objective 4.2"
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-16"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objective4_3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Objective 4.3:
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter objective 4.3"
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-16"
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
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Strengths and Resources */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h2 
          className="text-lg font-bold text-gray-800 mb-4"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          Strengths and Resources
        </h2>
        
        <FormField
          control={form.control}
          name="participantStrengths"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Participant Strengths:
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="List participant strengths (e.g., Strong interpersonal skills, lived experience, interest in helping others)"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supportNetwork"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Support Network:
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="List support network (e.g., Family members, Peer mentors, Recovery Peer team)"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="communityResources"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Community Resources:
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="List community resources (e.g., Local organizations, health workers, outreach teams)"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Activities and Interventions */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h2 
          className="text-lg font-bold text-gray-800 mb-4"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          Activities and Interventions
        </h2>
        
        <FormField
          control={form.control}
          name="activity1"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Activity 1:
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter activity 1 (e.g., Weekly participation in peer-led sessions)"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activity2"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Activity 2:
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter activity 2 (e.g., Monthly goal-setting and reflection meetings)"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Monitoring and Evaluation */}
      <div className="space-y-4">
        <h2 
          className="text-lg font-bold text-gray-800 mb-4"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          Monitoring and Evaluation
        </h2>
        
        <FormField
          control={form.control}
          name="methodOfMonitoring"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Method of Monitoring:
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter monitoring methods (e.g., Recovery Peer progress notes, participant self-assessments, monthly collaborative reviews)"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequencyOfMonitoring"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Frequency of Monitoring:
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., Weekly check-ins and monthly formal reviews"
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
          name="criteriaForSuccess"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Criteria for Success:
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter success criteria (e.g., Consistent participation, reduction in use, improved emotional regulation)"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Signatures */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h2 
          className="text-lg font-bold text-gray-800 mb-4"
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
              name="recoveryPeerSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    className="text-sm font-semibold text-gray-800"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Recovery Peer Signature
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
              name="recoveryPeerSignatureDate"
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

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="crsSupervisorSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  CRS Supervisor Signature
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
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="crsSupervisorSignatureDate"
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

      {/* Review Dates */}
      <div className="space-y-4">
        <h2 
          className="text-lg font-bold text-gray-800 mb-4"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          Review Dates
        </h2>
        
        <FormField
          control={form.control}
          name="nextReviewDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Next Review Date:
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
  );

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
            {renderProgressIndicator()}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center gap-2"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Previous</span>
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-2 rounded-lg shadow-md"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      <span className="text-sm font-medium">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-2 rounded-lg shadow-md"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm font-medium">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-medium">Submit</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};


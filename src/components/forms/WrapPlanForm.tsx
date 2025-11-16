import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

const formSchema = z.object({
  // Daily Maintenance Plan
  dailyMaintenancePlan: z.string().trim().max(5000).optional(),
  
  // Triggers & Action Plan
  triggersActionPlan: z.string().trim().max(5000).optional(),
  
  // Early Warning Signs & Action Plan
  earlyWarningSignsActionPlan: z.string().trim().max(5000).optional(),
  
  // When Things Are Breaking Down & Action Plan
  breakingDownActionPlan: z.string().trim().max(5000).optional(),
  
  // Crisis Plan
  crisisPlan: z.string().trim().max(5000).optional(),
  
  // Post Crisis Plan
  postCrisisPlan: z.string().trim().max(5000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Traffic Light sections configuration
const wrapSections = [
  {
    id: 'dailyMaintenancePlan',
    title: 'Daily Maintenance Plan',
    color: 'bg-green-600',
    borderColor: 'border-green-700',
    textColor: 'text-white',
    description: 'Me Well',
  },
  {
    id: 'triggersActionPlan',
    title: 'Triggers & Action Plan',
    color: 'bg-white',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-800',
    description: '',
  },
  {
    id: 'earlyWarningSignsActionPlan',
    title: 'Early Warning Signs & Action Plan',
    color: 'bg-yellow-400',
    borderColor: 'border-yellow-600',
    textColor: 'text-gray-800',
    description: '',
  },
  {
    id: 'breakingDownActionPlan',
    title: 'When Things Are Breaking Down & Action Plan',
    color: 'bg-orange-500',
    borderColor: 'border-orange-700',
    textColor: 'text-white',
    description: '',
  },
  {
    id: 'crisisPlan',
    title: 'Crisis Plan',
    color: 'bg-red-600',
    borderColor: 'border-red-700',
    textColor: 'text-white',
    description: '',
  },
  {
    id: 'postCrisisPlan',
    title: 'Post Crisis Plan',
    color: 'bg-green-300',
    borderColor: 'border-green-500',
    textColor: 'text-gray-800',
    description: '',
  },
];

export const WrapPlanForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log('WRAP Plan form submitted with data:', data);
      
      const response = await api.submitWrapPlan(data);
      
      if (response.success) {
        toast.success('WRAP Plan submitted successfully!', {
          description: `Your WRAP plan has been saved. Reference ID: ${response.data?.wrapPlanId || 'N/A'}`,
          duration: 3000,
        });
        
        // Reset form after successful submission
        form.reset();
      } else {
        throw new Error(response.message || 'Failed to submit WRAP Plan');
      }
    } catch (error: any) {
      console.error('Error submitting WRAP Plan:', error);
      const errorMessage = error?.message || error?.error || 'Please check your connection and try again.';
      toast.error('Failed to submit WRAP Plan', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="mb-8">
              <h1 
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center uppercase"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Wellness Recovery Action Plan (WRAP)
              </h1>
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <h2 
                  className="text-xl font-bold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Traffic Light
                </h2>
                <div className="max-w-md">
                  <p 
                    className="text-sm text-gray-700 leading-relaxed"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    WRAP is a mental health recovery education curriculum authored by Mary Ellen Copeland. This 'Traffic Light' handout was created as a visual illustration of Action Planning during different stages of health. Please visit{' '}
                    <a 
                      href="https://www.mentalhealthrecovery.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      www.mentalhealthrecovery.com
                    </a>
                    {' '}to learn more about WRAP.
                  </p>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Traffic Light Sections */}
                {wrapSections.map((section, index) => (
                  <div 
                    key={section.id}
                    className="flex gap-6 pb-6 border-b border-gray-200 last:border-b-0"
                  >
                    {/* Visual Indicator - Colored Circle */}
                    <div className="flex-shrink-0 pt-1">
                      <div
                        className={`w-28 h-28 rounded-full ${section.color} ${section.borderColor} border-2 flex items-center justify-center shadow-md relative`}
                        style={{
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          borderWidth: section.id === 'dailyMaintenancePlan' ? '3px' : '2px',
                          minWidth: '112px',
                          minHeight: '112px'
                        }}
                      >
                        {section.id === 'dailyMaintenancePlan' ? (
                          <div 
                            className={`${section.textColor} font-bold text-sm leading-tight`}
                            style={{ 
                              fontFamily: 'Arial, Helvetica, sans-serif',
                              writingMode: 'vertical-rl',
                              textOrientation: 'upright',
                              letterSpacing: '0.1em'
                            }}
                          >
                            Me Well
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Plan Title & Text Area */}
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={section.id as keyof FormValues}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-base font-bold text-gray-800 mb-3 block"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              {section.title}:
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Click or tap here to enter text"
                                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-36 text-sm"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                {/* Footer Statement */}
                <div className="pt-6 border-t border-gray-200">
                  <p 
                    className="text-center text-base font-semibold text-gray-800"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    The goal of Action Plans is to get back to 'Me Well'
                  </p>
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
                      <span className="text-sm font-medium">Submit WRAP Plan</span>
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


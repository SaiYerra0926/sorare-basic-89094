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
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { SignaturePad } from '@/components/ui/signature-pad';

const formSchema = z.object({
  // Participant and Referral Information
  participantName: z.string().trim().min(1, 'Participant name is required').max(100),
  dateOfReferral: z.string().min(1, 'Date of referral is required'),
  primaryDiagnosis: z.string().trim().max(500).optional(),
  dischargeFromServices: z.array(z.string()).min(1, 'Select at least one service'),
  
  // Admission and Discharge Information
  maNumber: z.string().trim().max(50).optional(),
  dateOfAdmission: z.string().min(1, 'Date of admission is required'),
  dateOfDischarge: z.string().min(1, 'Date of discharge is required'),
  
  // Discharge Summary
  cpsCrsProgramHoursCompleted: z.string().trim().max(200).optional(),
  dateLetterSent: z.string().optional(),
  natureOfDischargeCriteria: z.array(z.string()).min(1, 'Select at least one discharge criteria'),
  
  // Reason for discharge
  reasonForDischarge: z.string().trim().max(5000).optional(),
  
  // Referrals
  referrals: z.string().trim().max(5000).optional(),
  
  // After Care Plan
  afterCarePlan: z.string().trim().max(5000).optional(),
  
  // Staff Signature
  staffSignature: z.string().optional(),
  staffCredential: z.string().trim().max(200).optional(),
  staffSignatureDate: z.string().min(1, 'Staff signature date is required'),
});

type FormValues = z.infer<typeof formSchema>;

// Discharge from services options
const dischargeFromServicesOptions = [
  { value: 'willstan-housing', label: 'WillSTAN Housing' },
  { value: 'rsw', label: 'RSW' },
  { value: 'both-services', label: 'Both Services' },
];

// Nature of discharge criteria options
const natureOfDischargeCriteriaOptions = [
  { value: 'successfully-completed', label: 'Successfully Completed' },
  { value: 'agrees-to-discontinue', label: 'Agrees to Discontinue' },
  { value: 'no-longer-benefits', label: 'No longer benefits from the service(s)' },
  { value: 'violation-of-program', label: 'Violation of the program(s)' },
];

// Discharge Care Coordination Resources
const dischargeCareCoordinationResources = [
  'Resolve Crisis Services (888) 796-8226',
  '24/7 Crisis Text Line: Text "HOME" to 741741',
  '24/7 National Suicide Prevention Lifeline, 988',
  'Behavioral Therapy: Consult Health Care Provider and/or Treatment Provider',
];

export const DischargeSummaryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dischargeFromServices: [],
      natureOfDischargeCriteria: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Discharge Summary form submitted with data:', data);
      
      const response = await api.submitDischargeSummary(data);
      
      if (response.success) {
        toast.success('Discharge Summary submitted successfully!', {
          description: `Your discharge summary has been saved. Reference ID: ${response.data?.dischargeId || 'N/A'}`,
          duration: 3000,
        });
        
        // Reset form after successful submission
        form.reset();
        form.setValue('dischargeFromServices', []);
        form.setValue('natureOfDischargeCriteria', []);
      } else {
        throw new Error(response.message || 'Failed to submit Discharge Summary');
      }
    } catch (error: any) {
      console.error('Error submitting Discharge Summary:', error);
      const errorMessage = error?.message || error?.error || 'Please check your connection and try again.';
      toast.error('Failed to submit Discharge Summary', {
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
            <div className="mb-8 text-center">
              <h1 
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 uppercase"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Discharge Summary Form
              </h1>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Participant and Referral Information */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Participant and Referral Information
                  </h2>
                  
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
                            Participant's Name
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Click or tap here to enter text"
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
                      name="dateOfReferral"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Date of Referral
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              {...field} 
                              placeholder="Click or tap to enter a date"
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
                      name="primaryDiagnosis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Primary Diagnosis
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Click or tap here to enter text"
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
                      name="dischargeFromServices"
                      render={() => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800 mb-2"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Discharge from the following service(s):
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              {dischargeFromServicesOptions.map((option) => (
                                <FormField
                                  key={option.value}
                                  control={form.control}
                                  name="dischargeFromServices"
                                  render={({ field }) => {
                                    const isChecked = Array.isArray(field.value) && field.value.includes(option.value);
                                    return (
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={(checked) => {
                                              const currentValue = Array.isArray(field.value) ? field.value : [];
                                              if (checked) {
                                                field.onChange([...currentValue, option.value]);
                                              } else {
                                                field.onChange(currentValue.filter((v) => v !== option.value));
                                              }
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel 
                                          className="text-sm font-normal cursor-pointer text-gray-700"
                                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                        >
                                          {option.label}
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
                  </div>
                </div>

                {/* Admission and Discharge Information */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Admission and Discharge Information
                  </h2>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="maNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            MA#
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Click or tap here to enter text"
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
                      name="dateOfAdmission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Date of Admission
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              {...field} 
                              placeholder="Click or tap to enter a date"
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
                      name="dateOfDischarge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Date of Discharge
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              {...field} 
                              placeholder="Click or tap to enter a date"
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

                {/* Discharge Summary Section */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Discharge Summary
                  </h2>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="cpsCrsProgramHoursCompleted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            CPS/CRS Program hours completed
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Click or tap here to enter text"
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
                      name="dateLetterSent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Date Letter Sent <span className="text-gray-500 font-normal">(If Applicable)</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              {...field} 
                              placeholder="Click or tap to enter a date"
                              className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="natureOfDischargeCriteria"
                    render={() => (
                      <FormItem>
                        <FormLabel 
                          className="text-sm font-semibold text-gray-800 mb-2"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Nature of Discharge Criteria
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {natureOfDischargeCriteriaOptions.map((option) => (
                              <FormField
                                key={option.value}
                                control={form.control}
                                name="natureOfDischargeCriteria"
                                render={({ field }) => {
                                  const isChecked = Array.isArray(field.value) && field.value.includes(option.value);
                                  return (
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={isChecked}
                                          onCheckedChange={(checked) => {
                                            const currentValue = Array.isArray(field.value) ? field.value : [];
                                            if (checked) {
                                              field.onChange([...currentValue, option.value]);
                                            } else {
                                              field.onChange(currentValue.filter((v) => v !== option.value));
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel 
                                        className="text-sm font-normal cursor-pointer text-gray-700"
                                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                      >
                                        {option.label}
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
                </div>

                {/* Reason for discharge */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <FormField
                    control={form.control}
                    name="reasonForDischarge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel 
                          className="text-sm font-semibold text-gray-800"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Reason for discharge, progress, symptoms, and behaviors:
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Click or tap here to enter text"
                            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-32"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Referrals */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <FormField
                    control={form.control}
                    name="referrals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel 
                          className="text-sm font-semibold text-gray-800"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Referrals:
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Click or tap here to enter text"
                            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-32"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* After Care Plan */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <FormField
                    control={form.control}
                    name="afterCarePlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel 
                          className="text-sm font-semibold text-gray-800"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          After Care Plan:
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Click or tap here to enter text"
                            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-32"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Discharge Care Coordination Resources */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Discharge Care Coordination Resources:
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <ul className="space-y-2 list-disc list-inside">
                      {dischargeCareCoordinationResources.map((resource, index) => (
                        <li 
                          key={index}
                          className="text-sm text-gray-700"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Staff Signature Section */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Staff Signature
                  </h2>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="staffSignature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Staff Signature/Credential
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

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="staffCredential"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Staff Credential
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Enter credential"
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
                                placeholder="Click or tap to enter a date"
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
                      <span className="text-sm font-medium">Submit Discharge Summary</span>
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


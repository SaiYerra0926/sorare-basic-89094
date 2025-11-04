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
import { api } from '@/lib/api';
import { SignaturePad } from '@/components/ui/signature-pad';

const formSchema = z.object({
  referralDate: z.string().min(1, 'Referral date is required'),
  services: z.array(z.string()).min(1, 'Select at least one service'),
  name: z.string().trim().min(1, 'Name is required').max(100),
  pronouns: z.string().trim().max(50).optional(),
  legalName: z.string().trim().max(100).optional(),
  birthDate: z.string().min(1, 'Birth date is required'),
  isHomeless: z.boolean().default(false),
  address: z.string().trim().max(200).optional(),
  cityStateZip: z.string().trim().max(100).optional(),
  homePhone: z.string().trim().max(20).optional(),
  cellPhone: z.string().trim().max(20).optional(),
  ssn: z.string().trim().max(11).optional(),
  email: z.string().trim().email('Invalid email').max(255).optional().or(z.literal('')),
  medicalAssistanceId: z.string().trim().max(50).optional(),
  medicalAssistanceProvider: z.string().trim().max(100).optional(),
  gender: z.array(z.string()).min(1, 'Select at least one gender'),
  genderOther: z.string().trim().max(100).optional(),
  race: z.array(z.string()).min(1, 'Select at least one race'),
  raceOther: z.string().trim().max(100).optional(),
  isPregnant: z.string().max(500).optional(),
  drugOfChoice: z.string().trim().max(200).optional(),
  lastDateOfUse: z.string().optional(),
  mentalHealthConditions: z.string().trim().max(500).optional(),
  diagnosis: z.string().trim().max(500).optional(),
  medicalConditions: z.string().trim().max(500).optional(),
  allergies: z.string().trim().max(500).optional(),
  physicalLimitations: z.string().trim().max(500).optional(),
  medications: z.string().trim().max(500).optional(),
  tobaccoUser: z.string().optional(),
  criminalOffenses: z.string().trim().max(500).optional(),
  probationParole: z.string().trim().max(500).optional(),
  priorityPopulations: z.array(z.string()),
  emergencyContactName: z.string().trim().max(100).optional(),
  emergencyContactRelationship: z.string().trim().max(50).optional(),
  emergencyContactPhone: z.string().trim().max(20).optional(),
  emergencyContactAddress: z.string().trim().max(200).optional(),
  emergencyContactCityStateZip: z.string().trim().max(100).optional(),
  emergencyContactCellPhone: z.string().trim().max(20).optional(),
  referredByName: z.string().trim().min(1, 'Referrer name is required').max(100),
  referredByTitle: z.string().trim().max(100).optional(),
  referredByAgency: z.string().trim().max(200).optional(),
  referredByPhone: z.string().trim().max(20).optional(),
  referredBySignature: z.string().trim().max(200).optional(),
  referredByEmail: z.string().trim().email('Invalid email').max(255).optional().or(z.literal('')),
  applicantSignature: z.string().optional(), // Can be base64 image or text
  applicantSignatureDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const RecoveryReferralForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralDate: new Date().toISOString().split('T')[0],
      services: [],
      isHomeless: false,
      priorityPopulations: [],
      gender: [],
      race: [],
      tobaccoUser: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Form submitted with data:', data);
      
      // Convert gender and race arrays to single values for backend compatibility
      const submissionData = {
        ...data,
        services: Array.isArray(data.services) ? data.services : [],
        gender: Array.isArray(data.gender) && data.gender.length > 0 ? data.gender[0] : '',
        race: Array.isArray(data.race) && data.race.length > 0 ? data.race[0] : '',
      };
      
      const response = await api.submitReferral(submissionData);
      
      if (response.success) {
        toast.success('Referral submitted successfully!', {
          description: `Your referral has been saved. Reference ID: ${response.data?.referralId || 'N/A'}`,
          duration: 3000,
        });
        
        setTimeout(() => {
          window.location.href = '/referrals';
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to submit referral');
      }
    } catch (error: any) {
      console.error('Error submitting referral:', error);
      const errorMessage = error?.message || error?.error || 'Please check your connection and try again.';
      toast.error('Failed to submit referral', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { id: 'pregnant', label: 'Pregnant User' },
    { id: 'iv', label: 'IV User' },
    { id: 'overdose', label: 'Overdose Survivor' },
    { id: 'veteran', label: 'Veteran' },
    { id: 'mat', label: 'MAT (Medication Assisted Treatment)' },
    { id: 'parent', label: 'Parent/Caretaker with Child <1' },
    { id: 'not-applicable', label: 'NOT APPLICABLE' },
  ];

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['referralDate', 'services', 'name', 'birthDate', 'gender', 'race'];
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
      { number: 1, label: 'Personal Information' },
      { number: 2, label: 'Screening & Medical' },
      { number: 3, label: 'Contact & Signature' },
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
      {/* Header Section: Date of Referral and Services */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-800 mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            REQUIRED
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            Please Check All That Apply:
          </p>
          <FormField
            control={form.control}
            name="services"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes('assessment')}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), 'assessment']
                                  : field.value?.filter((v) => v !== 'assessment') || [];
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel 
                            className="text-sm font-normal cursor-pointer text-gray-700"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            D/A Level of Care Assessment
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes('case')}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), 'case']
                                  : field.value?.filter((v) => v !== 'case') || [];
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel 
                            className="text-sm font-normal cursor-pointer text-gray-700"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Case Management/Resource Coordination
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes('support')}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), 'support']
                                  : field.value?.filter((v) => v !== 'support') || [];
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel 
                            className="text-sm font-normal cursor-pointer text-gray-700"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Certified Recovery Support
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="md:w-48">
          <FormField
            control={form.control}
            name="referralDate"
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

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Personal Information
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
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
            name="pronouns"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Pronoun(s)
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="(Example. She/her, he/him, etc.)"
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-bold text-gray-800 mb-3" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            Legal Information
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="legalName"
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
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    className="text-sm font-semibold text-gray-800"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Birth Date
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

        <FormField
          control={form.control}
          name="isHomeless"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel 
                className="text-sm font-normal cursor-pointer text-gray-700"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Check Here If Homeless or at risk of homelessness.
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Address
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
            name="cityStateZip"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  City, State, Zip
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
            name="homePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Home Phone
                </FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
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
            name="cellPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Cell Phone
                </FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
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
            name="ssn"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  SSN
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Email
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
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
            name="medicalAssistanceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Medical Assistance ID
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
            name="medicalAssistanceProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Medical Assistance Provider
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

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="gender"
            render={() => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Gender
                </FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Male', 'Female', 'Transfeminine', 'Transmasculine', 'Nonbinary', 'Other'].map((option) => (
                      <FormField
                        key={option}
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.toLowerCase())}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), option.toLowerCase()]
                                    : field.value?.filter((v) => v !== option.toLowerCase()) || [];
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel 
                              className="text-sm font-normal cursor-pointer text-gray-700"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              {option}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormControl>
                {form.watch('gender')?.includes('other') && (
                  <FormField
                    control={form.control}
                    name="genderOther"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormControl>
                          <Input 
                            placeholder="Other" 
                            {...field} 
                            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="race"
            render={() => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Race
                </FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['African American', 'White', 'Asian', 'Hispanic/Latino', 'American Indian', 'Interracial', 'Other'].map((option) => (
                      <FormField
                        key={option}
                        control={form.control}
                        name="race"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.toLowerCase().replace('/', '-'))}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), option.toLowerCase().replace('/', '-')]
                                    : field.value?.filter((v) => v !== option.toLowerCase().replace('/', '-')) || [];
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel 
                              className="text-sm font-normal cursor-pointer text-gray-700"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              {option}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormControl>
                {form.watch('race')?.includes('other') && (
                  <FormField
                    control={form.control}
                    name="raceOther"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormControl>
                          <Input 
                            placeholder="Other" 
                            {...field} 
                            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Screening Questions
      </h3>

      <FormField
        control={form.control}
        name="isPregnant"
        render={({ field }) => (
          <FormItem>
            <FormLabel 
              className="text-sm font-semibold text-gray-800"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              1. Is the participant pregnant or is there a possibility of pregnancy? If yes, how far along?
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="drugOfChoice"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                2. Drug of Choice History
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
          name="lastDateOfUse"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Last Date of Use
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

      <FormField
        control={form.control}
        name="mentalHealthConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel 
              className="text-sm font-semibold text-gray-800"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              3. Mental Health conditions
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="diagnosis"
        render={({ field }) => (
          <FormItem>
            <FormLabel 
              className="text-sm font-semibold text-gray-800"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              4. Diagnosis?
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="medicalConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel 
              className="text-sm font-semibold text-gray-800"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              5. Medical conditions
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel 
              className="text-sm font-semibold text-gray-800"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              6. Allergies Y/N (Explain)
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="physicalLimitations"
        render={({ field }) => (
          <FormItem>
            <FormLabel 
              className="text-sm font-semibold text-gray-800"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              7. Physical Limitation/Disabling Condition(s)
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="medications"
        render={({ field }) => (
          <FormItem>
            <FormLabel 
              className="text-sm font-semibold text-gray-800"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              8. Medications/prescriber
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tobaccoUser"
        render={({ field }) => (
          <FormItem>
            <FormLabel 
              className="text-sm font-semibold text-gray-800"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              9. Tobacco User Y/N
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
        name="criminalOffenses"
        render={({ field }) => (
          <FormItem>
            <FormLabel 
              className="text-sm font-semibold text-gray-800"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              10. Current Criminal Offenses, PFA, etc. Y/N (If so, please explain)
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="probationParole"
        render={({ field }) => (
          <FormItem>
            <FormLabel 
              className="text-sm font-semibold text-gray-800"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              Probation/Parole Y/N (If so, Probation Officers Name and Contact)
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <FormField
          control={form.control}
          name="priorityPopulations"
          render={() => (
            <FormItem>
              <FormLabel 
                className="text-sm font-bold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Priority/Special Initiatives Population (Check All That Apply)
              </FormLabel>
              <FormControl>
                <div className="grid gap-3 md:grid-cols-2 mt-4">
                  {priorityOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="priorityPopulations"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), option.id]
                                  : field.value?.filter((v) => v !== option.id) || [];
                                field.onChange(newValue);
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
                      )}
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
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Family/Community Supports
        </h3>
        <p className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          EMERGENCY CONTACT
        </p>
        <p className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Family member, guardian, or significant other to be notified in case of emergency:
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="emergencyContactName"
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
            name="emergencyContactRelationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Relationship
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
            name="emergencyContactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Phone
                </FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
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
            name="emergencyContactAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Address
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
            name="emergencyContactCityStateZip"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  City, State, Zip
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
            name="emergencyContactCellPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Cell Phone
                </FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
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

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          REFERRED BY
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="referredByName"
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
            name="referredByTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Title
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
            name="referredByAgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Agency
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
            name="referredByPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Phone
                </FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
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
            name="referredBySignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Signature
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
            name="referredByEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Email
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
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

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          APPLICANT'S SIGNATURE (If Applicable)
        </h3>
        <p className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          My signature indicates that this referral has been discussed with me and I am interested in services.
        </p>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="applicantSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel 
                  className="text-sm font-semibold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Applicant's Signature
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

          <div className="max-w-xs">
            <FormField
              control={form.control}
              name="applicantSignatureDate"
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

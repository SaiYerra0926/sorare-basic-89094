import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';
import worxLogo from '@/assets/worx-logo.png';
import { api } from '@/lib/api';

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
  gender: z.string().min(1, 'Gender is required'),
  genderOther: z.string().trim().max(100).optional(),
  race: z.string().min(1, 'Race is required'),
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
  applicantSignature: z.string().trim().max(200).optional(),
  applicantSignatureDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const RecoveryReferralForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralDate: new Date().toISOString().split('T')[0],
      services: [],
      isHomeless: false,
      priorityPopulations: [],
      tobaccoUser: 'N',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Form submitted with data:', data);
      
      // Ensure services is an array
      const submissionData = {
        ...data,
        services: Array.isArray(data.services) ? data.services : [],
      };
      
      const response = await api.submitReferral(submissionData);
      
      if (response.success) {
        toast.success('Referral submitted successfully!', {
          description: `Your referral has been saved. Reference ID: ${response.data?.referralId || 'N/A'}`,
          duration: 3000,
        });
        
        // Wait a moment to show the success message, then navigate to fresh form
        setTimeout(() => {
          // Navigate to a fresh referral form page
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

  return (
    <div className="relative w-full min-h-screen">
      <Card className="relative shadow-xl border-primary/20 bg-background/98 backdrop-blur-sm">
        {/* Watermark Background - The Worx Text */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div
              key={i}
              className="absolute text-slate-300 dark:text-slate-600 font-black"
              style={{
                fontSize: '180px',
                top: `${(i * 35) % 100}%`,
                left: `${(i * 28 - 15) % 100}%`,
                transform: 'rotate(-45deg)',
                whiteSpace: 'nowrap',
                letterSpacing: '50px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1',
                opacity: 0.12,
              }}
            >
              THE WORX
            </div>
          ))}
        </div>
        
        <CardContent className="relative z-10 p-8 md:p-12 lg:p-16">
          {/* Form Header */}
          <div className="mb-10 border-b-2 border-primary/30 pb-8">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-6">
              {/* Left Logo - "The WORX!" with golden yellow gradient */}
              <div className="flex-shrink-0">
                <div className="border-4 border-blue-900 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 px-5 py-3 flex items-center gap-3 shadow-xl">
                  <div className="flex flex-col">
                    <span className="text-black text-sm font-serif italic leading-none" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>The</span>
                    <span className="text-yellow-800 text-2xl md:text-3xl font-bold uppercase tracking-wider leading-tight mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>WORX!</span>
                  </div>
                  <div className="border-2 border-yellow-400 bg-blue-900 p-2.5 flex items-center justify-center flex-shrink-0">
                    <img src={worxLogo} alt="The WORX Logo" className="h-8 w-auto" style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(15deg)' }} />
                  </div>
                </div>
              </div>
              
              {/* Main Title - Centered */}
              <div className="flex-1 text-center px-4">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground uppercase tracking-tight leading-tight">
                  Recovery Support Worx<br />
                  <span className="text-lg md:text-xl lg:text-2xl">Referral for Services</span>
                </h1>
              </div>
              
              {/* Right Logo - "rSw recovery Support worx" with black background */}
              <div className="flex-shrink-0 bg-black dark:bg-black p-4 rounded-lg min-w-[130px] text-center border-2 border-gray-800">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="text-4xl font-bold leading-none" style={{ letterSpacing: '-3px', fontFamily: 'sans-serif' }}>
                    <span className="text-blue-400 inline-block" style={{ marginRight: '-4px' }}>r</span>
                    <span className="text-green-500 inline-block" style={{ marginRight: '-4px' }}>S</span>
                    <span className="text-blue-400 inline-block">w</span>
                  </div>
                  <img src={worxLogo} alt="The WORX Logo" className="h-8 w-auto" />
                </div>
                <p className="text-xs text-white lowercase leading-tight font-normal" style={{ fontFamily: 'sans-serif' }}>recovery Support worx</p>
              </div>
            </div>
            
            {/* DIRECTIONS Section */}
            <div className="bg-muted/40 p-5 rounded-lg border-2 border-border shadow-sm mb-6">
              <p className="text-sm font-bold text-foreground mb-2 uppercase">DIRECTIONS:</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Please return completed form to The Worx! located at <strong>300 Catherine Street, 1st Floor McKees Rocks, PA 15136</strong>. You may also{' '}
                <a href="mailto:info@theworx.us" className="text-primary hover:underline font-semibold">
                  Email this form to info@theworx.us
                </a>.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              {/* REQUIRED Section */}
              <div className="space-y-6 bg-yellow-50/20 dark:bg-yellow-900/10 p-6 md:p-8 rounded-xl border-2 border-yellow-300/30 shadow-md">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-foreground uppercase bg-yellow-200/50 dark:bg-yellow-800/30 py-2 px-6 rounded-lg inline-block">
                    Required
                  </h2>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 mb-6">
                  <FormField
                    control={form.control}
                    name="referralDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-foreground">Date of Referral:</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="font-medium border-2 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="services"
                  render={() => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground bg-yellow-200/50 dark:bg-yellow-800/30 py-2 px-6 rounded-lg inline-block mb-4">
                        Please Check All That Apply:
                      </FormLabel>
                      <div className="space-y-3 mt-4">
                        <FormField
                          control={form.control}
                          name="services"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 bg-card p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('assessment')}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, 'assessment']
                                      : field.value?.filter((v) => v !== 'assessment');
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer text-foreground text-base">
                                D/A Level of Care Assessment
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="services"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 bg-card p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('case')}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, 'case']
                                      : field.value?.filter((v) => v !== 'case');
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer text-foreground text-base">
                                Case Management/Resource Coordination
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="services"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 bg-card p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('support')}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, 'support']
                                      : field.value?.filter((v) => v !== 'support');
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer text-foreground text-base">
                                Certified Recovery Support
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Legal Information Section */}
              <div className="space-y-6 bg-card/50 p-6 md:p-8 rounded-xl border-2 border-border shadow-sm">
                <h2 className="text-xl font-bold text-foreground uppercase border-b-2 border-primary/30 pb-3">
                  Legal Information
                </h2>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Name:</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">Pronoun(s):</FormLabel>
                        <FormControl>
                          <Input placeholder="Example. She/her, he/him, etc." {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          (Example. She/her, he/him, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="legalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Legal Information Name:</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">Birth Date:</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isHomeless"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 md:col-span-2 bg-yellow-50/30 dark:bg-yellow-900/20 p-4 rounded-lg border-2 border-yellow-300/40 shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-2 size-5"
                          />
                        </FormControl>
                        <FormLabel className="font-medium cursor-pointer text-foreground">
                          Check Here If Homeless or at risk of homelessness.
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Address:</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                      <FormLabel className="font-semibold">City, State, Zip:</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="homePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Home Phone:</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">Cell Phone:</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">SSN:</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">Email:</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">Medical Assistance ID:</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">Medical Assistance Provider:</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Demographic Information */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Gender:</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="male" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Male</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="female" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Female</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="transfeminine" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Transfeminine</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="transmasculine" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Transmasculine</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="nonbinary" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Nonbinary</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Other:</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        {form.watch('gender') === 'other' && (
                          <FormField
                            control={form.control}
                            name="genderOther"
                            render={({ field }) => (
                              <FormItem className="mt-3">
                                <FormControl>
                                  <Input placeholder="Please specify" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Race:</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="african-american" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">African American</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="white" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">White</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="asian" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Asian</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="hispanic" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Hispanic/Latino</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="american-indian" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">American Indian</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="interracial" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Interracial</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Other:</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        {form.watch('race') === 'other' && (
                          <FormField
                            control={form.control}
                            name="raceOther"
                            render={({ field }) => (
                              <FormItem className="mt-3">
                                <FormControl>
                                  <Input placeholder="Please specify" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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

              {/* Screening Questions Section */}
              <div className="space-y-6 bg-card/50 p-6 md:p-8 rounded-xl border-2 border-border shadow-sm">
                <h2 className="text-xl font-bold text-foreground uppercase border-b-2 border-primary/30 pb-3">
                  Screening Questions
                </h2>
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="isPregnant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">1. Is the participant pregnant or is there a possibility of pregnancy? If yes, how far along?</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-20 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="drugOfChoice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">2. Drug of Choice History:</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-20 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" {...field} />
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
                          <FormLabel className="font-semibold">Last Date of Use:</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">3. Mental Health conditions:</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-20 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" {...field} />
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
                        <FormLabel className="font-semibold">4. Diagnosis?</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-20 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" {...field} />
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
                        <FormLabel className="font-semibold">5. Medical conditions:</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-20 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" {...field} />
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
                        <FormLabel className="font-semibold">6. Allergies Y/N (Explain):</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-20 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" {...field} />
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
                        <FormLabel className="font-semibold">7. Physical Limitation/Disabling Condition(s):</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-20 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" {...field} />
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
                        <FormLabel className="font-semibold">8. Medications/prescriber:</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-20 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" {...field} />
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
                        <FormLabel className="font-semibold">9. Tobacco User Y/N:</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Y" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="N" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="criminalOffenses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">10. Current Criminal Offenses, PFA, etc. Y/N (If so, please explain):</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-20 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" {...field} />
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
                          <FormLabel className="font-semibold">Probation/Parole Y/N (If so, Probation Officers Name and Contact):</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-20 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Priority/Special Initiatives Population Section */}
              <div className="space-y-4 bg-card/50 p-6 md:p-8 rounded-xl border-2 border-border shadow-sm">
                <h2 className="text-xl font-bold text-foreground uppercase border-b-2 border-primary/30 pb-3">
                  Priority/Special Initiatives Population (Check All That Apply):
                </h2>
                <FormField
                  control={form.control}
                  name="priorityPopulations"
                  render={() => (
                    <FormItem>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mt-4">
                        {priorityOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="priorityPopulations"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3 space-y-0 bg-card p-3 rounded-lg border border-border">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...field.value, option.id]
                                        : field.value?.filter((v) => v !== option.id);
                                      field.onChange(newValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-foreground">{option.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Family/Community Supports Section */}
              <div className="space-y-4 bg-card/50 p-6 md:p-8 rounded-xl border-2 border-border shadow-sm">
                <h2 className="text-xl font-bold text-foreground uppercase border-b-2 border-primary/30 pb-3">
                  Family/Community Supports:
                </h2>
                <div className="bg-card p-6 rounded-lg border-2 border-primary/20 shadow-md">
                  <p className="font-bold text-foreground mb-6">
                    EMERGENCY CONTACT Family member, guardian, or significant other to be notified in case of emergency:
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Name:</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                          <FormLabel className="font-semibold">Relationship:</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                          <FormLabel className="font-semibold">Phone:</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                          <FormLabel className="font-semibold">Cell Phone:</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="emergencyContactAddress"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="font-semibold">Address:</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="emergencyContactCityStateZip"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="font-semibold">City, State, Zip:</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* REFERRED BY Section */}
              <div className="space-y-4 bg-card/50 p-6 md:p-8 rounded-xl border-2 border-border shadow-sm">
                <h2 className="text-xl font-bold text-foreground uppercase border-b-2 border-primary/30 pb-3">
                  Referred By (Please print):
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="referredByName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Name:</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">Title:</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">Agency:</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">Phone:</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">Signature:</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
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
                        <FormLabel className="font-semibold">Email:</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* APPLICANT'S SIGNATURE Section */}
              <div className="space-y-4 bg-card/50 p-6 md:p-8 rounded-xl border-2 border-border shadow-sm">
                <h2 className="text-xl font-bold text-foreground uppercase border-b-2 border-primary/30 pb-3">
                  Applicant's Signature (If Applicable):
                </h2>
                <p className="text-sm text-muted-foreground italic bg-muted/40 p-4 rounded-lg border-2 border-border">
                  My signature indicates that this referral has been discussed with me and I am interested in services.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="applicantSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Applicant's Signature:</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="applicantSignatureDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Date:</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center border-t-2 border-primary/30 pt-6 mt-10">
                <p className="text-sm text-muted-foreground">Updated 2025</p>
                <p className="text-sm font-semibold text-foreground">RSW Referral Form</p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()} className="min-w-32">
                  Clear Form
                </Button>
                <Button type="submit" className="min-w-32" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Submit Referral
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Calendar, Save } from 'lucide-react';

const formSchema = z.object({
  referralDate: z.string().min(1, 'Referral date is required'),
  services: z.array(z.string()).min(1, 'Select at least one service'),
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  pronouns: z.string().trim().max(50).optional(),
  birthDate: z.string().min(1, 'Birth date is required'),
  isHomeless: z.boolean().default(false),
  address: z.string().trim().max(200).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(2).optional(),
  zipCode: z.string().trim().max(10).optional(),
  homePhone: z.string().trim().max(20).optional(),
  cellPhone: z.string().trim().max(20).optional(),
  email: z.string().trim().email('Invalid email').max(255).optional().or(z.literal('')),
  ssn: z.string().trim().max(11).optional(),
  medicalAssistanceId: z.string().trim().max(50).optional(),
  medicalAssistanceProvider: z.string().trim().max(100).optional(),
  gender: z.string().min(1, 'Gender is required'),
  race: z.string().min(1, 'Race is required'),
  isPregnant: z.string().max(500).optional(),
  drugOfChoice: z.string().trim().max(200).optional(),
  lastUseDate: z.string().optional(),
  mentalHealthConditions: z.string().trim().max(500).optional(),
  diagnosis: z.string().trim().max(500).optional(),
  medicalConditions: z.string().trim().max(500).optional(),
  allergies: z.string().trim().max(500).optional(),
  physicalLimitations: z.string().trim().max(500).optional(),
  medications: z.string().trim().max(500).optional(),
  tobaccoUser: z.boolean().default(false),
  criminalOffenses: z.string().trim().max(500).optional(),
  probationParole: z.string().trim().max(500).optional(),
  priorityPopulations: z.array(z.string()),
  emergencyContactName: z.string().trim().max(100).optional(),
  emergencyContactRelationship: z.string().trim().max(50).optional(),
  emergencyContactPhone: z.string().trim().max(20).optional(),
  referredByName: z.string().trim().min(1, 'Referrer name is required').max(100),
  referredByTitle: z.string().trim().max(100).optional(),
  referredByAgency: z.string().trim().max(200).optional(),
  referredByPhone: z.string().trim().max(20).optional(),
  referredByEmail: z.string().trim().email('Invalid email').max(255).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export const RecoveryReferralForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralDate: new Date().toISOString().split('T')[0],
      services: [],
      isHomeless: false,
      tobaccoUser: false,
      priorityPopulations: [],
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    toast.success('Referral submitted successfully!', {
      description: 'We will process your referral shortly.',
    });
    form.reset();
  };

  const serviceOptions = [
    { id: 'assessment', label: 'D/A Level of Care Assessment' },
    { id: 'case', label: 'Case Management/Resource Coordination' },
    { id: 'support', label: 'Certified Recovery Support' },
  ];

  const priorityOptions = [
    { id: 'pregnant', label: 'Pregnant User' },
    { id: 'iv', label: 'IV User' },
    { id: 'overdose', label: 'Overdose Survivor' },
    { id: 'veteran', label: 'Veteran' },
    { id: 'mat', label: 'MAT (Medication Assisted Treatment)' },
    { id: 'parent', label: 'Parent/Caretaker with Child <1' },
  ];

  return (
    <Card className="shadow-xl border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recovery Support Referral Form
        </CardTitle>
        <CardDescription>Complete all required fields marked with *</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Date and Services */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="referralDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Referral *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="services"
                render={() => (
                  <FormItem>
                    <FormLabel>Services Requested *</FormLabel>
                    <div className="space-y-2">
                      {serviceOptions.map((service) => (
                        <FormField
                          key={service.id}
                          control={form.control}
                          name="services"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, service.id]
                                      : field.value?.filter((v) => v !== service.id);
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">{service.label}</FormLabel>
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

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Personal Information</h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Pronouns</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., she/her, he/him" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isHomeless"
                  render={({ field }) => (
                    <FormItem className="flex items-end space-x-2 space-y-0 pb-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Homeless or at risk of homelessness
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Contact Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4 grid-cols-2">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input maxLength={2} placeholder="PA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="homePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
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
                      <FormLabel>Cell Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Demographics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Demographics</h3>
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
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
                          <FormLabel className="font-normal cursor-pointer">Other</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="race"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Race *</FormLabel>
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
                          <FormLabel className="font-normal cursor-pointer">Other</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Priority Populations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Priority/Special Initiatives Population</h3>
              
              <FormField
                control={form.control}
                name="priorityPopulations"
                render={() => (
                  <FormItem>
                    <FormDescription>Check all that apply</FormDescription>
                    <div className="grid gap-2 md:grid-cols-2 mt-2">
                      {priorityOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="priorityPopulations"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
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
                              <FormLabel className="font-normal cursor-pointer">{option.label}</FormLabel>
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

            {/* Referred By */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Referred By</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="referredByName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Agency</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="referredByEmail"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Clear Form
              </Button>
              <Button type="submit" className="min-w-32">
                <Save className="h-4 w-4 mr-2" />
                Submit Referral
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

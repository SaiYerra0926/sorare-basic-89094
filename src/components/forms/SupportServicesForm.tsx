import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { HeartHandshake, Send } from 'lucide-react';

const formSchema = z.object({
  referralDate: z.string().min(1, 'Referral date is required'),
  participantName: z.string().trim().min(1, 'Participant name is required').max(100),
  participantAge: z.string().min(1, 'Age is required'),
  participantPhone: z.string().trim().max(20).optional(),
  supportServices: z.array(z.string()).min(1, 'Select at least one support service'),
  recoveryStage: z.string().min(1, 'Recovery stage is required'),
  peerSupportNeeds: z.string().trim().min(10, 'Please describe support needs').max(1000),
  meetingPreference: z.string().min(1, 'Meeting preference is required'),
  transportationNeeded: z.boolean().default(false),
  childcareNeeded: z.boolean().default(false),
  previousRecoverySupport: z.string().trim().max(500).optional(),
  currentGoals: z.string().trim().max(1000).optional(),
  barriersToSuccess: z.string().trim().max(1000).optional(),
  additionalNotes: z.string().trim().max(1000).optional(),
  referrerName: z.string().trim().min(1, 'Your name is required').max(100),
  referrerRelationship: z.string().trim().max(100).optional(),
  referrerPhone: z.string().trim().max(20).optional(),
  referrerEmail: z.string().trim().email('Invalid email').max(255).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export const SupportServicesForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralDate: new Date().toISOString().split('T')[0],
      supportServices: [],
      transportationNeeded: false,
      childcareNeeded: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Support Services Form submitted:', data);
    toast.success('Support services referral submitted!', {
      description: 'We will connect you with a certified recovery specialist.',
    });
    form.reset();
  };

  const supportServiceOptions = [
    { id: 'peer-support', label: 'Peer Support Counseling' },
    { id: 'group-sessions', label: 'Group Support Sessions' },
    { id: 'recovery-coaching', label: 'Recovery Coaching' },
    { id: 'crisis-support', label: '24/7 Crisis Support' },
    { id: 'family-support', label: 'Family Support Services' },
    { id: 'wellness-activities', label: 'Wellness Activities' },
    { id: 'life-skills', label: 'Life Skills Training' },
    { id: 'mentorship', label: 'Recovery Mentorship' },
  ];

  return (
    <Card className="shadow-xl border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="flex items-center gap-2">
          <HeartHandshake className="h-5 w-5" />
          Certified Recovery Support Services
        </CardTitle>
        <CardDescription>Peer-led support and recovery coaching from certified specialists</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Referral Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Referral Information</h3>
              
              <FormField
                control={form.control}
                name="referralDate"
                render={({ field }) => (
                  <FormItem className="md:w-1/2">
                    <FormLabel>Referral Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Participant Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Participant Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="participantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="participantAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age *</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="participantPhone"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Support Service Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Support Service Details</h3>
              
              <FormField
                control={form.control}
                name="supportServices"
                render={() => (
                  <FormItem>
                    <FormLabel>Support Services Requested *</FormLabel>
                    <FormDescription>Select all services that would benefit the participant</FormDescription>
                    <div className="grid gap-2 md:grid-cols-2 mt-2">
                      {supportServiceOptions.map((service) => (
                        <FormField
                          key={service.id}
                          control={form.control}
                          name="supportServices"
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

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="recoveryStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Recovery Stage *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="early">Early Recovery (0-3 months)</SelectItem>
                          <SelectItem value="active">Active Recovery (3-12 months)</SelectItem>
                          <SelectItem value="sustained">Sustained Recovery (1+ years)</SelectItem>
                          <SelectItem value="maintenance">Maintenance Phase</SelectItem>
                          <SelectItem value="not-started">Not Yet Started</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="meetingPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Preference *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in-person">In-Person Only</SelectItem>
                          <SelectItem value="virtual">Virtual/Online Only</SelectItem>
                          <SelectItem value="hybrid">Hybrid (Both)</SelectItem>
                          <SelectItem value="phone">Phone Support</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="peerSupportNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peer Support Needs *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the specific support needs and what you hope to achieve through peer support..." 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="transportationNeeded"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0 p-4 border rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="font-normal cursor-pointer">
                          Transportation Assistance Needed
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Check if participant needs help with transportation to meetings
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="childcareNeeded"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0 p-4 border rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="font-normal cursor-pointer">
                          Childcare Assistance Needed
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Check if participant needs childcare support during sessions
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="previousRecoverySupport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Recovery Support Experience</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe any previous recovery support services or programs..." 
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Recovery Goals</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What are the participant's main recovery goals?" 
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barriersToSuccess"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potential Barriers to Success</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Identify any challenges that might impact recovery success..." 
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any other relevant information that would help our team..." 
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Referrer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Your Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="referrerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="referrerRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Participant</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Family member, Counselor, Self" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="referrerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="referrerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
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
                <Send className="h-4 w-4 mr-2" />
                Submit Referral
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FileCheck, Send } from 'lucide-react';
import worxLogo from '@/assets/worx-logo.png';

const formSchema = z.object({
  referralDate: z.string().min(1, 'Referral date is required'),
  clientName: z.string().trim().min(1, 'Client name is required').max(100),
  clientPhone: z.string().trim().max(20).optional(),
  clientEmail: z.string().trim().email('Invalid email').max(255).optional().or(z.literal('')),
  serviceType: z.string().min(1, 'Service type is required'),
  urgencyLevel: z.string().min(1, 'Urgency level is required'),
  currentChallenges: z.string().trim().min(10, 'Please describe current challenges').max(1000),
  resourcesNeeded: z.string().trim().min(10, 'Please list resources needed').max(1000),
  referrerName: z.string().trim().min(1, 'Your name is required').max(100),
  referrerEmail: z.string().trim().email('Invalid email').max(255).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export const CaseManagementForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Case Management Form submitted:', data);
    toast.success('Case management referral submitted!', {
      description: 'Our team will review and contact you shortly.',
    });
    form.reset();
  };

  return (
    <div className="relative w-full min-h-screen">
      <Card className="relative shadow-xl border-primary/20 bg-background/98 backdrop-blur-sm">
        {/* Watermark Background - WORX Logo */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage: `url(${worxLogo})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '600px',
            backgroundPosition: 'center center',
          }}
        />
        <CardHeader className="relative z-10 bg-gradient-to-r from-primary/10 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Case Management & Resource Coordination
          </CardTitle>
          <CardDescription>Connecting clients with essential resources and ongoing support</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="referralDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referral Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="urgencyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency Level *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="routine">Routine - Within 1 week</SelectItem>
                        <SelectItem value="priority">Priority - Within 48 hours</SelectItem>
                        <SelectItem value="urgent">Urgent - Within 24 hours</SelectItem>
                        <SelectItem value="immediate">Immediate - Same day</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Full Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="clientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Service Needed *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="housing">Housing Assistance</SelectItem>
                      <SelectItem value="employment">Employment Services</SelectItem>
                      <SelectItem value="healthcare">Healthcare Access</SelectItem>
                      <SelectItem value="benefits">Benefits Enrollment</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="legal">Legal Services</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Case Management</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentChallenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Challenges *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the primary challenges the client is facing..." 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resourcesNeeded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resources Needed *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List specific resources or services the client needs..." 
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
    </div>
  );
};


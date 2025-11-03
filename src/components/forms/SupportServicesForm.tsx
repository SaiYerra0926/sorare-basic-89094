import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { HeartHandshake, Send } from 'lucide-react';
import worxLogo from '@/assets/worx-logo.png';

const formSchema = z.object({
  referralDate: z.string().min(1, 'Referral date is required'),
  participantName: z.string().trim().min(1, 'Participant name is required').max(100),
  participantPhone: z.string().trim().max(20).optional(),
  participantEmail: z.string().trim().email('Invalid email').max(255).optional().or(z.literal('')),
  supportNeeds: z.string().trim().min(10, 'Please describe support needs').max(1000),
  recoveryGoals: z.string().trim().max(1000).optional(),
  referrerName: z.string().trim().min(1, 'Your name is required').max(100),
  referrerEmail: z.string().trim().email('Invalid email').max(255).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export const SupportServicesForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Support Services Form submitted:', data);
    toast.success('Support services referral submitted!', {
      description: 'We will connect you with a certified recovery specialist.',
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
            <HeartHandshake className="h-5 w-5" />
            Certified Recovery Support Services
          </CardTitle>
          <CardDescription>Peer-led support and recovery coaching from certified specialists</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <FormField
              control={form.control}
              name="participantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant Full Name *</FormLabel>
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
                name="participantPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participant Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="participantEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participant Email</FormLabel>
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
              name="supportNeeds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Needs *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the specific support needs and what you hope to achieve..." 
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
              name="recoveryGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recovery Goals</FormLabel>
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


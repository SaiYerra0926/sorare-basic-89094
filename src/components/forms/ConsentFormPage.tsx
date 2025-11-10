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
  // Client Information
  clientName: z.string().trim().min(1, 'Client name is required').max(100),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  socialSecurityNumber: z.string().trim().max(11).optional(),
  streetAddress: z.string().trim().max(200).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(50).optional(),
  zipCode: z.string().trim().max(10).optional(),
  
  // Client Release and Signature
  discloseToName: z.string().trim().max(200).optional(),
  discloseToPhone: z.string().trim().max(20).optional(),
  obtainFromName: z.string().trim().max(200).optional(),
  obtainFromPhone: z.string().trim().max(20).optional(),
  informationRequested: z.string().trim().max(1000).optional(),
  informationPurpose: z.string().trim().max(500).optional(),
  expirationDate: z.string().optional(),
  specificEvent: z.string().trim().max(200).optional(),
  
  // Client Consent
  clientSignature: z.string().optional(),
  clientSignatureDate: z.string().optional(),
  witnessSignature: z.string().optional(),
  witnessSignatureDate: z.string().optional(),
  
  // Verification
  copyAccepted: z.boolean().default(false),
  copyDeclined: z.boolean().default(false),
  staffInitials: z.string().trim().max(50).optional(),
  clientInitials: z.string().trim().max(50).optional(),
  
  // The Worx! - RSW Use Only
  consentRevokedDate: z.string().optional(),
  consentRevokedStaffInitials: z.string().trim().max(50).optional(),
  requestingAgency: z.string().trim().max(200).optional(),
  requestingDepartment: z.string().trim().max(200).optional(),
  requestReceivedDate: z.string().optional(),
  releasingAgency: z.string().trim().max(200).optional(),
  releasingDepartment: z.string().trim().max(200).optional(),
  phiSentDate: z.string().optional(),
  subpoenaCourtOrder: z.string().trim().max(200).optional(),
  courtCountyState: z.string().trim().max(200).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ConsentFormPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      copyAccepted: false,
      copyDeclined: false,
      informationRequested: 'Presence in program, Brief Summary of progress and participation In services at your facility. Please include dates of services.',
      informationPurpose: 'COORDINATION OF SERVICES',
      specificEvent: 'N/A',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Consent form submitted with data:', data);
      
      // Here you would typically send the data to your API
      // const response = await api.submitConsentForm(data);
      
      toast.success('Consent form submitted successfully!', {
        description: 'Your consent form has been saved.',
        duration: 3000,
      });
      
      // Optionally redirect after submission
      // setTimeout(() => {
      //   window.location.href = '/';
      // }, 1500);
    } catch (error: any) {
      console.error('Error submitting consent form:', error);
      const errorMessage = error?.message || error?.error || 'Please check your connection and try again.';
      toast.error('Failed to submit consent form', {
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
                CONSENT FORM
              </h1>
              <p 
                className="text-sm text-gray-600 italic"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Instructions: Please Provide Information As It Existed When Services Were Provided.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Section 1: Client Information */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Client Information
                  </h2>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Name of Client: (Last, First, Middle Initial)
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
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Street Address
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
                      name="socialSecurityNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Social Security Number
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
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            City
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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              State
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
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Zip Code
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

                {/* Section 2: Client Release and Signature */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Client Release and Signature
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p 
                        className="text-sm font-semibold text-gray-800 mb-2"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      >
                        1. I Hereby Authorize:
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                        <p 
                          className="text-sm font-semibold text-gray-800 mb-2"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Name/phone number of Person/Agency to disclose information:
                        </p>
                        <p 
                          className="text-sm text-gray-700"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          The Worx! and affiliated Program Services
                        </p>
                        <p 
                          className="text-sm text-gray-700 mt-2"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Street Address: City: State: Zip Code:
                        </p>
                        <p 
                          className="text-sm text-gray-700"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          300 Catherine Street 1st Floor McKees Rocks, PA 15136, 412-219-9123
                        </p>
                      </div>
                    </div>

                    <div>
                      <p 
                        className="text-sm font-semibold text-gray-800 mb-2"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      >
                        2. To Release Information To:
                      </p>
                      <FormField
                        control={form.control}
                        name="discloseToName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="Name/phone number of Person/Agency"
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

                    <div>
                      <p 
                        className="text-sm font-semibold text-gray-800 mb-2"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      >
                        To obtain information from: (Please check one)
                      </p>
                      <FormField
                        control={form.control}
                        name="obtainFromName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="Name/phone number of Person/Agency to disclose information"
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

                    <div>
                      <p 
                        className="text-sm font-semibold text-gray-800 mb-2"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      >
                        3. The following information is requested: (Be Specific)
                      </p>
                      <FormField
                        control={form.control}
                        name="informationRequested"
                        render={({ field }) => (
                          <FormItem>
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
                    </div>

                    <div>
                      <p 
                        className="text-sm font-semibold text-gray-800 mb-2"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      >
                        4. The Information Identified above will be used for: (List Each Purpose):
                      </p>
                      <FormField
                        control={form.control}
                        name="informationPurpose"
                        render={({ field }) => (
                          <FormItem>
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
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="expirationDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              5. Date this Authorization to Disclose Information will expire:
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
                        name="specificEvent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              OR Specific Event terminating Operation of Release:
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

                {/* Section 3: Client Consent */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4 uppercase"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    CLIENT CONSENT
                  </h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <p 
                      className="text-sm text-gray-700 leading-relaxed"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      This authorization is voluntary and remains in effect until the above date or event, unless specifically revoked either verbally or in writing, by the client. Any information disclosed prior to the revocation of this authorization shall not be a breach of confidentiality. A photocopy of the authorization is as effective as the original. Unless otherwise agreed in writing, information may be disclosed under this authorization in any form or medium, including oral, written, or electronic transmission.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="clientSignature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Signature of Client
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
                        name="clientSignatureDate"
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
                        name="witnessSignature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Signature of Witness
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
                        name="witnessSignatureDate"
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

                {/* Section 4: Notice */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4 uppercase"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    NOTICE TO WHOMEVER DISCLOSURE IS MADE CONCERNING ADDTION RECORDS
                  </h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <p 
                      className="text-xs text-gray-700 leading-relaxed"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      The client may revoke this authorization at any time except to the extent that action has been taken in reliance thereon. If not previously revoked, this authorization will terminate on the date or event specified above. The client has the right to inspect any material disclosed pursuant to this authorization. The client has the right to request restrictions on the use or disclosure of protected health information. The client has the right to revoke this authorization at any time. If the client revokes this authorization, RSW will no longer use or disclose protected health information about the client for the reasons covered by this authorization, except to the extent that RSW has already relied on this authorization. The client understands that RSW cannot take back any disclosures already made with the client's permission and that RSW is required to retain records of the care that RSW has provided to the client. The client understands that HIV-related information may not be re-disclosed without the client's express written authorization. The client releases RSW from any liability for information disclosed to an unintended recipient due to an error in transmission.
                    </p>
                    <p 
                      className="text-xs text-gray-700 leading-relaxed"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      The information in this record has been disclosed to you from records whose confidentiality is protected by Federal law. Federal regulations (42 CFR Part 2) prohibit you from making any further disclosure of this information unless further disclosure is expressly permitted by the written consent of the person to whom it pertains or as otherwise permitted by 42 CFR Part 2. A general authorization for the release of medical or other information is NOT sufficient for this purpose. The Federal rules restrict any use of the information to criminally investigate or prosecute any alcohol or drug abuse patient.
                    </p>
                  </div>
                </div>

                {/* Section 5: Verification */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4 uppercase"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    VERIFICATION
                  </h2>
                  
                  <div className="space-y-4">
                    <p 
                      className="text-sm text-gray-700"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      I have been offered a copy of this form by The Worx! -RSW Staff.
                    </p>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="copyAccepted"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  if (checked) {
                                    form.setValue('copyDeclined', false);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel 
                              className="text-sm font-normal cursor-pointer text-gray-700"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              I have accepted a copy of this form
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="copyDeclined"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  if (checked) {
                                    form.setValue('copyAccepted', false);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel 
                              className="text-sm font-normal cursor-pointer text-gray-700"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              I have declined a copy of this form
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="staffInitials"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Staff Initials
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
                        name="clientInitials"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Client Initials
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

                {/* Section 6: The Worx! - RSW Use Only */}
                <div className="space-y-4">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4 uppercase text-center"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    THE WORX! -RSW USE ONLY
                  </h2>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="consentRevokedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Date consent was revoked:
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
                      name="consentRevokedStaffInitials"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Staff initials:
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
                      name="requestingAgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Agency/Person requesting PHI
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
                      name="requestingDepartment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Please Include Department Name:
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
                      name="requestReceivedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Date Requested Received:
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
                      name="releasingAgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Agency/Person releasing PHI
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
                      name="releasingDepartment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Please Include Department Name:
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
                      name="phiSentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Date PHI Was Sent:
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
                      name="subpoenaCourtOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Subpoena/Court Order
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
                      name="courtCountyState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Please list County/State Court issuing Subpoena/Court Order:
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
                      <span className="text-sm font-medium">Submit Consent Form</span>
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


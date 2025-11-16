import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Calendar, Clock, Pen, Type, Eraser } from 'lucide-react';
import { api } from '@/lib/api';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Compact Signature Pad Component for Table
const CompactSignaturePad = ({ value, onChange, onBlur }: { value?: string; onChange: (value: string) => void; onBlur?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'text'>('draw');
  const [textValue, setTextValue] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 120 * dpr;

    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = '120px';

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (value && value.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        ctx.drawImage(img, 0, 0, rect.width, 120);
      };
      img.src = value;
    } else if (value && signatureMode === 'text') {
      setTextValue(value);
    }
  }, [value, signatureMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (signatureMode !== 'draw') return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || signatureMode !== 'draw') return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL('image/png');
    onChange(dataURL);
    if (onBlur) onBlur();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
    if (onBlur) onBlur();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTextValue(text);
    onChange(text);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <Button
          type="button"
          variant={signatureMode === 'draw' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setSignatureMode('draw');
            if (textValue) {
              setTextValue('');
              onChange('');
            }
          }}
          className={`flex items-center gap-1 text-xs h-7 px-2 ${signatureMode === 'draw' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          <Pen className="w-3 h-3" />
          Draw Signature
        </Button>
        <Button
          type="button"
          variant={signatureMode === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setSignatureMode('text');
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
              }
            }
            onChange('');
          }}
          className={`flex items-center gap-1 text-xs h-7 px-2 ${signatureMode === 'text' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          <Type className="w-3 h-3" />
          Type Signature
        </Button>
      </div>

      {signatureMode === 'draw' && (
        <div className="space-y-1">
          <div className="border border-gray-300 rounded overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair"
              style={{ height: '120px', touchAction: 'none' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
              className="flex items-center gap-1 text-xs h-6 px-2"
            >
              <Eraser className="w-3 h-3" />
              Clear
            </Button>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Draw your signature above or switch to type mode
            </p>
          </div>
        </div>
      )}

      {signatureMode === 'text' && (
        <Input
          type="text"
          value={textValue}
          onChange={handleTextChange}
          onBlur={onBlur}
          placeholder="Type your signature"
          className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm h-8"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        />
      )}
    </div>
  );
};

// Service log entry schema
const serviceLogSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  units: z.string().min(1, 'Units is required'),
  participantSignature: z.string().optional(),
  staffSignature: z.string().optional(),
});

const formSchema = z.object({
  // Header Information
  participantName: z.string().trim().min(1, 'Participant name is required').max(100),
  maId: z.string().trim().max(50).optional(),
  chartNumber: z.string().trim().max(50).optional(),
  dsm5: z.string().trim().max(200).optional(),
  
  // Encounter Details
  typeOfContact: z.string().min(1, 'Type of contact is required'),
  typeOfContactOther: z.string().trim().max(200).optional(),
  recoveryInterventions: z.string().min(1, 'Recovery interventions is required'),
  locationOfService: z.string().min(1, 'Location of service is required'),
  locationOfServiceDetails: z.string().trim().max(1000).optional(),
  
  // Summary of Visit
  goal: z.string().trim().max(2000).optional(),
  objective: z.string().trim().max(2000).optional(),
  
  // Service Description
  serviceDescription: z.string().trim().max(5000).optional(),
  
  // Comments and Plan
  peerComments: z.string().trim().max(2000).optional(),
  planForNextSession: z.string().trim().max(2000).optional(),
  
  // Service Log
  serviceLog: z.array(serviceLogSchema).min(1, 'At least one service log entry is required'),
});

type FormValues = z.infer<typeof formSchema>;

// Master data for dropdowns
const typeOfContactOptions = [
  { value: 'in-person', label: 'In-Person' },
  { value: 'phone', label: 'Phone' },
  { value: 'video', label: 'Video Conference' },
  { value: 'home-visit', label: 'Home Visit' },
  { value: 'community', label: 'Community Setting' },
  { value: 'other', label: 'Other' },
];

const recoveryInterventionsOptions = [
  { value: 'individual-counseling', label: 'Individual Counseling' },
  { value: 'group-counseling', label: 'Group Counseling' },
  { value: 'peer-support', label: 'Peer Support' },
  { value: 'case-management', label: 'Case Management' },
  { value: 'crisis-intervention', label: 'Crisis Intervention' },
  { value: 'skill-building', label: 'Skill Building' },
  { value: 'recovery-planning', label: 'Recovery Planning' },
  { value: 'resource-coordination', label: 'Resource Coordination' },
  { value: 'advocacy', label: 'Advocacy' },
  { value: 'other', label: 'Other' },
];

const locationOfServiceOptions = [
  { value: 'office', label: 'Office' },
  { value: 'home', label: 'Home' },
  { value: 'community', label: 'Community' },
  { value: 'telehealth', label: 'Telehealth' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'residential', label: 'Residential Facility' },
  { value: 'other', label: 'Other' },
];

export const IndividualEncounterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceLog: [
        {
          date: '',
          startTime: '',
          endTime: '',
          units: '',
          participantSignature: '',
          staffSignature: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'serviceLog',
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Encounter form submitted with data:', data);
      
      const response = await api.submitEncounter(data);
      
      if (response.success) {
        toast.success('Encounter form submitted successfully!', {
          description: `Your encounter form has been saved. Reference ID: ${response.data?.encounterId || 'N/A'}`,
          duration: 3000,
        });
        
        // Reset form after successful submission
        form.reset();
        // Reset service log to one empty entry
        form.setValue('serviceLog', [{
          date: '',
          startTime: '',
          endTime: '',
          units: '',
          participantSignature: '',
          staffSignature: '',
        }]);
      } else {
        throw new Error(response.message || 'Failed to submit encounter form');
      }
    } catch (error: any) {
      console.error('Error submitting encounter form:', error);
      const errorMessage = error?.message || error?.error || 'Please check your connection and try again.';
      toast.error('Failed to submit encounter form', {
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
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
                Individual Encounter Form
              </h1>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Section 1: Header Information */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Participant Information
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
                      name="maId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            MA ID
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
                      name="chartNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Chart Number
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
                      name="dsm5"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            DSM-5
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

                {/* Section 2: Encounter Details */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Encounter Details
                  </h2>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="typeOfContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Type of Contact
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select type of contact" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {typeOfContactOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('typeOfContact') === 'other' && (
                      <FormField
                        control={form.control}
                        name="typeOfContactOther"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel 
                              className="text-sm font-semibold text-gray-800"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              Specify Other
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
                    )}

                    <FormField
                      control={form.control}
                      name="recoveryInterventions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Recovery Interventions
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select recovery intervention" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {recoveryInterventionsOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationOfService"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Location of Service
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="Select location of service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locationOfServiceOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationOfServiceDetails"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Additional location details..."
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

                {/* Section 3: Summary of Visit */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <h2 
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    Summary of Visit/Content of Peer Service Rendered
                  </h2>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Goal
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-32"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="objective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Objective
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-32"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 4: Service Description */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <FormField
                    control={form.control}
                    name="serviceDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel 
                          className="text-sm font-semibold text-gray-800"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Describe the services provided, related to the individual's goal (what objectives from the ISP did you work on):
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-40"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 5: Comments and Plan */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="peerComments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Peer comment(s)/response to service:
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-32"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="planForNextSession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            Plan for next session:
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-32"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 6: Service Log Table */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 
                      className="text-lg font-bold text-gray-800"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      Service Log
                    </h2>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({
                        date: '',
                        startTime: '',
                        endTime: '',
                        units: '',
                        participantSignature: '',
                        staffSignature: '',
                      })}
                      className="flex items-center gap-2 bg-white hover:bg-gray-50"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Row
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-[140px] py-3 text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>DATE</TableHead>
                          <TableHead className="w-[130px] py-3 text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>START TIME</TableHead>
                          <TableHead className="w-[130px] py-3 text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>END TIME</TableHead>
                          <TableHead className="w-[120px] py-3 text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>UNITS</TableHead>
                          <TableHead className="w-[280px] py-3 text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>PARTICIPANT'S SIGNATURE</TableHead>
                          <TableHead className="w-[280px] py-3 text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>STAFF SIGNATURE</TableHead>
                          <TableHead className="w-[60px] py-3"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id} className="border-b border-gray-100">
                            <TableCell className="py-2">
                              <FormField
                                control={form.control}
                                name={`serviceLog.${index}.date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="relative">
                                        <Input 
                                          type="date"
                                          {...field} 
                                          placeholder="mm/dd/yyyy"
                                          className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm h-9 pr-8"
                                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                        />
                                        <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                      </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="py-2">
                              <FormField
                                control={form.control}
                                name={`serviceLog.${index}.startTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="relative">
                                        <Input 
                                          type="time"
                                          {...field} 
                                          placeholder="--:--"
                                          className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm h-9 pr-8"
                                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                        />
                                        <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                      </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="py-2">
                              <FormField
                                control={form.control}
                                name={`serviceLog.${index}.endTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="relative">
                                        <Input 
                                          type="time"
                                          {...field} 
                                          placeholder="--:--"
                                          className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm h-9 pr-8"
                                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                        />
                                        <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                      </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="py-2">
                              <FormField
                                control={form.control}
                                name={`serviceLog.${index}.units`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input 
                                        {...field} 
                                        placeholder="Units"
                                        className="rounded-lg border-gray-300 bg-gray-50 hover:bg-gray-100 focus:border-green-500 focus:ring-green-500 text-sm h-9 text-center font-medium"
                                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="py-2 align-top">
                              <FormField
                                control={form.control}
                                name={`serviceLog.${index}.participantSignature`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="w-full">
                                        <CompactSignaturePad
                                          value={field.value}
                                          onChange={(value) => field.onChange(value)}
                                          onBlur={field.onBlur}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="py-2 align-top">
                              <FormField
                                control={form.control}
                                name={`serviceLog.${index}.staffSignature`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="w-full">
                                        <CompactSignaturePad
                                          value={field.value}
                                          onChange={(value) => field.onChange(value)}
                                          onBlur={field.onBlur}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="py-2">
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => remove(index)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Section 7: Certification Statement */}
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p 
                      className="text-sm text-gray-700 leading-relaxed italic"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      "I certify that I was an active participant in the services described above, that I received the services indicated, that the information provided is accurate to the best of my knowledge, and that I understand the payment sources and legal implications for false claims."
                    </p>
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
                      <span className="text-sm font-medium">Submit Encounter Form</span>
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


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import emailjs from '@emailjs/browser';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Initialize EmailJS
emailjs.init("eUS4hyFkK3IagJ29o");

const timeSlots = [
  '05:00 AM - 06:00 AM',
  '07:00 PM - 08:00 PM',
  '08:15 PM - 09:15 PM',
  '10:00 PM - 10:30 PM',
];

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  date: z.date({
    required_error: 'Please select a date',
  }),
  time: z.string({
    required_error: 'Please select a time slot',
  }),
});

export default function AppointmentForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const appointmentId = uuidv4();

    try {
      await emailjs.send(
        'service_0yti8r8', // Replace with your EmailJS service ID
        'template_3t9rnqv', // Replace with your EmailJS template ID
        {
          to_name: 'Admin',
          appointment_id: appointmentId,
          client_name: values.name,
          phone_number: values.phone,
          appointment_date: format(values.date, 'PPP'),
          appointment_time: values.time,
        }
      );

      localStorage.setItem(
        'appointmentData',
        JSON.stringify({
          id: appointmentId,
          ...values,
          date: format(values.date, 'PPP'),
        })
      );

      toast.success('Appointment booked successfully!');
      navigate('/confirmation');
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
      console.error('EmailJS error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-2xl mx-auto px-6 py-8"
    >
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Fill out the form below to schedule your appointment
        </p>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      country={'us'}
                      value={field.value}
                      onChange={(phone) => field.onChange(phone)}
                      inputClass="!w-full !h-10 !text-base"
                      containerClass="!w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <div className="flex flex-col p-3 rounded-md border">
                      <div className="flex items-center mb-2">
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        <span className="text-sm text-muted-foreground">
                          {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                          className="rounded-md border shadow-sm"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Slot</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>{field.value}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>{slot}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin mr-2">⌛</div>
                  Booking...
                </div>
              ) : (
                'Book Appointment'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
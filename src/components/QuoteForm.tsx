import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CheckCircle2, Loader2, Phone, Clock, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number required"),
  city: z.string().min(2, "City/State is required"),
  projectType: z.string({ required_error: "Please select a project type" }),
  glassSize: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().optional(),
});

export default function QuoteForm() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", city: "", message: "", glassSize: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Insert lead into Supabase
      const { error } = await supabase.from('leads').insert({
        full_name: values.name,
        phone: values.phone,
        email: values.email,
        city_state: values.city,
        project_type: values.projectType,
        timeline: values.timeline || null,
        glass_size: values.glassSize || null,
        message: values.message || null,
        status: 'new',
        source: 'quote_form',
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({ title: "Quote Request Received!", description: "We'll be in touch within 1 business day." });
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({ title: "Something went wrong", description: "Please try again or call us directly.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-slate-100 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Request Received!</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Thank you for contacting Smart Corp. One of our specialists will review your details and reach out to you within 1 business day.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">Send Another Request</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-primary shrink-0">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Prefer to talk?</h4>
            <p className="text-sm text-slate-600">Call our AI receptionist to get an instant quote.</p>
          </div>
        </div>
        <a href="tel:+12109960797">
          <Button variant="secondary" className="whitespace-nowrap font-semibold">Call +1 (210) 996-0797</Button>
        </a>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Get a Free Quote</h3>
          <p className="text-slate-500 text-sm mb-4">Fill out the form below for a no-obligation quote. Response within 1 business day.</p>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
             <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-green-500" /> No Obligation</span>
             <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-green-500" /> Fast Response</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number *</FormLabel><FormControl><Input placeholder="210-123-4567" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input placeholder="john@company.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabel>City / State *</FormLabel><FormControl><Input placeholder="San Antonio, TX" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="projectType" render={({ field }) => (
                <FormItem><FormLabel>Project Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="office">Corporate / Office</SelectItem>
                      <SelectItem value="medical">Medical / Clinic</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="storefront">Retail / Storefront</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="timeline" render={({ field }) => (
                <FormItem><FormLabel>Timeline</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="When do you need it?" /></SelectTrigger></FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="1-3_months">1-3 Months</SelectItem>
                      <SelectItem value="3-6_months">3-6 Months</SelectItem>
                      <SelectItem value="researching">Just Researching</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="glassSize" render={({ field }) => (
              <FormItem><FormLabel>Approximate Glass Size (Optional)</FormLabel><FormControl><Input placeholder="e.g. 10ft x 8ft glass, or 3 windows" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="message" render={({ field }) => (
              <FormItem><FormLabel>Message / Details</FormLabel><FormControl><Textarea placeholder="Tell us about your project..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="w-full h-12 text-base font-bold shadow-md" disabled={isLoading}>
              {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>) : "Get a Free Quote"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

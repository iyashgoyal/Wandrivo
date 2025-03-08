import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, Send } from "lucide-react";

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function Contact() {
  const [location] = useLocation();
  const { toast } = useToast();
  const urlParams = new URLSearchParams(location.split("?")[1]);
  const packageId = urlParams.get("package");

  const form = useForm<InsertInquiry>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      travelDates: "",
      budget: undefined,
      packageId: packageId ? parseInt(packageId) : undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      const response = await apiRequest("POST", "/api/inquiries", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your inquiry has been submitted. We'll contact you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our travel packages? We're here to help make your dream vacation a reality!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <motion.div 
            className="md:col-span-1 space-y-4"
            variants={formAnimation}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemAnimation}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Phone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">+1-800-WANDRIVO</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">info@wandrivo.com</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="md:col-span-2"
            variants={formAnimation}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                    className="space-y-6"
                  >
                    <motion.div variants={itemAnimation}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                      <FormField
                        control={form.control}
                        name="travelDates"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Travel Dates</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., July 2024"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              When would you like to travel?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget (₹)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Your budget in rupees"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value ? parseInt(e.target.value) : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              What's your approximate budget for this trip?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your travel plans..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div 
                      variants={itemAnimation}
                      className="flex justify-end"
                    >
                      <Button
                        type="submit"
                        className="w-full md:w-auto"
                        disabled={mutation.isPending}
                        size="lg"
                      >
                        {mutation.isPending ? (
                          "Submitting..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Inquiry
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
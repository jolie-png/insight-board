import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertFeedbackSchema, type InsertFeedback, FEEDBACK_CATEGORIES, FEEDBACK_PRIORITIES } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, Upload } from "lucide-react";

interface FeedbackFormProps {
  onSuccess?: () => void;
}

export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertFeedback>({
    resolver: zodResolver(insertFeedbackSchema),
    defaultValues: {
      userName: "",
      userEmail: "",
      category: "",
      priority: "medium",
      message: "",
    },
  });

  const createFeedbackMutation = useMutation({
    mutationFn: async (data: InsertFeedback) => {
      const response = await apiRequest("POST", "/api/feedback", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Your feedback has been submitted successfully!",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Feedback submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertFeedback) => {
    setIsSubmitting(true);
    try {
      await createFeedbackMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryLabels: Record<string, string> = {
    'bug-report': 'Bug Report',
    'feature-request': 'Feature Request',
    'ui-ux': 'UI/UX Feedback',
    'performance': 'Performance Issue',
    'general': 'General Feedback',
    'other': 'Other',
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Submit New Feedback</h3>
          <p className="text-sm text-slate-600 mt-2">Help us improve by sharing your thoughts and suggestions</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your name" 
                        {...field} 
                        data-testid="input-user-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        {...field} 
                        data-testid="input-user-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FEEDBACK_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabels[category]}
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
              name="priority"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Priority Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-3"
                    >
                      {FEEDBACK_PRIORITIES.map((priority) => (
                        <div key={priority}>
                          <RadioGroupItem value={priority} id={priority} className="peer sr-only" />
                          <Label
                            htmlFor={priority}
                            className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:bg-opacity-10"
                            data-testid={`radio-priority-${priority}`}
                          >
                            <div className="ml-3">
                              <div className="text-sm font-medium text-slate-700 capitalize">{priority}</div>
                              <div className="text-xs text-slate-500">
                                {priority === 'low' && 'Minor improvement'}
                                {priority === 'medium' && 'Moderate impact'}
                                {priority === 'high' && 'Urgent issue'}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Message <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Please describe your feedback in detail. Include steps to reproduce if reporting a bug."
                      {...field}
                      data-testid="textarea-message"
                    />
                  </FormControl>
                  <p className="text-xs text-slate-500">Minimum 10 characters required</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Attachment (Optional)</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Drag and drop files here, or click to browse</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".png,.jpg,.jpeg,.pdf"
                  data-testid="input-file-attachment"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <Button 
                type="submit" 
                disabled={isSubmitting || createFeedbackMutation.isPending}
                className="flex items-center space-x-2"
                data-testid="button-submit-feedback"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

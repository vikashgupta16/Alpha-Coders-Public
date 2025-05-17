
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SectionTitle } from '@/components/core/section-title';
import { FeedbackCard } from '@/components/core/feedback-card';
import type { Feedback as FeedbackType } from '@/lib/types';
import { MessageSquare, Star, Send, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { firestore } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


interface ProjectOption {
  id: string;
  name: string;
}

interface FeedbackSectionProps {
  projects: ProjectOption[];
}

const feedbackFormSchema = z.object({
  projectId: z.string().min(1, { message: "Please select a project." }),
  author: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  rating: z.coerce.number().min(1, "Please select a rating.").max(5),
  comment: z.string().min(10, { message: "Comment must be at least 10 characters." }).max(500),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export function FeedbackSection({ projects }: FeedbackSectionProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(true);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      projectId: '',
      author: '',
      rating: 0, // Default to 0, schema will validate it's >= 1 on submit
      comment: '',
    },
  });

  useEffect(() => {
    if (!firestore) {
      console.error("Firestore not initialized. Feedback section will not work.");
      setFeedbackError("Feedback service is currently unavailable. Firestore not initialized.");
      setIsLoadingFeedbacks(false);
      return;
    }

    setIsLoadingFeedbacks(true);
    setFeedbackError(null);

    const feedbacksCol = collection(firestore, 'feedbacks');
    const q = query(feedbacksCol, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedFeedbacks: FeedbackType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let timestampStr: string;
        if (data.timestamp instanceof Timestamp) {
          timestampStr = data.timestamp.toDate().toISOString();
        } else if (typeof data.timestamp === 'string') {
          timestampStr = data.timestamp;
        } else if (data.timestamp && typeof data.timestamp.seconds === 'number') {
          timestampStr = new Timestamp(data.timestamp.seconds, data.timestamp.nanoseconds).toDate().toISOString();
        }
         else {
          // Fallback if timestamp is missing or in an unexpected format, though serverTimestamp should prevent this.
          timestampStr = new Date().toISOString(); 
        }

        fetchedFeedbacks.push({
          id: doc.id,
          projectId: data.projectId,
          author: data.author,
          rating: data.rating,
          comment: data.comment,
          timestamp: timestampStr,
        });
      });
      setFeedbacks(fetchedFeedbacks);
      setIsLoadingFeedbacks(false);
    }, (error) => {
      console.error("Error fetching feedbacks from Firestore:", error);
      setFeedbackError("Could not load feedback. Please ensure Firestore is enabled in your Firebase project, check security rules, and verify console for details.");
      setIsLoadingFeedbacks(false);
    });

    return () => unsubscribe();
  }, []);


  const onSubmit: SubmitHandler<FeedbackFormData> = async (data) => {
    if (!firestore) {
      toast({
        title: "Error",
        description: "Feedback service is unavailable. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'feedbacks'), {
        ...data,
        timestamp: serverTimestamp(),
      });
      form.reset(); // Reset form fields to default values
      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your valuable feedback.",
        variant: "default",
        className: "bg-primary text-primary-foreground border-primary"
      });
    } catch (error) {
      console.error("Error submitting feedback to Firestore:", error);
      toast({
        title: "Submission Error",
        description: "Could not submit your feedback. Please ensure Firestore is enabled and rules are correctly set.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle icon={MessageSquare} title="Feedback & Reviews" subtitle="Share your thoughts on our projects or see what others are saying." />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="border-accent/40 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-accent">
                <Send className="mr-2 h-6 w-6" />
                Leave Your Feedback
              </CardTitle>
              <CardDescription>We value your input! Let us know what you think.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Project</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="bg-background border-border focus:border-accent focus:ring-accent">
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover border-border">
                            {projects && projects.length > 0 ? projects.map(p => (
                              <SelectItem key={p.id} value={String(p.id)} className="hover:bg-accent/20 focus:bg-accent/20">
                                {p.name}
                              </SelectItem>
                            )) : (
                               <SelectItem value="no-projects" disabled>No projects available for feedback</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} className="bg-background border-border focus:border-accent focus:ring-accent" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Rating</FormLabel>
                        {/* Handle undefined or 0 initial value for controlled Select */}
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value ? String(field.value) : ""}> 
                           <FormControl>
                            <SelectTrigger className="bg-background border-border focus:border-accent focus:ring-accent">
                              <SelectValue placeholder="Select rating (1-5 stars)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover border-border">
                            {[5, 4, 3, 2, 1].map(r => (
                              <SelectItem key={r} value={String(r)} className="hover:bg-accent/20 focus:bg-accent/20">
                                <div className="flex items-center">
                                  {r} <Star className="ml-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
                                </div>
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
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Comment</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Share your thoughts..." {...field} className="min-h-[100px] bg-background border-border focus:border-accent focus:ring-accent" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting || !firestore} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                       <Send className="mr-2 h-4 w-4" /> Submit Feedback
                      </>
                    )}
                  </Button>
                  {!firestore && (
                     <p className="text-xs text-destructive text-center">Feedback service is unavailable. Firebase might not be configured.</p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
              <Star className="mr-3 h-7 w-7 text-yellow-400" />
              Recent Feedback
            </h3>
            {isLoadingFeedbacks && (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}
            {!isLoadingFeedbacks && feedbackError && (
              <div className="flex flex-col items-center justify-center text-center p-6 border border-destructive/30 bg-destructive/10 rounded-md">
                <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                <p className="text-destructive font-semibold">Error Loading Feedback</p>
                <p className="text-sm text-muted-foreground">{feedbackError}</p>
              </div>
            )}
            {!isLoadingFeedbacks && !feedbackError && feedbacks.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No feedback yet. Be the first to share your thoughts!</p>
            )}
            {!isLoadingFeedbacks && !feedbackError && feedbacks.length > 0 && (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {feedbacks.map(fb => {
                  const projectDetails = projects.find(p => String(p.id) === fb.projectId);
                  return <FeedbackCard key={fb.id} feedback={fb} projectName={projectDetails?.name || `Feedback for Project`} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
    

    
import type { Feedback } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, UserCircle } from 'lucide-react';

interface FeedbackCardProps {
  feedback: Feedback;
  projectName?: string;
}

export function FeedbackCard({ feedback, projectName }: FeedbackCardProps) {
  return (
    <Card className="bg-card border-border hover:border-accent transition-colors shadow-sm hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-accent">{projectName || `Feedback for ${feedback.projectId}`}</CardTitle>
            <div className="flex items-center mt-1">
              <UserCircle className="w-4 h-4 mr-1.5 text-muted-foreground" />
              <CardDescription className="text-sm text-muted-foreground">By {feedback.author}</CardDescription>
            </div>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">{feedback.comment}</p>
        <p className="text-xs text-muted-foreground mt-3 text-right">{new Date(feedback.timestamp).toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

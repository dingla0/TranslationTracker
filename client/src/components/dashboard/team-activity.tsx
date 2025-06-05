import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle, 
  Upload, 
  MessageSquare, 
  Book,
  AlertCircle,
  User
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Activity {
  id: number;
  userId: number | null;
  action: string;
  entityType: string;
  entityId: number | null;
  description: string;
  metadata: any;
  createdAt: string;
  user: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    username: string;
  } | null;
}

interface TeamActivityProps {
  activities?: Activity[];
  isLoading?: boolean;
}

export default function TeamActivity({ activities, isLoading }: TeamActivityProps) {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "uploaded":
        return <Upload className="h-4 w-4 text-primary" />;
      case "translated":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "reviewed":
      case "updated":
        return <MessageSquare className="h-4 w-4 text-warning" />;
      case "added":
        return <Book className="h-4 w-4 text-secondary" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityIconBg = (action: string) => {
    switch (action) {
      case "uploaded":
        return "bg-primary/10";
      case "translated":
      case "completed":
        return "bg-accent/10";
      case "reviewed":
      case "updated":
        return "bg-warning/10";
      case "added":
        return "bg-secondary/10";
      default:
        return "bg-muted";
    }
  };

  const getUserDisplayName = (user: Activity['user']) => {
    if (!user) return "Unknown User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  const getUserInitials = (user: Activity['user']) => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className="content-card">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="content-card">
      <CardHeader>
        <CardTitle>Team Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {!activities || activities.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No recent activity</h3>
            <p className="text-muted-foreground">
              Team activities will appear here as work progresses.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${getActivityIconBg(activity.action)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {getActivityIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{getUserDisplayName(activity.user)}</span>{" "}
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            
            <Button variant="link" className="w-full mt-4 text-primary hover:text-primary/80">
              View All Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  User, 
  Globe, 
  ChevronRight,
  FileText 
} from "lucide-react";
import { format } from "date-fns";

interface TranslationProject {
  id: number;
  contentId: number;
  sourceLanguage: string;
  targetLanguage: string;
  assignedTo: number | null;
  status: string;
  priority: string;
  dueDate: string | null;
  progress: number;
  translatedText: string | null;
  reviewNotes: string | null;
  content: {
    id: number;
    title: string;
    description: string | null;
    event: string | null;
    topic: string | null;
    contentDate: string | null;
  };
  assignedTo: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    username: string;
  } | null;
}

interface RecentContentProps {
  projects?: TranslationProject[];
  isLoading?: boolean;
}

export default function RecentContent({ projects, isLoading }: RecentContentProps) {
  const [, setLocation] = useLocation();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "review":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in_progress":
        return "In Progress";
      case "review":
        return "Review";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const getProgressColor = (progress: number, status: string) => {
    if (status === "completed") return "bg-accent";
    if (progress >= 75) return "bg-primary";
    if (progress >= 50) return "bg-warning";
    return "bg-muted-foreground";
  };

  const handleOpenEditor = (projectId: number) => {
    setLocation(`/editor/${projectId}`);
  };

  if (isLoading) {
    return (
      <Card className="content-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="content-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Projects</CardTitle>
          <Button variant="link" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!projects || projects.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
            <p className="text-muted-foreground">
              Translation projects will appear here once created.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.slice(0, 3).map((project) => (
              <div 
                key={project.id} 
                className="hover:bg-muted/50 rounded-lg p-4 -mx-4 transition-colors cursor-pointer"
                onClick={() => handleOpenEditor(project.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-foreground">{project.content.title}</h4>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      {project.content.contentDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(project.content.contentDate), "MMM dd, yyyy")}</span>
                        </div>
                      )}
                      
                      {project.assignedTo && (
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>
                            {project.assignedTo.firstName} {project.assignedTo.lastName}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4" />
                        <span>{project.sourceLanguage.toUpperCase()} → {project.targetLanguage.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Translation Progress</span>
                        <span className="font-medium text-foreground">{project.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${getProgressColor(project.progress, project.status)}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="ml-4">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

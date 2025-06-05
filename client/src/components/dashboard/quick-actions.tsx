import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Edit, 
  Book, 
  Download 
} from "lucide-react";

export default function QuickActions() {
  const [, setLocation] = useLocation();

  const actions = [
    {
      title: "Upload Video",
      description: "Add new Korean content",
      icon: Upload,
      color: "text-primary",
      bgColor: "bg-primary/10",
      onClick: () => setLocation("/content")
    },
    {
      title: "New Translation",
      description: "Start translation work",
      icon: Edit,
      color: "text-accent",
      bgColor: "bg-accent/10",
      onClick: () => setLocation("/editor")
    },
    {
      title: "Manage Glossary",
      description: "Add terminology",
      icon: Book,
      color: "text-warning",
      bgColor: "bg-warning/10",
      onClick: () => setLocation("/glossary")
    },
    {
      title: "Export Files",
      description: "PDF, DOCX, TXT",
      icon: Download,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      onClick: () => setLocation("/export")
    }
  ];

  return (
    <Card className="content-card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className="quick-action-button"
            onClick={action.onClick}
          >
            <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <action.icon className={`h-5 w-5 ${action.color}`} />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-foreground">{action.title}</p>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

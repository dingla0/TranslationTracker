import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Users, 
  Database 
} from "lucide-react";

interface StatsGridProps {
  stats?: {
    activeProjects: number;
    completedTranslations: number;
    pendingReview: number;
    activeTranslators: number;
    tmEntries: number;
  };
  isLoading?: boolean;
}

export default function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Unable to load statistics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statItems = [
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+2.3%",
      changeLabel: "vs last week",
      changeColor: "text-accent"
    },
    {
      title: "Completed Translations",
      value: stats.completedTranslations,
      icon: CheckCircle,
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: "+12.5%",
      changeLabel: "vs last month",
      changeColor: "text-accent"
    },
    {
      title: "Pending Review",
      value: stats.pendingReview,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      change: "+3",
      changeLabel: "since yesterday",
      changeColor: "text-destructive"
    },
    {
      title: "Active Translators",
      value: stats.activeTranslators,
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      change: "100%",
      changeLabel: "online now",
      changeColor: "text-accent"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={index} className="stats-card hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {item.value.toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium ${item.changeColor}`}>{item.change}</span>
              <span className="text-muted-foreground ml-2">{item.changeLabel}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

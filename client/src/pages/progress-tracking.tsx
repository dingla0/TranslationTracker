import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle,
  Filter
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface ProjectProgress {
  id: number;
  contentId: number;
  sourceLanguage: string;
  targetLanguage: string;

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
  createdAt: string;
  updatedAt: string;
}

export default function ProgressTracking() {
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const { data: projects = [], isLoading } = useQuery<ProjectProgress[]>({
    queryKey: ["/api/translation-projects"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-accent";
      case "in_progress": return "text-primary";
      case "review": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-destructive";
      case "high": return "text-warning";
      case "medium": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null;
    return differenceInDays(new Date(dueDate), new Date());
  };

  const getDueDateStatus = (dueDate: string | null) => {
    const days = getDaysUntilDue(dueDate);
    if (days === null) return "no-due-date";
    if (days < 0) return "overdue";
    if (days <= 3) return "due-soon";
    return "on-track";
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const languageMatch = selectedLanguage === "all" || 
      project.targetLanguage === selectedLanguage;
    const statusMatch = selectedStatus === "all" || 
      project.status === selectedStatus;
    const priorityMatch = selectedPriority === "all" || 
      project.priority === selectedPriority;
    
    return languageMatch && statusMatch && priorityMatch;
  });

  // Analytics calculations
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const inProgressProjects = projects.filter(p => p.status === "in_progress").length;
  const averageProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;
  
  const overdueProjects = projects.filter(p => 
    p.dueDate && differenceInDays(new Date(p.dueDate), new Date()) < 0
  ).length;

  const projectsByLanguage = projects.reduce((acc, project) => {
    const lang = project.targetLanguage;
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const progressByStatus = {
    pending: projects.filter(p => p.status === "pending").length,
    in_progress: projects.filter(p => p.status === "in_progress").length,
    review: projects.filter(p => p.status === "review").length,
    completed: projects.filter(p => p.status === "completed").length,
  };

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Progress Tracking"
        subtitle="Monitor translation project progress and team performance"
        showCreateButton={false}
      />
      
      <div className="flex-1 overflow-auto p-6">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="font-medium text-accent">+{inProgressProjects}</span>
                <span className="text-muted-foreground ml-2">in progress</span>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="font-medium text-accent">{completedProjects}</span>
                <span className="text-muted-foreground ml-2">completed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Progress</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{averageProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={averageProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue Projects</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{overdueProjects}</p>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="font-medium text-destructive">
                  {overdueProjects > 0 ? "Attention needed" : "All on track"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Project Details</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="team">Team Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects List */}
            <Card>
              <CardHeader>
                <CardTitle>Project Progress ({filteredProjects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProjects.map((project) => {
                    const daysUntilDue = getDaysUntilDue(project.dueDate);
                    const dueDateStatus = getDueDateStatus(project.dueDate);
                    
                    return (
                      <div key={project.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{project.content.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {project.content.event} • {project.content.topic}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getPriorityColor(project.priority)}>
                              {project.priority}
                            </Badge>
                            <Badge variant="secondary" className={getStatusColor(project.status)}>
                              {project.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Translator:</span>
                            <span className="font-medium">
                              {project.assignedTo 
                                ? `${project.assignedTo.firstName} ${project.assignedTo.lastName}`
                                : "Unassigned"
                              }
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Due:</span>
                            <span className={`font-medium ${
                              dueDateStatus === "overdue" ? "text-destructive" :
                              dueDateStatus === "due-soon" ? "text-warning" : "text-foreground"
                            }`}>
                              {project.dueDate 
                                ? format(new Date(project.dueDate), "MMM dd, yyyy")
                                : "No due date"
                              }
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Time left:</span>
                            <span className={`font-medium ${
                              dueDateStatus === "overdue" ? "text-destructive" :
                              dueDateStatus === "due-soon" ? "text-warning" : "text-foreground"
                            }`}>
                              {daysUntilDue !== null 
                                ? daysUntilDue < 0 
                                  ? `${Math.abs(daysUntilDue)} days overdue`
                                  : daysUntilDue === 0
                                  ? "Due today"
                                  : `${daysUntilDue} days left`
                                : "No deadline"
                              }
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-muted-foreground">Language:</span>
                            <span className="font-medium">
                              {project.sourceLanguage.toUpperCase()} → {project.targetLanguage.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Projects by Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(progressByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          status === "completed" ? "bg-accent" :
                          status === "in_progress" ? "bg-primary" :
                          status === "review" ? "bg-warning" : "bg-muted-foreground"
                        }`} />
                        <span className="capitalize">{status.replace("_", " ")}</span>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Projects by Language</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(projectsByLanguage).map(([language, count]) => (
                    <div key={language} className="flex items-center justify-between">
                      <span className="uppercase font-medium">{language}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>Team performance analytics will be available once more translation data is collected.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download, FileText, File, Image, Video, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface ExportJob {
  id: number;
  userId: number;
  projectId: number;
  format: string;
  status: string;
  fileUrl: string | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
  project: {
    id: number;
    contentId: number;
    translatedText: string | null;
    content: {
      id: number;
      title: string;
      description: string | null;
    };
  } | null;
}

interface TranslationProject {
  id: number;
  contentId: number;
  status: string;
  translatedText: string | null;
  content: {
    id: number;
    title: string;
    description: string | null;
  };
}

export default function ExportCenter() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const { toast } = useToast();

  const { data: exportJobs = [], isLoading: jobsLoading } = useQuery<ExportJob[]>({
    queryKey: ["/api/exports"],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<TranslationProject[]>({
    queryKey: ["/api/translation-projects"],
  });

  const createExportMutation = useMutation({
    mutationFn: async ({ projectId, format }: { projectId: number; format: string }) => {
      return await apiRequest("POST", "/api/exports", {
        userId: 1, // Mock user ID
        projectId,
        format,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exports"] });
      setIsExportDialogOpen(false);
      setSelectedProject("");
      setSelectedFormat("");
      toast({
        title: "Success",
        description: "Export job created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create export job",
        variant: "destructive",
      });
    },
  });

  const handleCreateExport = () => {
    if (!selectedProject || !selectedFormat) {
      toast({
        title: "Error",
        description: "Please select a project and format",
        variant: "destructive",
      });
      return;
    }
    createExportMutation.mutate({
      projectId: parseInt(selectedProject),
      format: selectedFormat,
    });
  };

  const handleDownload = (fileUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    link.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "docx":
        return <File className="h-4 w-4 text-blue-500" />;
      case "txt":
        return <FileText className="h-4 w-4 text-gray-500" />;
      case "srt":
        return <Video className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const formatOptions = [
    { value: "docx", label: "Word Document (.docx)", description: "Formatted document for editing" },
    { value: "pdf", label: "PDF Document (.pdf)", description: "Print-ready format" },
    { value: "txt", label: "Plain Text (.txt)", description: "Simple text format" },
    { value: "srt", label: "Subtitle File (.srt)", description: "Video subtitle format" },
  ];

  // Filter projects that have completed translations
  const availableProjects = projects.filter(project => 
    project.status === "completed" && project.translatedText
  );

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Export Center"
        subtitle="Download translations in multiple formats"
        showCreateButton={false}
      />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Export Jobs</h2>
            <p className="text-muted-foreground">
              Create and manage export jobs for your completed translations
            </p>
          </div>
          
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>New Export</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Export</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project">Translation Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProjects.map(project => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.content.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availableProjects.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      No completed translations available for export
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format..." />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            {getFormatIcon(option.value)}
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">{option.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsExportDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateExport}
                    disabled={createExportMutation.isPending || !selectedProject || !selectedFormat}
                  >
                    {createExportMutation.isPending ? "Creating..." : "Create Export"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {jobsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : exportJobs.length === 0 ? (
          <div className="text-center py-12">
            <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No export jobs yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first export job to download translations in various formats.
            </p>
            <Button onClick={() => setIsExportDialogOpen(true)}>
              <Download className="h-4 w-4 mr-2" />
              Create Export
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exportJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center space-x-2">
                        {getFormatIcon(job.format)}
                        <span>{job.project?.content.title || "Unknown Project"}</span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {job.format.toUpperCase()} Export
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(job.status)}
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.project?.content.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.project.content.description}
                    </p>
                  )}
                  
                  {job.status === "processing" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Processing...</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  )}
                  
                  {job.error && (
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <p className="text-sm text-destructive">{job.error}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Created:</span>
                      <span>{format(new Date(job.createdAt), "MMM dd, yyyy HH:mm")}</span>
                    </div>
                    {job.completedAt && (
                      <div className="flex items-center justify-between">
                        <span>Completed:</span>
                        <span>{format(new Date(job.completedAt), "MMM dd, yyyy HH:mm")}</span>
                      </div>
                    )}
                  </div>
                  
                  {job.status === "completed" && job.fileUrl && (
                    <Button 
                      className="w-full"
                      onClick={() => handleDownload(
                        job.fileUrl!, 
                        `${job.project?.content.title || 'export'}.${job.format}`
                      )}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                  )}
                  
                  {job.status === "failed" && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Retry logic would go here
                        toast({
                          title: "Retry",
                          description: "Retry functionality not implemented yet",
                        });
                      }}
                    >
                      Retry Export
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, Calendar, User, FileText, Video } from "lucide-react";
import { format } from "date-fns";

interface Content {
  id: number;
  title: string;
  description: string | null;
  event: string | null;
  topic: string | null;
  contentDate: string | null;
  videoUrl: string | null;
  koreanTranscription: string | null;
  status: string;
  createdAt: string;
  uploadedBy: number | null;
}

export default function ContentManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    event: "",
    topic: "",
    contentDate: "",
    koreanTranscription: "",
  });
  const { toast } = useToast();

  const { data: contents = [], isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents"],
  });

  const createContentMutation = useMutation({
    mutationFn: async (content: typeof newContent) => {
      return await apiRequest("POST", "/api/contents", {
        ...content,
        contentDate: content.contentDate ? new Date(content.contentDate) : null,
        uploadedBy: 1, // Mock user ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contents"] });
      setIsCreateDialogOpen(false);
      setNewContent({
        title: "",
        description: "",
        event: "",
        topic: "",
        contentDate: "",
        koreanTranscription: "",
      });
      toast({
        title: "Success",
        description: "Content uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload content",
        variant: "destructive",
      });
    },
  });

  const handleCreateContent = () => {
    if (!newContent.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    createContentMutation.mutate(newContent);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "ready_for_translation":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "ready_for_translation":
        return "Ready for Translation";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Content Manager"
        subtitle="Upload and manage Korean video transcriptions"
        showCreateButton={false}
      />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search content..."
              className="w-64"
            />
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload Content</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload New Content</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newContent.title}
                      onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                      placeholder="Weekly Forum - Faith and Community"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentDate">Content Date</Label>
                    <Input
                      id="contentDate"
                      type="date"
                      value={newContent.contentDate}
                      onChange={(e) => setNewContent({ ...newContent, contentDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event">Event</Label>
                    <Input
                      id="event"
                      value={newContent.event}
                      onChange={(e) => setNewContent({ ...newContent, event: e.target.value })}
                      placeholder="Weekly Forum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      value={newContent.topic}
                      onChange={(e) => setNewContent({ ...newContent, topic: e.target.value })}
                      placeholder="Romans 12:1-8"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newContent.description}
                    onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                    placeholder="Brief description of the content..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="koreanTranscription">Korean Transcription</Label>
                  <Textarea
                    id="koreanTranscription"
                    value={newContent.koreanTranscription}
                    onChange={(e) => setNewContent({ ...newContent, koreanTranscription: e.target.value })}
                    placeholder="Enter Korean transcription here..."
                    rows={6}
                    className="font-mono"
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateContent}
                    disabled={createContentMutation.isPending}
                  >
                    {createContentMutation.isPending ? "Uploading..." : "Upload Content"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
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
        ) : contents.length === 0 ? (
          <div className="text-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No content uploaded yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by uploading your first Korean video transcription.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Content
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <Card key={content.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{content.title}</CardTitle>
                    <Badge variant={getStatusBadgeVariant(content.status)}>
                      {getStatusLabel(content.status)}
                    </Badge>
                  </div>
                  {content.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {content.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {content.event && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {content.event}
                        {content.topic && ` - ${content.topic}`}
                      </div>
                    )}
                    
                    {content.contentDate && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(new Date(content.contentDate), "MMM dd, yyyy")}
                      </div>
                    )}
                    
                    {content.koreanTranscription && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 mr-2" />
                        {content.koreanTranscription.length} characters
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(content.createdAt), "MMM dd, yyyy")}
                      </span>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

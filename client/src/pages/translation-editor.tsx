import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import BilingualEditor from "@/components/editor/bilingual-editor";
import TMPanel from "@/components/translation-memory/tm-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, Bot, History, MessageSquare, Clock, Zap } from "lucide-react";

interface TranslationProject {
  id: number;
  contentId: number;
  sourceLanguage: string;
  targetLanguage: string;
  assignedToId: number | null;
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
    koreanTranscription: string | null;
  };
  assignedTo: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    username: string;
  } | null;
}

export default function TranslationEditor() {
  const { id } = useParams();
  const [translatedText, setTranslatedText] = useState("");
  const [currentSourceText, setCurrentSourceText] = useState("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showTMPanel, setShowTMPanel] = useState(true);
  const { toast } = useToast();

  const { data: project, isLoading } = useQuery<TranslationProject>({
    queryKey: ["/api/translation-projects", id],
    enabled: !!id,
  });

  const { data: tmSuggestions } = useQuery({
    queryKey: ["/api/translation-memory/search", project?.content.koreanTranscription],
    enabled: !!project?.content.koreanTranscription,
  });

  const { data: glossaryTerms } = useQuery({
    queryKey: ["/api/glossary"],
  });

  // Auto-save functionality
  useEffect(() => {
    if (!project || !translatedText) return;

    const saveTimeout = setTimeout(async () => {
      setIsAutoSaving(true);
      try {
        await apiRequest("PUT", `/api/translation-projects/${project.id}`, {
          translatedText,
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsAutoSaving(false);
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [translatedText, project]);

  // Initialize translated text from project data
  useEffect(() => {
    if (project?.translatedText) {
      setTranslatedText(project.translatedText);
    }
  }, [project]);

  const updateProjectMutation = useMutation({
    mutationFn: async (updates: Partial<TranslationProject>) => {
      return await apiRequest("PUT", `/api/translation-projects/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translation-projects", id] });
      toast({
        title: "Success",
        description: "Translation saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save translation",
        variant: "destructive",
      });
    },
  });

  const translateMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/translate", {
        text,
        from: "ko",
        to: "en",
      });
      return response.json();
    },
    onSuccess: (data) => {
      setTranslatedText(data.translatedText);
      toast({
        title: "Success",
        description: "Auto-translation completed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Auto-translation failed",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProjectMutation.mutate({
      translatedText,
      progress: Math.min(100, Math.max(0, Math.floor((translatedText.length / (project?.content.koreanTranscription?.length || 1)) * 100))),
    });
  };

  const handleAutoTranslate = () => {
    if (project?.content.koreanTranscription) {
      translateMutation.mutate(project.content.koreanTranscription);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    updateProjectMutation.mutate({ status: newStatus });
  };

  // Handle TM suggestion selection
  const handleTmSuggestionSelect = (suggestion: any) => {
    setTranslatedText(prev => prev + (prev ? " " : "") + suggestion.targetText);
    toast({
      title: "Translation Suggestion Applied",
      description: `Added translation from memory (${suggestion.matchScore}% match)`,
    });
  };

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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Translation Editor" subtitle="Loading..." />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto p-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Translation Editor" subtitle="Project not found" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Project not found</h3>
            <p className="text-muted-foreground">The requested translation project could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Translation Editor"
        subtitle={`${project.content.title} - ${project.content.event || "Translation Project"}`}
        showCreateButton={false}
      />
      
      <div className="flex-1 overflow-auto">
        {/* Project Info Bar */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant={getStatusBadgeVariant(project.status)}>
                {project.status.replace("_", " ").toUpperCase()}
              </Badge>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Progress:</span>
                <Progress value={project.progress} className="w-20" />
                <span>{project.progress}%</span>
              </div>
              {project.assignedTo && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <span>Assigned to:</span>
                  <span className="font-medium">
                    {project.assignedTo.firstName} {project.assignedTo.lastName}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={project.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoTranslate}
                disabled={translateMutation.isPending}
              >
                <Bot className="h-4 w-4 mr-2" />
                {translateMutation.isPending ? "Translating..." : "Auto Translate"}
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={updateProjectMutation.isPending}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProjectMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Editor Layout with TM Panel */}
        <div className="flex h-full">
          {/* Editor Section */}
          <div className="flex-1 p-6">
            <BilingualEditor
              sourceText={project.content.koreanTranscription || ""}
              targetText={translatedText}
              onTargetTextChange={setTranslatedText}
              sourceLanguage="Korean"
              targetLanguage="English"
            />
            
            {/* Bottom Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Glossary Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Relevant Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {glossaryTerms && Array.isArray(glossaryTerms) && glossaryTerms.length > 0 ? (
                    glossaryTerms.slice(0, 3).map((term: any, index: number) => (
                      <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                        <div className="font-medium text-foreground mb-1">
                          {term.koreanTerm} → {term.englishTerm}
                        </div>
                        <div className="text-muted-foreground">
                          {term.definition}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No relevant terms found.</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Activity History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Translation progress tracked automatically</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Translation Memory Panel */}
          {showTMPanel && (
            <TMPanel
              sourceText={currentSourceText || project.content.koreanTranscription || ""}
              onSuggestionSelect={handleTmSuggestionSelect}
              projectId={project.id}
              event={project.content.event || undefined}
              topic={project.content.topic || undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Characters:</span>
                  <span className="font-medium">
                    {translatedText.length} / {project.content.koreanTranscription?.length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Auto-save:</span>
                  <span className={`font-medium ${isAutoSaving ? "text-primary" : "text-accent"}`}>
                    {isAutoSaving ? "Saving..." : "Saved"}
                  </span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

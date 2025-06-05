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
    queryKey: [`/api/translation-projects/${id}`],
    enabled: !!id,
  });

  const { data: glossaryTerms } = useQuery({
    queryKey: ["/api/glossary/search", currentSourceText],
    enabled: !!currentSourceText,
  });

  useEffect(() => {
    if (project) {
      setTranslatedText(project.translatedText || "");
      setCurrentSourceText(project.content.koreanTranscription || "");
    }
  }, [project]);

  useEffect(() => {
    if (!translatedText) return;
    
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 2000);

    return () => clearTimeout(timer);
  }, [translatedText]);

  const handleAutoSave = async () => {
    if (!project) return;
    
    setIsAutoSaving(true);
    try {
      const response = await fetch(`/api/translation-projects/${project.id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          translatedText,
          progress: Math.min(100, Math.round((translatedText.length / (project.content.koreanTranscription?.length || 1)) * 100))
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const updateProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/translation-projects/${project?.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/translation-projects/${id}`] });
      toast({
        title: "Saved",
        description: "Translation has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to save translation.",
        variant: "destructive",
      });
    },
  });

  const handleTmSuggestionSelect = (suggestion: any) => {
    setTranslatedText(suggestion.targetText);
    toast({
      title: "Suggestion Applied",
      description: "Translation Memory suggestion has been applied.",
    });
  };

  const handleSave = () => {
    if (!project) return;
    
    updateProjectMutation.mutate({
      translatedText,
      progress: Math.min(100, Math.round((translatedText.length / (project.content.koreanTranscription?.length || 1)) * 100))
    });
  };

  const handleStatusChange = (newStatus: string) => {
    if (!project) return;
    
    updateProjectMutation.mutate({
      status: newStatus
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Translation project not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto">
        {/* Project Header */}
        <div className="border-b bg-card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{project.content.title}</h1>
                <p className="text-muted-foreground">
                  {project.sourceLanguage} → {project.targetLanguage}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTMPanel(!showTMPanel)}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  {showTMPanel ? "Hide" : "Show"} TM
                </Button>
                <Select value={project.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSave} disabled={updateProjectMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateProjectMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Progress:</span>
                <Progress value={project.progress} className="w-24" />
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Priority:</span>
                <Badge variant="outline" className={`${
                  project.priority === 'urgent' ? 'border-red-500 text-red-600' :
                  project.priority === 'high' ? 'border-orange-500 text-orange-600' :
                  project.priority === 'medium' ? 'border-blue-500 text-blue-600' :
                  'border-green-500 text-green-600'
                }`}>
                  {project.priority}
                </Badge>
              </div>
              {project.assignedTo && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Assigned to:</span>
                  <span className="font-medium">
                    {project.assignedTo.firstName} {project.assignedTo.lastName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Editor Layout */}
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
              
              {/* Session Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Session Info
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
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Bot, Brain, BookOpen, Zap, Star, Copy, ArrowRight, CheckCircle2 } from "lucide-react";

interface CustomModel {
  id: string;
  name: string;
  category: string;
  description: string;
  status: string;
  sourceLanguage: string;
  targetLanguage: string;
  createdAt: string;
}

interface TranslationPanelProps {
  sourceText: string;
  onTranslationSelect: (translation: string) => void;
  className?: string;
}

export default function TranslationPanel({ 
  sourceText, 
  onTranslationSelect, 
  className = "" 
}: TranslationPanelProps) {
  const [activeModel, setActiveModel] = useState<string>("biblical");
  const [inputText, setInputText] = useState(sourceText);
  const { toast } = useToast();

  // Fetch available custom models
  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ["/api/azure-translator/models"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Biblical translation mutation
  const biblicalTranslation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch("/api/azure-translator/translate/biblical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error("Translation failed");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Biblical Translation Complete",
        description: "Specialized biblical model translation generated.",
      });
    },
    onError: () => {
      toast({
        title: "Translation Failed",
        description: "Biblical translation service unavailable.",
        variant: "destructive",
      });
    },
  });

  // Theological translation mutation
  const theologicalTranslation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch("/api/azure-translator/translate/theological", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error("Translation failed");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Theological Translation Complete",
        description: "Specialized theological model translation generated.",
      });
    },
    onError: () => {
      toast({
        title: "Translation Failed",
        description: "Theological translation service unavailable.",
        variant: "destructive",
      });
    },
  });

  // Quality assessment mutation
  const qualityAssessment = useMutation({
    mutationFn: async (data: { sourceText: string; translatedText: string }) => {
      const response = await fetch("/api/azure-translator/quality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Quality assessment failed");
      return response.json();
    },
  });

  const handleTranslate = (model: string) => {
    if (!inputText.trim()) return;

    switch (model) {
      case "biblical":
        biblicalTranslation.mutate(inputText);
        break;
      case "theological":
        theologicalTranslation.mutate(inputText);
        break;
      default:
        break;
    }
  };

  const handleSelectTranslation = (translation: string) => {
    onTranslationSelect(translation);
    toast({
      title: "Translation Applied",
      description: "Azure Custom Translator result has been applied.",
    });
  };

  const handleAssessQuality = (sourceText: string, translatedText: string) => {
    qualityAssessment.mutate({ sourceText, translatedText });
  };

  return (
    <div className={`w-80 bg-background border-l ${className}`}>
      <Card className="h-full border-0 rounded-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Bot className="h-5 w-5 mr-2 text-blue-600" />
            Azure Custom Translator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Domain-specific AI translation models
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Input Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Source Text</label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter Korean text to translate..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Translation Models */}
          <Tabs value={activeModel} onValueChange={setActiveModel} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="biblical" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                Biblical
              </TabsTrigger>
              <TabsTrigger value="theological" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                Theological
              </TabsTrigger>
            </TabsList>

            <TabsContent value="biblical" className="space-y-3 mt-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Biblical Model</h4>
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Specialized for biblical texts, scriptures, and religious terminology
                </p>
                <Button
                  onClick={() => handleTranslate("biblical")}
                  disabled={!inputText.trim() || biblicalTranslation.isPending}
                  className="w-full"
                  size="sm"
                >
                  {biblicalTranslation.isPending ? (
                    <>
                      <Zap className="h-3 w-3 mr-2 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-3 w-3 mr-2" />
                      Translate
                    </>
                  )}
                </Button>
              </div>

              {biblicalTranslation.data && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Biblical Translation</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(biblicalTranslation.data.translatedText)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectTranslation(biblicalTranslation.data.translatedText)}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">{biblicalTranslation.data.translatedText}</p>
                  <div className="flex items-center mt-2 gap-2">
                    <Badge variant="outline" className="text-xs">
                      {biblicalTranslation.data.model}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAssessQuality(inputText, biblicalTranslation.data.translatedText)}
                      disabled={qualityAssessment.isPending}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Quality
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="theological" className="space-y-3 mt-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Theological Model</h4>
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Optimized for theological concepts, doctrinal texts, and academic discourse
                </p>
                <Button
                  onClick={() => handleTranslate("theological")}
                  disabled={!inputText.trim() || theologicalTranslation.isPending}
                  className="w-full"
                  size="sm"
                >
                  {theologicalTranslation.isPending ? (
                    <>
                      <Zap className="h-3 w-3 mr-2 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-3 w-3 mr-2" />
                      Translate
                    </>
                  )}
                </Button>
              </div>

              {theologicalTranslation.data && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Theological Translation</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(theologicalTranslation.data.translatedText)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectTranslation(theologicalTranslation.data.translatedText)}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">{theologicalTranslation.data.translatedText}</p>
                  <div className="flex items-center mt-2 gap-2">
                    <Badge variant="outline" className="text-xs">
                      {theologicalTranslation.data.model}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAssessQuality(inputText, theologicalTranslation.data.translatedText)}
                      disabled={qualityAssessment.isPending}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Quality
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Quality Assessment Results */}
          {qualityAssessment.data && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Translation Quality</span>
                  <Badge variant={qualityAssessment.data.score >= 80 ? "default" : "secondary"}>
                    {qualityAssessment.data.score}%
                  </Badge>
                </div>
                <Progress value={qualityAssessment.data.score} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Confidence: {Math.round(qualityAssessment.data.confidence * 100)}%
                </p>
              </div>
            </>
          )}

          {/* Available Models Info */}
          {models && models.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Available Models</h4>
                {models.slice(0, 2).map((model: CustomModel) => (
                  <div key={model.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div>
                      <p className="text-xs font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.category}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {model.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
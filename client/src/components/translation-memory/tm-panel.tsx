import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  User,
  Tag,
  Zap,
  History,
  Settings
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface TMSuggestion {
  id: number;
  sourceText: string;
  targetText: string;
  matchScore: number;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
  event?: string;
  topic?: string;
  usageCount: number;
  avgRating?: number;
  createdAt: string;
  translatedBy: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    username: string;
  } | null;
}

interface TMPanelProps {
  sourceText: string;
  onSuggestionSelect: (suggestion: TMSuggestion) => void;
  projectId?: number;
  event?: string;
  topic?: string;
}

export default function TMPanel({ 
  sourceText, 
  onSuggestionSelect, 
  projectId, 
  event, 
  topic 
}: TMPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<TMSuggestion | null>(null);
  const queryClient = useQueryClient();

  // Auto-search when sourceText changes
  useEffect(() => {
    if (sourceText && sourceText.trim().length > 2) {
      setSearchQuery(sourceText.trim());
    }
  }, [sourceText]);

  // TM search query
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["/api/translation-memory/search", searchQuery, event, topic],
    enabled: searchQuery.length > 2,
    queryFn: async () => {
      const params = new URLSearchParams({
        sourceText: searchQuery,
        sourceLanguage: 'ko',
        targetLanguage: 'en',
        similarity: '70',
        limit: '8'
      });
      
      if (event) params.append('event', event);
      if (topic) params.append('topic', topic);
      
      return apiRequest(`/api/translation-memory/search?${params}`);
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  // TM feedback mutation
  const feedbackMutation = useMutation({
    mutationFn: async (data: {
      tmSegmentId: number;
      action: 'used' | 'dismissed' | 'rated' | 'copied';
      rating?: number;
      projectId?: number;
    }) => {
      return apiRequest("/api/translation-memory/feedback", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translation-memory/search"] });
    },
  });

  const handleCopySuggestion = (suggestion: TMSuggestion) => {
    navigator.clipboard.writeText(suggestion.targetText);
    feedbackMutation.mutate({
      tmSegmentId: suggestion.id,
      action: 'copied',
      projectId,
    });
    onSuggestionSelect(suggestion);
  };

  const handleUseSuggestion = (suggestion: TMSuggestion) => {
    feedbackMutation.mutate({
      tmSegmentId: suggestion.id,
      action: 'used',
      projectId,
    });
    onSuggestionSelect(suggestion);
  };

  const handleRateSuggestion = (suggestion: TMSuggestion, rating: number) => {
    feedbackMutation.mutate({
      tmSegmentId: suggestion.id,
      action: 'rated',
      rating,
      projectId,
    });
  };

  const handleDismissSuggestion = (suggestion: TMSuggestion) => {
    feedbackMutation.mutate({
      tmSegmentId: suggestion.id,
      action: 'dismissed',
      projectId,
    });
  };

  const getMatchColor = (score: number) => {
    if (score === 100) return 'text-accent';
    if (score >= 90) return 'text-primary';
    if (score >= 80) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getMatchBadgeVariant = (score: number) => {
    if (score === 100) return 'default';
    if (score >= 90) return 'secondary';
    if (score >= 80) return 'outline';
    return 'outline';
  };

  return (
    <div className="w-80 h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center">
          <Zap className="h-4 w-4 mr-2 text-primary" />
          Translation Memory
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          AI-powered translation suggestions
        </p>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search translation memory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Suggestions List */}
      <div className="flex-1 overflow-auto">
        {isLoading && (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Searching...</p>
          </div>
        )}

        {!isLoading && searchQuery.length <= 2 && (
          <div className="p-4 text-center text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Type at least 3 characters to search</p>
          </div>
        )}

        {!isLoading && searchQuery.length > 2 && suggestions.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No translation matches found</p>
            <p className="text-xs mt-1">Try adjusting your search terms</p>
          </div>
        )}

        <div className="space-y-3 p-4">
          {suggestions.map((suggestion: TMSuggestion) => (
            <Card 
              key={suggestion.id} 
              className={`hover:bg-muted/50 transition-colors cursor-pointer ${
                selectedSuggestion?.id === suggestion.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedSuggestion(suggestion)}
            >
              <CardContent className="p-4">
                {/* Match Score */}
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={getMatchBadgeVariant(suggestion.matchScore)}>
                    {suggestion.matchScore === 100 ? 'Exact' : `${suggestion.matchScore}%`}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {suggestion.avgRating && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {suggestion.avgRating}/5
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Used {suggestion.usageCount}x
                    </div>
                  </div>
                </div>

                {/* Source Text */}
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">Source (Korean)</p>
                  <p className="text-sm text-foreground">{suggestion.sourceText}</p>
                </div>

                {/* Target Text */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Translation (English)</p>
                  <p className="text-sm font-medium text-foreground">{suggestion.targetText}</p>
                </div>

                {/* Context Info */}
                {(suggestion.event || suggestion.topic || suggestion.context) && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {suggestion.event && (
                      <Badge variant="outline" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {suggestion.event}
                      </Badge>
                    )}
                    {suggestion.topic && (
                      <Badge variant="outline" className="text-xs">
                        {suggestion.topic}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {suggestion.translatedBy?.firstName || suggestion.translatedBy?.username || 'Unknown'}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(suggestion.createdAt), "MMM dd")}
                  </div>
                </div>

                {/* Match Progress Bar */}
                <div className="mb-3">
                  <Progress 
                    value={suggestion.matchScore} 
                    className="h-1" 
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopySuggestion(suggestion);
                    }}
                    className="flex-1"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseSuggestion(suggestion);
                    }}
                    className="flex-1"
                  >
                    Use
                  </Button>
                </div>

                {/* Rating Buttons */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRateSuggestion(suggestion, 5);
                      }}
                      className="p-1"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRateSuggestion(suggestion, 1);
                      }}
                      className="p-1"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismissSuggestion(suggestion);
                    }}
                    className="text-xs"
                  >
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{suggestions.length} suggestions</span>
          <Button variant="ghost" size="sm">
            <Settings className="h-3 w-3 mr-1" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
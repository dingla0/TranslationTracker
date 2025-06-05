import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Book, Edit, ArrowRight } from "lucide-react";

interface GlossaryTerm {
  id: number;
  koreanTerm: string;
  englishTerm: string;
  definition: string | null;
  usage: string | null;
  partOfSpeech: string | null;
  category: string | null;
  tags: string[] | null;
  createdAt: string;
}

export default function GlossaryPreview() {
  const [, setLocation] = useLocation();
  
  const { data: terms = [], isLoading } = useQuery<GlossaryTerm[]>({
    queryKey: ["/api/glossary"],
  });

  const handleManageGlossary = () => {
    setLocation("/glossary");
  };

  if (isLoading) {
    return (
      <Card className="content-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 bg-muted rounded-lg space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="content-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Glossary Terms</CardTitle>
          <Button 
            variant="link" 
            className="text-primary hover:text-primary/80"
            onClick={handleManageGlossary}
          >
            Manage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {terms.length === 0 ? (
          <div className="text-center py-8">
            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No glossary terms yet</h3>
            <p className="text-muted-foreground mb-4">
              Add terminology to improve translation consistency.
            </p>
            <Button onClick={handleManageGlossary}>
              <Book className="h-4 w-4 mr-2" />
              Add Terms
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {terms.slice(0, 3).map((term) => (
              <div 
                key={term.id} 
                className="flex items-start justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-foreground font-mono">{term.koreanTerm}</p>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{term.englishTerm}</p>
                  </div>
                  
                  {term.usage && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {term.usage}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {term.partOfSpeech && (
                      <Badge variant="outline" className="text-xs">
                        {term.partOfSpeech}
                      </Badge>
                    )}
                    {term.category && (
                      <Badge variant="secondary" className="text-xs">
                        {term.category}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" onClick={handleManageGlossary}>
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            {terms.length > 3 && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handleManageGlossary}
              >
                View All {terms.length} Terms
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

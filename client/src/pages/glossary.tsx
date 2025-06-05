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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Search, Edit, Trash2, Book, Tag } from "lucide-react";

interface GlossaryTerm {
  id: number;
  koreanTerm: string;
  englishTerm: string;
  definition: string | null;
  usage: string | null;
  partOfSpeech: string | null;
  category: string | null;
  tags: string[] | null;
  addedBy: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    username: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function Glossary() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newTerm, setNewTerm] = useState({
    koreanTerm: "",
    englishTerm: "",
    definition: "",
    usage: "",
    partOfSpeech: "",
    category: "",
    tags: "",
  });
  const { toast } = useToast();

  const { data: terms = [], isLoading } = useQuery<GlossaryTerm[]>({
    queryKey: ["/api/glossary"],
  });

  const createTermMutation = useMutation({
    mutationFn: async (term: typeof newTerm) => {
      return await apiRequest("POST", "/api/glossary", {
        ...term,
        tags: term.tags ? term.tags.split(",").map(tag => tag.trim()) : [],
        addedBy: 1, // Mock user ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/glossary"] });
      setIsCreateDialogOpen(false);
      setNewTerm({
        koreanTerm: "",
        englishTerm: "",
        definition: "",
        usage: "",
        partOfSpeech: "",
        category: "",
        tags: "",
      });
      toast({
        title: "Success",
        description: "Glossary term added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add glossary term",
        variant: "destructive",
      });
    },
  });

  const deleteTermMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/glossary/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/glossary"] });
      toast({
        title: "Success",
        description: "Glossary term deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete glossary term",
        variant: "destructive",
      });
    },
  });

  const handleCreateTerm = () => {
    if (!newTerm.koreanTerm.trim() || !newTerm.englishTerm.trim()) {
      toast({
        title: "Error",
        description: "Korean and English terms are required",
        variant: "destructive",
      });
      return;
    }
    createTermMutation.mutate(newTerm);
  };

  const handleDeleteTerm = (id: number) => {
    if (confirm("Are you sure you want to delete this term?")) {
      deleteTermMutation.mutate(id);
    }
  };

  // Filter terms based on search and category
  const filteredTerms = terms.filter(term => {
    const matchesSearch = !searchQuery || 
      term.koreanTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.englishTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      term.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(terms.map(term => term.category).filter(Boolean)));

  const partOfSpeechOptions = [
    "noun", "verb", "adjective", "adverb", "preposition", "conjunction", "interjection"
  ];

  const categoryOptions = [
    "theological", "general", "technical", "biblical", "liturgical"
  ];

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Glossary Management"
        subtitle="Manage terminology and translation consistency"
        showCreateButton={false}
      />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category!}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Term</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Glossary Term</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="koreanTerm">Korean Term *</Label>
                    <Input
                      id="koreanTerm"
                      value={newTerm.koreanTerm}
                      onChange={(e) => setNewTerm({ ...newTerm, koreanTerm: e.target.value })}
                      placeholder="믿음"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="englishTerm">English Term *</Label>
                    <Input
                      id="englishTerm"
                      value={newTerm.englishTerm}
                      onChange={(e) => setNewTerm({ ...newTerm, englishTerm: e.target.value })}
                      placeholder="faith"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="definition">Definition</Label>
                  <Textarea
                    id="definition"
                    value={newTerm.definition}
                    onChange={(e) => setNewTerm({ ...newTerm, definition: e.target.value })}
                    placeholder="Definition of the term..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="usage">Usage Context</Label>
                  <Textarea
                    id="usage"
                    value={newTerm.usage}
                    onChange={(e) => setNewTerm({ ...newTerm, usage: e.target.value })}
                    placeholder="How and when to use this term..."
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partOfSpeech">Part of Speech</Label>
                    <Select value={newTerm.partOfSpeech} onValueChange={(value) => setNewTerm({ ...newTerm, partOfSpeech: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {partOfSpeechOptions.map(pos => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newTerm.category} onValueChange={(value) => setNewTerm({ ...newTerm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newTerm.tags}
                    onChange={(e) => setNewTerm({ ...newTerm, tags: e.target.value })}
                    placeholder="biblical, spiritual, core-concept"
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
                    onClick={handleCreateTerm}
                    disabled={createTermMutation.isPending}
                  >
                    {createTermMutation.isPending ? "Adding..." : "Add Term"}
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
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
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
        ) : filteredTerms.length === 0 ? (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery || selectedCategory !== "all" ? "No terms match your search" : "No glossary terms yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all" 
                ? "Try adjusting your search criteria or filters."
                : "Get started by adding your first glossary term."
              }
            </p>
            {!searchQuery && selectedCategory === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Term
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.map((term) => (
              <Card key={term.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-mono">{term.koreanTerm}</CardTitle>
                      <p className="text-base font-medium text-muted-foreground">
                        {term.englishTerm}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTerm(term.id)}
                        disabled={deleteTermMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {term.definition && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {term.definition}
                    </p>
                  )}
                  
                  {term.usage && (
                    <div className="text-sm">
                      <span className="font-medium text-foreground">Usage: </span>
                      <span className="text-muted-foreground">{term.usage}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
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
                  
                  {term.tags && term.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {term.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Added by {term.addedBy?.firstName} {term.addedBy?.lastName}
                    </span>
                    <span>
                      {new Date(term.createdAt).toLocaleDateString()}
                    </span>
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

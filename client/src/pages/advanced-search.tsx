import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  Book, 
  Users,
  Clock,
  Tag,
  Globe,
  Target
} from "lucide-react";
import { format } from "date-fns";

interface SearchResult {
  type: 'content' | 'project' | 'glossary';
  id: number;
  title: string;
  description: string;
  relevance: number;
  metadata: Record<string, any>;
}

export default function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [includeContent, setIncludeContent] = useState(true);
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeGlossary, setIncludeGlossary] = useState(true);

  // Mock search results for demonstration
  const searchResults: SearchResult[] = [
    {
      type: 'content',
      id: 1,
      title: 'Weekly Forum - Faith and Community',
      description: 'Discussion on building strong faith communities based on Romans 12:1-8',
      relevance: 95,
      metadata: {
        event: 'Weekly Forum',
        topic: 'Romans 12:1-8',
        status: 'ready_for_translation',
        date: '2024-01-15'
      }
    },
    {
      type: 'project',
      id: 1,
      title: 'Romans 12:1-8 Translation Project',
      description: 'Korean to English translation of Romans passage discussion',
      relevance: 88,
      metadata: {
        status: 'in_progress',
        progress: 65,
        assignedTo: 'Sarah Johnson',
        dueDate: '2024-02-01'
      }
    },
    {
      type: 'glossary',
      id: 2,
      title: '믿음 (faith)',
      description: 'Complete trust or confidence in God and His promises',
      relevance: 82,
      metadata: {
        category: 'theological',
        partOfSpeech: 'noun',
        tags: ['core-concept', 'spiritual', 'biblical']
      }
    }
  ];

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'content': return <FileText className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      case 'glossary': return <Book className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'content': return 'text-primary';
      case 'project': return 'text-accent';
      case 'glossary': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 90) return 'text-accent';
    if (relevance >= 70) return 'text-primary';
    if (relevance >= 50) return 'text-warning';
    return 'text-muted-foreground';
  };

  const filteredResults = searchResults.filter(result => {
    if (!includeContent && result.type === 'content') return false;
    if (!includeProjects && result.type === 'project') return false;
    if (!includeGlossary && result.type === 'glossary') return false;
    
    if (searchType !== 'all' && result.type !== searchType) return false;
    
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Advanced Search"
        subtitle="Find content, projects, and terminology across the platform"
        showCreateButton={false}
      />
      
      <div className="flex-1 overflow-auto p-6">
        {/* Search Interface */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Query
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content, projects, terminology..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Quick searches:</span>
              {['Romans 12', 'faith', 'in_progress', 'Korean transcription'].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="results" className="space-y-6">
          <TabsList>
            <TabsTrigger value="results">Search Results</TabsTrigger>
            <TabsTrigger value="filters">Advanced Filters</TabsTrigger>
            <TabsTrigger value="saved">Saved Searches</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            {/* Search Statistics */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Found <span className="font-semibold text-foreground">{filteredResults.length}</span> results
                    {searchQuery && (
                      <span> for "<span className="font-medium">{searchQuery}</span>"</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Sort by: Relevance</span>
                    <Select defaultValue="relevance">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="type">Type</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <Card key={`${result.type}-${result.id}`} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`${getResultColor(result.type)}`}>
                          {getResultIcon(result.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{result.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {result.type}
                        </Badge>
                        <div className={`text-sm font-medium ${getRelevanceColor(result.relevance)}`}>
                          {result.relevance}%
                        </div>
                      </div>
                    </div>

                    {/* Result Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      {result.type === 'content' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Date:</span>
                            <span>{format(new Date(result.metadata.date), "MMM dd, yyyy")}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Event:</span>
                            <span>{result.metadata.event}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Book className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Topic:</span>
                            <span>{result.metadata.topic}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="secondary" className="text-xs">
                              {result.metadata.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </>
                      )}

                      {result.type === 'project' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Assigned:</span>
                            <span>{result.metadata.assignedTo}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Progress:</span>
                            <span>{result.metadata.progress}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Due:</span>
                            <span>{format(new Date(result.metadata.dueDate), "MMM dd")}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="secondary" className="text-xs">
                              {result.metadata.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </>
                      )}

                      {result.type === 'glossary' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Book className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Category:</span>
                            <span>{result.metadata.category}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Part of Speech:</span>
                            <span>{result.metadata.partOfSpeech}</span>
                          </div>
                          <div className="flex items-center space-x-2 col-span-2">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Tags:</span>
                            <div className="flex flex-wrap gap-1">
                              {result.metadata.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="filters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Type Filters */}
                <div>
                  <h3 className="font-semibold mb-3">Content Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-content" 
                        checked={includeContent}
                        onCheckedChange={setIncludeContent}
                      />
                      <label htmlFor="include-content" className="text-sm">Content & Transcriptions</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-projects" 
                        checked={includeProjects}
                        onCheckedChange={setIncludeProjects}
                      />
                      <label htmlFor="include-projects" className="text-sm">Translation Projects</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-glossary" 
                        checked={includeGlossary}
                        onCheckedChange={setIncludeGlossary}
                      />
                      <label htmlFor="include-glossary" className="text-sm">Glossary Terms</label>
                    </div>
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date Range</label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="ready_for_translation">Ready for Translation</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Under Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Language</label>
                    <Select value={languageFilter} onValueChange={setLanguageFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Search Type</label>
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="content">Content Only</SelectItem>
                        <SelectItem value="project">Projects Only</SelectItem>
                        <SelectItem value="glossary">Glossary Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Reset Filters</Button>
                  <Button>Apply Filters</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Searches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4" />
                  <p>No saved searches yet. Create and save searches for quick access.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
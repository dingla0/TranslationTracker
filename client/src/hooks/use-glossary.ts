import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface GlossaryTerm {
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

export function useGlossary() {
  const { toast } = useToast();

  const glossaryQuery = useQuery<GlossaryTerm[]>({
    queryKey: ["/api/glossary"],
  });

  const createTermMutation = useMutation({
    mutationFn: async (term: {
      koreanTerm: string;
      englishTerm: string;
      definition?: string;
      usage?: string;
      partOfSpeech?: string;
      category?: string;
      tags?: string[];
      addedBy?: number;
    }) => {
      return await apiRequest("POST", "/api/glossary", term);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/glossary"] });
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

  const updateTermMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<GlossaryTerm> }) => {
      return await apiRequest("PUT", `/api/glossary/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/glossary"] });
      toast({
        title: "Success",
        description: "Glossary term updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update glossary term",
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

  return {
    terms: glossaryQuery.data || [],
    isLoading: glossaryQuery.isLoading,
    error: glossaryQuery.error,
    createTerm: createTermMutation.mutate,
    updateTerm: updateTermMutation.mutate,
    deleteTerm: deleteTermMutation.mutate,
    isCreating: createTermMutation.isPending,
    isUpdating: updateTermMutation.isPending,
    isDeleting: deleteTermMutation.isPending,
  };
}

export function useGlossarySearch(query: string) {
  return useQuery<GlossaryTerm[]>({
    queryKey: ["/api/glossary/search", { q: query }],
    enabled: !!query && query.length > 2,
  });
}

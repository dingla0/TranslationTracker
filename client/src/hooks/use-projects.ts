import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface TranslationProject {
  id: number;
  contentId: number;
  sourceLanguage: string;
  targetLanguage: string;
  assignedTo: number | null;
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

export function useProjects() {
  const { toast } = useToast();

  const projectsQuery = useQuery<TranslationProject[]>({
    queryKey: ["/api/translation-projects"],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (project: {
      contentId: number;
      sourceLanguage?: string;
      targetLanguage?: string;
      assignedTo?: number;
      priority?: string;
      dueDate?: string;
    }) => {
      return await apiRequest("POST", "/api/translation-projects", project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translation-projects"] });
      toast({
        title: "Success",
        description: "Translation project created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create translation project",
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<TranslationProject> }) => {
      return await apiRequest("PUT", `/api/translation-projects/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translation-projects"] });
      toast({
        title: "Success",
        description: "Translation project updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update translation project",
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/translation-projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translation-projects"] });
      toast({
        title: "Success",
        description: "Translation project deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete translation project",
        variant: "destructive",
      });
    },
  });

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  };
}

export function useProject(id: number) {
  const { toast } = useToast();

  const projectQuery = useQuery<TranslationProject>({
    queryKey: ["/api/translation-projects", id],
    enabled: !!id,
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (updates: Partial<TranslationProject>) => {
      return await apiRequest("PUT", `/api/translation-projects/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translation-projects", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/translation-projects"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update translation project",
        variant: "destructive",
      });
    },
  });

  return {
    project: projectQuery.data,
    isLoading: projectQuery.isLoading,
    error: projectQuery.error,
    updateProject: updateProjectMutation.mutate,
    isUpdating: updateProjectMutation.isPending,
  };
}

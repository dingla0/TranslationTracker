'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bot, Zap, Save, Clock, FileText, Target, Calendar } from 'lucide-react'
import Header from '@/components/layout/header'
import BilingualEditor from '@/components/editor/bilingual-editor'
import TMPanel from '@/components/translation-memory/tm-panel'
import TranslationPanel from '@/components/azure-translator/translation-panel'

interface TranslationProject {
  id: number
  contentId: number
  sourceLanguage: string
  targetLanguage: string
  assignedTo: number | null
  status: string
  priority: string
  dueDate: string | null
  progress: number
  translatedText: string | null
  reviewNotes: string | null
  content: {
    id: number
    title: string
    description: string | null
    event: string | null
    topic: string | null
    koreanTranscription: string | null
  }
  assignedTo: {
    id: number
    firstName: string | null
    lastName: string | null
    username: string
  } | null
}

export default function TranslationEditor() {
  const params = useParams()
  const id = params.id as string
  const [translatedText, setTranslatedText] = useState("")
  const [currentSourceText, setCurrentSourceText] = useState("")
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [showTMPanel, setShowTMPanel] = useState(true)
  const [showAzurePanel, setShowAzurePanel] = useState(true)

  const { data: project, isLoading } = useQuery<TranslationProject>({
    queryKey: [`/api/translation-projects/${id}`],
    enabled: !!id,
  })

  const updateProjectMutation = useMutation({
    mutationFn: async (updates: Partial<TranslationProject>) => {
      const response = await fetch(`/api/translation-projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to update project')
      return response.json()
    },
  })

  useEffect(() => {
    if (project?.translatedText) {
      setTranslatedText(project.translatedText)
    }
    if (project?.content?.koreanTranscription) {
      setCurrentSourceText(project.content.koreanTranscription)
    }
  }, [project])

  const handleSave = () => {
    updateProjectMutation.mutate({ 
      translatedText,
      progress: Math.min(100, Math.max(0, Math.round((translatedText.length / (currentSourceText.length || 1)) * 100)))
    })
  }

  const handleStatusChange = (newStatus: string) => {
    if (!project) return
    updateProjectMutation.mutate({ status: newStatus })
  }

  const handleTmSuggestionSelect = (suggestion: string) => {
    setTranslatedText(suggestion)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Translation Editor" />
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Translation Editor" />
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Translation project not found.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Translation Editor" />
      
      <div className="container mx-auto p-6">
        <div className="flex h-[calc(100vh-8rem)]">
          <div className="flex-1 mr-4">
            {/* Project Header */}
            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{project.content.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAzurePanel(!showAzurePanel)}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {showAzurePanel ? "Hide" : "Show"} Azure
                    </Button>
                    <Select value={project.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Under Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleSave}
                      disabled={updateProjectMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      {updateProjectMutation.isPending ? (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={project.priority === 'high' ? 'destructive' : project.priority === 'medium' ? 'default' : 'secondary'}>
                      {project.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <Progress value={project.progress} className="flex-1" />
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Editor */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Translation Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BilingualEditor
                  sourceText={project.content.koreanTranscription || ""}
                  targetText={translatedText}
                  onTargetTextChange={setTranslatedText}
                  onSourceTextChange={setCurrentSourceText}
                  sourceLanguage={project.sourceLanguage}
                  targetLanguage={project.targetLanguage}
                />
              </CardContent>
            </Card>
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

          {/* Azure Custom Translator Panel */}
          {showAzurePanel && (
            <TranslationPanel
              sourceText={currentSourceText || project.content.koreanTranscription || ""}
              onTranslationSelect={setTranslatedText}
            />
          )}
        </div>
      </div>
    </div>
  )
}
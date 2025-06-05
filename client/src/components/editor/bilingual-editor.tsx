import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  Bot, 
  History, 
  MessageSquare,
  Copy,
  RefreshCw
} from "lucide-react";

interface BilingualEditorProps {
  sourceText: string;
  targetText: string;
  onTargetTextChange: (text: string) => void;
  sourceLanguage?: string;
  targetLanguage?: string;
  onSave?: () => void;
  onAutoTranslate?: () => void;
  isAutoTranslating?: boolean;
  isSaving?: boolean;
}

export default function BilingualEditor({
  sourceText,
  targetText,
  onTargetTextChange,
  sourceLanguage = "Korean",
  targetLanguage = "English",
  onSave,
  onAutoTranslate,
  isAutoTranslating = false,
  isSaving = false
}: BilingualEditorProps) {
  const [selectedSourceText, setSelectedSourceText] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const targetTextareaRef = useRef<HTMLTextAreaElement>(null);
  const sourceTextRef = useRef<HTMLDivElement>(null);

  // Handle text selection in source text
  const handleSourceTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedSourceText(selection.toString().trim());
    }
  };

  // Insert text at cursor position
  const insertTextAtCursor = (textToInsert: string) => {
    if (targetTextareaRef.current) {
      const textarea = targetTextareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = targetText.substring(0, start) + textToInsert + targetText.substring(end);
      onTargetTextChange(newText);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
      }, 0);
    }
  };

  // Copy selected source text to target
  const copySelectedToTarget = () => {
    if (selectedSourceText) {
      insertTextAtCursor(selectedSourceText);
      setSelectedSourceText("");
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S for save
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        if (onSave) onSave();
      }
      
      // Ctrl+T for auto-translate
      if (event.ctrlKey && event.key === 't') {
        event.preventDefault();
        if (onAutoTranslate) onAutoTranslate();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onAutoTranslate]);

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  const getProgressPercentage = () => {
    if (!sourceText.trim()) return 0;
    const sourceLength = sourceText.trim().length;
    const targetLength = targetText.trim().length;
    return Math.min(100, Math.round((targetLength / sourceLength) * 100));
  };

  return (
    <Card className="content-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Translation Editor</CardTitle>
          <div className="flex items-center space-x-2">
            {selectedSourceText && (
              <Button
                variant="outline"
                size="sm"
                onClick={copySelectedToTarget}
                className="text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Selected
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onAutoTranslate}
              disabled={isAutoTranslating || !sourceText.trim()}
            >
              {isAutoTranslating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Bot className="h-4 w-4 mr-2" />
              )}
              {isAutoTranslating ? "Translating..." : "AI Assist"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              <History className="h-4 w-4 mr-2" />
              Memory
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Side-by-side {sourceLanguage} to {targetLanguage} translation workspace
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Text Panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">{sourceLanguage} (Source)</h3>
              <Button variant="link" size="sm" className="text-xs text-primary hover:text-primary/80">
                Edit Source
              </Button>
            </div>
            
            <div 
              ref={sourceTextRef}
              className="editor-pane bg-muted/50 overflow-auto cursor-text"
              onMouseUp={handleSourceTextSelection}
              style={{ minHeight: "200px" }}
            >
              <div className="text-foreground leading-relaxed whitespace-pre-wrap font-mono text-sm">
                {sourceText || (
                  <span className="text-muted-foreground italic">
                    No source text available. Please upload content first.
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{getCharacterCount(sourceText)} characters</span>
              <span>{getWordCount(sourceText)} words</span>
            </div>
          </div>
          
          {/* Target Text Panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">{targetLanguage} (Target)</h3>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium text-foreground">{getProgressPercentage()}%</span>
              </div>
            </div>
            
            <Textarea
              ref={targetTextareaRef}
              value={targetText}
              onChange={(e) => {
                onTargetTextChange(e.target.value);
                setCursorPosition(e.target.selectionStart);
              }}
              placeholder="Enter English translation here..."
              className="editor-pane resize-none font-mono text-sm"
              style={{ minHeight: "200px" }}
              onKeyDown={(e) => {
                // Tab to insert 4 spaces
                if (e.key === 'Tab') {
                  e.preventDefault();
                  insertTextAtCursor('    ');
                }
              }}
            />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{getCharacterCount(targetText)} characters</span>
              <span>{getWordCount(targetText)} words</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Editor Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Auto-saved"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>Collaborative editing</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-muted-foreground">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+T</kbd> Auto-translate
              <span className="mx-2">•</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+S</kbd> Save
            </div>
            
            <Button
              onClick={onSave}
              disabled={isSaving}
              size="sm"
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

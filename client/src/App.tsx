import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ContentManager from "@/pages/content-manager";
import TranslationEditor from "@/pages/translation-editor";
import Glossary from "@/pages/glossary";
import ExportCenter from "@/pages/export-center";
import ProgressTracking from "@/pages/progress-tracking";
import UserManagement from "@/pages/user-management";
import AdvancedSearch from "@/pages/advanced-search";
import QualityAssurance from "@/pages/quality-assurance";
import Collaboration from "@/pages/collaboration";
import Settings from "@/pages/settings";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/content" component={ContentManager} />
          <Route path="/editor/:id?" component={TranslationEditor} />
          <Route path="/translation-editor/:id?" component={TranslationEditor} />
          <Route path="/glossary" component={Glossary} />
          <Route path="/export" component={ExportCenter} />
          <Route path="/progress" component={ProgressTracking} />
          <Route path="/users" component={UserManagement} />
          <Route path="/search" component={AdvancedSearch} />
          <Route path="/quality" component={QualityAssurance} />
          <Route path="/collaboration" component={Collaboration} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

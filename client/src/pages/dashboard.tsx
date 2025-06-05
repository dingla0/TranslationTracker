import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import StatsGrid from "@/components/dashboard/stats-grid";
import RecentContent from "@/components/dashboard/recent-content";
import QuickActions from "@/components/dashboard/quick-actions";
import TeamActivity from "@/components/dashboard/team-activity";
import GlossaryPreview from "@/components/glossary/glossary-preview";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/translation-projects"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Translation Dashboard"
        subtitle="Manage your translation projects and track progress"
        showCreateButton={true}
        createButtonText="New Project"
      />
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <StatsGrid stats={stats} isLoading={statsLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RecentContent projects={projects} isLoading={projectsLoading} />
          </div>
          
          <div className="space-y-8">
            <QuickActions />
            <TeamActivity activities={activities} isLoading={activitiesLoading} />
            <GlossaryPreview />
          </div>
        </div>
      </div>
    </div>
  );
}

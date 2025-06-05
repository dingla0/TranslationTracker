import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Plus, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showCreateButton?: boolean;
  createButtonText?: string;
  onCreateClick?: () => void;
}

export default function Header({ 
  title, 
  subtitle, 
  showCreateButton = false, 
  createButtonText = "Create",
  onCreateClick 
}: HeaderProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Search content..."
            className="w-64 pl-10 pr-4"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Create Button */}
        {showCreateButton && (
          <Button onClick={onCreateClick} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>{createButtonText}</span>
          </Button>
        )}
      </div>
    </header>
  );
}

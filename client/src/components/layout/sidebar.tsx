import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileVideo, 
  Edit, 
  Book, 
  TrendingUp, 
  Download, 
  Users, 
  Settings,
  Languages
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Content Manager", href: "/content", icon: FileVideo },
  { name: "Translation Editor", href: "/editor", icon: Edit },
  { name: "Glossary", href: "/glossary", icon: Book },
  { name: "Progress Tracking", href: "/progress", icon: TrendingUp },
  { name: "Export Center", href: "/export", icon: Download },
];

const accountNavigation = [
  { name: "User Management", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Languages className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">TranslateFlow</h1>
            <p className="text-xs text-muted-foreground">Translation Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            
            return (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={cn(
                    "sidebar-nav-item",
                    isActive ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Account
            </h3>
            {accountNavigation.map((item) => {
              const isActive = location === item.href;
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "sidebar-nav-item",
                    isActive ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-foreground">CK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Christian Ko</p>
            <p className="text-xs text-muted-foreground truncate">Translation Lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

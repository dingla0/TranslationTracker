import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageCircle, 
  Bell, 
  Video, 
  Share2, 
  Clock,
  Send,
  UserCheck,
  Activity,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

interface Collaborator {
  id: number;
  name: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: string;
  currentProject?: number;
}

interface Comment {
  id: number;
  userId: number;
  userName: string;
  content: string;
  projectId: number;
  createdAt: string;
  resolved: boolean;
}

interface Notification {
  id: number;
  type: 'comment' | 'assignment' | 'completion' | 'review' | 'mention';
  title: string;
  message: string;
  projectId?: number;
  read: boolean;
  createdAt: string;
}

export default function Collaboration() {
  const [newComment, setNewComment] = useState("");
  const [selectedProject, setSelectedProject] = useState<number>(1);

  // Mock data for demonstration
  const collaborators: Collaborator[] = [
    {
      id: 1,
      name: "Christian Ko",
      role: "Admin",
      status: 'online',
      lastSeen: new Date().toISOString(),
      currentProject: 1
    },
    {
      id: 2,
      name: "Min Kim",
      role: "Korean Transcriber",
      status: 'online',
      lastSeen: new Date(Date.now() - 5 * 60000).toISOString(),
      currentProject: 2
    },
    {
      id: 3,
      name: "Sarah Johnson",
      role: "English Translator",
      status: 'away',
      lastSeen: new Date(Date.now() - 30 * 60000).toISOString(),
      currentProject: 1
    }
  ];

  const comments: Comment[] = [
    {
      id: 1,
      userId: 3,
      userName: "Sarah Johnson",
      content: "I need clarification on the translation of '은혜' in this context. Should it be 'grace' or 'mercy'?",
      projectId: 1,
      createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
      resolved: false
    },
    {
      id: 2,
      userId: 1,
      userName: "Christian Ko",
      content: "In this theological context, 'grace' would be more appropriate. It refers to God's unmerited favor.",
      projectId: 1,
      createdAt: new Date(Date.now() - 1 * 60 * 60000).toISOString(),
      resolved: false
    }
  ];

  const notifications: Notification[] = [
    {
      id: 1,
      type: 'comment',
      title: 'New Comment',
      message: 'Sarah Johnson commented on Romans 12:1-8 translation',
      projectId: 1,
      read: false,
      createdAt: new Date(Date.now() - 30 * 60000).toISOString()
    },
    {
      id: 2,
      type: 'assignment',
      title: 'New Assignment',
      message: 'You have been assigned to translate Matthew 28:16-20',
      projectId: 2,
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString()
    },
    {
      id: 3,
      type: 'completion',
      title: 'Translation Completed',
      message: 'Romans 12:1-8 translation has been marked as complete',
      projectId: 1,
      read: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60000).toISOString()
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-accent';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageCircle className="h-4 w-4" />;
      case 'assignment': return <UserCheck className="h-4 w-4" />;
      case 'completion': return <Activity className="h-4 w-4" />;
      case 'review': return <Users className="h-4 w-4" />;
      case 'mention': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const onlineCollaborators = collaborators.filter(c => c.status === 'online').length;

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Collaboration Hub"
        subtitle="Real-time collaboration and communication for translation teams"
        showCreateButton={false}
      />
      
      <div className="flex-1 overflow-auto p-6">
        {/* Collaboration Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Online Now</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{onlineCollaborators}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="font-medium text-accent">{collaborators.length}</span>
                <span className="text-muted-foreground ml-2">total team members</span>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Discussions</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{comments.filter(c => !c.resolved).length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{unreadNotifications}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Bell className="h-6 w-6 text-warning" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-muted-foreground">unread messages</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="team" className="space-y-6">
          <TabsList>
            <TabsTrigger value="team">Team Status</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications ({unreadNotifications})</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-foreground">
                              {collaborator.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(collaborator.status)}`} />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-foreground">{collaborator.name}</h3>
                          <p className="text-sm text-muted-foreground">{collaborator.role}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {collaborator.status}
                            </Badge>
                            {collaborator.currentProject && (
                              <span className="text-xs text-muted-foreground">
                                Working on Project #{collaborator.currentProject}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            {/* Comment Input */}
            <Card>
              <CardHeader>
                <CardTitle>Add Comment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Share your thoughts, ask questions, or provide feedback..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="self-end">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            <Card>
              <CardHeader>
                <CardTitle>Project Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-foreground">
                              {comment.userName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{comment.userName}</h4>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant={comment.resolved ? "default" : "secondary"}>
                            {comment.resolved ? "Resolved" : "Open"}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-foreground mb-3">{comment.content}</p>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          Reply
                        </Button>
                        {!comment.resolved && (
                          <Button variant="outline" size="sm">
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    Mark All Read
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${!notification.read ? 'bg-primary/10' : 'bg-muted'}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-foreground">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(notification.createdAt), "MMM dd, HH:mm")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          
                          {notification.projectId && (
                            <div className="mt-2">
                              <Button variant="outline" size="sm">
                                View Project #{notification.projectId}
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Team Meetings & Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4" />
                  <p className="mb-4">No scheduled meetings at the moment.</p>
                  <Button>
                    <Video className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import { useState } from "react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Bell, 
  Shield, 
  Download, 
  Palette,
  Database,
  Zap,
  Users,
  FileText
} from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    desktop: true,
    comments: true,
    assignments: true,
    completions: true,
    mentions: true
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/dd/yyyy',
    theme: 'system',
    autoSave: true,
    spellCheck: true
  });

  const [qualitySettings, setQualitySettings] = useState({
    autoQA: true,
    minScore: 70,
    warningThreshold: 50,
    requireReview: true
  });

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Settings"
        subtitle="Configure your Translation Management System preferences"
        showCreateButton={false}
      />
      
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* System Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SettingsIcon className="h-5 w-5 mr-2" />
                  System Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="interface-language">Interface Language</Label>
                    <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                      <SelectTrigger id="interface-language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ko">한국어 (Korean)</SelectItem>
                        <SelectItem value="es">Español (Spanish)</SelectItem>
                        <SelectItem value="fr">Français (French)</SelectItem>
                        <SelectItem value="zh">中文 (Chinese)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Asia/Seoul">Seoul</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({...preferences, dateFormat: value})}>
                      <SelectTrigger id="date-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                        <SelectItem value="MMM dd, yyyy">MMM DD, YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Editor Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-save">Auto-save translations</Label>
                        <p className="text-sm text-muted-foreground">Automatically save changes while typing</p>
                      </div>
                      <Switch 
                        id="auto-save"
                        checked={preferences.autoSave}
                        onCheckedChange={(checked) => setPreferences({...preferences, autoSave: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="spell-check">Enable spell check</Label>
                        <p className="text-sm text-muted-foreground">Check spelling while editing translations</p>
                      </div>
                      <Switch 
                        id="spell-check"
                        checked={preferences.spellCheck}
                        onCheckedChange={(checked) => setPreferences({...preferences, spellCheck: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="languages" className="space-y-6">
            {/* Language Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Translation Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Source Languages</h3>
                    <div className="space-y-3">
                      {[
                        { code: 'ko', name: '한국어 (Korean)', enabled: true },
                        { code: 'en', name: 'English', enabled: true },
                        { code: 'zh', name: '中文 (Chinese)', enabled: false },
                        { code: 'ja', name: '日本語 (Japanese)', enabled: false }
                      ].map((lang) => (
                        <div key={lang.code} className="flex items-center justify-between p-3 border border-border rounded">
                          <div>
                            <span className="font-medium">{lang.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">({lang.code.toUpperCase()})</span>
                          </div>
                          <Switch checked={lang.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Target Languages</h3>
                    <div className="space-y-3">
                      {[
                        { code: 'en', name: 'English', enabled: true },
                        { code: 'es', name: 'Español (Spanish)', enabled: true },
                        { code: 'fr', name: 'Français (French)', enabled: true },
                        { code: 'de', name: 'Deutsch (German)', enabled: false },
                        { code: 'pt', name: 'Português (Portuguese)', enabled: false }
                      ].map((lang) => (
                        <div key={lang.code} className="flex items-center justify-between p-3 border border-border rounded">
                          <div>
                            <span className="font-medium">{lang.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">({lang.code.toUpperCase()})</span>
                          </div>
                          <Switch checked={lang.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Regional Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Translation Direction</Label>
                      <Select defaultValue="ko-en">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ko-en">Korean → English</SelectItem>
                          <SelectItem value="en-ko">English → Korean</SelectItem>
                          <SelectItem value="ko-es">Korean → Spanish</SelectItem>
                          <SelectItem value="ko-fr">Korean → French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Default Character Encoding</Label>
                      <Select defaultValue="utf-8">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utf-8">UTF-8</SelectItem>
                          <SelectItem value="utf-16">UTF-16</SelectItem>
                          <SelectItem value="euc-kr">EUC-KR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Delivery Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch 
                        id="email-notifications"
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="desktop-notifications">Desktop notifications</Label>
                        <p className="text-sm text-muted-foreground">Show browser notifications</p>
                      </div>
                      <Switch 
                        id="desktop-notifications"
                        checked={notifications.desktop}
                        onCheckedChange={(checked) => setNotifications({...notifications, desktop: checked})}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="comment-notifications">Comments and discussions</Label>
                        <p className="text-sm text-muted-foreground">New comments on your projects</p>
                      </div>
                      <Switch 
                        id="comment-notifications"
                        checked={notifications.comments}
                        onCheckedChange={(checked) => setNotifications({...notifications, comments: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="assignment-notifications">Project assignments</Label>
                        <p className="text-sm text-muted-foreground">When you're assigned to new projects</p>
                      </div>
                      <Switch 
                        id="assignment-notifications"
                        checked={notifications.assignments}
                        onCheckedChange={(checked) => setNotifications({...notifications, assignments: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="completion-notifications">Project completions</Label>
                        <p className="text-sm text-muted-foreground">When projects are completed or reviewed</p>
                      </div>
                      <Switch 
                        id="completion-notifications"
                        checked={notifications.completions}
                        onCheckedChange={(checked) => setNotifications({...notifications, completions: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="mention-notifications">Mentions</Label>
                        <p className="text-sm text-muted-foreground">When you're mentioned in comments</p>
                      </div>
                      <Switch 
                        id="mention-notifications"
                        checked={notifications.mentions}
                        onCheckedChange={(checked) => setNotifications({...notifications, mentions: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Quality Assurance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-qa">Automatic quality checks</Label>
                      <p className="text-sm text-muted-foreground">Run quality checks when translations are completed</p>
                    </div>
                    <Switch 
                      id="auto-qa"
                      checked={qualitySettings.autoQA}
                      onCheckedChange={(checked) => setQualitySettings({...qualitySettings, autoQA: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="require-review">Require manual review</Label>
                      <p className="text-sm text-muted-foreground">All translations must be reviewed before approval</p>
                    </div>
                    <Switch 
                      id="require-review"
                      checked={qualitySettings.requireReview}
                      onCheckedChange={(checked) => setQualitySettings({...qualitySettings, requireReview: checked})}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Score Thresholds</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-score">Minimum pass score (%)</Label>
                      <Input 
                        id="min-score"
                        type="number" 
                        min="0" 
                        max="100" 
                        value={qualitySettings.minScore}
                        onChange={(e) => setQualitySettings({...qualitySettings, minScore: parseInt(e.target.value) || 70})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warning-threshold">Warning threshold (%)</Label>
                      <Input 
                        id="warning-threshold"
                        type="number" 
                        min="0" 
                        max="100" 
                        value={qualitySettings.warningThreshold}
                        onChange={(e) => setQualitySettings({...qualitySettings, warningThreshold: parseInt(e.target.value) || 50})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  External Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Google Translate API', description: 'Machine translation assistance', status: 'Not connected', icon: Globe },
                    { name: 'Microsoft Teams', description: 'Team collaboration notifications', status: 'Not connected', icon: Users },
                    { name: 'Slack', description: 'Project updates and notifications', status: 'Not connected', icon: Bell },
                    { name: 'OneDrive', description: 'File storage and backup', status: 'Not connected', icon: FileText }
                  ].map((integration) => (
                    <div key={integration.name} className="border border-border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <integration.icon className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{integration.status}</span>
                        <Button variant="outline" size="sm">Connect</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Data Management</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-border rounded">
                      <div>
                        <p className="font-medium">Export all data</p>
                        <p className="text-sm text-muted-foreground">Download all your translation data</p>
                      </div>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-border rounded">
                      <div>
                        <p className="font-medium">Clear cache</p>
                        <p className="text-sm text-muted-foreground">Clear stored translation memory cache</p>
                      </div>
                      <Button variant="outline">Clear</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">System Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <span>1.0.0-beta</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>January 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Database Size:</span>
                      <span>24.5 MB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Settings */}
        <div className="flex justify-end space-x-2 pt-6">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
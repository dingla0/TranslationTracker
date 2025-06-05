import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Eye, 
  FileText,
  Zap,
  Target,
  TrendingUp,
  Shield
} from "lucide-react";

interface QualityCheck {
  id: number;
  projectId: number;
  type: 'accuracy' | 'consistency' | 'terminology' | 'formatting' | 'completeness';
  status: 'pass' | 'warning' | 'fail';
  score: number;
  description: string;
  suggestions: string[];
  createdAt: string;
}

interface QualityReport {
  id: number;
  projectId: number;
  overallScore: number;
  checks: QualityCheck[];
  reviewedBy: string | null;
  reviewedAt: string | null;
  status: 'pending' | 'approved' | 'needs_revision';
}

export default function QualityAssurance() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data for quality reports
  const qualityReports: QualityReport[] = [
    {
      id: 1,
      projectId: 1,
      overallScore: 87,
      checks: [
        {
          id: 1,
          projectId: 1,
          type: 'accuracy',
          status: 'pass',
          score: 92,
          description: 'Translation accuracy assessment',
          suggestions: ['Consider using more precise terminology for theological concepts'],
          createdAt: '2024-01-20T10:00:00Z'
        },
        {
          id: 2,
          projectId: 1,
          type: 'consistency',
          status: 'warning',
          score: 78,
          description: 'Terminology consistency check',
          suggestions: ['Use consistent translation for "믿음" throughout the document', 'Check capitalization of biblical references'],
          createdAt: '2024-01-20T10:05:00Z'
        },
        {
          id: 3,
          projectId: 1,
          type: 'completeness',
          status: 'pass',
          score: 95,
          description: 'Translation completeness verification',
          suggestions: [],
          createdAt: '2024-01-20T10:10:00Z'
        }
      ],
      reviewedBy: null,
      reviewedAt: null,
      status: 'pending'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'fail': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-accent';
      case 'warning': return 'text-warning';
      case 'fail': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-accent';
    if (score >= 70) return 'text-primary';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getCheckTypeIcon = (type: string) => {
    switch (type) {
      case 'accuracy': return <Target className="h-4 w-4" />;
      case 'consistency': return <Shield className="h-4 w-4" />;
      case 'terminology': return <FileText className="h-4 w-4" />;
      case 'formatting': return <Eye className="h-4 w-4" />;
      case 'completeness': return <CheckCircle className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  // Calculate statistics
  const totalReports = qualityReports.length;
  const avgScore = qualityReports.length > 0 
    ? Math.round(qualityReports.reduce((sum, report) => sum + report.overallScore, 0) / qualityReports.length)
    : 0;
  const pendingReviews = qualityReports.filter(r => r.status === 'pending').length;
  const passedChecks = qualityReports.flatMap(r => r.checks).filter(c => c.status === 'pass').length;
  const totalChecks = qualityReports.flatMap(r => r.checks).length;

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Quality Assurance"
        subtitle="Automated quality checks and review management"
        showCreateButton={false}
      />
      
      <div className="flex-1 overflow-auto p-6">
        {/* QA Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quality Reports</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{totalReports}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className={`text-3xl font-bold mt-2 ${getScoreColor(avgScore)}`}>{avgScore}%</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={avgScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{pendingReviews}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="font-medium text-accent">{passedChecks}</span>
                <span className="text-muted-foreground ml-1">/ {totalChecks} checks</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Quality Reports</TabsTrigger>
            <TabsTrigger value="checks">Check Details</TabsTrigger>
            <TabsTrigger value="settings">QA Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Quality Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Quality Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityReports.map((report) => (
                    <div key={report.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">Project #{report.projectId} Quality Report</h3>
                          <p className="text-sm text-muted-foreground">
                            {report.checks.length} checks completed
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className={`text-2xl font-bold ${getScoreColor(report.overallScore)}`}>
                            {report.overallScore}%
                          </div>
                          <Badge variant={
                            report.status === 'approved' ? 'default' :
                            report.status === 'needs_revision' ? 'destructive' : 'secondary'
                          }>
                            {report.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {report.checks.map((check) => (
                          <div key={check.id} className="flex items-center space-x-3 p-3 bg-card rounded border">
                            <div className={getStatusColor(check.status)}>
                              {getCheckTypeIcon(check.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium capitalize">{check.type}</span>
                                <span className={`text-sm font-medium ${getScoreColor(check.score)}`}>
                                  {check.score}%
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 mt-1">
                                {getStatusIcon(check.status)}
                                <span className={`text-xs ${getStatusColor(check.status)}`}>
                                  {check.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {report.status === 'pending' && (
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Quality Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityReports.map((report) => (
                    <div key={report.id} className="border border-border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground">Report #{report.id}</h3>
                          <p className="text-sm text-muted-foreground">Project #{report.projectId}</p>
                        </div>
                        <div className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>
                          {report.overallScore}%
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Quality Checks:</h4>
                        {report.checks.map((check) => (
                          <div key={check.id} className="bg-muted/50 rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getCheckTypeIcon(check.type)}
                                <span className="font-medium capitalize">{check.type}</span>
                                {getStatusIcon(check.status)}
                              </div>
                              <span className={`font-medium ${getScoreColor(check.score)}`}>
                                {check.score}%
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{check.description}</p>
                            {check.suggestions.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-1">Suggestions:</p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {check.suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <span className="text-primary">•</span>
                                      <span>{suggestion}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Check Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { type: 'accuracy', description: 'Verifies translation accuracy and meaning preservation', enabled: true },
                    { type: 'consistency', description: 'Checks terminology and style consistency', enabled: true },
                    { type: 'terminology', description: 'Validates use of approved glossary terms', enabled: true },
                    { type: 'formatting', description: 'Ensures proper formatting and structure', enabled: true },
                    { type: 'completeness', description: 'Confirms all content has been translated', enabled: true },
                  ].map((checkType) => (
                    <div key={checkType.type} className="border border-border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        {getCheckTypeIcon(checkType.type)}
                        <h3 className="font-semibold capitalize">{checkType.type}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{checkType.description}</p>
                      <Badge variant={checkType.enabled ? 'default' : 'secondary'}>
                        {checkType.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Assurance Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Automated Checks</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-border rounded">
                        <div>
                          <p className="font-medium">Run checks on translation completion</p>
                          <p className="text-sm text-muted-foreground">Automatically run quality checks when a translation is marked as complete</p>
                        </div>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-border rounded">
                        <div>
                          <p className="font-medium">Real-time terminology validation</p>
                          <p className="text-sm text-muted-foreground">Check terminology usage while translating</p>
                        </div>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Scoring Thresholds</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Minimum pass score</label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-muted rounded h-2">
                            <div className="bg-primary rounded h-2" style={{ width: '70%' }}></div>
                          </div>
                          <span className="text-sm font-medium">70%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Warning threshold</label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-muted rounded h-2">
                            <div className="bg-warning rounded h-2" style={{ width: '50%' }}></div>
                          </div>
                          <span className="text-sm font-medium">50%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
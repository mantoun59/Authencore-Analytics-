import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Activity, 
  Monitor, 
  AlertTriangle, 
  Clock,
  MapPin,
  Smartphone
} from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';
import { format } from 'date-fns';
import MFASetup from './MFASetup';

const SecurityDashboard = () => {
  const {
    securityEvents,
    activeSessions,
    isLoading,
    getSecurityEvents,
    getActiveSessions,
    terminateSession
  } = useSecurity();

  useEffect(() => {
    getSecurityEvents();
    getActiveSessions();
  }, [getSecurityEvents, getActiveSessions]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login': return '🔐';
      case 'logout': return '🚪';
      case 'mfa_enabled': return '🛡️';
      case 'mfa_disabled': return '⚠️';
      case 'suspicious_activity_detected': return '🚨';
      case 'password_changed': return '🔑';
      case 'session_terminated': return '❌';
      default: return '📝';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Security Center</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mfa">Multi-Factor Auth</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Events</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityEvents.length}</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSessions.length}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Low</div>
                <p className="text-xs text-muted-foreground">No suspicious activity</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Security Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {securityEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getEventIcon(event.event_type)}</span>
                    <div>
                      <p className="font-medium capitalize">{event.event_type.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.created_at), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getSeverityColor(event.severity) as any}>
                    {event.severity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mfa">
          <MFASetup />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Event Log</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse">Loading events...</div>
              ) : securityEvents.length === 0 ? (
                <p className="text-muted-foreground">No security events recorded.</p>
              ) : (
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-lg">{getEventIcon(event.event_type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium capitalize">
                                {event.event_type.replace('_', ' ')}
                              </h3>
                              <Badge variant={getSeverityColor(event.severity) as any}>
                                {event.severity}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(event.created_at), 'MMM d, yyyy HH:mm:ss')}
                              </div>
                              {event.ip_address && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.ip_address}
                                </div>
                              )}
                              {event.user_agent && (
                                <div className="flex items-center gap-1">
                                  <Smartphone className="h-3 w-3" />
                                  {event.user_agent.substring(0, 50)}...
                                </div>
                              )}
                            </div>
                            {event.event_details && (
                              <pre className="text-xs mt-2 p-2 bg-muted rounded">
                                {JSON.stringify(event.event_details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse">Loading sessions...</div>
              ) : activeSessions.length === 0 ? (
                <p className="text-muted-foreground">No active sessions found.</p>
              ) : (
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Monitor className="h-4 w-4" />
                            <span className="font-medium">Session</span>
                            <Badge variant="outline">Active</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Created: {format(new Date(session.created_at), 'MMM d, yyyy HH:mm')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last accessed: {format(new Date(session.last_accessed), 'MMM d, yyyy HH:mm')}
                            </div>
                            {session.ip_address && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {session.ip_address}
                              </div>
                            )}
                            {session.user_agent && (
                              <div className="flex items-center gap-1">
                                <Smartphone className="h-3 w-3" />
                                {session.user_agent.substring(0, 80)}...
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => terminateSession(session.id)}
                        >
                          Terminate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
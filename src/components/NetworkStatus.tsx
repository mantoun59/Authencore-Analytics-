import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { networkFallback } from '@/utils/networkFallback';
import { Wifi, WifiOff, Clock, Database, RefreshCw } from 'lucide-react';

export const NetworkStatus: React.FC = () => {
  const [status, setStatus] = useState(networkFallback.getNetworkStatus());
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const updateStatus = () => {
    setStatus(networkFallback.getNetworkStatus());
    setLastUpdate(new Date());
  };

  useEffect(() => {
    const interval = setInterval(updateStatus, 5000);
    
    // Listen for network events
    const handleOnline = () => updateStatus();
    const handleOffline = () => updateStatus();
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const clearCache = () => {
    networkFallback.clearCache();
    updateStatus();
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {status.isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">
              {status.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <Badge variant={status.isOnline ? 'default' : 'destructive'}>
            {status.isOnline ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Queued Requests</span>
            </div>
            <Badge variant="outline">{status.queuedRequests}</Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span>Cache Entries</span>
            </div>
            <Badge variant="outline">{status.cacheSize}</Badge>
          </div>

          <div className="text-xs text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={updateStatus}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            <Button
              onClick={clearCache}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Clear Cache
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
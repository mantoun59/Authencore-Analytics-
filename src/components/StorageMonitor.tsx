import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { HardDrive, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';

interface StorageStats {
  bucketName: string;
  totalSize: number;
  fileCount: number;
  quotaUsed: number;
  quotaRemaining: number;
  isNearLimit: boolean;
  oldestFile?: string;
  largestFile?: string;
}

export const StorageMonitor: React.FC = () => {
  const [stats, setStats] = useState<StorageStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [cleaning, setCleaning] = useState<string | null>(null);

  const fetchStorageStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('storage-monitor', {
        body: { action: 'stats', bucket: 'all' }
      });

      if (error) throw error;
      setStats(data.buckets || []);
    } catch (error) {
      console.error('Error fetching storage stats:', error);
      toast.error('Failed to fetch storage statistics');
    } finally {
      setLoading(false);
    }
  };

  const cleanupBucket = async (bucketName: string) => {
    setCleaning(bucketName);
    try {
      const { data, error } = await supabase.functions.invoke('storage-monitor', {
        body: { action: 'cleanup', bucket: bucketName, days: 30 }
      });

      if (error) throw error;
      
      toast.success(`Cleaned up ${data.cleaned} files from ${bucketName}`);
      await fetchStorageStats(); // Refresh stats
    } catch (error) {
      console.error('Error cleaning bucket:', error);
      toast.error('Failed to clean up storage');
    } finally {
      setCleaning(null);
    }
  };

  const optimizeAllStorage = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('storage-monitor', {
        body: { action: 'optimize' }
      });

      if (error) throw error;
      
      if (data.optimized) {
        toast.success(`Optimized storage: cleaned ${data.cleaned} files`);
      } else {
        toast.info('Storage is already optimized');
      }
      
      await fetchStorageStats(); // Refresh stats
    } catch (error) {
      console.error('Error optimizing storage:', error);
      toast.error('Failed to optimize storage');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    fetchStorageStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Storage Monitor</h2>
          <p className="text-muted-foreground">Monitor and manage storage usage across buckets</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchStorageStats}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={optimizeAllStorage}
            disabled={loading}
            size="sm"
          >
            <HardDrive className="h-4 w-4 mr-2" />
            Optimize All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.bucketName} className={stat.isNearLimit ? 'border-warning' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">{stat.bucketName}</CardTitle>
                {stat.isNearLimit && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Near Limit
                  </Badge>
                )}
              </div>
              <CardDescription>
                {stat.fileCount} files • {formatBytes(stat.totalSize)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Quota Usage</span>
                  <span>{stat.quotaUsed}%</span>
                </div>
                <Progress 
                  value={stat.quotaUsed} 
                  className={`h-2 ${stat.isNearLimit ? 'progress-warning' : ''}`}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatBytes(stat.quotaRemaining)} remaining
                </p>
              </div>

              {(stat.oldestFile || stat.largestFile) && (
                <div className="text-xs space-y-1">
                  {stat.oldestFile && (
                    <p><span className="font-medium">Oldest:</span> {stat.oldestFile}</p>
                  )}
                  {stat.largestFile && (
                    <p><span className="font-medium">Largest:</span> {stat.largestFile}</p>
                  )}
                </div>
              )}

              <Button
                onClick={() => cleanupBucket(stat.bucketName)}
                disabled={cleaning === stat.bucketName}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {cleaning === stat.bucketName ? 'Cleaning...' : 'Clean Old Files'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <HardDrive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No storage data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
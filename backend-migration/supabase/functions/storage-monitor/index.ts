import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Storage quota limits in bytes
const STORAGE_LIMITS = {
  'reports': 5 * 1024 * 1024 * 1024, // 5GB
  'marketing-materials': 2 * 1024 * 1024 * 1024, // 2GB
  'assessment-logos': 500 * 1024 * 1024, // 500MB
};

class StorageMonitor {
  static async getBucketStats(bucketName: string): Promise<StorageStats> {
    try {
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        throw error;
      }

      let totalSize = 0;
      let fileCount = 0;

      for (const file of files || []) {
        if (file.metadata?.size) {
          totalSize += file.metadata.size;
        }
        fileCount++;
      }

      const quotaLimit = STORAGE_LIMITS[bucketName as keyof typeof STORAGE_LIMITS] || 1024 * 1024 * 1024; // 1GB default
      const quotaUsage = (totalSize / quotaLimit) * 100;

      return {
        bucketName,
        totalSize,
        fileCount,
        quotaLimit,
        quotaUsage: Math.round(quotaUsage * 100) / 100,
        nearLimit: quotaUsage > 80,
        lastChecked: new Date().toISOString()
      };

    } catch (error: any) {
      console.error(`Error getting stats for bucket ${bucketName}:`, error);
      return {
        bucketName,
        totalSize: 0,
        fileCount: 0,
        quotaLimit: 0,
        quotaUsage: 0,
        nearLimit: false,
        lastChecked: new Date().toISOString(),
        error: error.message
      };
    }
  }

  static async cleanupOldFiles(bucketName: string, daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'asc' }
        });

      if (error) {
        throw error;
      }

      const filesToDelete = files?.filter(file => {
        if (!file.created_at) return false;
        const fileDate = new Date(file.created_at);
        return fileDate < cutoffDate;
      }) || [];

      if (filesToDelete.length === 0) {
        return 0;
      }

      const fileNames = filesToDelete.map(file => file.name);
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove(fileNames);

      if (deleteError) {
        console.error(`Error deleting files from ${bucketName}:`, deleteError);
        return 0;
      }

      console.log(`Cleaned up ${filesToDelete.length} files from ${bucketName}`);
      return filesToDelete.length;

    } catch (error: any) {
      console.error(`Cleanup error for bucket ${bucketName}:`, error);
      return 0;
    }
  }

  static async optimizeStorage(): Promise<{ cleaned: number; optimized: boolean }> {
    let totalCleaned = 0;
    let optimized = false;

    for (const bucketName of Object.keys(STORAGE_LIMITS)) {
      try {
        const stats = await this.getBucketStats(bucketName);
        
        if (stats.nearLimit) {
          console.log(`Bucket ${bucketName} is near limit (${stats.quotaUsage}%), starting cleanup...`);
          const cleaned = await this.cleanupOldFiles(bucketName, 30);
          totalCleaned += cleaned;
          optimized = true;
        }
      } catch (error: any) {
        console.error(`Error optimizing bucket ${bucketName}:`, error);
      }
    }

    return { cleaned: totalCleaned, optimized };
  }
}

interface StorageStats {
  bucketName: string;
  totalSize: number;
  fileCount: number;
  quotaLimit: number;
  quotaUsage: number;
  nearLimit: boolean;
  lastChecked: string;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'stats';
    const bucket = url.searchParams.get('bucket');

    console.log(`Storage monitor action: ${action}`, { bucket });

    let result: any;

    switch (action) {
      case 'stats':
        if (bucket) {
          result = await StorageMonitor.getBucketStats(bucket);
        } else {
          const buckets = Object.keys(STORAGE_LIMITS);
          const allStats = await Promise.all(
            buckets.map(bucketName => StorageMonitor.getBucketStats(bucketName))
          );
          result = {
            buckets: allStats,
            totalBuckets: allStats.length,
            bucketsNearLimit: allStats.filter(s => s.nearLimit).length
          };
        }
        break;

      case 'cleanup':
        if (!bucket) {
          throw new Error('Bucket name required for cleanup action');
        }
        const daysOld = parseInt(url.searchParams.get('days') || '30');
        const cleaned = await StorageMonitor.cleanupOldFiles(bucket, daysOld);
        result = { bucket, cleaned, daysOld };
        break;

      case 'optimize':
        result = await StorageMonitor.optimizeStorage();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log analytics event
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'storage_monitor_action',
      p_entity_type: 'storage',
      p_metadata: {
        action,
        bucket,
        result: result
      }
    });

    return new Response(JSON.stringify({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Storage monitor error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
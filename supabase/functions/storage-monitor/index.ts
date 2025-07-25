import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Storage quota limits (in bytes)
const STORAGE_LIMITS = {
  reports: 100 * 1024 * 1024, // 100MB
  user_uploads: 50 * 1024 * 1024, // 50MB per user
  total_bucket: 500 * 1024 * 1024 // 500MB total
};

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

class StorageMonitor {
  static async getBucketStats(bucketName: string): Promise<StorageStats> {
    try {
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 1000 });

      if (error) throw error;

      let totalSize = 0;
      let oldestFile = '';
      let largestFile = '';
      let oldestDate = new Date();
      let largestSize = 0;

      for (const file of files || []) {
        if (file.metadata?.size) {
          totalSize += file.metadata.size;
          
          if (file.metadata.size > largestSize) {
            largestSize = file.metadata.size;
            largestFile = file.name;
          }
        }

        if (file.created_at) {
          const fileDate = new Date(file.created_at);
          if (fileDate < oldestDate) {
            oldestDate = fileDate;
            oldestFile = file.name;
          }
        }
      }

      const quotaLimit = STORAGE_LIMITS[bucketName] || STORAGE_LIMITS.total_bucket;
      const quotaUsed = (totalSize / quotaLimit) * 100;
      const isNearLimit = quotaUsed > 80;

      return {
        bucketName,
        totalSize,
        fileCount: files?.length || 0,
        quotaUsed: Math.round(quotaUsed),
        quotaRemaining: Math.max(0, quotaLimit - totalSize),
        isNearLimit,
        oldestFile,
        largestFile
      };
    } catch (error) {
      console.error(`Error getting stats for bucket ${bucketName}:`, error);
      throw error;
    }
  }

  static async cleanupOldFiles(bucketName: string, daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 1000 });

      if (error) throw error;

      const filesToDelete = files?.filter(file => {
        if (!file.created_at) return false;
        return new Date(file.created_at) < cutoffDate;
      }) || [];

      if (filesToDelete.length === 0) return 0;

      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove(filesToDelete.map(f => f.name));

      if (deleteError) throw deleteError;

      console.log(`Cleaned up ${filesToDelete.length} files from ${bucketName}`);
      return filesToDelete.length;
    } catch (error) {
      console.error(`Error cleaning up bucket ${bucketName}:`, error);
      return 0;
    }
  }

  static async optimizeStorage(): Promise<{ cleaned: number; optimized: boolean }> {
    try {
      let totalCleaned = 0;

      // Check all buckets for cleanup
      const buckets = ['reports'];
      
      for (const bucket of buckets) {
        const stats = await this.getBucketStats(bucket);
        
        if (stats.isNearLimit) {
          console.log(`Bucket ${bucket} is near limit (${stats.quotaUsed}%), cleaning up...`);
          const cleaned = await this.cleanupOldFiles(bucket, 14); // Clean files older than 2 weeks
          totalCleaned += cleaned;
        }
      }

      return { cleaned: totalCleaned, optimized: totalCleaned > 0 };
    } catch (error) {
      console.error('Error optimizing storage:', error);
      return { cleaned: 0, optimized: false };
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'stats';
    const bucket = url.searchParams.get('bucket') || 'reports';

    let result;

    switch (action) {
      case 'stats':
        if (bucket === 'all') {
          const buckets = ['reports'];
          const allStats = await Promise.all(
            buckets.map(b => StorageMonitor.getBucketStats(b))
          );
          result = { buckets: allStats };
        } else {
          result = await StorageMonitor.getBucketStats(bucket);
        }
        break;

      case 'cleanup':
        const days = parseInt(url.searchParams.get('days') || '30');
        const cleaned = await StorageMonitor.cleanupOldFiles(bucket, days);
        result = { bucket, cleaned, message: `Cleaned ${cleaned} files older than ${days} days` };
        break;

      case 'optimize':
        result = await StorageMonitor.optimizeStorage();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log monitoring event
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'storage_monitored',
      p_entity_type: 'storage',
      p_metadata: {
        action,
        bucket,
        result: typeof result === 'object' ? JSON.stringify(result) : result
      }
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Storage monitoring error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
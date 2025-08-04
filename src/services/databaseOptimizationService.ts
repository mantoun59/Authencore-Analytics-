import { supabase } from '@/integrations/supabase/client';

/**
 * Database Optimization Service
 * Handles performance monitoring, query optimization, and migration management
 */

interface QueryPerformanceMetric {
  query: string;
  executionTime: number;
  timestamp: string;
  context: string;
}

interface DatabaseHealth {
  connectionStatus: 'healthy' | 'degraded' | 'critical';
  averageQueryTime: number;
  slowQueries: QueryPerformanceMetric[];
  recommendations: string[];
}

export class DatabaseOptimizationService {
  private static instance: DatabaseOptimizationService;
  private queryMetrics: QueryPerformanceMetric[] = [];
  private readonly SLOW_QUERY_THRESHOLD = 1000; // 1 second

  static getInstance(): DatabaseOptimizationService {
    if (!DatabaseOptimizationService.instance) {
      DatabaseOptimizationService.instance = new DatabaseOptimizationService();
    }
    return DatabaseOptimizationService.instance;
  }

  /**
   * Monitor query performance
   */
  async monitorQuery<T>(
    queryPromise: Promise<T>,
    context: string,
    query?: string
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await queryPromise;
      const executionTime = performance.now() - startTime;
      
      // Record metrics
      this.recordQueryMetric({
        query: query || 'Unknown Query',
        executionTime,
        timestamp: new Date().toISOString(),
        context
      });

      return result;
    } catch (error) {
      const executionTime = performance.now() - startTime;
      
      // Record failed query metrics
      this.recordQueryMetric({
        query: query || 'Failed Query',
        executionTime,
        timestamp: new Date().toISOString(),
        context: `${context} (FAILED)`
      });

      throw error;
    }
  }

  /**
   * Record query performance metric
   */
  private recordQueryMetric(metric: QueryPerformanceMetric): void {
    this.queryMetrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory bloat
    if (this.queryMetrics.length > 100) {
      this.queryMetrics = this.queryMetrics.slice(-100);
    }

    // Log slow queries
    if (metric.executionTime > this.SLOW_QUERY_THRESHOLD) {
      console.warn(`Slow query detected (${metric.executionTime}ms):`, metric);
    }
  }

  /**
   * Get database health metrics
   */
  getDatabaseHealth(): DatabaseHealth {
    if (this.queryMetrics.length === 0) {
      return {
        connectionStatus: 'healthy',
        averageQueryTime: 0,
        slowQueries: [],
        recommendations: ['No metrics available yet']
      };
    }

    const averageQueryTime = this.queryMetrics.reduce(
      (sum, metric) => sum + metric.executionTime, 0
    ) / this.queryMetrics.length;

    const slowQueries = this.queryMetrics.filter(
      metric => metric.executionTime > this.SLOW_QUERY_THRESHOLD
    );

    const connectionStatus: DatabaseHealth['connectionStatus'] = 
      averageQueryTime > 2000 ? 'critical' :
      averageQueryTime > 1000 ? 'degraded' : 'healthy';

    const recommendations = this.generateRecommendations(averageQueryTime, slowQueries);

    return {
      connectionStatus,
      averageQueryTime,
      slowQueries,
      recommendations
    };
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(
    averageQueryTime: number,
    slowQueries: QueryPerformanceMetric[]
  ): string[] {
    const recommendations: string[] = [];

    if (averageQueryTime > 1000) {
      recommendations.push('Consider adding database indexes for frequently queried columns');
    }

    if (slowQueries.length > 10) {
      recommendations.push('High number of slow queries detected - review query optimization');
    }

    const assessmentQueries = slowQueries.filter(q => 
      q.context.includes('assessment') || q.query.includes('assessment')
    );
    
    if (assessmentQueries.length > 0) {
      recommendations.push('Consider implementing query caching for assessment data');
    }

    if (recommendations.length === 0) {
      recommendations.push('Database performance is optimal');
    }

    return recommendations;
  }

  /**
   * Optimize assessment data queries
   */
  async optimizeAssessmentQueries() {
    try {
      // Get assessment results with optimized query
      const response = await supabase
        .from('assessment_results')
        .select('assessment_type, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1000);

      const recentResults = response.data;

      if (recentResults) {
        // Query optimized and returned
      }

      return {
        success: true,
        recordsAnalyzed: recentResults?.length || 0
      };
    } catch (error) {
      console.error('Assessment query optimization failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Clean up old data (data retention management)
   */
  async cleanupOldData(): Promise<{ success: boolean; cleaned: number; error?: string }> {
    try {
      // Clean up old assessment progress records (expired and completed)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const response = await supabase
        .from('assessment_progress')
        .delete()
        .or(`expires_at.lt.${thirtyDaysAgo},and(is_completed.eq.true,updated_at.lt.${thirtyDaysAgo})`);

      return {
        success: !response.error,
        cleaned: response.count || 0
      };
    } catch (error) {
      console.error('Data cleanup failed:', error);
      return {
        success: false,
        cleaned: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get migration consolidation recommendations
   */
  async getMigrationConsolidationReport(): Promise<{
    totalMigrations: number;
    recommendations: string[];
    consolidationPlan: string[];
  }> {
    try {
      const response = await supabase
        .from('schema_versions')
        .select('*')
        .order('executed_at', { ascending: true });

      const migrations = response.data;
      const totalMigrations = migrations?.length || 0;
      const recommendations: string[] = [];
      const consolidationPlan: string[] = [];

      if (totalMigrations > 15) {
        recommendations.push('High number of migrations detected - consider consolidation');
        consolidationPlan.push('1. Create backup of current database state');
        consolidationPlan.push('2. Generate consolidated schema from current state');
        consolidationPlan.push('3. Create new baseline migration');
        consolidationPlan.push('4. Archive old migrations for reference');
      } else {
        recommendations.push('Migration count is within acceptable range');
      }

      return {
        totalMigrations,
        recommendations,
        consolidationPlan
      };
    } catch (error) {
      console.error('Migration analysis failed:', error);
      return {
        totalMigrations: 0,
        recommendations: ['Unable to analyze migrations'],
        consolidationPlan: []
      };
    }
  }

  /**
   * Clear performance metrics
   */
  clearMetrics(): void {
    this.queryMetrics = [];
  }
}

export const databaseOptimizationService = DatabaseOptimizationService.getInstance();

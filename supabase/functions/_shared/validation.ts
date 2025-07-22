// Shared Zod validation utilities for Edge Functions
// Import this in edge functions as needed

// Note: This file demonstrates the schemas - you'll need to import Zod directly in each edge function
// import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

export const ChatbotRequestSchema = {
  parse: (data: unknown) => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid request body - must be an object');
    }
    
    const req = data as Record<string, unknown>;
    
    if (!req.message || typeof req.message !== 'string') {
      throw new Error('Invalid or missing message field - must be a string');
    }
    
    if (req.message.length > 1000) {
      throw new Error('Message too long - maximum 1000 characters');
    }
    
    if (req.sessionId && typeof req.sessionId !== 'string') {
      throw new Error('Invalid sessionId - must be a string');
    }
    
    return {
      message: req.message.trim(),
      sessionId: req.sessionId as string | undefined,
      context: req.context as Record<string, unknown> | undefined
    };
  }
};

export const EnhancedAIRequestSchema = {
  parse: (data: unknown) => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid request body - must be an object');
    }
    
    const req = data as Record<string, unknown>;
    
    if (!req.prompt || typeof req.prompt !== 'string') {
      throw new Error('Invalid or missing prompt field - must be a string');
    }
    
    if (req.prompt.length > 5000) {
      throw new Error('Prompt too long - maximum 5000 characters');
    }
    
    const validModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-2025-04-14'];
    const model = req.model || 'gpt-4o-mini';
    if (typeof model !== 'string' || !validModels.includes(model)) {
      throw new Error(`Invalid model - must be one of: ${validModels.join(', ')}`);
    }
    
    const temperature = req.temperature || 0.3;
    if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
      throw new Error('Invalid temperature - must be a number between 0 and 2');
    }
    
    const maxTokens = req.maxTokens || 4000;
    if (typeof maxTokens !== 'number' || maxTokens < 1 || maxTokens > 8000) {
      throw new Error('Invalid maxTokens - must be a number between 1 and 8000');
    }
    
    return {
      prompt: req.prompt.trim(),
      model: model as string,
      temperature: temperature as number,
      maxTokens: maxTokens as number
    };
  }
};

export const ReportRequestSchema = {
  parse: (data: unknown) => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid request body - must be an object');
    }
    
    const req = data as Record<string, unknown>;
    
    if (!req.assessmentResultId || typeof req.assessmentResultId !== 'string') {
      throw new Error('Invalid or missing assessmentResultId - must be a string');
    }
    
    const validReportTypes = ['candidate', 'employer'];
    if (req.reportType && !validReportTypes.includes(req.reportType as string)) {
      throw new Error(`Invalid reportType - must be one of: ${validReportTypes.join(', ')}`);
    }
    
    // Validate candidateInfo if provided
    if (req.candidateInfo) {
      if (typeof req.candidateInfo !== 'object') {
        throw new Error('Invalid candidateInfo - must be an object');
      }
      
      const candidate = req.candidateInfo as Record<string, unknown>;
      if (!candidate.name || typeof candidate.name !== 'string') {
        throw new Error('Invalid candidateInfo.name - must be a string');
      }
      
      if (!candidate.email || typeof candidate.email !== 'string' || !candidate.email.includes('@')) {
        throw new Error('Invalid candidateInfo.email - must be a valid email string');
      }
    }
    
    return {
      assessmentResultId: req.assessmentResultId as string,
      reportType: (req.reportType as string) || 'candidate',
      candidateInfo: req.candidateInfo as Record<string, unknown> | undefined
    };
  }
};

// Error response helper
export const createErrorResponse = (error: Error, status = 400) => {
  console.error('Validation error:', error.message);
  return new Response(
    JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    }
  );
};

// Success response helper
export const createSuccessResponse = (data: unknown) => {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    }
  );
};
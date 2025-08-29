export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      ai_content_validation: {
        Row: {
          bias_flags: string[] | null
          created_at: string
          human_review_required: boolean
          id: string
          is_valid: boolean
          issues: string[] | null
          recommendations: string[] | null
          report_id: string
          review_notes: string | null
          reviewed_by: string | null
          updated_at: string
          validated_at: string
          validation_score: number
        }
        Insert: {
          bias_flags?: string[] | null
          created_at?: string
          human_review_required?: boolean
          id?: string
          is_valid?: boolean
          issues?: string[] | null
          recommendations?: string[] | null
          report_id: string
          review_notes?: string | null
          reviewed_by?: string | null
          updated_at?: string
          validated_at?: string
          validation_score?: number
        }
        Update: {
          bias_flags?: string[] | null
          created_at?: string
          human_review_required?: boolean
          id?: string
          is_valid?: boolean
          issues?: string[] | null
          recommendations?: string[] | null
          report_id?: string
          review_notes?: string | null
          reviewed_by?: string | null
          updated_at?: string
          validated_at?: string
          validation_score?: number
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          blocked_until: string | null
          created_at: string
          endpoint: string
          id: string
          identifier: string
          request_count: number
          window_start: string
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string
          endpoint: string
          id?: string
          identifier: string
          request_count?: number
          window_start?: string
        }
        Update: {
          blocked_until?: string | null
          created_at?: string
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      assessment_catalog: {
        Row: {
          assessment_type: string
          created_at: string
          description: string
          estimated_duration_minutes: number
          id: string
          is_active: boolean
          name: string
          question_count: number
          theoretical_foundation: string
          updated_at: string
        }
        Insert: {
          assessment_type: string
          created_at?: string
          description: string
          estimated_duration_minutes: number
          id?: string
          is_active?: boolean
          name: string
          question_count: number
          theoretical_foundation: string
          updated_at?: string
        }
        Update: {
          assessment_type?: string
          created_at?: string
          description?: string
          estimated_duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          question_count?: number
          theoretical_foundation?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessment_demographics: {
        Row: {
          age_range: string | null
          assessment_result_id: string | null
          consent_for_research: boolean | null
          country: string | null
          created_at: string
          cultural_background: string | null
          disability_accommodations: boolean | null
          education_level: string | null
          gender: string | null
          id: string
          industry: string | null
          primary_language: string | null
          socioeconomic_background: string | null
          user_id: string | null
          work_experience: string | null
        }
        Insert: {
          age_range?: string | null
          assessment_result_id?: string | null
          consent_for_research?: boolean | null
          country?: string | null
          created_at?: string
          cultural_background?: string | null
          disability_accommodations?: boolean | null
          education_level?: string | null
          gender?: string | null
          id?: string
          industry?: string | null
          primary_language?: string | null
          socioeconomic_background?: string | null
          user_id?: string | null
          work_experience?: string | null
        }
        Update: {
          age_range?: string | null
          assessment_result_id?: string | null
          consent_for_research?: boolean | null
          country?: string | null
          created_at?: string
          cultural_background?: string | null
          disability_accommodations?: boolean | null
          education_level?: string | null
          gender?: string | null
          id?: string
          industry?: string | null
          primary_language?: string | null
          socioeconomic_background?: string | null
          user_id?: string | null
          work_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_demographics_assessment_result_id_fkey"
            columns: ["assessment_result_id"]
            isOneToOne: false
            referencedRelation: "assessment_results"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_progress: {
        Row: {
          assessment_type: string
          created_at: string
          current_phase: number | null
          current_question: number | null
          expires_at: string
          guest_token: string | null
          id: string
          is_completed: boolean | null
          last_saved_at: string
          phase_data: Json
          progress_percentage: number | null
          responses: Json
          started_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assessment_type: string
          created_at?: string
          current_phase?: number | null
          current_question?: number | null
          expires_at?: string
          guest_token?: string | null
          id?: string
          is_completed?: boolean | null
          last_saved_at?: string
          phase_data?: Json
          progress_percentage?: number | null
          responses?: Json
          started_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assessment_type?: string
          created_at?: string
          current_phase?: number | null
          current_question?: number | null
          expires_at?: string
          guest_token?: string | null
          id?: string
          is_completed?: boolean | null
          last_saved_at?: string
          phase_data?: Json
          progress_percentage?: number | null
          responses?: Json
          started_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      assessment_results: {
        Row: {
          assessment_type: string
          completed_at: string
          created_at: string
          id: string
          results: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_type: string
          completed_at?: string
          created_at?: string
          id?: string
          results: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_type?: string
          completed_at?: string
          created_at?: string
          id?: string
          results?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assessment_skills_mapping: {
        Row: {
          assessment_dimension: string
          assessment_type: string
          created_at: string
          created_by: string | null
          id: string
          mapped_skills: string[]
          mapping_confidence: number
          prediction_relevance: number
          skill_weights: Json
          updated_at: string
          validated_by: string | null
        }
        Insert: {
          assessment_dimension: string
          assessment_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          mapped_skills?: string[]
          mapping_confidence?: number
          prediction_relevance?: number
          skill_weights?: Json
          updated_at?: string
          validated_by?: string | null
        }
        Update: {
          assessment_dimension?: string
          assessment_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          mapped_skills?: string[]
          mapping_confidence?: number
          prediction_relevance?: number
          skill_weights?: Json
          updated_at?: string
          validated_by?: string | null
        }
        Relationships: []
      }
      assessment_validation_status: {
        Row: {
          assessment_type: string
          created_at: string
          ethical_concerns: string[] | null
          id: string
          last_reviewed_at: string | null
          legal_compliance_status: string | null
          notes: string | null
          psychometric_rating: number | null
          reliability_score: number | null
          reviewed_by: string | null
          risk_level: string
          theoretical_foundation: string | null
          updated_at: string
          validation_status: string
          validity_evidence: string[] | null
        }
        Insert: {
          assessment_type: string
          created_at?: string
          ethical_concerns?: string[] | null
          id?: string
          last_reviewed_at?: string | null
          legal_compliance_status?: string | null
          notes?: string | null
          psychometric_rating?: number | null
          reliability_score?: number | null
          reviewed_by?: string | null
          risk_level?: string
          theoretical_foundation?: string | null
          updated_at?: string
          validation_status?: string
          validity_evidence?: string[] | null
        }
        Update: {
          assessment_type?: string
          created_at?: string
          ethical_concerns?: string[] | null
          id?: string
          last_reviewed_at?: string | null
          legal_compliance_status?: string | null
          notes?: string | null
          psychometric_rating?: number | null
          reliability_score?: number | null
          reviewed_by?: string | null
          risk_level?: string
          theoretical_foundation?: string | null
          updated_at?: string
          validation_status?: string
          validity_evidence?: string[] | null
        }
        Relationships: []
      }
      bias_analysis_results: {
        Row: {
          analysis_metadata: Json | null
          assessment_result_id: string | null
          assessment_type: string
          bias_indicators: Json
          bias_severity: string | null
          created_at: string
          demographic_data: Json
          dimension_scores: Json
          fairness_metrics: Json
          flagged_dimensions: string[] | null
          id: string
          recommended_actions: string[] | null
        }
        Insert: {
          analysis_metadata?: Json | null
          assessment_result_id?: string | null
          assessment_type: string
          bias_indicators: Json
          bias_severity?: string | null
          created_at?: string
          demographic_data: Json
          dimension_scores: Json
          fairness_metrics: Json
          flagged_dimensions?: string[] | null
          id?: string
          recommended_actions?: string[] | null
        }
        Update: {
          analysis_metadata?: Json | null
          assessment_result_id?: string | null
          assessment_type?: string
          bias_indicators?: Json
          bias_severity?: string | null
          created_at?: string
          demographic_data?: Json
          dimension_scores?: Json
          fairness_metrics?: Json
          flagged_dimensions?: string[] | null
          id?: string
          recommended_actions?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "bias_analysis_results_assessment_result_id_fkey"
            columns: ["assessment_result_id"]
            isOneToOne: false
            referencedRelation: "assessment_results"
            referencedColumns: ["id"]
          },
        ]
      }
      career_pathway_predictions: {
        Row: {
          confidence_scores: Json
          created_at: string
          id: string
          industry_trends: Json
          market_opportunities: Json
          personalization_factors: Json | null
          predicted_pathways: Json
          risk_factors: Json
          skills_progression: Json
          timeline_predictions: Json
          updated_at: string
          user_current_role: string
          user_id: string
        }
        Insert: {
          confidence_scores?: Json
          created_at?: string
          id?: string
          industry_trends?: Json
          market_opportunities?: Json
          personalization_factors?: Json | null
          predicted_pathways?: Json
          risk_factors?: Json
          skills_progression?: Json
          timeline_predictions?: Json
          updated_at?: string
          user_current_role: string
          user_id: string
        }
        Update: {
          confidence_scores?: Json
          created_at?: string
          id?: string
          industry_trends?: Json
          market_opportunities?: Json
          personalization_factors?: Json | null
          predicted_pathways?: Json
          risk_factors?: Json
          skills_progression?: Json
          timeline_predictions?: Json
          updated_at?: string
          user_current_role?: string
          user_id?: string
        }
        Relationships: []
      }
      chatbot_analytics: {
        Row: {
          conversation_duration_seconds: number | null
          created_at: string
          id: string
          message_count: number
          satisfaction_rating: number | null
          session_id: string
          topics_discussed: string[] | null
          user_id: string | null
        }
        Insert: {
          conversation_duration_seconds?: number | null
          created_at?: string
          id?: string
          message_count?: number
          satisfaction_rating?: number | null
          session_id: string
          topics_discussed?: string[] | null
          user_id?: string | null
        }
        Update: {
          conversation_duration_seconds?: number | null
          created_at?: string
          id?: string
          message_count?: number
          satisfaction_rating?: number | null
          session_id?: string
          topics_discussed?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      chatbot_conversations: {
        Row: {
          conversation_data: Json
          created_at: string
          id: string
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          conversation_data?: Json
          created_at?: string
          id?: string
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          conversation_data?: Json
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      communication_competency_results: {
        Row: {
          created_at: string
          direct_indirect: number
          expressive_reserved: number
          formal_informal: number
          id: string
          interpretation: string
          overall_communication_effectiveness: number
          recommendations: Json
          session_id: string
          task_relationship: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          direct_indirect: number
          expressive_reserved: number
          formal_informal: number
          id?: string
          interpretation: string
          overall_communication_effectiveness: number
          recommendations?: Json
          session_id: string
          task_relationship: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          direct_indirect?: number
          expressive_reserved?: number
          formal_informal?: number
          id?: string
          interpretation?: string
          overall_communication_effectiveness?: number
          recommendations?: Json
          session_id?: string
          task_relationship?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string | null
          email: string
          id: string
          inquiry_type: string | null
          message: string
          metadata: Json | null
          name: string
          phone: string | null
          responded_at: string | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          inquiry_type?: string | null
          message: string
          metadata?: Json | null
          name: string
          phone?: string | null
          responded_at?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          inquiry_type?: string | null
          message?: string
          metadata?: Json | null
          name?: string
          phone?: string | null
          responded_at?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      data_deletion_requests: {
        Row: {
          deletion_data: Json | null
          email: string
          id: string
          metadata: Json | null
          processed_at: string | null
          processed_by: string | null
          request_type: string
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          deletion_data?: Json | null
          email: string
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          processed_by?: string | null
          request_type?: string
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          deletion_data?: Json | null
          email?: string
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          processed_by?: string | null
          request_type?: string
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      employer_accounts: {
        Row: {
          contact_person: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          password_hash: string
          phone: string | null
          plan_type: string | null
          updated_at: string | null
        }
        Insert: {
          contact_person?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          password_hash: string
          phone?: string | null
          plan_type?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_person?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          password_hash?: string
          phone?: string | null
          plan_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      employer_candidates: {
        Row: {
          age: number | null
          assessment_completed: boolean | null
          completed_at: string | null
          country: string | null
          created_at: string | null
          email: string
          employer_id: string | null
          full_name: string | null
          gender: string | null
          id: string
          invited_at: string | null
          position_applied: string | null
          report_url: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          assessment_completed?: boolean | null
          completed_at?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          employer_id?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          invited_at?: string | null
          position_applied?: string | null
          report_url?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          assessment_completed?: boolean | null
          completed_at?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          employer_id?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          invited_at?: string | null
          position_applied?: string | null
          report_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employer_candidates_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      future_skills_catalog: {
        Row: {
          automation_risk: number | null
          category: string
          confidence_score: number | null
          created_at: string
          demand_score: number | null
          description: string | null
          growth_rate: number | null
          id: string
          learning_difficulty: number | null
          metadata: Json | null
          salary_premium: number | null
          skill_name: string
          subcategory: string | null
          supply_score: number | null
          tech_adoption_score: number | null
          updated_at: string
        }
        Insert: {
          automation_risk?: number | null
          category: string
          confidence_score?: number | null
          created_at?: string
          demand_score?: number | null
          description?: string | null
          growth_rate?: number | null
          id?: string
          learning_difficulty?: number | null
          metadata?: Json | null
          salary_premium?: number | null
          skill_name: string
          subcategory?: string | null
          supply_score?: number | null
          tech_adoption_score?: number | null
          updated_at?: string
        }
        Update: {
          automation_risk?: number | null
          category?: string
          confidence_score?: number | null
          created_at?: string
          demand_score?: number | null
          description?: string | null
          growth_rate?: number | null
          id?: string
          learning_difficulty?: number | null
          metadata?: Json | null
          salary_premium?: number | null
          skill_name?: string
          subcategory?: string | null
          supply_score?: number | null
          tech_adoption_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      generated_reports: {
        Row: {
          assessment_result_id: string
          created_at: string
          id: string
          pdf_url: string | null
          report_data: Json
          report_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_result_id: string
          created_at?: string
          id?: string
          pdf_url?: string | null
          report_data: Json
          report_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_result_id?: string
          created_at?: string
          id?: string
          pdf_url?: string | null
          report_data?: Json
          report_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_reports_assessment_result_id_fkey"
            columns: ["assessment_result_id"]
            isOneToOne: false
            referencedRelation: "assessment_results"
            referencedColumns: ["id"]
          },
        ]
      }
      genz_assessment_responses: {
        Row: {
          created_at: string | null
          id: string
          response_time: number | null
          response_type: string
          scenario_id: string | null
          session_id: string
          swipe_data: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          response_time?: number | null
          response_type: string
          scenario_id?: string | null
          session_id: string
          swipe_data?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          response_time?: number | null
          response_type?: string
          scenario_id?: string | null
          session_id?: string
          swipe_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "genz_assessment_responses_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "genz_assessment_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      genz_assessment_results: {
        Row: {
          avatar_emoji: string | null
          birth_year: number | null
          company_matches: Json
          completed_at: string | null
          created_at: string | null
          dimensions: Json
          employer_insights: Json | null
          id: string
          red_flags: Json
          session_id: string
          traits: Json
          updated_at: string | null
          user_id: string | null
          username: string
          validity_metrics: Json | null
          workplace_preferences: Json
          workplace_profile: Json
        }
        Insert: {
          avatar_emoji?: string | null
          birth_year?: number | null
          company_matches: Json
          completed_at?: string | null
          created_at?: string | null
          dimensions: Json
          employer_insights?: Json | null
          id?: string
          red_flags: Json
          session_id: string
          traits: Json
          updated_at?: string | null
          user_id?: string | null
          username: string
          validity_metrics?: Json | null
          workplace_preferences: Json
          workplace_profile: Json
        }
        Update: {
          avatar_emoji?: string | null
          birth_year?: number | null
          company_matches?: Json
          completed_at?: string | null
          created_at?: string | null
          dimensions?: Json
          employer_insights?: Json | null
          id?: string
          red_flags?: Json
          session_id?: string
          traits?: Json
          updated_at?: string | null
          user_id?: string | null
          username?: string
          validity_metrics?: Json | null
          workplace_preferences?: Json
          workplace_profile?: Json
        }
        Relationships: []
      }
      genz_assessment_scenarios: {
        Row: {
          category: string
          context: string | null
          created_at: string | null
          emoji: string | null
          id: string
          responses: Json
          text: string
          type: string
        }
        Insert: {
          category: string
          context?: string | null
          created_at?: string | null
          emoji?: string | null
          id?: string
          responses: Json
          text: string
          type: string
        }
        Update: {
          category?: string
          context?: string | null
          created_at?: string | null
          emoji?: string | null
          id?: string
          responses?: Json
          text?: string
          type?: string
        }
        Relationships: []
      }
      genz_collaboration_responses: {
        Row: {
          created_at: string | null
          id: string
          option_scores: Json
          scenario_id: string
          selected_option: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_scores: Json
          scenario_id: string
          selected_option: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          option_scores?: Json
          scenario_id?: string
          selected_option?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      genz_values_responses: {
        Row: {
          created_at: string | null
          id: string
          rank: number
          session_id: string
          user_id: string | null
          value_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rank: number
          session_id: string
          user_id?: string | null
          value_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rank?: number
          session_id?: string
          user_id?: string | null
          value_id?: string
        }
        Relationships: []
      }
      guest_access_tokens: {
        Row: {
          assessment_type: string
          created_at: string
          email: string
          expires_at: string
          id: string
          is_active: boolean | null
          order_id: string | null
          token: string
          used_at: string | null
        }
        Insert: {
          assessment_type: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          order_id?: string | null
          token: string
          used_at?: string | null
        }
        Update: {
          assessment_type?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          order_id?: string | null
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_access_tokens_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      industry_skills_trends: {
        Row: {
          confidence_level: number
          created_at: string
          data_collection_date: string
          data_sources: Json | null
          declining_skills: Json
          emerging_technologies: Json
          forecast_horizon: number
          geographic_variations: Json | null
          id: string
          industry_name: string
          job_market_data: Json
          salary_trends: Json
          skill_demand_forecast: Json
          trending_skills: Json
          updated_at: string
        }
        Insert: {
          confidence_level?: number
          created_at?: string
          data_collection_date?: string
          data_sources?: Json | null
          declining_skills?: Json
          emerging_technologies?: Json
          forecast_horizon?: number
          geographic_variations?: Json | null
          id?: string
          industry_name: string
          job_market_data?: Json
          salary_trends?: Json
          skill_demand_forecast?: Json
          trending_skills?: Json
          updated_at?: string
        }
        Update: {
          confidence_level?: number
          created_at?: string
          data_collection_date?: string
          data_sources?: Json | null
          declining_skills?: Json
          emerging_technologies?: Json
          forecast_horizon?: number
          geographic_variations?: Json | null
          id?: string
          industry_name?: string
          job_market_data?: Json
          salary_trends?: Json
          skill_demand_forecast?: Json
          trending_skills?: Json
          updated_at?: string
        }
        Relationships: []
      }
      industry_trends_forecast: {
        Row: {
          automation_risk: number | null
          avg_salary: number | null
          confidence_intervals: Json | null
          created_at: string
          forecast_generated_at: string
          forecast_period: string
          gdp_growth: number | null
          growth_rate: number | null
          id: string
          industry_name: string
          innovation_index: number | null
          job_postings_volume: number | null
          ml_model_version: string | null
          region: string
          unemployment_rate: number | null
          updated_at: string
        }
        Insert: {
          automation_risk?: number | null
          avg_salary?: number | null
          confidence_intervals?: Json | null
          created_at?: string
          forecast_generated_at?: string
          forecast_period: string
          gdp_growth?: number | null
          growth_rate?: number | null
          id?: string
          industry_name: string
          innovation_index?: number | null
          job_postings_volume?: number | null
          ml_model_version?: string | null
          region: string
          unemployment_rate?: number | null
          updated_at?: string
        }
        Update: {
          automation_risk?: number | null
          avg_salary?: number | null
          confidence_intervals?: Json | null
          created_at?: string
          forecast_generated_at?: string
          forecast_period?: string
          gdp_growth?: number | null
          growth_rate?: number | null
          id?: string
          industry_name?: string
          innovation_index?: number | null
          job_postings_volume?: number | null
          ml_model_version?: string | null
          region?: string
          unemployment_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      leadership_behavior_results: {
        Row: {
          affiliative_leadership: number
          coaching_leadership: number
          commanding_leadership: number
          created_at: string
          democratic_leadership: number
          id: string
          interpretation: string
          overall_leadership_effectiveness: number
          pacesetting_leadership: number
          primary_style: string
          recommendations: Json
          secondary_style: string
          session_id: string
          updated_at: string
          user_id: string
          visionary_leadership: number
        }
        Insert: {
          affiliative_leadership: number
          coaching_leadership: number
          commanding_leadership: number
          created_at?: string
          democratic_leadership: number
          id?: string
          interpretation: string
          overall_leadership_effectiveness: number
          pacesetting_leadership: number
          primary_style: string
          recommendations?: Json
          secondary_style: string
          session_id: string
          updated_at?: string
          user_id: string
          visionary_leadership: number
        }
        Update: {
          affiliative_leadership?: number
          coaching_leadership?: number
          commanding_leadership?: number
          created_at?: string
          democratic_leadership?: number
          id?: string
          interpretation?: string
          overall_leadership_effectiveness?: number
          pacesetting_leadership?: number
          primary_style?: string
          recommendations?: Json
          secondary_style?: string
          session_id?: string
          updated_at?: string
          user_id?: string
          visionary_leadership?: number
        }
        Relationships: []
      }
      ml_feature_store: {
        Row: {
          collected_at: string
          created_at: string
          data_source: string | null
          entity_id: string | null
          feature_category: string
          feature_metadata: Json | null
          feature_name: string
          feature_value: number
          id: string
          transformation_applied: string | null
        }
        Insert: {
          collected_at?: string
          created_at?: string
          data_source?: string | null
          entity_id?: string | null
          feature_category: string
          feature_metadata?: Json | null
          feature_name: string
          feature_value: number
          id?: string
          transformation_applied?: string | null
        }
        Update: {
          collected_at?: string
          created_at?: string
          data_source?: string | null
          entity_id?: string | null
          feature_category?: string
          feature_metadata?: Json | null
          feature_name?: string
          feature_value?: number
          id?: string
          transformation_applied?: string | null
        }
        Relationships: []
      }
      ml_model_experiments: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          data_version: string | null
          experiment_id: string
          feature_importance: Json | null
          hyperparameters: Json
          id: string
          model_type: string
          model_version: string
          started_at: string
          status: string
          training_duration_seconds: number | null
          training_metrics: Json
          updated_at: string
          validation_metrics: Json
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          data_version?: string | null
          experiment_id: string
          feature_importance?: Json | null
          hyperparameters?: Json
          id?: string
          model_type: string
          model_version: string
          started_at?: string
          status?: string
          training_duration_seconds?: number | null
          training_metrics?: Json
          updated_at?: string
          validation_metrics?: Json
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          data_version?: string | null
          experiment_id?: string
          feature_importance?: Json | null
          hyperparameters?: Json
          id?: string
          model_type?: string
          model_version?: string
          started_at?: string
          status?: string
          training_duration_seconds?: number | null
          training_metrics?: Json
          updated_at?: string
          validation_metrics?: Json
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          source: string | null
          subscribed_at: string | null
          unsubscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          source?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          source?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      normative_databases: {
        Row: {
          assessment_type: string
          collected_date: string
          created_at: string
          data_points: number[]
          data_quality_score: number | null
          demographic_group: Json
          dimension: string
          id: string
          is_active: boolean | null
          mean_score: number
          percentile_25: number
          percentile_50: number
          percentile_75: number
          percentile_90: number
          sample_size: number
          std_deviation: number
          updated_at: string
        }
        Insert: {
          assessment_type: string
          collected_date?: string
          created_at?: string
          data_points: number[]
          data_quality_score?: number | null
          demographic_group: Json
          dimension: string
          id?: string
          is_active?: boolean | null
          mean_score: number
          percentile_25: number
          percentile_50: number
          percentile_75: number
          percentile_90: number
          sample_size: number
          std_deviation: number
          updated_at?: string
        }
        Update: {
          assessment_type?: string
          collected_date?: string
          created_at?: string
          data_points?: number[]
          data_quality_score?: number | null
          demographic_group?: Json
          dimension?: string
          id?: string
          is_active?: boolean | null
          mean_score?: number
          percentile_25?: number
          percentile_50?: number
          percentile_75?: number
          percentile_90?: number
          sample_size?: number
          std_deviation?: number
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          assessment_type: string
          created_at: string
          id: string
          order_id: string | null
          quantity: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          assessment_type: string
          created_at?: string
          id?: string
          order_id?: string | null
          quantity?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          assessment_type?: string
          created_at?: string
          id?: string
          order_id?: string | null
          quantity?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assessment_type: string | null
          billing_info: Json | null
          created_at: string
          currency: string
          expires_at: string | null
          guest_email: string | null
          guest_name: string | null
          id: string
          is_guest_order: boolean | null
          payment_metadata: Json | null
          payment_processor: string | null
          payment_reference: string | null
          payment_status: string
          plan_id: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assessment_type?: string | null
          billing_info?: Json | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          is_guest_order?: boolean | null
          payment_metadata?: Json | null
          payment_processor?: string | null
          payment_reference?: string | null
          payment_status?: string
          plan_id?: string | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assessment_type?: string | null
          billing_info?: Json | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          is_guest_order?: boolean | null
          payment_metadata?: Json | null
          payment_processor?: string | null
          payment_reference?: string | null
          payment_status?: string
          plan_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "payment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_access_logs: {
        Row: {
          action: string
          assessment_type: string | null
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          partner_id: string
          user_agent: string | null
        }
        Insert: {
          action: string
          assessment_type?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          partner_id: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          assessment_type?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          partner_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_access_logs_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_access_permissions: {
        Row: {
          assessment_type: string
          can_access: boolean
          created_at: string
          id: string
          partner_id: string
        }
        Insert: {
          assessment_type: string
          can_access?: boolean
          created_at?: string
          id?: string
          partner_id: string
        }
        Update: {
          assessment_type?: string
          can_access?: boolean
          created_at?: string
          id?: string
          partner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_access_permissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_accounts: {
        Row: {
          access_expires_at: string
          contact_email: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          organization_name: string
          password_hash: string
          updated_at: string
          username: string
        }
        Insert: {
          access_expires_at: string
          contact_email: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          organization_name: string
          password_hash: string
          updated_at?: string
          username: string
        }
        Update: {
          access_expires_at?: string
          contact_email?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          organization_name?: string
          password_hash?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      partner_pricing: {
        Row: {
          assessment_type: string
          created_at: string
          discount_percentage: number | null
          fixed_price: number | null
          id: string
          is_active: boolean | null
          min_quantity: number
          partner_id: string | null
          updated_at: string
        }
        Insert: {
          assessment_type: string
          created_at?: string
          discount_percentage?: number | null
          fixed_price?: number | null
          id?: string
          is_active?: boolean | null
          min_quantity?: number
          partner_id?: string | null
          updated_at?: string
        }
        Update: {
          assessment_type?: string
          created_at?: string
          discount_percentage?: number | null
          fixed_price?: number | null
          id?: string
          is_active?: boolean | null
          min_quantity?: number
          partner_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_pricing_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_plans: {
        Row: {
          assessment_access: Json | null
          billing_interval: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          is_active: boolean | null
          max_assessments: number | null
          name: string
          plan_type: string
          price: number
          updated_at: string
        }
        Insert: {
          assessment_access?: Json | null
          billing_interval?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_assessments?: number | null
          name: string
          plan_type: string
          price: number
          updated_at?: string
        }
        Update: {
          assessment_access?: Json | null
          billing_interval?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_assessments?: number | null
          name?: string
          plan_type?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          candidate_id: string | null
          candidate_type: string
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          candidate_id?: string | null
          candidate_type: string
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          candidate_id?: string | null
          candidate_type?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pdf_reports: {
        Row: {
          assessment_result_id: string | null
          file_path: string
          file_size: number | null
          generated_at: string | null
          id: string
          report_type: string
          user_id: string | null
        }
        Insert: {
          assessment_result_id?: string | null
          file_path: string
          file_size?: number | null
          generated_at?: string | null
          id?: string
          report_type: string
          user_id?: string | null
        }
        Update: {
          assessment_result_id?: string | null
          file_path?: string
          file_size?: number | null
          generated_at?: string | null
          id?: string
          report_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pdf_reports_assessment_result_id_fkey"
            columns: ["assessment_result_id"]
            isOneToOne: false
            referencedRelation: "assessment_results"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_oversight_requirements: {
        Row: {
          assessment_type: string
          created_at: string
          id: string
          legal_disclaimers: string[] | null
          minimum_qualification_level: string | null
          requires_qualified_administrator: boolean | null
          requires_supervision: boolean | null
          updated_at: string
          usage_restrictions: string[] | null
        }
        Insert: {
          assessment_type: string
          created_at?: string
          id?: string
          legal_disclaimers?: string[] | null
          minimum_qualification_level?: string | null
          requires_qualified_administrator?: boolean | null
          requires_supervision?: boolean | null
          updated_at?: string
          usage_restrictions?: string[] | null
        }
        Update: {
          assessment_type?: string
          created_at?: string
          id?: string
          legal_disclaimers?: string[] | null
          minimum_qualification_level?: string | null
          requires_qualified_administrator?: boolean | null
          requires_supervision?: boolean | null
          updated_at?: string
          usage_restrictions?: string[] | null
        }
        Relationships: []
      }
      professional_standards_compliance: {
        Row: {
          assessment_type: string
          compliance_score: number
          compliance_status: string
          created_at: string
          id: string
          last_review_date: string
          next_review_due: string | null
          remediation_plan: string[] | null
          requirements_met: string[] | null
          requirements_missing: string[] | null
          reviewer_notes: string | null
          standard_type: string
          updated_at: string
        }
        Insert: {
          assessment_type: string
          compliance_score?: number
          compliance_status?: string
          created_at?: string
          id?: string
          last_review_date?: string
          next_review_due?: string | null
          remediation_plan?: string[] | null
          requirements_met?: string[] | null
          requirements_missing?: string[] | null
          reviewer_notes?: string | null
          standard_type: string
          updated_at?: string
        }
        Update: {
          assessment_type?: string
          compliance_score?: number
          compliance_status?: string
          created_at?: string
          id?: string
          last_review_date?: string
          next_review_due?: string | null
          remediation_plan?: string[] | null
          requirements_met?: string[] | null
          requirements_missing?: string[] | null
          reviewer_notes?: string | null
          standard_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      schema_versions: {
        Row: {
          checksum: string | null
          description: string
          executed_at: string | null
          executed_by: string | null
          id: string
          metadata: Json | null
          migration_file: string
          version_number: string
        }
        Insert: {
          checksum?: string | null
          description: string
          executed_at?: string | null
          executed_by?: string | null
          id?: string
          metadata?: Json | null
          migration_file: string
          version_number: string
        }
        Update: {
          checksum?: string | null
          description?: string
          executed_at?: string | null
          executed_by?: string | null
          id?: string
          metadata?: Json | null
          migration_file?: string
          version_number?: string
        }
        Relationships: []
      }
      scoring_versions: {
        Row: {
          algorithm_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          parameters: Json
          version_number: string
        }
        Insert: {
          algorithm_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parameters: Json
          version_number: string
        }
        Update: {
          algorithm_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parameters?: Json
          version_number?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          event_details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_improvements: {
        Row: {
          created_at: string
          description: string
          id: string
          implemented_at: string
          improvement_type: string
          metadata: Json | null
          status: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          implemented_at?: string
          improvement_type: string
          metadata?: Json | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          implemented_at?: string
          improvement_type?: string
          metadata?: Json | null
          status?: string
        }
        Relationships: []
      }
      skills_demand_forecast: {
        Row: {
          confidence_level: number | null
          confidence_lower: number
          confidence_upper: number
          created_at: string
          features_used: Json | null
          forecast_horizon: number
          forecast_metadata: Json | null
          generated_by_model: string
          id: string
          industry: string | null
          model_ensemble_results: Json | null
          model_version: string | null
          predicted_demand: number
          region: string
          skill_id: string | null
          updated_at: string
        }
        Insert: {
          confidence_level?: number | null
          confidence_lower: number
          confidence_upper: number
          created_at?: string
          features_used?: Json | null
          forecast_horizon: number
          forecast_metadata?: Json | null
          generated_by_model: string
          id?: string
          industry?: string | null
          model_ensemble_results?: Json | null
          model_version?: string | null
          predicted_demand: number
          region: string
          skill_id?: string | null
          updated_at?: string
        }
        Update: {
          confidence_level?: number | null
          confidence_lower?: number
          confidence_upper?: number
          created_at?: string
          features_used?: Json | null
          forecast_horizon?: number
          forecast_metadata?: Json | null
          generated_by_model?: string
          id?: string
          industry?: string | null
          model_ensemble_results?: Json | null
          model_version?: string | null
          predicted_demand?: number
          region?: string
          skill_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_demand_forecast_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "future_skills_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      skills_taxonomy: {
        Row: {
          created_at: string
          current_demand_score: number
          data_sources: Json | null
          description: string | null
          emergence_timeline: string
          future_demand_score: number
          growth_trajectory: number
          id: string
          industry_relevance: Json
          last_updated: string
          obsolescence_risk: number
          related_skills: string[]
          skill_category: string
          skill_name: string
          skill_type: string
        }
        Insert: {
          created_at?: string
          current_demand_score?: number
          data_sources?: Json | null
          description?: string | null
          emergence_timeline?: string
          future_demand_score?: number
          growth_trajectory?: number
          id?: string
          industry_relevance?: Json
          last_updated?: string
          obsolescence_risk?: number
          related_skills?: string[]
          skill_category: string
          skill_name: string
          skill_type?: string
        }
        Update: {
          created_at?: string
          current_demand_score?: number
          data_sources?: Json | null
          description?: string | null
          emergence_timeline?: string
          future_demand_score?: number
          growth_trajectory?: number
          id?: string
          industry_relevance?: Json
          last_updated?: string
          obsolescence_risk?: number
          related_skills?: string[]
          skill_category?: string
          skill_name?: string
          skill_type?: string
        }
        Relationships: []
      }
      solo_candidates: {
        Row: {
          access_token: string
          age: number | null
          assessment_completed: boolean | null
          country: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          full_name: string | null
          gender: string | null
          id: string
          payment_status: string | null
          report_url: string | null
          updated_at: string | null
        }
        Insert: {
          access_token: string
          age?: number | null
          assessment_completed?: boolean | null
          country?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          payment_status?: string | null
          report_url?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          age?: number | null
          assessment_completed?: boolean | null
          country?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          payment_status?: string | null
          report_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      technology_integration_results: {
        Row: {
          created_at: string
          digital_boundaries: number
          id: string
          interpretation: string
          overall_tech_integration: number
          productivity_impact: number
          recommendations: Json
          session_id: string
          tech_life_balance: number
          updated_at: string
          usage_patterns: number
          user_id: string
        }
        Insert: {
          created_at?: string
          digital_boundaries: number
          id?: string
          interpretation: string
          overall_tech_integration: number
          productivity_impact: number
          recommendations?: Json
          session_id: string
          tech_life_balance: number
          updated_at?: string
          usage_patterns: number
          user_id: string
        }
        Update: {
          created_at?: string
          digital_boundaries?: number
          id?: string
          interpretation?: string
          overall_tech_integration?: number
          productivity_impact?: number
          recommendations?: Json
          session_id?: string
          tech_life_balance?: number
          updated_at?: string
          usage_patterns?: number
          user_id?: string
        }
        Relationships: []
      }
      user_mfa: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          id: string
          is_enabled: boolean
          secret: string
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          secret: string
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          secret?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          last_accessed: string
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_accessed?: string
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_accessed?: string
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_skill_development: {
        Row: {
          created_at: string
          current_level: number | null
          estimated_completion_date: string | null
          id: string
          learning_path: Json | null
          priority_score: number | null
          progress_percentage: number | null
          recommended_resources: Json | null
          skill_id: string | null
          target_level: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_level?: number | null
          estimated_completion_date?: string | null
          id?: string
          learning_path?: Json | null
          priority_score?: number | null
          progress_percentage?: number | null
          recommended_resources?: Json | null
          skill_id?: string | null
          target_level?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_level?: number | null
          estimated_completion_date?: string | null
          id?: string
          learning_path?: Json | null
          priority_score?: number | null
          progress_percentage?: number | null
          recommended_resources?: Json | null
          skill_id?: string | null
          target_level?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skill_development_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "future_skills_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills_predictions: {
        Row: {
          assessment_result_id: string | null
          confidence_level: number
          created_at: string
          expires_at: string
          future_readiness_score: number
          generated_at: string
          id: string
          industry_context: string | null
          predicted_skills: Json
          prediction_metadata: Json | null
          prediction_timeframe: number
          recommended_learning_path: Json
          role_context: string | null
          skills_gap_analysis: Json
          user_id: string
        }
        Insert: {
          assessment_result_id?: string | null
          confidence_level?: number
          created_at?: string
          expires_at?: string
          future_readiness_score?: number
          generated_at?: string
          id?: string
          industry_context?: string | null
          predicted_skills?: Json
          prediction_metadata?: Json | null
          prediction_timeframe?: number
          recommended_learning_path?: Json
          role_context?: string | null
          skills_gap_analysis?: Json
          user_id: string
        }
        Update: {
          assessment_result_id?: string | null
          confidence_level?: number
          created_at?: string
          expires_at?: string
          future_readiness_score?: number
          generated_at?: string
          id?: string
          industry_context?: string | null
          predicted_skills?: Json
          prediction_metadata?: Json | null
          prediction_timeframe?: number
          recommended_learning_path?: Json
          role_context?: string | null
          skills_gap_analysis?: Json
          user_id?: string
        }
        Relationships: []
      }
      work_preferences_results: {
        Row: {
          career_expectations: number
          communication_styles: number
          created_at: string
          id: string
          interpretation: string
          multigenerational_strategies: number
          preference_profile: Json
          recommendations: Json
          session_id: string
          technology_integration: number
          updated_at: string
          user_id: string
          work_preferences: number
          workplace_fit: Json
        }
        Insert: {
          career_expectations: number
          communication_styles: number
          created_at?: string
          id?: string
          interpretation: string
          multigenerational_strategies: number
          preference_profile: Json
          recommendations?: Json
          session_id: string
          technology_integration: number
          updated_at?: string
          user_id: string
          work_preferences: number
          workplace_fit: Json
        }
        Update: {
          career_expectations?: number
          communication_styles?: number
          created_at?: string
          id?: string
          interpretation?: string
          multigenerational_strategies?: number
          preference_profile?: Json
          recommendations?: Json
          session_id?: string
          technology_integration?: number
          updated_at?: string
          user_id?: string
          work_preferences?: number
          workplace_fit?: Json
        }
        Relationships: []
      }
      work_values_results: {
        Row: {
          achievement_recognition: number
          autonomy_independence: number
          bottom_values: Json
          collaboration_teamwork: number
          created_at: string
          growth_learning: number
          id: string
          innovation_creativity: number
          interpretation: string
          leadership_influence: number
          recommendations: Json
          security_stability: number
          session_id: string
          social_impact_service: number
          top_values: Json
          updated_at: string
          user_id: string
          values_hierarchy: Json
          values_profile: Json
          work_life_integration: number
        }
        Insert: {
          achievement_recognition: number
          autonomy_independence: number
          bottom_values: Json
          collaboration_teamwork: number
          created_at?: string
          growth_learning: number
          id?: string
          innovation_creativity: number
          interpretation: string
          leadership_influence: number
          recommendations?: Json
          security_stability: number
          session_id: string
          social_impact_service: number
          top_values: Json
          updated_at?: string
          user_id: string
          values_hierarchy: Json
          values_profile: Json
          work_life_integration: number
        }
        Update: {
          achievement_recognition?: number
          autonomy_independence?: number
          bottom_values?: Json
          collaboration_teamwork?: number
          created_at?: string
          growth_learning?: number
          id?: string
          innovation_creativity?: number
          interpretation?: string
          leadership_influence?: number
          recommendations?: Json
          security_stability?: number
          session_id?: string
          social_impact_service?: number
          top_values?: Json
          updated_at?: string
          user_id?: string
          values_hierarchy?: Json
          values_profile?: Json
          work_life_integration?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_assessment_bias: {
        Args: { p_assessment_type: string; p_time_period_days?: number }
        Returns: Json
      }
      assign_admin_role: {
        Args: { p_email: string }
        Returns: undefined
      }
      authenticate_employer: {
        Args: { p_email: string; p_password: string }
        Returns: {
          email: string
          employer_id: string
          is_active: boolean
          name: string
        }[]
      }
      authenticate_partner: {
        Args: { p_password: string; p_username: string }
        Returns: {
          access_expires_at: string
          is_active: boolean
          is_expired: boolean
          organization_name: string
          partner_id: string
          username: string
        }[]
      }
      check_assessment_access: {
        Args: { p_assessment_type: string }
        Returns: boolean
      }
      check_guest_access: {
        Args: { p_assessment_type: string; p_token: string }
        Returns: boolean
      }
      check_partner_assessment_access: {
        Args: { p_assessment_type: string; p_partner_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_endpoint: string
          p_identifier: string
          p_limit?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_expired_assessment_progress: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_user_data: {
        Args: { p_user_id: string }
        Returns: Json
      }
      detect_suspicious_activity: {
        Args: {
          p_action: string
          p_ip_address: unknown
          p_user_agent: string
          p_user_id: string
        }
        Returns: boolean
      }
      generate_guest_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_deletion_request_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          processed_at: string
          request_id: string
          requested_at: string
          status: string
        }[]
      }
      get_normative_percentiles: {
        Args: {
          p_assessment_type: string
          p_demographics?: Json
          p_dimension: string
          p_score: number
        }
        Returns: Json
      }
      get_security_compliance_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          compliance_score: number
          implemented: number
          pending: number
          requires_config: number
          total_improvements: number
        }[]
      }
      get_security_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          last_updated: string
          policy_count: number
          rls_enabled: boolean
          table_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      log_analytics_event: {
        Args: {
          p_entity_id?: string
          p_entity_type?: string
          p_event_type: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      log_partner_activity: {
        Args: {
          p_action: string
          p_assessment_type?: string
          p_ip_address?: string
          p_metadata?: Json
          p_partner_id: string
          p_user_agent?: string
        }
        Returns: undefined
      }
      log_security_audit: {
        Args: {
          p_audit_type: string
          p_findings?: Json
          p_recommendations?: Json
        }
        Returns: string
      }
      log_security_event: {
        Args: {
          p_event_details?: Json
          p_event_type: string
          p_ip_address?: unknown
          p_severity?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      policy_exists: {
        Args: { policy_name: string; table_name: string }
        Returns: boolean
      }
      request_admin_password_reset: {
        Args: { p_email: string }
        Returns: undefined
      }
      request_data_deletion: {
        Args: { p_reason?: string }
        Returns: string
      }
      trigger_purchase_report: {
        Args: { p_admin_email?: string; p_period: string }
        Returns: Json
      }
      use_guest_token: {
        Args: { p_assessment_type: string; p_token: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

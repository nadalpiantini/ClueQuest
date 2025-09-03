export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cluequest_api_keys: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          name: string
          key_hash: string
          key_prefix: string
          permissions: Json
          rate_limit_per_hour: number
          last_used_at: string | null
          expires_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          name: string
          key_hash: string
          key_prefix: string
          permissions?: Json
          rate_limit_per_hour?: number
          last_used_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          name?: string
          key_hash?: string
          key_prefix?: string
          permissions?: Json
          rate_limit_per_hour?: number
          last_used_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_api_keys_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "cluequest_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_api_keys_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_api_usage: {
        Row: {
          id: string
          api_key_id: string | null
          organization_id: string
          endpoint: string
          method: string
          status_code: number
          response_time_ms: number | null
          ip_address: string | null
          user_agent: string | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          api_key_id?: string | null
          organization_id: string
          endpoint: string
          method: string
          status_code: number
          response_time_ms?: number | null
          ip_address?: string | null
          user_agent?: string | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          api_key_id?: string | null
          organization_id?: string
          endpoint?: string
          method?: string
          status_code?: number
          response_time_ms?: number | null
          ip_address?: string | null
          user_agent?: string | null
          error_message?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            referencedRelation: "cluequest_api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_api_usage_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "cluequest_organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_audit_logs: {
        Row: {
          id: string
          organization_id: string | null
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          severity: string
          tags: Json
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          severity?: string
          tags?: Json
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          severity?: string
          tags?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "cluequest_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_audit_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_feature_flags: {
        Row: {
          id: string
          name: string
          description: string | null
          is_enabled: boolean
          rollout_percentage: number
          conditions: Json
          environment: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_enabled?: boolean
          rollout_percentage?: number
          conditions?: Json
          environment?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_enabled?: boolean
          rollout_percentage?: number
          conditions?: Json
          environment?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_feature_flags_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_notifications: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          type: string
          title: string
          message: string
          action_url: string | null
          is_read: boolean
          read_at: string | null
          expires_at: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          type: string
          title: string
          message: string
          action_url?: string | null
          is_read?: boolean
          read_at?: string | null
          expires_at?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          type?: string
          title?: string
          message?: string
          action_url?: string | null
          is_read?: boolean
          read_at?: string | null
          expires_at?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_notifications_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "cluequest_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_notification_preferences: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          notification_type: string
          email_enabled: boolean
          in_app_enabled: boolean
          push_enabled: boolean
          frequency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          notification_type: string
          email_enabled?: boolean
          in_app_enabled?: boolean
          push_enabled?: boolean
          frequency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          notification_type?: string
          email_enabled?: boolean
          in_app_enabled?: boolean
          push_enabled?: boolean
          frequency?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_notification_preferences_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "cluequest_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_notification_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_organizations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          website_url: string | null
          logo_url: string | null
          industry: string | null
          company_size: string | null
          country: string | null
          timezone: string
          settings: Json
          billing_email: string | null
          is_active: boolean
          trial_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          website_url?: string | null
          logo_url?: string | null
          industry?: string | null
          company_size?: string | null
          country?: string | null
          timezone?: string
          settings?: Json
          billing_email?: string | null
          is_active?: boolean
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          website_url?: string | null
          logo_url?: string | null
          industry?: string | null
          company_size?: string | null
          country?: string | null
          timezone?: string
          settings?: Json
          billing_email?: string | null
          is_active?: boolean
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cluequest_organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string
          permissions: Json
          invited_by: string | null
          invited_at: string | null
          joined_at: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role: string
          permissions?: Json
          invited_by?: string | null
          invited_at?: string | null
          joined_at?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string
          permissions?: Json
          invited_by?: string | null
          invited_at?: string | null
          joined_at?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_organization_members_invited_by_fkey"
            columns: ["invited_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_organization_members_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "cluequest_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_organization_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price_monthly: number | null
          price_yearly: number | null
          currency: string
          max_users: number | null
          max_projects: number | null
          features: Json
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price_monthly?: number | null
          price_yearly?: number | null
          currency?: string
          max_users?: number | null
          max_projects?: number | null
          features?: Json
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price_monthly?: number | null
          price_yearly?: number | null
          currency?: string
          max_users?: number | null
          max_projects?: number | null
          features?: Json
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cluequest_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          timezone: string
          language: string
          country: string | null
          phone: string | null
          job_title: string | null
          company: string | null
          bio: string | null
          preferences: Json
          onboarding_completed: boolean
          email_verified: boolean
          last_active_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          language?: string
          country?: string | null
          phone?: string | null
          job_title?: string | null
          company?: string | null
          bio?: string | null
          preferences?: Json
          onboarding_completed?: boolean
          email_verified?: boolean
          last_active_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          language?: string
          country?: string | null
          phone?: string | null
          job_title?: string | null
          company?: string | null
          bio?: string | null
          preferences?: Json
          onboarding_completed?: boolean
          email_verified?: boolean
          last_active_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_security_incidents: {
        Row: {
          id: string
          organization_id: string | null
          incident_type: string
          severity: string
          status: string
          title: string
          description: string | null
          affected_users: number
          detection_method: string | null
          ip_address: string | null
          user_agent: string | null
          metadata: Json
          detected_at: string
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          incident_type: string
          severity: string
          status?: string
          title: string
          description?: string | null
          affected_users?: number
          detection_method?: string | null
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json
          detected_at?: string
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          incident_type?: string
          severity?: string
          status?: string
          title?: string
          description?: string | null
          affected_users?: number
          detection_method?: string | null
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json
          detected_at?: string
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_security_incidents_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "cluequest_organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_subscriptions: {
        Row: {
          id: string
          organization_id: string
          plan_id: string
          status: string
          current_period_start: string
          current_period_end: string
          trial_start: string | null
          trial_end: string | null
          canceled_at: string | null
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          plan_id: string
          status: string
          current_period_start: string
          current_period_end: string
          trial_start?: string | null
          trial_end?: string | null
          canceled_at?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          plan_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          trial_start?: string | null
          trial_end?: string | null
          canceled_at?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "cluequest_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "cluequest_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_support_messages: {
        Row: {
          id: string
          ticket_id: string
          user_id: string
          message: string
          is_internal: boolean
          attachments: Json
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          user_id: string
          message: string
          is_internal?: boolean
          attachments?: Json
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          user_id?: string
          message?: string
          is_internal?: boolean
          attachments?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            referencedRelation: "cluequest_support_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_support_messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_support_tickets: {
        Row: {
          id: string
          organization_id: string | null
          user_id: string
          subject: string
          description: string
          priority: string
          status: string
          category: string | null
          assigned_to: string | null
          resolution: string | null
          satisfaction_rating: number | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          user_id: string
          subject: string
          description: string
          priority?: string
          status?: string
          category?: string | null
          assigned_to?: string | null
          resolution?: string | null
          satisfaction_rating?: number | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          user_id?: string
          subject?: string
          description?: string
          priority?: string
          status?: string
          category?: string | null
          assigned_to?: string | null
          resolution?: string | null
          satisfaction_rating?: number | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_support_tickets_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "cluequest_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_support_tickets_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_usage_records: {
        Row: {
          id: string
          organization_id: string
          user_id: string | null
          event_type: string
          quantity: number
          metadata: Json
          recorded_at: string
          billing_period_start: string
          billing_period_end: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id?: string | null
          event_type: string
          quantity?: number
          metadata?: Json
          recorded_at?: string
          billing_period_start: string
          billing_period_end: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string | null
          event_type?: string
          quantity?: number
          metadata?: Json
          recorded_at?: string
          billing_period_start?: string
          billing_period_end?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_usage_records_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "cluequest_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_usage_records_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cluequest_user_feature_flags: {
        Row: {
          id: string
          user_id: string
          feature_flag_id: string
          is_enabled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          feature_flag_id: string
          is_enabled: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          feature_flag_id?: string
          is_enabled?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluequest_user_feature_flags_feature_flag_id_fkey"
            columns: ["feature_flag_id"]
            referencedRelation: "cluequest_feature_flags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cluequest_user_feature_flags_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_usage_metrics: {
        Args: {
          org_id: string
          start_date?: string
          end_date?: string
        }
        Returns: Json
      }
      get_dashboard_data_optimized: {
        Args: {
          org_id?: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Utility types for better developer experience
export type Profile = Database['public']['Tables']['cluequest_profiles']['Row']
export type Organization = Database['public']['Tables']['cluequest_organizations']['Row']
export type OrganizationMember = Database['public']['Tables']['cluequest_organization_members']['Row']
export type Plan = Database['public']['Tables']['cluequest_plans']['Row']
export type Subscription = Database['public']['Tables']['cluequest_subscriptions']['Row']
export type ApiKey = Database['public']['Tables']['cluequest_api_keys']['Row']
export type Notification = Database['public']['Tables']['cluequest_notifications']['Row']
export type AuditLog = Database['public']['Tables']['cluequest_audit_logs']['Row']
export type FeatureFlag = Database['public']['Tables']['cluequest_feature_flags']['Row']
export type SupportTicket = Database['public']['Tables']['cluequest_support_tickets']['Row']
export type UsageRecord = Database['public']['Tables']['cluequest_usage_records']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['cluequest_profiles']['Insert']
export type OrganizationInsert = Database['public']['Tables']['cluequest_organizations']['Insert']
export type OrganizationMemberInsert = Database['public']['Tables']['cluequest_organization_members']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['cluequest_profiles']['Update']
export type OrganizationUpdate = Database['public']['Tables']['cluequest_organizations']['Update']
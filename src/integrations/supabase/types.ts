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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          summary: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          summary?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          summary?: string | null
        }
        Relationships: []
      }
      admin_catalog: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          features: string | null
          id: string
          name: string
          price_from_php: number | null
          status: string | null
          turnaround_days: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: string | null
          id?: string
          name: string
          price_from_php?: number | null
          status?: string | null
          turnaround_days?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: string | null
          id?: string
          name?: string
          price_from_php?: number | null
          status?: string | null
          turnaround_days?: number | null
        }
        Relationships: []
      }
      admin_clients: {
        Row: {
          business_name: string | null
          business_type: string | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          status: string | null
          whatsapp: string | null
        }
        Insert: {
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          status?: string | null
          whatsapp?: string | null
        }
        Update: {
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          status?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      admin_project_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          note_type: string | null
          project_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          note_type?: string | null
          project_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          note_type?: string | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_project_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "admin_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_project_urls: {
        Row: {
          created_at: string | null
          id: string
          label: string
          project_id: string | null
          url: string
          url_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          project_id?: string | null
          url: string
          url_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          project_id?: string | null
          url?: string
          url_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_project_urls_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "admin_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_projects: {
        Row: {
          client_name: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          github_url: string | null
          id: string
          live_url: string | null
          lovable_url: string | null
          name: string
          status: string | null
          supabase_project_id: string | null
          updated_at: string | null
          vercel_url: string | null
          webapp_type: string | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          lovable_url?: string | null
          name: string
          status?: string | null
          supabase_project_id?: string | null
          updated_at?: string | null
          vercel_url?: string | null
          webapp_type?: string | null
        }
        Update: {
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          lovable_url?: string | null
          name?: string
          status?: string | null
          supabase_project_id?: string | null
          updated_at?: string | null
          vercel_url?: string | null
          webapp_type?: string | null
        }
        Relationships: []
      }
      admin_quotes: {
        Row: {
          client_id: string | null
          client_name: string | null
          created_at: string | null
          description: string | null
          id: string
          notes: string | null
          price_php: number | null
          status: string | null
          valid_until: string | null
          webapp_type: string
        }
        Insert: {
          client_id?: string | null
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          price_php?: number | null
          status?: string | null
          valid_until?: string | null
          webapp_type: string
        }
        Update: {
          client_id?: string | null
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          price_php?: number | null
          status?: string | null
          valid_until?: string | null
          webapp_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "admin_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      app_links: {
        Row: {
          created_at: string
          display_order: number
          icon: string
          id: string
          is_primary: boolean
          is_visible: boolean
          name: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          is_primary?: boolean
          is_visible?: boolean
          name: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          is_primary?: boolean
          is_visible?: boolean
          name?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string | null
          display_order: number | null
          excerpt: string
          id: string
          published: boolean | null
          tag: string
          tag_bg: string
          tag_color: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          display_order?: number | null
          excerpt: string
          id?: string
          published?: boolean | null
          tag: string
          tag_bg?: string
          tag_color?: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          display_order?: number | null
          excerpt?: string
          id?: string
          published?: boolean | null
          tag?: string
          tag_bg?: string
          tag_color?: string
          title?: string
        }
        Relationships: []
      }
      catalog_items: {
        Row: {
          base_price_php: number | null
          category: string | null
          created_at: string
          demo_url: string | null
          description: string | null
          display_order: number | null
          features: string[] | null
          id: string
          is_active: boolean
          name: string
          screenshots: string[] | null
          setup_days: number | null
          tech_stack: string[] | null
        }
        Insert: {
          base_price_php?: number | null
          category?: string | null
          created_at?: string
          demo_url?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean
          name: string
          screenshots?: string[] | null
          setup_days?: number | null
          tech_stack?: string[] | null
        }
        Update: {
          base_price_php?: number | null
          category?: string | null
          created_at?: string
          demo_url?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean
          name?: string
          screenshots?: string[] | null
          setup_days?: number | null
          tech_stack?: string[] | null
        }
        Relationships: []
      }
      client_notes: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          business_name: string
          business_type: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          estimated_value_php: number | null
          facebook_url: string | null
          follow_up_date: string | null
          id: string
          last_contact_date: string | null
          location: string | null
          monthly_recurring_php: number | null
          notes: string | null
          pipeline_stage: string
          pitch_sent_date: string | null
          service_interests: string[] | null
          source: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          business_name: string
          business_type?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          estimated_value_php?: number | null
          facebook_url?: string | null
          follow_up_date?: string | null
          id?: string
          last_contact_date?: string | null
          location?: string | null
          monthly_recurring_php?: number | null
          notes?: string | null
          pipeline_stage?: string
          pitch_sent_date?: string | null
          service_interests?: string[] | null
          source?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          business_name?: string
          business_type?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          estimated_value_php?: number | null
          facebook_url?: string | null
          follow_up_date?: string | null
          id?: string
          last_contact_date?: string | null
          location?: string | null
          monthly_recurring_php?: number | null
          notes?: string | null
          pipeline_stage?: string
          pitch_sent_date?: string | null
          service_interests?: string[] | null
          source?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          id: string
          language: string
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          id?: string
          language?: string
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          id?: string
          language?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          author_name: string | null
          created_at: string
          id: string
          message: string
        }
        Insert: {
          author_name?: string | null
          created_at?: string
          id?: string
          message: string
        }
        Update: {
          author_name?: string | null
          created_at?: string
          id?: string
          message?: string
        }
        Relationships: []
      }
      header_link: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string
          device_type: string | null
          file_path: string
          file_url: string
          id: string
          media_type: string | null
          project_id: string | null
          size_bytes: number | null
          tags: string[] | null
          tool_id: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          device_type?: string | null
          file_path: string
          file_url: string
          id?: string
          media_type?: string | null
          project_id?: string | null
          size_bytes?: number | null
          tags?: string[] | null
          tool_id?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          device_type?: string | null
          file_path?: string
          file_url?: string
          id?: string
          media_type?: string | null
          project_id?: string | null
          size_bytes?: number | null
          tags?: string[] | null
          tool_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          client_id: string | null
          completed: boolean
          content: string | null
          created_at: string
          due_date: string | null
          id: string
          priority: string
          project_id: string | null
          tags: string[] | null
          title: string
          tool_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          completed?: boolean
          content?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string | null
          tags?: string[] | null
          title: string
          tool_id?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          completed?: boolean
          content?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string | null
          tags?: string[] | null
          title?: string
          tool_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_cost_php: number | null
          actual_launch: string | null
          budget_php: number | null
          category: string | null
          created_at: string
          description: string | null
          display_order: number | null
          github_url: string | null
          id: string
          live_url: string | null
          lovable_url: string | null
          name: string
          notes: string | null
          screenshots: string[] | null
          stage: string
          start_date: string | null
          target_launch: string | null
          team_members: string[] | null
          tech_stack: string[] | null
          updated_at: string
          vercel_url: string | null
        }
        Insert: {
          actual_cost_php?: number | null
          actual_launch?: string | null
          budget_php?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          lovable_url?: string | null
          name: string
          notes?: string | null
          screenshots?: string[] | null
          stage?: string
          start_date?: string | null
          target_launch?: string | null
          team_members?: string[] | null
          tech_stack?: string[] | null
          updated_at?: string
          vercel_url?: string | null
        }
        Update: {
          actual_cost_php?: number | null
          actual_launch?: string | null
          budget_php?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          lovable_url?: string | null
          name?: string
          notes?: string | null
          screenshots?: string[] | null
          stage?: string
          start_date?: string | null
          target_launch?: string | null
          team_members?: string[] | null
          tech_stack?: string[] | null
          updated_at?: string
          vercel_url?: string | null
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          catalog_item_id: string | null
          description: string | null
          id: string
          line_total_php: number
          name: string
          qty: number
          quote_id: string
          sort_order: number | null
          unit_price_php: number
        }
        Insert: {
          catalog_item_id?: string | null
          description?: string | null
          id?: string
          line_total_php?: number
          name: string
          qty?: number
          quote_id: string
          sort_order?: number | null
          unit_price_php?: number
        }
        Update: {
          catalog_item_id?: string | null
          description?: string | null
          id?: string
          line_total_php?: number
          name?: string
          qty?: number
          quote_id?: string
          sort_order?: number | null
          unit_price_php?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_catalog_item_id_fkey"
            columns: ["catalog_item_id"]
            isOneToOne: false
            referencedRelation: "catalog_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_id: string | null
          created_at: string
          follow_up_count: number
          id: string
          last_reminder_at: string | null
          notes: string | null
          sent_via: string | null
          status: string
          terms: string | null
          title: string
          total_php: number | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          follow_up_count?: number
          id?: string
          last_reminder_at?: string | null
          notes?: string | null
          sent_via?: string | null
          status?: string
          terms?: string | null
          title: string
          total_php?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          follow_up_count?: number
          id?: string
          last_reminder_at?: string | null
          notes?: string | null
          sent_via?: string | null
          status?: string
          terms?: string | null
          title?: string
          total_php?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue: {
        Row: {
          amount_php: number
          client_id: string | null
          created_at: string
          id: string
          notes: string | null
          payment_date: string | null
          status: string
          type: string
        }
        Insert: {
          amount_php?: number
          client_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          status?: string
          type?: string
        }
        Update: {
          amount_php?: number
          client_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          address_line: string | null
          city: string | null
          color_accent: string | null
          color_primary: string | null
          color_secondary: string | null
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          copyright_holder: string | null
          country: string | null
          created_at: string
          favicon_url: string | null
          id: string
          logo_dark_url: string | null
          logo_light_url: string | null
          logo_main_url: string | null
          postal_code: string | null
          province: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_tiktok: string | null
          social_twitter: string | null
          social_youtube: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          address_line?: string | null
          city?: string | null
          color_accent?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          copyright_holder?: string | null
          country?: string | null
          created_at?: string
          favicon_url?: string | null
          id?: string
          logo_dark_url?: string | null
          logo_light_url?: string | null
          logo_main_url?: string | null
          postal_code?: string | null
          province?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          address_line?: string | null
          city?: string | null
          color_accent?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          copyright_holder?: string | null
          country?: string | null
          created_at?: string
          favicon_url?: string | null
          id?: string
          logo_dark_url?: string | null
          logo_light_url?: string | null
          logo_main_url?: string | null
          postal_code?: string | null
          province?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          created_at: string
          description: string | null
          github_url: string | null
          id: string
          install_instructions: string | null
          installed: boolean
          installed_at: string | null
          license: string | null
          monthly_cost_usd: number | null
          name: string
          notes: string | null
          priority_rank: number | null
          revenue_potential_php: number | null
          token_burn: string | null
          use_cases: string[] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          github_url?: string | null
          id?: string
          install_instructions?: string | null
          installed?: boolean
          installed_at?: string | null
          license?: string | null
          monthly_cost_usd?: number | null
          name: string
          notes?: string | null
          priority_rank?: number | null
          revenue_potential_php?: number | null
          token_burn?: string | null
          use_cases?: string[] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          github_url?: string | null
          id?: string
          install_instructions?: string | null
          installed?: boolean
          installed_at?: string | null
          license?: string | null
          monthly_cost_usd?: number | null
          name?: string
          notes?: string | null
          priority_rank?: number | null
          revenue_potential_php?: number | null
          token_burn?: string | null
          use_cases?: string[] | null
        }
        Relationships: []
      }
      weekly_goals: {
        Row: {
          completed: boolean
          created_at: string
          current_value: number
          id: string
          sort_order: number | null
          target_value: number
          title: string
          updated_at: string
          week_start_date: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          current_value?: number
          id?: string
          sort_order?: number | null
          target_value?: number
          title: string
          updated_at?: string
          week_start_date?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          current_value?: number
          id?: string
          sort_order?: number | null
          target_value?: number
          title?: string
          updated_at?: string
          week_start_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

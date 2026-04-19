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
      site_settings: {
        Row: {
          created_at: string
          id: string
          logo_dark_url: string | null
          logo_light_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_dark_url?: string | null
          logo_light_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_dark_url?: string | null
          logo_light_url?: string | null
          updated_at?: string
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

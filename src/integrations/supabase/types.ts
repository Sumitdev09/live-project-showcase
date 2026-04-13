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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          tags: Json | null
          title: string
        }
        Insert: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          tags?: Json | null
          title: string
        }
        Update: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          tags?: Json | null
          title?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string
          credential_url: string | null
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          issue_date: string | null
          issuer: string | null
          title: string
        }
        Insert: {
          created_at?: string
          credential_url?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuer?: string | null
          title: string
        }
        Update: {
          created_at?: string
          credential_url?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuer?: string | null
          title?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string | null
          name: string
          read: boolean | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name: string
          read?: boolean | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          read?: boolean | null
          subject?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string | null
          description: string | null
          end_year: number | null
          field: string | null
          id: string
          institution: string
          start_year: number | null
        }
        Insert: {
          created_at?: string
          degree?: string | null
          description?: string | null
          end_year?: number | null
          field?: string | null
          id?: string
          institution: string
          start_year?: number | null
        }
        Update: {
          created_at?: string
          degree?: string | null
          description?: string | null
          end_year?: number | null
          field?: string | null
          id?: string
          institution?: string
          start_year?: number | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          position: string
          start_date: string | null
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position: string
          start_date?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position?: string
          start_date?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          achievements: Json | null
          bio: string | null
          created_at: string
          developer1_url: string | null
          developer2_url: string | null
          email: string | null
          full_name: string | null
          github: string | null
          id: string
          instagram: string | null
          interests: Json | null
          linkedin: string | null
          location: string | null
          phone: string | null
          photo_url: string | null
          resume_url: string | null
          skill_stats: Json | null
          skills: Json | null
          title: string | null
          tools: Json | null
          twitter: string | null
          updated_at: string
        }
        Insert: {
          achievements?: Json | null
          bio?: string | null
          created_at?: string
          developer1_url?: string | null
          developer2_url?: string | null
          email?: string | null
          full_name?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          interests?: Json | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          photo_url?: string | null
          resume_url?: string | null
          skill_stats?: Json | null
          skills?: Json | null
          title?: string | null
          tools?: Json | null
          twitter?: string | null
          updated_at?: string
        }
        Update: {
          achievements?: Json | null
          bio?: string | null
          created_at?: string
          developer1_url?: string | null
          developer2_url?: string | null
          email?: string | null
          full_name?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          interests?: Json | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          photo_url?: string | null
          resume_url?: string | null
          skill_stats?: Json | null
          skills?: Json | null
          title?: string | null
          tools?: Json | null
          twitter?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          github_url: string | null
          id: string
          image_url: string | null
          live_url: string | null
          material_url: string | null
          technologies: Json | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          material_url?: string | null
          technologies?: Json | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          material_url?: string | null
          technologies?: Json | null
          title?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          created_at: string
          icon_name: string | null
          id: string
          skills: Json | null
          sort_order: number | null
          title: string
        }
        Insert: {
          created_at?: string
          icon_name?: string | null
          id?: string
          skills?: Json | null
          sort_order?: number | null
          title: string
        }
        Update: {
          created_at?: string
          icon_name?: string | null
          id?: string
          skills?: Json | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

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
      about_page_content: {
        Row: {
          content: string | null
          id: string
          images: Json | null
          section_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          id?: string
          images?: Json | null
          section_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          id?: string
          images?: Json | null
          section_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          doctor_name: string | null
          id: number
          notes: string | null
          specialty: string | null
          user_id: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          doctor_name?: string | null
          id?: number
          notes?: string | null
          specialty?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          doctor_name?: string | null
          id?: number
          notes?: string | null
          specialty?: string | null
          user_id?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          is_active: boolean
          language: string
          published_date: string
          source: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          is_active?: boolean
          language: string
          published_date: string
          source: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_active?: boolean
          language?: string
          published_date?: string
          source?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      medications: {
        Row: {
          created_at: string
          dosage: string | null
          frequency: string | null
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          frequency?: string | null
          id?: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string | null
          frequency?: string | null
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      pharmacy_links: {
        Row: {
          commercial_name: string | null
          created_at: string
          id: string
          is_active: boolean
          laboratory: string | null
          last_price_update: string | null
          medication_name: string
          mg_per_tablet: string | null
          pharmacy_name: string
          presentation: string
          price: number
          product_url: string
          quantity: number | null
          regular_price: number | null
          sale_price: number | null
          updated_at: string
        }
        Insert: {
          commercial_name?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          laboratory?: string | null
          last_price_update?: string | null
          medication_name: string
          mg_per_tablet?: string | null
          pharmacy_name: string
          presentation: string
          price: number
          product_url: string
          quantity?: number | null
          regular_price?: number | null
          sale_price?: number | null
          updated_at?: string
        }
        Update: {
          commercial_name?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          laboratory?: string | null
          last_price_update?: string | null
          medication_name?: string
          mg_per_tablet?: string | null
          pharmacy_name?: string
          presentation?: string
          price?: number
          product_url?: string
          quantity?: number | null
          regular_price?: number | null
          sale_price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
      symptom_logs: {
        Row: {
          id: number
          logged_at: string
          notes: string | null
          severity: number
          symptom: string
          user_id: string
        }
        Insert: {
          id?: number
          logged_at?: string
          notes?: string | null
          severity: number
          symptom: string
          user_id: string
        }
        Update: {
          id?: number
          logged_at?: string
          notes?: string | null
          severity?: number
          symptom?: string
          user_id?: string
        }
        Relationships: []
      }
      tips: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: number
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: number
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      user_questions: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          question: string
          responded_by: string | null
          response: string | null
          response_date: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          question: string
          responded_by?: string | null
          response?: string | null
          response_date?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          question?: string
          responded_by?: string | null
          response?: string | null
          response_date?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      delete_explanatory_video: {
        Args: { p_video_id: string }
        Returns: boolean
      }
      get_explanatory_videos: {
        Args: never
        Returns: {
          created_at: string
          description: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          title: string
          uploaded_by: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      insert_explanatory_video: {
        Args: {
          p_description: string
          p_file_name: string
          p_file_path: string
          p_file_size: number
          p_title: string
          p_uploaded_by: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "health_professional" | "visitor"
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
      app_role: ["admin", "health_professional", "visitor"],
    },
  },
} as const

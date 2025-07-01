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
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          description: string
          file_path: string
          file_name: string
          file_size: number
          created_at: string
          uploaded_by: string
        }[]
      }
      insert_explanatory_video: {
        Args: {
          p_title: string
          p_description: string
          p_file_path: string
          p_file_name: string
          p_file_size: number
          p_uploaded_by: string
        }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

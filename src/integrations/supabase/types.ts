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
      practices: {
        Row: {
          category: string
          display_name: string
          duration_estimated: string | null
          for_profile: string
          id: string
          intensity: string | null
          intention: string | null
          media_mode: string
          media_url: string | null
          name: string
          phases: Json | null
          premium: boolean
          sort_order: number
          tags: Json | null
          technique: string | null
        }
        Insert: {
          category: string
          display_name: string
          duration_estimated?: string | null
          for_profile?: string
          id: string
          intensity?: string | null
          intention?: string | null
          media_mode?: string
          media_url?: string | null
          name: string
          phases?: Json | null
          premium?: boolean
          sort_order?: number
          tags?: Json | null
          technique?: string | null
        }
        Update: {
          category?: string
          display_name?: string
          duration_estimated?: string | null
          for_profile?: string
          id?: string
          intensity?: string | null
          intention?: string | null
          media_mode?: string
          media_url?: string | null
          name?: string
          phases?: Json | null
          premium?: boolean
          sort_order?: number
          tags?: Json | null
          technique?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          onboarding_answers: Json | null
          onboarding_completed: boolean
          user_id: string
          user_profile: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          onboarding_answers?: Json | null
          onboarding_completed?: boolean
          user_id: string
          user_profile?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          onboarding_answers?: Json | null
          onboarding_completed?: boolean
          user_id?: string
          user_profile?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          days: Json
          description: string | null
          id: string
          max_days: number
          name: string
          target_profile: string
        }
        Insert: {
          days?: Json
          description?: string | null
          id: string
          max_days?: number
          name: string
          target_profile?: string
        }
        Update: {
          days?: Json
          description?: string | null
          id?: string
          max_days?: number
          name?: string
          target_profile?: string
        }
        Relationships: []
      }
      saved_practices: {
        Row: {
          practice_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          practice_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          practice_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          completed_at: string
          duration_seconds: number | null
          feeling: string | null
          ice_duration_minutes: number | null
          id: string
          practice_id: string | null
          practice_name: string | null
          temperature: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          duration_seconds?: number | null
          feeling?: string | null
          ice_duration_minutes?: number | null
          id?: string
          practice_id?: string | null
          practice_name?: string | null
          temperature?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          duration_seconds?: number | null
          feeling?: string | null
          ice_duration_minutes?: number | null
          id?: string
          practice_id?: string | null
          practice_name?: string | null
          temperature?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_program_progress: {
        Row: {
          completed_at: string | null
          completed_days: Json
          current_day: number
          id: string
          program_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_days?: Json
          current_day?: number
          id?: string
          program_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_days?: Json
          current_day?: number
          id?: string
          program_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_program_progress_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
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

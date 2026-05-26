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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      daily_tasks: {
        Row: {
          category: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          task_date: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          task_date?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          task_date?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          ai_response: string | null
          content: string
          created_at: string
          id: string
          mood: number | null
          user_id: string
        }
        Insert: {
          ai_response?: string | null
          content: string
          created_at?: string
          id?: string
          mood?: number | null
          user_id: string
        }
        Update: {
          ai_response?: string | null
          content?: string
          created_at?: string
          id?: string
          mood?: number | null
          user_id?: string
        }
        Relationships: []
      }
      kiwify_orders: {
        Row: {
          created_at: string
          created_user_id: string | null
          email: string
          id: string
          order_id: string
          product_id: string | null
          raw: Json | null
          status: string
        }
        Insert: {
          created_at?: string
          created_user_id?: string | null
          email: string
          id?: string
          order_id: string
          product_id?: string | null
          raw?: Json | null
          status: string
        }
        Update: {
          created_at?: string
          created_user_id?: string | null
          email?: string
          id?: string
          order_id?: string
          product_id?: string | null
          raw?: Json | null
          status?: string
        }
        Relationships: []
      }
      mood_checkins: {
        Row: {
          checkin_date: string
          created_at: string
          id: string
          mood: number
          note: string | null
          user_id: string
        }
        Insert: {
          checkin_date?: string
          created_at?: string
          id?: string
          mood: number
          note?: string | null
          user_id: string
        }
        Update: {
          checkin_date?: string
          created_at?: string
          id?: string
          mood?: number
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      onboarding: {
        Row: {
          ai_plan: string | null
          biggest_obstacle: string | null
          created_at: string
          critical_hours: string[] | null
          current_feeling: string | null
          goal: string | null
          habit: string
          intensity: number
          time_lost: string | null
          triggers: string[] | null
          updated_at: string
          user_id: string
          vision_30_days: string | null
        }
        Insert: {
          ai_plan?: string | null
          biggest_obstacle?: string | null
          created_at?: string
          critical_hours?: string[] | null
          current_feeling?: string | null
          goal?: string | null
          habit: string
          intensity?: number
          time_lost?: string | null
          triggers?: string[] | null
          updated_at?: string
          user_id: string
          vision_30_days?: string | null
        }
        Update: {
          ai_plan?: string | null
          biggest_obstacle?: string | null
          created_at?: string
          critical_hours?: string[] | null
          current_feeling?: string | null
          goal?: string | null
          habit?: string
          intensity?: number
          time_lost?: string | null
          triggers?: string[] | null
          updated_at?: string
          user_id?: string
          vision_30_days?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean | null
          created_at: string
          full_name: string | null
          id: string
          onboarded: boolean | null
          source: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          full_name?: string | null
          id: string
          onboarded?: boolean | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          full_name?: string | null
          id?: string
          onboarded?: boolean | null
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      progress: {
        Row: {
          best_streak: number | null
          current_streak: number | null
          last_active_date: string | null
          level: number | null
          total_clean_days: number | null
          updated_at: string
          user_id: string
          xp: number | null
        }
        Insert: {
          best_streak?: number | null
          current_streak?: number | null
          last_active_date?: string | null
          level?: number | null
          total_clean_days?: number | null
          updated_at?: string
          user_id: string
          xp?: number | null
        }
        Update: {
          best_streak?: number | null
          current_streak?: number | null
          last_active_date?: string | null
          level?: number | null
          total_clean_days?: number | null
          updated_at?: string
          user_id?: string
          xp?: number | null
        }
        Relationships: []
      }
      relapses: {
        Row: {
          context: string | null
          created_at: string
          id: string
          trigger: string | null
          user_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          id?: string
          trigger?: string | null
          user_id: string
        }
        Update: {
          context?: string | null
          created_at?: string
          id?: string
          trigger?: string | null
          user_id?: string
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

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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          comment: string | null
          created_at: string
          id: string
          new_status: string | null
          previous_status: string | null
          target_id: string
          target_table: string
        }
        Insert: {
          action: string
          admin_id: string
          comment?: string | null
          created_at?: string
          id?: string
          new_status?: string | null
          previous_status?: string | null
          target_id: string
          target_table: string
        }
        Update: {
          action?: string
          admin_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          new_status?: string | null
          previous_status?: string | null
          target_id?: string
          target_table?: string
        }
        Relationships: []
      }
      cardio_logs: {
        Row: {
          admin_comment: string | null
          cardio_type: Database["public"]["Enums"]["cardio_type"]
          created_at: string
          date: string
          distance: number
          distance_unit: string
          id: string
          notes: string | null
          user_id: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          admin_comment?: string | null
          cardio_type: Database["public"]["Enums"]["cardio_type"]
          created_at?: string
          date: string
          distance: number
          distance_unit?: string
          id?: string
          notes?: string | null
          user_id: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          admin_comment?: string | null
          cardio_type?: Database["public"]["Enums"]["cardio_type"]
          created_at?: string
          date?: string
          distance?: number
          distance_unit?: string
          id?: string
          notes?: string | null
          user_id?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      digest_queue: {
        Row: {
          admin_comment: string | null
          created_at: string
          id: string
          log_date: string
          log_details: string
          log_id: string
          log_type: string
          new_status: string
          previous_status: string
          processed: boolean
          processed_at: string | null
          user_id: string
        }
        Insert: {
          admin_comment?: string | null
          created_at?: string
          id?: string
          log_date: string
          log_details: string
          log_id: string
          log_type: string
          new_status: string
          previous_status: string
          processed?: boolean
          processed_at?: string | null
          user_id: string
        }
        Update: {
          admin_comment?: string | null
          created_at?: string
          id?: string
          log_date?: string
          log_details?: string
          log_id?: string
          log_type?: string
          new_status?: string
          previous_status?: string
          processed?: boolean
          processed_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          log_id: string
          log_type: string
          notification_type: string
          recipient_email: string
          recipient_user_id: string
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          log_id: string
          log_type: string
          notification_type: string
          recipient_email: string
          recipient_user_id: string
          status?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          log_id?: string
          log_type?: string
          notification_type?: string
          recipient_email?: string
          recipient_user_id?: string
          status?: string
        }
        Relationships: []
      }
      hiit_logs: {
        Row: {
          admin_comment: string | null
          created_at: string
          date: string
          description: string | null
          duration: number
          id: string
          user_id: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          admin_comment?: string | null
          created_at?: string
          date: string
          description?: string | null
          duration: number
          id?: string
          user_id: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          admin_comment?: string | null
          created_at?: string
          date?: string
          description?: string | null
          duration?: number
          id?: string
          user_id?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          admin_comment: string | null
          created_at: string
          id: string
          is_read: boolean
          log_date: string | null
          log_id: string | null
          log_type: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          admin_comment?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          log_date?: string | null
          log_id?: string | null
          log_type?: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          admin_comment?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          log_date?: string | null
          log_id?: string | null
          log_type?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email_notifications: boolean
          full_name: string | null
          id: string
          in_app_notifications: boolean
          notification_mode: string
          notify_on_flagged: boolean
          notify_on_verified: boolean
          unit: string | null
          unit_category: Database["public"]["Enums"]["unit_category"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          full_name?: string | null
          id?: string
          in_app_notifications?: boolean
          notification_mode?: string
          notify_on_flagged?: boolean
          notify_on_verified?: boolean
          unit?: string | null
          unit_category?: Database["public"]["Enums"]["unit_category"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          full_name?: string | null
          id?: string
          in_app_notifications?: boolean
          notification_mode?: string
          notify_on_flagged?: boolean
          notify_on_verified?: boolean
          unit?: string | null
          unit_category?: Database["public"]["Enums"]["unit_category"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      strength_logs: {
        Row: {
          admin_comment: string | null
          created_at: string
          date: string
          exercise_name: string
          id: string
          notes: string | null
          reps_per_set: number
          sets: number
          total_weight: number
          user_id: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
          weight_per_rep: number
        }
        Insert: {
          admin_comment?: string | null
          created_at?: string
          date: string
          exercise_name: string
          id?: string
          notes?: string | null
          reps_per_set: number
          sets: number
          total_weight: number
          user_id: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          weight_per_rep: number
        }
        Update: {
          admin_comment?: string | null
          created_at?: string
          date?: string
          exercise_name?: string
          id?: string
          notes?: string | null
          reps_per_set?: number
          sets?: number
          total_weight?: number
          user_id?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
          weight_per_rep?: number
        }
        Relationships: []
      }
      tmarm_logs: {
        Row: {
          admin_comment: string | null
          created_at: string
          date: string
          description: string | null
          duration: number
          id: string
          user_id: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          admin_comment?: string | null
          created_at?: string
          date: string
          description?: string | null
          duration: number
          id?: string
          user_id: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          admin_comment?: string | null
          created_at?: string
          date?: string
          description?: string | null
          duration?: number
          id?: string
          user_id?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
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
          role?: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "soldier"
      cardio_type: "run_walk_ruck" | "bike" | "swim" | "row_elliptical"
      unit_category:
        | "veterans"
        | "government"
        | "military_family"
        | "civilian"
        | "other"
      verification_status: "pending" | "verified" | "flagged"
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
      app_role: ["admin", "soldier"],
      cardio_type: ["run_walk_ruck", "bike", "swim", "row_elliptical"],
      unit_category: [
        "veterans",
        "government",
        "military_family",
        "civilian",
        "other",
      ],
      verification_status: ["pending", "verified", "flagged"],
    },
  },
} as const

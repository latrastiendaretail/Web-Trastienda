export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          order_index: number
          created_at: string
        }
        Insert: {
          name: string
          slug: string
          order_index?: number
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          category_id: string | null
          title: string
          slug: string
          tagline: string | null
          description: string | null
          thumbnail_url: string | null
          duration_minutes: number
          status: 'draft' | 'published' | 'coming_soon'
          order_index: number
          format: string | null
          start_date: string | null
          max_students: number | null
          features: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          title: string
          slug: string
          tagline?: string | null
          description?: string | null
          thumbnail_url?: string | null
          duration_minutes?: number
          status?: 'draft' | 'published' | 'coming_soon'
          order_index?: number
          format?: string | null
          start_date?: string | null
          max_students?: number | null
          features?: Json | null
        }
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
        Relationships: []
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          video_url: string | null
          duration_minutes: number
          order_index: number
          is_preview: boolean
          created_at: string
        }
        Insert: {
          course_id: string
          title: string
          description?: string | null
          video_url?: string | null
          duration_minutes?: number
          order_index?: number
          is_preview?: boolean
        }
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'lessons_course_id_fkey'
            columns: ['course_id']
            referencedRelation: 'courses'
            referencedColumns: ['id']
          }
        ]
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
        }
        Insert: {
          user_id: string
          course_id: string
        }
        Update: never
        Relationships: [
          {
            foreignKeyName: 'enrollments_course_id_fkey'
            columns: ['course_id']
            referencedRelation: 'courses'
            referencedColumns: ['id']
          }
        ]
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          user_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'lesson_progress_lesson_id_fkey'
            columns: ['lesson_id']
            referencedRelation: 'lessons'
            referencedColumns: ['id']
          }
        ]
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          linkedin_url: string | null
          cover_image: string | null
          status: 'draft' | 'published'
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          slug: string
          content: string
          excerpt?: string | null
          linkedin_url?: string | null
          cover_image?: string | null
          status?: 'draft' | 'published'
          published_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          email: string
          source: string
          created_at: string
        }
        Insert: {
          email: string
          source?: string
        }
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

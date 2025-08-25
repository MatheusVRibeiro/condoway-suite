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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ambientes: {
        Row: {
          ativo: boolean
          capacidade: number | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          capacidade?: number | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          capacidade?: number | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      apartamentos: {
        Row: {
          bloco_id: string
          created_at: string
          id: string
          numero: string
        }
        Insert: {
          bloco_id: string
          created_at?: string
          id?: string
          numero: string
        }
        Update: {
          bloco_id?: string
          created_at?: string
          id?: string
          numero?: string
        }
        Relationships: [
          {
            foreignKeyName: "apartamentos_bloco_id_fkey"
            columns: ["bloco_id"]
            isOneToOne: false
            referencedRelation: "blocos"
            referencedColumns: ["id"]
          },
        ]
      }
      blocos: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      comunicacoes: {
        Row: {
          apartamento_id: string | null
          bloco_id: string | null
          conteudo: string
          created_at: string
          destinatario_id: string | null
          id: string
          is_lida: boolean
          remetente_id: string
          tipo: string
          titulo: string
        }
        Insert: {
          apartamento_id?: string | null
          bloco_id?: string | null
          conteudo: string
          created_at?: string
          destinatario_id?: string | null
          id?: string
          is_lida?: boolean
          remetente_id: string
          tipo?: string
          titulo: string
        }
        Update: {
          apartamento_id?: string | null
          bloco_id?: string | null
          conteudo?: string
          created_at?: string
          destinatario_id?: string | null
          id?: string
          is_lida?: boolean
          remetente_id?: string
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunicacoes_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicacoes_bloco_id_fkey"
            columns: ["bloco_id"]
            isOneToOne: false
            referencedRelation: "blocos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicacoes_destinatario_id_fkey"
            columns: ["destinatario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicacoes_remetente_id_fkey"
            columns: ["remetente_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      encomendas: {
        Row: {
          apartamento_id: string
          codigo_rastreio: string | null
          created_at: string
          data_entrega: string | null
          data_recebimento: string
          destinatario_id: string
          id: string
          loja: string
          observacoes: string | null
          registrado_por: string
          status: string
        }
        Insert: {
          apartamento_id: string
          codigo_rastreio?: string | null
          created_at?: string
          data_entrega?: string | null
          data_recebimento?: string
          destinatario_id: string
          id?: string
          loja: string
          observacoes?: string | null
          registrado_por: string
          status?: string
        }
        Update: {
          apartamento_id?: string
          codigo_rastreio?: string | null
          created_at?: string
          data_entrega?: string | null
          data_recebimento?: string
          destinatario_id?: string
          id?: string
          loja?: string
          observacoes?: string | null
          registrado_por?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "encomendas_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encomendas_destinatario_id_fkey"
            columns: ["destinatario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encomendas_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro: {
        Row: {
          categoria: string | null
          created_at: string
          criado_por: string
          data_transacao: string
          descricao: string
          id: string
          observacoes: string | null
          tipo: Database["public"]["Enums"]["tipo_transacao"]
          valor: number
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          criado_por: string
          data_transacao?: string
          descricao: string
          id?: string
          observacoes?: string | null
          tipo: Database["public"]["Enums"]["tipo_transacao"]
          valor: number
        }
        Update: {
          categoria?: string | null
          created_at?: string
          criado_por?: string
          data_transacao?: string
          descricao?: string
          id?: string
          observacoes?: string | null
          tipo?: Database["public"]["Enums"]["tipo_transacao"]
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          ambiente_id: string
          aprovado_por: string | null
          created_at: string
          criado_por: string
          data_fim: string
          data_inicio: string
          id: string
          observacoes: string | null
          status: Database["public"]["Enums"]["status_reserva"]
          usuario_id: string
        }
        Insert: {
          ambiente_id: string
          aprovado_por?: string | null
          created_at?: string
          criado_por: string
          data_fim: string
          data_inicio: string
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_reserva"]
          usuario_id: string
        }
        Update: {
          ambiente_id?: string
          aprovado_por?: string | null
          created_at?: string
          criado_por?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_reserva"]
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservas_ambiente_id_fkey"
            columns: ["ambiente_id"]
            isOneToOne: false
            referencedRelation: "ambientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuario_apartamentos: {
        Row: {
          apartamento_id: string
          created_at: string
          id: string
          usuario_id: string
        }
        Insert: {
          apartamento_id: string
          created_at?: string
          id?: string
          usuario_id: string
        }
        Update: {
          apartamento_id?: string
          created_at?: string
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_apartamentos_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_apartamentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          password_hash: string
          status: Database["public"]["Enums"]["status_morador"]
          telefone: string | null
          updated_at: string
          user_tipo: Database["public"]["Enums"]["user_tipo"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          password_hash: string
          status?: Database["public"]["Enums"]["status_morador"]
          telefone?: string | null
          updated_at?: string
          user_tipo?: Database["public"]["Enums"]["user_tipo"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          password_hash?: string
          status?: Database["public"]["Enums"]["status_morador"]
          telefone?: string | null
          updated_at?: string
          user_tipo?: Database["public"]["Enums"]["user_tipo"]
        }
        Relationships: []
      }
      visitantes: {
        Row: {
          apartamento_id: string
          created_at: string
          data_entrada: string
          data_saida: string | null
          documento: string
          id: string
          nome: string
          observacoes: string | null
          registrado_por: string
          status: Database["public"]["Enums"]["status_visitante"]
        }
        Insert: {
          apartamento_id: string
          created_at?: string
          data_entrada?: string
          data_saida?: string | null
          documento: string
          id?: string
          nome: string
          observacoes?: string | null
          registrado_por: string
          status?: Database["public"]["Enums"]["status_visitante"]
        }
        Update: {
          apartamento_id?: string
          created_at?: string
          data_entrada?: string
          data_saida?: string | null
          documento?: string
          id?: string
          nome?: string
          observacoes?: string | null
          registrado_por?: string
          status?: Database["public"]["Enums"]["status_visitante"]
        }
        Relationships: [
          {
            foreignKeyName: "visitantes_apartamento_id_fkey"
            columns: ["apartamento_id"]
            isOneToOne: false
            referencedRelation: "apartamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitantes_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
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
      status_morador: "ativo" | "inativo"
      status_reserva: "pendente" | "aprovada" | "recusada" | "cancelada"
      status_visitante: "ativo" | "saiu"
      tipo_transacao: "receita" | "despesa"
      user_tipo: "sindico" | "porteiro" | "morador"
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
      status_morador: ["ativo", "inativo"],
      status_reserva: ["pendente", "aprovada", "recusada", "cancelada"],
      status_visitante: ["ativo", "saiu"],
      tipo_transacao: ["receita", "despesa"],
      user_tipo: ["sindico", "porteiro", "morador"],
    },
  },
} as const

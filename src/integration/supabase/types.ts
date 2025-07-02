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
      dlks_doc_type: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      dlks_job_scope: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      dlks_job_scope_assign: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          job_scope_id: number | null
          updated_at: string | null
          updated_by: string | null
          work_management_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          job_scope_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_management_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          job_scope_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_management_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_job_scope_assign_dlks_job_scope_fk"
            columns: ["job_scope_id"]
            isOneToOne: false
            referencedRelation: "dlks_job_scope"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dlks_job_scope_assign_dlks_work_management_fk"
            columns: ["work_management_id"]
            isOneToOne: false
            referencedRelation: "dlks_work_management"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_lkh: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          created_by: string | null
          csqa: boolean | null
          description: string | null
          hirac: boolean | null
          id: string
          lkh_date: string | null
          lkh_status_id: number | null
          quantity_m: number | null
          quantity_unit: number | null
          remark: string | null
          service_id: string | null
          supervisor_id: string | null
          unit_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          created_by?: string | null
          csqa?: boolean | null
          description?: string | null
          hirac?: boolean | null
          id?: string
          lkh_date?: string | null
          lkh_status_id?: number | null
          quantity_m?: number | null
          quantity_unit?: number | null
          remark?: string | null
          service_id?: string | null
          supervisor_id?: string | null
          unit_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          created_by?: string | null
          csqa?: boolean | null
          description?: string | null
          hirac?: boolean | null
          id?: string
          lkh_date?: string | null
          lkh_status_id?: number | null
          quantity_m?: number | null
          quantity_unit?: number | null
          remark?: string | null
          service_id?: string | null
          supervisor_id?: string | null
          unit_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_lkh_dlks_purchase_order_line_fk"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "dlks_purchase_order_line"
            referencedColumns: ["service_id"]
          },
          {
            foreignKeyName: "dlks_lkh_dlks_status_fk"
            columns: ["lkh_status_id"]
            isOneToOne: false
            referencedRelation: "dlks_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dlks_lkh_dlks_unit_fk"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dlks_unit"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_lkh_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          lkh_id: string | null
          remark: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          lkh_id?: string | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          lkh_id?: string | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_lkh_attachment_dlks_lkh_fk"
            columns: ["lkh_id"]
            isOneToOne: false
            referencedRelation: "dlks_lkh"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_lkh_image: {
        Row: {
          ai_result: Json | null
          captured_at: string | null
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: string
          is_active: boolean | null
          is_app: boolean | null
          is_verified: boolean | null
          latitude: number | null
          lkh_id: string | null
          longitude: number | null
          progress_type: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          ai_result?: Json | null
          captured_at?: string | null
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: string
          is_active?: boolean | null
          is_app?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          lkh_id?: string | null
          longitude?: number | null
          progress_type?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          ai_result?: Json | null
          captured_at?: string | null
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: string
          is_active?: boolean | null
          is_app?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          lkh_id?: string | null
          longitude?: number | null
          progress_type?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lkh_image_dlks_lkh_fk"
            columns: ["lkh_id"]
            isOneToOne: false
            referencedRelation: "dlks_lkh"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_lkh_task: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          lkh_id: string | null
          task_no: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          lkh_id?: string | null
          task_no?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          lkh_id?: string | null
          task_no?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_lkh_task_dlks_lkh_fk"
            columns: ["lkh_id"]
            isOneToOne: false
            referencedRelation: "dlks_lkh"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_lks_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          doc_type_id: number | null
          file_path: string | null
          id: number
          lks_id: string | null
          remark: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          doc_type_id?: number | null
          file_path?: string | null
          id?: number
          lks_id?: string | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          doc_type_id?: number | null
          file_path?: string | null
          id?: number
          lks_id?: string | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_lks_attachment_dlks_doc_type_fk"
            columns: ["doc_type_id"]
            isOneToOne: false
            referencedRelation: "dlks_doc_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dlks_lks_attachment_dlks_lks_submission_fk"
            columns: ["lks_id"]
            isOneToOne: false
            referencedRelation: "dlks_lks_submission"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_lks_submission: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          lks_code: string | null
          lks_status_id: number | null
          lks_submit_date: string | null
          po_number: string | null
          remark: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          lks_code?: string | null
          lks_status_id?: number | null
          lks_submit_date?: string | null
          po_number?: string | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          lks_code?: string | null
          lks_status_id?: number | null
          lks_submit_date?: string | null
          po_number?: string | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_lks_submission_dlks_purchase_order_fk"
            columns: ["po_number"]
            isOneToOne: false
            referencedRelation: "dlks_purchase_order"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_organization: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          logo_file_path: string | null
          name: string | null
          type: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          logo_file_path?: string | null
          name?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          logo_file_path?: string | null
          name?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      dlks_pre_work_checklist: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      dlks_profile: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string | null
          phone_number: string | null
          updated_at: string | null
          updated_by: string | null
          user_role: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_role?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_role?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_profile_dlks_user_role_fk"
            columns: ["user_role"]
            isOneToOne: false
            referencedRelation: "dlks_user_role"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_profile_address: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          created_by: string | null
          id: string
          postal_code: string | null
          profile_id: string | null
          state: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          postal_code?: string | null
          profile_id?: string | null
          state?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          postal_code?: string | null
          profile_id?: string | null
          state?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_profile_address_dlks_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "dlks_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_profile_organization: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          organization_id: string | null
          profile_id: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          organization_id?: string | null
          profile_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          organization_id?: string | null
          profile_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_profile_organization_dlks_organization_fk"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "dlks_organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dlks_profile_organization_dlks_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "dlks_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_purchase_order: {
        Row: {
          contract_no: string | null
          created_at: string | null
          created_by: string | null
          id: string
          po_amount: number | null
          po_date: string | null
          po_description: string | null
          po_number: string
          updated_at: string | null
          updated_by: string | null
          work_management_id: string | null
        }
        Insert: {
          contract_no?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          po_amount?: number | null
          po_date?: string | null
          po_description?: string | null
          po_number: string
          updated_at?: string | null
          updated_by?: string | null
          work_management_id?: string | null
        }
        Update: {
          contract_no?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          po_amount?: number | null
          po_date?: string | null
          po_description?: string | null
          po_number?: string
          updated_at?: string | null
          updated_by?: string | null
          work_management_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_purchase_order_dlks_work_management_fk"
            columns: ["work_management_id"]
            isOneToOne: false
            referencedRelation: "dlks_work_management"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_purchase_order_line: {
        Row: {
          actual_amount: number | null
          actual_quantity_m: number | null
          actual_quantity_unit: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          line_no: number | null
          line_status: string | null
          lkh_created: boolean | null
          po_number: string | null
          quantity_m: number | null
          quantity_unit: number | null
          rate: number | null
          remark: string | null
          service_id: string
          unit_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          actual_amount?: number | null
          actual_quantity_m?: number | null
          actual_quantity_unit?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          line_no?: number | null
          line_status?: string | null
          lkh_created?: boolean | null
          po_number?: string | null
          quantity_m?: number | null
          quantity_unit?: number | null
          rate?: number | null
          remark?: string | null
          service_id: string
          unit_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          actual_amount?: number | null
          actual_quantity_m?: number | null
          actual_quantity_unit?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          line_no?: number | null
          line_status?: string | null
          lkh_created?: boolean | null
          po_number?: string | null
          quantity_m?: number | null
          quantity_unit?: number | null
          rate?: number | null
          remark?: string | null
          service_id?: string
          unit_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_purchase_order_line_dlks_purchase_order_fk"
            columns: ["po_number"]
            isOneToOne: false
            referencedRelation: "dlks_purchase_order"
            referencedColumns: ["po_number"]
          },
          {
            foreignKeyName: "dlks_purchase_order_line_dlks_unit_fk"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dlks_unit"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_status: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      dlks_supervisor_assign: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          supervisor_id: string | null
          updated_at: string | null
          updated_by: string | null
          work_management_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          supervisor_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          work_management_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          supervisor_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          work_management_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_supervisor_assign_dlks_profile_fk"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "dlks_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dlks_supervisor_assign_dlks_work_management_fk"
            columns: ["work_management_id"]
            isOneToOne: false
            referencedRelation: "dlks_work_management"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_unit: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      dlks_user_group: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      dlks_user_role: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
          user_group_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_group_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_group_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_user_role_dlks_user_group_fk"
            columns: ["user_group_id"]
            isOneToOne: false
            referencedRelation: "dlks_user_group"
            referencedColumns: ["id"]
          },
        ]
      }
      dlks_work_management: {
        Row: {
          akk_number: string | null
          complaint_number: string | null
          contractor_id: string | null
          created_at: string | null
          created_by: string | null
          estimated_completion_date: string | null
          id: string
          issued_date: string | null
          multiple_lks: boolean | null
          pre_work_checklist_id: number | null
          project_number: string | null
          proposed_date: string | null
          remark: string | null
          start_date: string | null
          status_id: number | null
          updated_at: string | null
          updated_by: string | null
          word_code: string | null
          work_code: string | null
          work_location: string | null
          work_type: number | null
        }
        Insert: {
          akk_number?: string | null
          complaint_number?: string | null
          contractor_id?: string | null
          created_at?: string | null
          created_by?: string | null
          estimated_completion_date?: string | null
          id?: string
          issued_date?: string | null
          multiple_lks?: boolean | null
          pre_work_checklist_id?: number | null
          project_number?: string | null
          proposed_date?: string | null
          remark?: string | null
          start_date?: string | null
          status_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          word_code?: string | null
          work_code?: string | null
          work_location?: string | null
          work_type?: number | null
        }
        Update: {
          akk_number?: string | null
          complaint_number?: string | null
          contractor_id?: string | null
          created_at?: string | null
          created_by?: string | null
          estimated_completion_date?: string | null
          id?: string
          issued_date?: string | null
          multiple_lks?: boolean | null
          pre_work_checklist_id?: number | null
          project_number?: string | null
          proposed_date?: string | null
          remark?: string | null
          start_date?: string | null
          status_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          word_code?: string | null
          work_code?: string | null
          work_location?: string | null
          work_type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dlks_work_management_dlks_organization_fk"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "dlks_organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dlks_work_management_dlks_pre_work_checklist_fk"
            columns: ["pre_work_checklist_id"]
            isOneToOne: false
            referencedRelation: "dlks_pre_work_checklist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dlks_work_management_dlks_status_fk"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "dlks_status"
            referencedColumns: ["id"]
          },
        ]
      }
      "test-table": {
        Row: {
          created_at: string
          desc: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          desc?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          desc?: string | null
          id?: number
          name?: string | null
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

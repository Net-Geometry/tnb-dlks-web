// Database Types for DLKS User Management System

export interface DlksUserRole {
  id: string; // Changed from number to string (UUID)
  name: string;
  created_by?: string;
  created_at: string;
  updated_by?: string;
  updated_at: string;
  is_active: boolean;
}

export interface DlksUserGroup {
  id: number;
  name: string;
  created_by?: string;
  created_at: string;
  updated_by?: string;
  updated_at: string;
  organization_id?: string;
}

export interface Profile {
  id: string; // UUID from auth.users
  name: string;
  email: string;
  phone_number?: string;
  created_by?: string;
  created_at: string;
  updated_by?: string;
  updated_at: string;
  user_role: string; // Changed from number to string (UUID reference)
  organization_id?: string;
  is_active?: boolean; // User activation status
  deactivated_at?: string; // When user was deactivated
  // Joined data
  dlks_user_role?: DlksUserRole;
  dlks_profile_address?: ProfileAddress[];
}

export interface ProfileAddress {
  id: string;
  address: string;
  postal_code: string;
  city: string;
  state: string;
  created_by?: string;
  created_at: string;
  updated_by?: string;
  updated_at: string;
  profile_id: string;
}

export interface UserActivityLog {
  id: string; // UUID primary key
  profile_id: string; // Foreign key to dlks_profile
  activity_type: string; // LOGIN, LOGOUT, CREATE, UPDATE, DELETE, etc.
  activity_description: string;
  entity_type?: string; // USER, ORGANIZATION, WORK_ORDER, etc.
  entity_id?: string; // ID of the affected entity
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
  // Joined data
  profile?: Profile;
}

export interface Organization {
  id: string; // UUID primary key
  name: string;
  type?: string; // Organization type (government, contractor, vendor, etc.)
  description?: string;
  location?: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
  logo_file_path?: string;
  is_active?: boolean;
  created_by?: string;
  created_at: string;
  updated_by?: string;
  updated_at: string;
  // Computed fields
  member_count?: number;
}

// Form Types
export interface CreateUserFormData {
  // Auth data
  email: string;
  password: string;
  confirmPassword: string;

  // Profile data
  full_name: string;
  phone?: string;
  employee_id?: string;
  department?: string;
  company?: string;
  position?: string;
  role_id: string; // Changed from number to string (UUID)
  organization_id?: string;

  // Address data
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  address_type?: string;
}

export interface UpdateUserFormData {
  full_name: string;
  phone?: string;
  role_id: string; // Changed from number to string (UUID)
  organization_id?: string;
}

export interface CreateOrganizationFormData {
  name: string;
  type: string;
  description?: string;
  location?: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
}

export interface UpdateOrganizationFormData {
  name: string;
  type: string;
  description?: string;
  location?: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
  is_active?: boolean;
}

// API Response Types
export interface CreateUserResponse {
  success: boolean;
  data?: {
    user: any; // Supabase user object
    profile: Profile;
    address?: ProfileAddress;
  };
  error?: string;
}

export interface UserListResponse {
  success: boolean;
  data?: Profile[];
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface OrganizationResponse {
  success: boolean;
  data?: Organization;
  error?: string;
}

export interface OrganizationListResponse {
  success: boolean;
  data?: Organization[];
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
}

// User Activity Log Types
export interface UserActivityLog {
  id: string; // UUID primary key
  profile_id: string; // Foreign key to dlks_profile
  activity_type: string; // LOGIN, LOGOUT, CREATE, UPDATE, DELETE, etc.
  activity_description: string;
  entity_type?: string; // USER, ORGANIZATION, WORK_ORDER, etc.
  entity_id?: string; // ID of the affected entity
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
  // Joined data
  profile?: Profile;
}

export interface ActivityLogResponse {
  success: boolean;
  data?: UserActivityLog[];
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
  message?: string;
}

// Activity Log Form Data
export interface CreateActivityLogData {
  profile_id: string;
  activity_type: string;
  activity_description: string;
  entity_type?: string;
  entity_id?: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
}

// Role Permissions
export const USER_PERMISSIONS = {
  FULL_ACCESS: "full_access",
  USER_MANAGEMENT: "user_management",
  SYSTEM_CONFIG: "system_config",
  WORK_ORDERS: "work_orders",
  VALIDATE: "validate",
  REPORTS: "reports",
  JIB_REQUESTS: "jib_requests",
  FIELD_REPORTS: "field_reports",
  PURCHASE_ORDERS: "purchase_orders",
  PROJECT_MANAGEMENT: "project_management",
  ASSIGNED_WORK_ORDERS: "assigned_work_orders",
  SUBMIT_REPORTS: "submit_reports",
  DELIVERY_UPDATES: "delivery_updates",
  VALIDATION: "validation",
} as const;

export type UserPermission =
  (typeof USER_PERMISSIONS)[keyof typeof USER_PERMISSIONS];

// Role Codes
export const USER_ROLE_CODES = {
  TNB_SUPER_ADMIN: "TNB_SUPER_ADMIN",
  SENIOR_ENGINEER: "SENIOR_ENGINEER",
  ENGINEER: "ENGINEER",
  TECHNICIAN: "TECHNICIAN",
  PROJECT_MANAGER: "PROJECT_MANAGER",
  CONTRACTOR: "CONTRACTOR",
  VENDOR: "VENDOR",
  KKB: "KKB",
} as const;

export type UserRoleCode =
  (typeof USER_ROLE_CODES)[keyof typeof USER_ROLE_CODES];

// Malaysian States for address form
export const MALAYSIAN_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Wilayah Persekutuan Kuala Lumpur",
  "Wilayah Persekutuan Labuan",
  "Wilayah Persekutuan Putrajaya",
] as const;

export type MalaysianState = (typeof MALAYSIAN_STATES)[number];

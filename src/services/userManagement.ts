import { supabase, supabaseAdmin } from "@/integration/supabase/client";
import { ActivityLogService } from "./activityLogService";
import type {
  CreateUserFormData,
  CreateUserResponse,
  UserListResponse,
  Profile,
  DlksUserRole,
  ProfileAddress,
  UpdateUserFormData,
} from "@/types/database";

export class UserManagementService {
  // Get all available roles
  static async getRoles(): Promise<DlksUserRole[]> {
    try {
      const { data, error } = await supabase
        .from("dlks_user_role")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Error fetching roles:", error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  }

  // Get all organizations
  static async getOrganizations(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("dlks_organization")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  }

  // Get user groups
  static async getUserGroups(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("dlks_user_group")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user groups:", error);
      throw error;
    }
  }

  // Create new user with profile and address
  static async createUser(
    userData: CreateUserFormData
  ): Promise<CreateUserResponse> {
    try {
      // Check if service role is available
      if (!supabaseAdmin) {
        return {
          success: false,
          error: "Service role not configured. Admin operations not available.",
        };
      }

      // 1. Create user in auth.users using service role
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            full_name: userData.full_name,
            phone: userData.phone,
            employee_id: userData.employee_id,
            // department: userData.department,
            // company: userData.company,
            // position: userData.position,
          },
        });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: "Failed to create user" };
      }

      // 2. Create/Update profile in public.dlks_profile
      const { data: profileData, error: profileError } = await supabase
        .from("dlks_profile")
        .upsert({
          id: authData.user.id,
          email: userData.email,
          name: userData.full_name,
          phone_number: userData.phone,
          user_role: userData.role_id,
          organization_id: userData.organization_id,
          created_by: authData.user.id,
          updated_by: authData.user.id,
        })
        .select(
          `
          *,
          dlks_user_role:user_role (
            id,
            name,
            created_at,
            updated_at,
            is_active
          ),
          dlks_organization:organization_id (
            id,
            name,
            type
          )
        `
        )
        .single();

      if (profileError) {
        // Rollback: Delete the auth user if profile creation fails
        if (supabaseAdmin) {
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        }
        return { success: false, error: profileError.message };
      }

      // 3. Create address if provided
      let addressData: ProfileAddress | undefined;
      if (userData.address_line_1) {
        const { data: addrData, error: addressError } = await supabase
          .from("dlks_profile_address")
          .insert({
            profile_id: authData.user.id,
            address:
              userData.address_line_1 +
              (userData.address_line_2 ? ", " + userData.address_line_2 : ""),
            postal_code: userData.postal_code,
            city: userData.city,
            state: userData.state,
            created_by: authData.user.id,
          })
          .select()
          .single();

        if (addressError) {
          console.warn("Address creation failed:", addressError.message);
        } else {
          addressData = addrData as ProfileAddress;
        }
      }

      // 4. Log activity
      await this.logActivity(
        authData.user.id,
        "USER_CREATED",
        "User account created"
      );

      return {
        success: true,
        data: {
          user: authData.user,
          profile: profileData,
          address: addressData,
        },
      };
    } catch (error: any) {
      console.error("Error creating user:", error);
      return {
        success: false,
        error: error.message || "Failed to create user",
      };
    }
  }

  // Get all users with pagination
  static async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<UserListResponse> {
    try {
      let query = supabase
        .from("dlks_profile")
        .select(
          `
          *,
          dlks_user_role:user_role (
            id,
            name,
            created_at,
            updated_at,
            is_active
          ),
          dlks_organization:organization_id (
            id,
            name,
            type
          )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false });

      // Add search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Add pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      return {
        success: true,
        data: (data || []) as Profile[],
        total: count || 0,
        page,
        limit,
      };
    } catch (error: any) {
      console.error("Error fetching users:", error);
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  static async updateUser(
    userId: string,
    userData: UpdateUserFormData
  ): Promise<CreateUserResponse> {
    try {
      const { data, error } = await supabase
        .from("dlks_profile")
        .update({
          name: userData.full_name,
          phone_number: userData.phone,
          user_role: userData.role_id,
          organization_id: userData.organization_id,
          updated_by: userId,
        })
        .eq("id", userId)
        .select(
          `
          *,
          dlks_user_role:user_role (
            id,
            name,
            created_at,
            updated_at,
            is_active
          ),
          dlks_organization:organization_id (
            id,
            name,
            type
          )
        `
        )
        .single();

      if (error) throw error;

      // Log activity
      await this.logActivity(userId, "USER_UPDATED", "User profile updated");

      return {
        success: true,
        data: {
          user: null,
          profile: data as Profile,
        },
      };
    } catch (error: any) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }
  }

  // Delete user
  static async deleteUser(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!supabaseAdmin) {
        return {
          success: false,
          error: "Service role not configured. Admin operations not available.",
        };
      }

      // First delete from auth.users (this will cascade to profile due to foreign key)
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
        userId
      );

      if (authError) throw authError;

      return { success: true };
    } catch (error: any) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }
  }

  // Toggle user active status
  static async toggleUserStatus(
    userId: string,
    isActive: boolean
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Update the is_active field in dlks_profile
      const { error } = await supabase
        .from("dlks_profile")
        .update({
          is_active: isActive,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      // Alternative approach: If we have admin privileges, we can also update the auth.users table
      if (supabaseAdmin) {
        try {
          if (!isActive) {
            // Ban the user from signing in
            await supabaseAdmin.auth.admin.updateUserById(userId, {
              ban_duration: "876000h", // Ban for 100 years (effectively permanent)
            });
          } else {
            // Remove the ban
            await supabaseAdmin.auth.admin.updateUserById(userId, {
              ban_duration: "none",
            });
          }
        } catch (authError) {
          console.warn("Could not update auth status:", authError);
        }
      }

      // Log activity
      await this.logActivity(
        userId,
        isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
        `User ${isActive ? "activated" : "deactivated"}`
      );

      return { success: true };
    } catch (error: any) {
      console.error("Error toggling user status:", error);
      return { success: false, error: error.message };
    }
  }

  // Get user permissions (placeholder - implement based on your permission system)
  static async getUserPermissions(userId: string): Promise<string[]> {
    try {
      // TODO: Implement proper permission retrieval from database
      // For now, return a dummy set of permissions based on user role
      const user = await this.getUserById(userId);
      if (!user || !user.dlks_user_role) return [];

      // Map role to default permissions (this is a placeholder)
      const rolePermissions: Record<string, string[]> = {
        TNB_SUPER_ADMIN: ["full_access", "user_management", "system_config"],
        SENIOR_ENGINEER: [
          "work_orders",
          "validate",
          "reports",
          "project_management",
        ],
        ENGINEER: ["assigned_work_orders", "submit_reports", "field_reports"],
        TECHNICIAN: ["field_reports", "submit_reports"],
      };

      return rolePermissions[user.dlks_user_role.name] || [];
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      return [];
    }
  }

  // Update user permissions (placeholder - implement based on your permission system)
  static async updateUserPermissions(
    userId: string,
    permissions: string[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // TODO: Implement proper permission update in database
      // This would typically involve updating a user_permissions table
      // or role_permissions mapping

      // For now, just log the action
      await this.logActivity(
        userId,
        "PERMISSIONS_UPDATED",
        `User permissions updated: ${permissions.join(", ")}`
      );

      return { success: true };
    } catch (error: any) {
      console.error("Error updating user permissions:", error);
      return { success: false, error: error.message };
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from("dlks_profile")
        .select(
          `
          *,
          dlks_organization:organization_id (
            id,
            name,
            type
          )
        `
        )
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as Profile;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  // Check if user has specific permission
  static async hasPermission(
    userId: string,
    permission: string
  ): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      if (!user || !user.dlks_user_role) return false;

      // TODO: Implement proper permission checking logic
      // This would require a permissions table and role-permission mappings
      return true;
    } catch (error) {
      console.error("Error checking permissions:", error);
      return false;
    }
  }

  // Get user statistics
  static async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
    byOrganization: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase.from("dlks_profile").select(`
          *,
          dlks_user_role:user_role (
            id,
            name,
            created_at,
            updated_at,
            is_active
          ),
          dlks_organization:organization_id (
            id,
            name
          )
        `);

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        active: data?.length || 0, // All users are active since no is_active field
        inactive: 0,
        byRole: {} as Record<string, number>,
        byOrganization: {} as Record<string, number>,
      };

      // Calculate role distribution
      data?.forEach((user: any) => {
        const roleName = user.dlks_user_role?.name || "Unknown";
        stats.byRole[roleName] = (stats.byRole[roleName] || 0) + 1;
      });

      // Calculate organization distribution
      data?.forEach((user: any) => {
        const orgName = user.dlks_organization?.name || "No Organization";
        stats.byOrganization[orgName] =
          (stats.byOrganization[orgName] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        byRole: {},
        byOrganization: {},
      };
    }
  }

  // Log user activity
  static async logActivity(
    profileId: string,
    activityType: string,
    description: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await ActivityLogService.logActivity(
        profileId,
        activityType,
        description,
        undefined,
        undefined,
        ipAddress,
        userAgent
      );
    } catch (error) {
      console.warn("Failed to log activity:", error);
      // Don't throw error as this is non-critical
    }
  }

  // Get user activity log
  static async getUserActivity(userId: string, limit: number = 20) {
    try {
      const response = await ActivityLogService.getUserActivityLogs(
        1,
        limit,
        userId
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching user activity:", error);
      return [];
    }
  }
}

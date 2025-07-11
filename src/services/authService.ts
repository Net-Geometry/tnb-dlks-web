import { supabase } from "@/integration/supabase/client";
import type { Profile } from "@/types/database";

export class AuthService {
  /**
   * Get user profile by ID for authentication purposes
   * This is a simplified version focused only on auth needs
   */
  static async getUserProfile(userId: string): Promise<Profile | null> {
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
          ),
          dlks_user_role:user_role (
            id,
            name,
            created_at,
            updated_at,
            is_active
          )
        `
        )
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      return data as Profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  /**
   * Check if user has specific permission
   * Simplified version for auth context
   */
  static async hasPermission(
    userId: string,
    permission: string
  ): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile || !profile.dlks_user_role) return false;

      // Check if user is active
      if (!profile.is_active) return false;

      // TODO: Implement proper role-based permission checking
      // This should check against a permissions table or role configuration
      // For now, implement basic role checks:
      const userRole = profile.dlks_user_role.name?.toLowerCase();
      
      // Example permission logic - customize based on your needs
      switch (permission.toLowerCase()) {
        case 'admin':
          return userRole === 'admin' || userRole === 'super_admin';
        case 'user_management':
          return userRole === 'admin' || userRole === 'super_admin' || userRole === 'user_manager';
        case 'read_only':
          return true; // All authenticated users can read
        default:
          return false; // Deny by default for unknown permissions
      }
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }

  /**
   * Get user's basic info for auth purposes
   * Even more lightweight version if you don't need full profile
   */
  static async getUserBasicInfo(userId: string): Promise<{ id: string; email?: string; name?: string } | null> {
    try {
      const { data, error } = await supabase
        .from("dlks_profile")
        .select("id, email, name")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user basic info:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching user basic info:", error);
      return null;
    }
  }

  /**
   * Check if user exists and is active
   */
  static async isUserActive(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("dlks_profile")
        .select("is_active")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error checking user status:", error);
        return false;
      }
      
      return data?.is_active ?? false;
    } catch (error) {
      console.error("Error checking user status:", error);
      return false;
    }
  }

  /**
   * Update user's updated_at timestamp when they log in
   */
  static async updateLoginTimestamp(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("dlks_profile")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) {
        console.error("Error updating login timestamp:", error);
      }
    } catch (error) {
      console.error("Error updating login timestamp:", error);
    }
  }
}

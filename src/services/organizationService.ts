import { supabase, supabaseAdmin } from "@/integration/supabase/client";
import { ActivityLogService } from "./activityLogService";
import type {
  CreateOrganizationFormData,
  UpdateOrganizationFormData,
  OrganizationResponse,
  OrganizationListResponse,
  Organization,
  Profile,
} from "@/types/database";

export class OrganizationService {
  // Get all organizations with pagination and search
  static async getOrganizations(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<OrganizationListResponse> {
    try {
      let query = supabase
        .from("dlks_organization")
        .select(
          `
          *,
          member_count:dlks_profile(count)
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false });

      // Add search filter
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,type.ilike.%${search}%,description.ilike.%${search}%`
        );
      }

      // Add pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      // Process the data to get member count
      const processedData = (data || []).map((org) => ({
        ...org,
        member_count: org.member_count ? org.member_count[0]?.count || 0 : 0,
      }));

      return {
        success: true,
        data: processedData as Organization[],
        total: count || 0,
        page,
        limit,
      };
    } catch (error: any) {
      console.error("Error fetching organizations:", error);
      return { success: false, error: error.message };
    }
  }

  // Get organization by ID
  static async getOrganizationById(id: string): Promise<Organization | null> {
    try {
      const { data, error } = await supabase
        .from("dlks_organization")
        .select(
          `
          *,
          member_count:dlks_profile(count)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      return {
        ...data,
        member_count: data.member_count ? data.member_count[0]?.count || 0 : 0,
      } as Organization;
    } catch (error) {
      console.error("Error fetching organization:", error);
      return null;
    }
  }

  // Get organization members
  static async getOrganizationMembers(
    organizationId: string
  ): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from("dlks_profile")
        .select(
          `
          *,
          dlks_user_role:user_role (*)
        `
        )
        .eq("organization_id", organizationId)
        .order("name");

      if (error) throw error;
      return (data || []) as Profile[];
    } catch (error) {
      console.error("Error fetching organization members:", error);
      return [];
    }
  }

  // Create new organization
  static async createOrganization(
    orgData: CreateOrganizationFormData
  ): Promise<OrganizationResponse> {
    try {
      const { data, error } = await supabase
        .from("dlks_organization")
        .insert({
          name: orgData.name,
          type: orgData.type,
          description: orgData.description,
          location: orgData.location,
          contact_phone: orgData.contact_phone,
          contact_email: orgData.contact_email,
          website: orgData.website,
          is_active: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await ActivityLogService.logOrganizationCreated(
        "system", // TODO: Get current user ID
        data.id,
        orgData.name
      );

      return {
        success: true,
        data: data as Organization,
      };
    } catch (error: any) {
      console.error("Error creating organization:", error);
      return {
        success: false,
        error: error.message || "Failed to create organization",
      };
    }
  }

  // Update organization
  static async updateOrganization(
    id: string,
    orgData: UpdateOrganizationFormData
  ): Promise<OrganizationResponse> {
    try {
      const { data, error } = await supabase
        .from("dlks_organization")
        .update({
          name: orgData.name,
          type: orgData.type,
          description: orgData.description,
          location: orgData.location,
          contact_phone: orgData.contact_phone,
          contact_email: orgData.contact_email,
          website: orgData.website,
          is_active: orgData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await ActivityLogService.logOrganizationUpdated(
        "system", // TODO: Get current user ID
        id,
        orgData.name,
        "Organization details updated"
      );

      return {
        success: true,
        data: data as Organization,
      };
    } catch (error: any) {
      console.error("Error updating organization:", error);
      return {
        success: false,
        error: error.message || "Failed to update organization",
      };
    }
  }

  // Delete organization
  static async deleteOrganization(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // First check if organization has members
      const { data: members } = await supabase
        .from("dlks_profile")
        .select("id")
        .eq("organization_id", id)
        .limit(1);

      if (members && members.length > 0) {
        return {
          success: false,
          error:
            "Cannot delete organization with active members. Please reassign or remove members first.",
        };
      }

      // Get organization name for logging
      const org = await this.getOrganizationById(id);
      const orgName = org?.name || "Unknown";

      const { error } = await supabase
        .from("dlks_organization")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Log activity
      await ActivityLogService.logOrganizationDeleted(
        "system", // TODO: Get current user ID
        id,
        orgName
      );

      return { success: true };
    } catch (error: any) {
      console.error("Error deleting organization:", error);
      return { success: false, error: error.message };
    }
  }

  // Get organization statistics
  static async getOrganizationStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
    totalMembers: number;
  }> {
    try {
      const { data, error } = await supabase.from("dlks_organization").select(`
          *,
          member_count:dlks_profile(count)
        `);

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        active:
          data?.filter((org) => (org as any).is_active !== false).length || 0,
        inactive:
          data?.filter((org) => (org as any).is_active === false).length || 0,
        byType: {} as Record<string, number>,
        totalMembers: 0,
      };

      // Calculate type distribution and total members
      data?.forEach((org: any) => {
        const type = org.type || "Unknown";
        stats.byType[type] = (stats.byType[type] || 0) + 1;
        stats.totalMembers += org.member_count
          ? org.member_count[0]?.count || 0
          : 0;
      });

      return stats;
    } catch (error) {
      console.error("Error fetching organization stats:", error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        byType: {},
        totalMembers: 0,
      };
    }
  }

  // Assign user to organization
  static async assignUserToOrganization(
    userId: string,
    organizationId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("dlks_profile")
        .update({
          organization_id: organizationId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      // Log activity
      await ActivityLogService.logActivity(
        "system", // TODO: Get current user ID
        "USER_ASSIGNED_TO_ORG",
        `User assigned to organization`
      );

      return { success: true };
    } catch (error: any) {
      console.error("Error assigning user to organization:", error);
      return { success: false, error: error.message };
    }
  }

  // Remove user from organization
  static async removeUserFromOrganization(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("dlks_profile")
        .update({
          organization_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      // Log activity
      await ActivityLogService.logActivity(
        "system", // TODO: Get current user ID
        "USER_REMOVED_FROM_ORG",
        `User removed from organization`
      );

      return { success: true };
    } catch (error: any) {
      console.error("Error removing user from organization:", error);
      return { success: false, error: error.message };
    }
  }

  // Add organization member
  static async addOrganizationMember(
    organizationId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("dlks_profile")
        .update({
          organization_id: organizationId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      // Log activity
      await ActivityLogService.logActivity(
        "system", // TODO: Get current user ID
        "USER_ADDED_TO_ORG",
        `User added to organization`
      );

      return { success: true };
    } catch (error: any) {
      console.error("Error adding user to organization:", error);
      return { success: false, error: error.message };
    }
  }

  // Remove organization member
  static async removeOrganizationMember(
    organizationId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("dlks_profile")
        .update({
          organization_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .eq("organization_id", organizationId);

      if (error) throw error;

      // Log activity
      await ActivityLogService.logActivity(
        "system", // TODO: Get current user ID
        "USER_REMOVED_FROM_ORG",
        `User removed from organization`
      );

      return { success: true };
    } catch (error: any) {
      console.error("Error removing user from organization:", error);
      return { success: false, error: error.message };
    }
  }
}

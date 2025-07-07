import { supabase } from "@/integration/supabase/client";
import type {
  UserActivityLog,
  CreateActivityLogData,
  ActivityLogResponse,
} from "@/types/database";

export class ActivityLogService {
  // Create activity log entry
  static async createActivityLog(
    logData: CreateActivityLogData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("dlks_user_activity_log").insert({
        profile_id: logData.profile_id,
        activity_type: logData.activity_type,
        activity_description: logData.activity_description,
        entity_type: logData.entity_type,
        entity_id: logData.entity_id,
        ip_address: logData.ip_address,
        user_agent: logData.user_agent,
        session_id: logData.session_id,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error("Error creating activity log:", error);
      return { success: false, error: error.message };
    }
  }

  // Get user activity logs with pagination and filtering
  static async getUserActivityLogs(
    page: number = 1,
    limit: number = 10,
    userId?: string,
    activityType?: string,
    entityType?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ActivityLogResponse> {
    try {
      console.log("ActivityLogService: Starting getUserActivityLogs with params:", {
        page,
        limit,
        userId,
        activityType,
        entityType,
        startDate,
        endDate,
      });

      let query = supabase
        .from("dlks_user_activity_log")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      // Add filters
      if (userId) {
        query = query.eq("profile_id", userId);
      }

      if (activityType) {
        query = query.eq("activity_type", activityType);
      }

      if (entityType) {
        query = query.eq("entity_type", entityType);
      }

      if (startDate) {
        query = query.gte("created_at", startDate);
      }

      if (endDate) {
        query = query.lte("created_at", endDate);
      }

      // Add pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      console.log("ActivityLogService: Executing query with pagination:", { from, to });

      const { data, error, count } = await query.range(from, to);

      console.log("ActivityLogService: Query result:", { data, error, count });

      if (error) {
        console.error("ActivityLogService: Database error:", error);
        
        // Check if it's a table not found error
        if (
          error.message.includes(
            'relation "public.dlks_user_activity_log" does not exist'
          )
        ) {
          console.warn(
            "Activity log table doesn't exist yet. Please create the table using the provided SQL schema."
          );
          return {
            success: true,
            data: [],
            total: 0,
            page,
            limit,
            message:
              "Activity log table not found. Please run the database setup scripts in the /database folder.",
          };
        }

        // Check if it's a permission error
        if (error.message.includes("permission denied")) {
          console.warn("Permission denied accessing activity log table.");
          return {
            success: true,
            data: [],
            total: 0,
            page,
            limit,
            message:
              "Permission denied. Please check your database permissions.",
          };
        }

        throw error;
      }

      console.log("ActivityLogService: Returning successful response with data count:", data?.length || 0);

      return {
        success: true,
        data: data as UserActivityLog[],
        total: count || 0,
        page,
        limit,
      };
    } catch (error: any) {
      console.error("ActivityLogService: Unexpected error:", error);
      return {
        success: false,
        error: error.message,
        data: [],
        total: 0,
        page,
        limit,
      };
    }
  }

  // Get activity log statistics
  static async getActivityLogStats(
    userId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    total: number;
    byType: Record<string, number>;
    byEntity: Record<string, number>;
    recentActivity: number;
  }> {
    try {
      let query = supabase.from("dlks_user_activity_log").select("*");

      // Add filters
      if (userId) {
        query = query.eq("profile_id", userId);
      }

      if (startDate) {
        query = query.gte("created_at", startDate);
      }

      if (endDate) {
        query = query.lte("created_at", endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        byType: {} as Record<string, number>,
        byEntity: {} as Record<string, number>,
        recentActivity: 0,
      };

      // Calculate statistics
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      data?.forEach((log: any) => {
        // Count by activity type
        stats.byType[log.activity_type] =
          (stats.byType[log.activity_type] || 0) + 1;

        // Count by entity type
        if (log.entity_type) {
          stats.byEntity[log.entity_type] =
            (stats.byEntity[log.entity_type] || 0) + 1;
        }

        // Count recent activity (last 24 hours)
        if (new Date(log.created_at) > last24Hours) {
          stats.recentActivity++;
        }
      });

      return stats;
    } catch (error) {
      console.error("Error fetching activity log stats:", error);
      return {
        total: 0,
        byType: {},
        byEntity: {},
        recentActivity: 0,
      };
    }
  }

  // Log user login
  static async logUserLogin(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
    sessionId?: string
  ): Promise<void> {
    try {
      await this.createActivityLog({
        profile_id: userId,
        activity_type: "LOGIN",
        activity_description: "User logged in",
        entity_type: "USER",
        entity_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionId,
      });
    } catch (error) {
      console.warn("Failed to log user login:", error);
    }
  }

  // Log user logout
  static async logUserLogout(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
    sessionId?: string
  ): Promise<void> {
    try {
      await this.createActivityLog({
        profile_id: userId,
        activity_type: "LOGOUT",
        activity_description: "User logged out",
        entity_type: "USER",
        entity_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionId,
      });
    } catch (error) {
      console.warn("Failed to log user logout:", error);
    }
  }

  // Log user creation
  static async logUserCreated(
    createdByUserId: string,
    newUserId: string,
    newUserName: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.createActivityLog({
        profile_id: createdByUserId,
        activity_type: "CREATE",
        activity_description: `Created user: ${newUserName}`,
        entity_type: "USER",
        entity_id: newUserId,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (error) {
      console.warn("Failed to log user creation:", error);
    }
  }

  // Log user update
  static async logUserUpdated(
    updatedByUserId: string,
    targetUserId: string,
    targetUserName: string,
    changes: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.createActivityLog({
        profile_id: updatedByUserId,
        activity_type: "UPDATE",
        activity_description: `Updated user: ${targetUserName} - ${changes}`,
        entity_type: "USER",
        entity_id: targetUserId,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (error) {
      console.warn("Failed to log user update:", error);
    }
  }

  // Log user activation/deactivation
  static async logUserStatusChange(
    changedByUserId: string,
    targetUserId: string,
    targetUserName: string,
    isActive: boolean,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.createActivityLog({
        profile_id: changedByUserId,
        activity_type: isActive ? "ACTIVATE" : "DEACTIVATE",
        activity_description: `${
          isActive ? "Activated" : "Deactivated"
        } user: ${targetUserName}`,
        entity_type: "USER",
        entity_id: targetUserId,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (error) {
      console.warn("Failed to log user status change:", error);
    }
  }

  // Log organization creation
  static async logOrganizationCreated(
    createdByUserId: string,
    organizationId: string,
    organizationName: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.createActivityLog({
        profile_id: createdByUserId,
        activity_type: "CREATE",
        activity_description: `Created organization: ${organizationName}`,
        entity_type: "ORGANIZATION",
        entity_id: organizationId,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (error) {
      console.warn("Failed to log organization creation:", error);
    }
  }

  // Log organization update
  static async logOrganizationUpdated(
    updatedByUserId: string,
    organizationId: string,
    organizationName: string,
    changes: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.createActivityLog({
        profile_id: updatedByUserId,
        activity_type: "UPDATE",
        activity_description: `Updated organization: ${organizationName} - ${changes}`,
        entity_type: "ORGANIZATION",
        entity_id: organizationId,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (error) {
      console.warn("Failed to log organization update:", error);
    }
  }

  // Log organization deletion
  static async logOrganizationDeleted(
    deletedByUserId: string,
    organizationId: string,
    organizationName: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.createActivityLog({
        profile_id: deletedByUserId,
        activity_type: "DELETE",
        activity_description: `Deleted organization: ${organizationName}`,
        entity_type: "ORGANIZATION",
        entity_id: organizationId,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (error) {
      console.warn("Failed to log organization deletion:", error);
    }
  }

  // Log organization member assignment
  static async logOrganizationMemberAdded(
    changedByUserId: string,
    organizationId: string,
    organizationName: string,
    memberId: string,
    memberName: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.createActivityLog({
        profile_id: changedByUserId,
        activity_type: "ASSIGN",
        activity_description: `Added ${memberName} to organization: ${organizationName}`,
        entity_type: "ORGANIZATION",
        entity_id: organizationId,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (error) {
      console.warn("Failed to log organization member addition:", error);
    }
  }

  // Log organization member removal
  static async logOrganizationMemberRemoved(
    changedByUserId: string,
    organizationId: string,
    organizationName: string,
    memberId: string,
    memberName: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.createActivityLog({
        profile_id: changedByUserId,
        activity_type: "REMOVE",
        activity_description: `Removed ${memberName} from organization: ${organizationName}`,
        entity_type: "ORGANIZATION",
        entity_id: organizationId,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (error) {
      console.warn("Failed to log organization member removal:", error);
    }
  }

  // Generic activity logger
  static async logActivity(
    userId: string,
    activityType: string,
    description: string,
    entityType?: string,
    entityId?: string,
    ipAddress?: string,
    userAgent?: string,
    sessionId?: string
  ): Promise<void> {
    try {
      await this.createActivityLog({
        profile_id: userId,
        activity_type: activityType,
        activity_description: description,
        entity_type: entityType,
        entity_id: entityId,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionId,
      });
    } catch (error) {
      console.warn("Failed to log activity:", error);
    }
  }
}

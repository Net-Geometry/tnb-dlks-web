// Test utility for activity log
// This can be run in the browser console to test activity log functionality

import { ActivityLogService } from "@/services/activityLogService";

// Test function to check if activity log service is working
export const testActivityLogService = async () => {
  console.log("Testing ActivityLogService...");

  try {
    // Test getting activity logs
    const result = await ActivityLogService.getUserActivityLogs(1, 10);
    console.log("Activity logs result:", result);

    if (result.success) {
      console.log("✅ Activity log service is working");
      console.log("Total activities:", result.total);
      console.log("Activities found:", result.data?.length || 0);
    } else {
      console.log("❌ Activity log service failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Error testing activity log service:", error);
  }
};

// Test function to create a test activity log entry
export const createTestActivityLog = async (userId: string) => {
  console.log("Creating test activity log entry...");

  try {
    const result = await ActivityLogService.createActivityLog({
      profile_id: userId,
      activity_type: "TEST",
      activity_description: "Test activity log entry",
      entity_type: "USER",
      entity_id: userId,
      ip_address: "127.0.0.1",
      user_agent: navigator.userAgent,
    });

    console.log("Create activity log result:", result);

    if (result.success) {
      console.log("✅ Successfully created test activity log");
    } else {
      console.log("❌ Failed to create test activity log:", result.error);
    }
  } catch (error) {
    console.error("❌ Error creating test activity log:", error);
  }
};

// Make functions available globally for testing
if (typeof window !== "undefined") {
  (window as any).testActivityLogService = testActivityLogService;
  (window as any).createTestActivityLog = createTestActivityLog;
}

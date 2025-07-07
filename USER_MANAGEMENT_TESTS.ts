// Test file for User Management System
// This file contains test cases to verify the user management functionality

import { UserManagementService } from "./src/services/userManagement";
import type { CreateUserFormData } from "./src/types/database";

/**
 * Test User Management Service
 *
 * To run these tests:
 * 1. Make sure your Supabase environment is set up
 * 2. Run the SQL setup script first
 * 3. Execute these tests in your browser console or create a proper test file
 */

export class UserManagementTester {
  // Test 1: Load basic data
  static async testLoadBasicData() {
    console.log("🧪 Testing: Load basic data...");

    try {
      const roles = await UserManagementService.getRoles();
      console.log("✅ Roles loaded:", roles.length);

      const organizations = await UserManagementService.getOrganizations();
      console.log("✅ Organizations loaded:", organizations.length);

      const userGroups = await UserManagementService.getUserGroups();
      console.log("✅ User groups loaded:", userGroups.length);

      return { roles, organizations, userGroups };
    } catch (error) {
      console.error("❌ Error loading basic data:", error);
      return null;
    }
  }

  // Test 2: Create test user
  static async testCreateUser() {
    console.log("🧪 Testing: Create test user...");

    const testUser: CreateUserFormData = {
      email: "test.user@tnb.com.my",
      password: "TestPassword123!",
      confirmPassword: "TestPassword123!",
      full_name: "Test User",
      phone: "+60123456789",
      employee_id: "EMP001",
      department: "Engineering",
      company: "TNB",
      position: "Senior Engineer",
      role_id: 2, // Assuming Senior Engineer role has ID 2
      organization_id: "", // Will be set based on loaded organizations
      address_line_1: "123 Test Street",
      address_line_2: "Test Area",
      city: "Kuala Lumpur",
      state: "Selangor",
      postal_code: "50000",
    };

    try {
      const result = await UserManagementService.createUser(testUser);

      if (result.success) {
        console.log("✅ User created successfully:", result.data?.profile.name);
        return result.data;
      } else {
        console.error("❌ User creation failed:", result.error);
        return null;
      }
    } catch (error) {
      console.error("❌ Error creating user:", error);
      return null;
    }
  }

  // Test 3: Get users list
  static async testGetUsers() {
    console.log("🧪 Testing: Get users list...");

    try {
      const result = await UserManagementService.getUsers(1, 10);

      if (result.success) {
        console.log("✅ Users retrieved:", result.data?.length);
        console.log("📊 Total users:", result.total);
        return result.data;
      } else {
        console.error("❌ Failed to get users:", result.error);
        return null;
      }
    } catch (error) {
      console.error("❌ Error getting users:", error);
      return null;
    }
  }

  // Test 4: Get user statistics
  static async testUserStats() {
    console.log("🧪 Testing: Get user statistics...");

    try {
      const stats = await UserManagementService.getUserStats();
      console.log("✅ User statistics:", stats);
      return stats;
    } catch (error) {
      console.error("❌ Error getting user stats:", error);
      return null;
    }
  }

  // Test 5: Search users
  static async testSearchUsers() {
    console.log("🧪 Testing: Search users...");

    try {
      const result = await UserManagementService.getUsers(1, 10, "test");

      if (result.success) {
        console.log("✅ Search results:", result.data?.length);
        return result.data;
      } else {
        console.error("❌ Search failed:", result.error);
        return null;
      }
    } catch (error) {
      console.error("❌ Error searching users:", error);
      return null;
    }
  }

  // Run all tests
  static async runAllTests() {
    console.log("🚀 Starting User Management Tests...");
    console.log("=====================================");

    // Test 1: Load basic data
    const basicData = await this.testLoadBasicData();
    if (!basicData) return;

    // Test 2: Create user (optional - comment out if you don't want to create test data)
    // const newUser = await this.testCreateUser();

    // Test 3: Get users
    const users = await this.testGetUsers();

    // Test 4: Get statistics
    const stats = await this.testUserStats();

    // Test 5: Search users
    const searchResults = await this.testSearchUsers();

    console.log("=====================================");
    console.log("✅ All tests completed!");

    return {
      basicData,
      users,
      stats,
      searchResults,
    };
  }
}

// Example usage (uncomment to run in browser console):
// UserManagementTester.runAllTests().then(results => {
//   console.log('Final test results:', results);
// });

// Individual test examples:
// UserManagementTester.testLoadBasicData();
// UserManagementTester.testGetUsers();
// UserManagementTester.testUserStats();

export default UserManagementTester;

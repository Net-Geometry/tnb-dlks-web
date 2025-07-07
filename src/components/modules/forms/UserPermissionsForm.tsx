import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Shield,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Settings,
  FileText,
  Users,
  Database,
} from "lucide-react";
import { UserManagementService } from "@/services/userManagement";
import type { Profile } from "@/types/database";
import { USER_PERMISSIONS } from "@/types/database";

// Permission categories for better organization
const PERMISSION_CATEGORIES = {
  SYSTEM: {
    name: "System Administration",
    icon: Settings,
    color: "bg-red-100 text-red-800",
    permissions: [
      USER_PERMISSIONS.FULL_ACCESS,
      USER_PERMISSIONS.USER_MANAGEMENT,
      USER_PERMISSIONS.SYSTEM_CONFIG,
    ] as string[],
  },
  WORK_MANAGEMENT: {
    name: "Work Management",
    icon: FileText,
    color: "bg-blue-100 text-blue-800",
    permissions: [
      USER_PERMISSIONS.WORK_ORDERS,
      USER_PERMISSIONS.ASSIGNED_WORK_ORDERS,
      USER_PERMISSIONS.PROJECT_MANAGEMENT,
    ] as string[],
  },
  OPERATIONS: {
    name: "Operations",
    icon: Users,
    color: "bg-green-100 text-green-800",
    permissions: [
      USER_PERMISSIONS.VALIDATION,
      USER_PERMISSIONS.VALIDATE,
      USER_PERMISSIONS.JIB_REQUESTS,
      USER_PERMISSIONS.FIELD_REPORTS,
      USER_PERMISSIONS.SUBMIT_REPORTS,
    ] as string[],
  },
  PROCUREMENT: {
    name: "Procurement & Orders",
    icon: Database,
    color: "bg-purple-100 text-purple-800",
    permissions: [
      USER_PERMISSIONS.PURCHASE_ORDERS,
      USER_PERMISSIONS.DELIVERY_UPDATES,
    ] as string[],
  },
  REPORTING: {
    name: "Reports & Analytics",
    icon: FileText,
    color: "bg-orange-100 text-orange-800",
    permissions: [USER_PERMISSIONS.REPORTS] as string[],
  },
};

// Validation schema for permissions
const userPermissionsSchema = z.object({
  permissions: z.array(z.string()).default([]),
});

type UserPermissionsFormValues = z.infer<typeof userPermissionsSchema>;

interface UserPermissionsFormProps {
  user: Profile;
  onSuccess: (permissions: string[]) => void;
  onCancel: () => void;
}

const UserPermissionsForm: React.FC<UserPermissionsFormProps> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPermissions, setCurrentPermissions] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserPermissionsFormValues>({
    resolver: zodResolver(userPermissionsSchema),
    defaultValues: {
      permissions: [],
    },
  });

  const selectedPermissions = watch("permissions");

  // Load current user permissions
  useEffect(() => {
    const loadUserPermissions = async () => {
      try {
        // Use the service to get user permissions
        const permissions = await UserManagementService.getUserPermissions(
          user.id
        );
        setCurrentPermissions(permissions);
        setValue("permissions", permissions);
      } catch (err) {
        setError("Failed to load user permissions");
        console.error("Error loading permissions:", err);
      }
    };
    loadUserPermissions();
  }, [user.id, setValue]);

  // Get default permissions based on role (mock implementation)
  const getRoleDefaultPermissions = (roleName: string): string[] => {
    switch (roleName.toLowerCase()) {
      case "tnb super admin":
        return Object.values(USER_PERMISSIONS);
      case "senior engineer":
        return [
          USER_PERMISSIONS.WORK_ORDERS,
          USER_PERMISSIONS.PROJECT_MANAGEMENT,
          USER_PERMISSIONS.REPORTS,
          USER_PERMISSIONS.VALIDATION,
          USER_PERMISSIONS.PURCHASE_ORDERS,
          USER_PERMISSIONS.FIELD_REPORTS,
          USER_PERMISSIONS.SUBMIT_REPORTS,
        ];
      case "engineer":
        return [
          USER_PERMISSIONS.ASSIGNED_WORK_ORDERS,
          USER_PERMISSIONS.FIELD_REPORTS,
          USER_PERMISSIONS.SUBMIT_REPORTS,
          USER_PERMISSIONS.VALIDATION,
        ];
      case "technician":
        return [
          USER_PERMISSIONS.FIELD_REPORTS,
          USER_PERMISSIONS.SUBMIT_REPORTS,
        ];
      case "project manager":
        return [
          USER_PERMISSIONS.PROJECT_MANAGEMENT,
          USER_PERMISSIONS.WORK_ORDERS,
          USER_PERMISSIONS.REPORTS,
          USER_PERMISSIONS.PURCHASE_ORDERS,
        ];
      case "contractor":
        return [
          USER_PERMISSIONS.ASSIGNED_WORK_ORDERS,
          USER_PERMISSIONS.SUBMIT_REPORTS,
        ];
      case "vendor":
        return [
          USER_PERMISSIONS.PURCHASE_ORDERS,
          USER_PERMISSIONS.DELIVERY_UPDATES,
        ];
      default:
        return [];
    }
  };

  const onSubmit = async (data: UserPermissionsFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const result = await UserManagementService.updateUserPermissions(
        user.id,
        data.permissions
      );

      if (result.success) {
        onSuccess(data.permissions);
      } else {
        setError(result.error || "Failed to update permissions");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update permissions");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permission: string, checked: boolean) => {
    const currentPerms = selectedPermissions || [];
    if (checked) {
      setValue("permissions", [...currentPerms, permission]);
    } else {
      setValue(
        "permissions",
        currentPerms.filter((p) => p !== permission)
      );
    }
  };

  const handleCategoryToggle = (
    categoryPermissions: string[],
    checked: boolean
  ) => {
    const currentPerms = selectedPermissions || [];
    if (checked) {
      // Add all permissions in this category
      const newPerms = [...currentPerms];
      categoryPermissions.forEach((perm) => {
        if (!newPerms.includes(perm)) {
          newPerms.push(perm);
        }
      });
      setValue("permissions", newPerms);
    } else {
      // Remove all permissions in this category
      setValue(
        "permissions",
        currentPerms.filter((p) => !categoryPermissions.includes(p))
      );
    }
  };

  const isCategoryFullySelected = (categoryPermissions: string[]) => {
    const currentPerms = selectedPermissions || [];
    return categoryPermissions.every((perm) => currentPerms.includes(perm));
  };

  const isCategoryPartiallySelected = (categoryPermissions: string[]) => {
    const currentPerms = selectedPermissions || [];
    return (
      categoryPermissions.some((perm) => currentPerms.includes(perm)) &&
      !categoryPermissions.every((perm) => currentPerms.includes(perm))
    );
  };

  const getPermissionDescription = (permission: string): string => {
    const descriptions: Record<string, string> = {
      [USER_PERMISSIONS.FULL_ACCESS]:
        "Complete system access with all permissions",
      [USER_PERMISSIONS.USER_MANAGEMENT]:
        "Create, edit, and manage user accounts",
      [USER_PERMISSIONS.SYSTEM_CONFIG]:
        "Configure system settings and parameters",
      [USER_PERMISSIONS.WORK_ORDERS]: "View and manage all work orders",
      [USER_PERMISSIONS.ASSIGNED_WORK_ORDERS]:
        "View and manage assigned work orders only",
      [USER_PERMISSIONS.PROJECT_MANAGEMENT]:
        "Manage projects and project assignments",
      [USER_PERMISSIONS.VALIDATE]: "Validate and approve work submissions",
      [USER_PERMISSIONS.VALIDATION]: "Perform validation tasks and reviews",
      [USER_PERMISSIONS.JIB_REQUESTS]:
        "Handle JIB (Job Information Board) requests",
      [USER_PERMISSIONS.FIELD_REPORTS]: "View and manage field reports",
      [USER_PERMISSIONS.SUBMIT_REPORTS]: "Submit reports and documentation",
      [USER_PERMISSIONS.PURCHASE_ORDERS]: "Create and manage purchase orders",
      [USER_PERMISSIONS.DELIVERY_UPDATES]:
        "Update delivery status and information",
      [USER_PERMISSIONS.REPORTS]: "Generate and view system reports",
    };

    return (
      descriptions[permission] ||
      "Permission to access specific system features"
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* User Info Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            User Permissions: {user.name}
          </CardTitle>
          <CardDescription>
            Current Role:{" "}
            <Badge variant="secondary">
              {user.dlks_user_role?.name || "No Role"}
            </Badge>
            <br />
            Manage what this user can access and do in the system
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Permissions by Category */}
      {Object.entries(PERMISSION_CATEGORIES).map(([categoryKey, category]) => {
        const categoryPermissions = category.permissions;
        const isFullySelected = isCategoryFullySelected(categoryPermissions);
        const isPartiallySelected =
          isCategoryPartiallySelected(categoryPermissions);
        const IconComponent = category.icon;

        return (
          <Card key={categoryKey}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${categoryKey}`}
                    checked={isFullySelected}
                    className={
                      isPartiallySelected
                        ? "data-[state=checked]:bg-orange-500"
                        : ""
                    }
                    onCheckedChange={(checked) =>
                      handleCategoryToggle(
                        categoryPermissions,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`category-${categoryKey}`}
                    className="text-sm font-medium"
                  >
                    {isFullySelected
                      ? "All Selected"
                      : isPartiallySelected
                      ? "Partial"
                      : "None Selected"}
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {categoryPermissions.map((permission) => {
                  const isSelected = (selectedPermissions || []).includes(
                    permission
                  );
                  return (
                    <div
                      key={permission}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50"
                    >
                      <Checkbox
                        id={permission}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handlePermissionToggle(permission, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={permission}
                          className="font-medium cursor-pointer"
                        >
                          {permission
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Label>
                        <p className="text-sm text-gray-500">
                          {getPermissionDescription(permission)}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permission Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Selected Permissions:{" "}
              <Badge variant="outline">
                {(selectedPermissions || []).length}
              </Badge>
            </p>
            <div className="flex flex-wrap gap-1">
              {(selectedPermissions || []).map((permission) => (
                <Badge key={permission} variant="secondary" className="text-xs">
                  {permission.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Update Permissions
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default UserPermissionsForm;

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageHeader from "@/components/ui/page-header";
import AddUserForm from "./forms/AddUserForm";
import EditUserForm from "./forms/EditUserForm";
import UserPermissionsForm from "./forms/UserPermissionsForm";
import { UserManagementService } from "@/services/userManagement";
import type { Profile } from "@/types/database";
import {
  Plus,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Calendar,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  Settings,
  AlertTriangle,
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    departments: 0,
  });

  // Load users data
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await UserManagementService.getUsers(1, 100, searchTerm);

      if (response.success && response.data) {
        setUsers(response.data);

        // Calculate stats
        const activeCount = response.data.filter(
          (user) => user.is_active !== false
        ).length;
        const inactiveCount = response.data.filter(
          (user) => user.is_active === false
        ).length;
        const departments = new Set(
          response.data.map((user) => user.organization_id).filter(Boolean)
        ).size;

        setStats({
          total: response.data.length,
          active: activeCount,
          inactive: inactiveCount,
          departments,
        });
      } else {
        setError(response.error || "Failed to load users");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserSuccess = (data: any) => {
    setSuccessMessage(
      `User "${data.profile.name}" has been created successfully!`
    );
    setAddUserDialogOpen(false);
    loadUsers(); // Refresh the user list

    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleEditUserSuccess = (data: any) => {
    setSuccessMessage(
      `User "${data.profile.name}" has been updated successfully!`
    );
    setEditUserDialogOpen(false);
    setSelectedUser(null);
    loadUsers(); // Refresh the user list

    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handlePermissionsSuccess = () => {
    setSuccessMessage(
      `Permissions for "${selectedUser?.name}" have been updated successfully!`
    );
    setPermissionsDialogOpen(false);
    setSelectedUser(null);
    loadUsers(); // Refresh the user list

    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    setEditUserDialogOpen(true);
  };

  const handleManagePermissions = (user: Profile) => {
    setSelectedUser(user);
    setPermissionsDialogOpen(true);
  };

  const handleDeactivateUser = async (user: Profile) => {
    try {
      const result = await UserManagementService.toggleUserStatus(
        user.id,
        false
      );

      if (result.success) {
        setSuccessMessage(
          `User "${user.name}" has been deactivated successfully!`
        );
        loadUsers(); // Refresh the user list
      } else {
        setError(result.error || "Failed to deactivate user");
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to deactivate user");
    }
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await UserManagementService.toggleUserStatus(
        userId,
        !currentStatus
      );
      if (response.success) {
        loadUsers(); // Refresh the user list
      } else {
        setError(response.error || "Failed to update user status");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Active" : "Inactive";
  };

  const handleActivateUser = async (user: Profile) => {
    try {
      const result = await UserManagementService.toggleUserStatus(
        user.id,
        true
      );

      if (result.success) {
        setSuccessMessage(
          `User "${user.name}" has been activated successfully!`
        );
        loadUsers(); // Refresh the user list
      } else {
        setError(result.error || "Failed to activate user");
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to activate user");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <PageHeader
        title="User Management"
        subtitle="Manage system users, roles, and permissions"
      >
        <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center gap-2"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <AddUserForm
              onSuccess={handleAddUserSuccess}
              onCancel={() => setAddUserDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="w-full px-6 py-8 space-y-6">
        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.inactive}
                  </p>
                </div>
                <UserX className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Organization
                  </p>
                  <p className="text-2xl font-bold">{stats.departments}</p>
                </div>
                <Building className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name, email, or department..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading users...</span>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        {!loading && (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">{user.name}</CardTitle>
                          <Badge variant="outline">
                            {user.id.slice(0, 8)}...
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {user.dlks_user_role?.name || "No role"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Building className="w-4 h-4" />
                          <span>
                            {user.organization_id || "No organization"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(user.is_active !== false)}>
                      {getStatusText(user.is_active !== false)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">
                        Contact Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phone_number || "No phone"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">
                        Account Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            Joined:{" "}
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Last Login: Never</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Role & Permissions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.dlks_user_role && (
                        <Badge variant="secondary">
                          {user.dlks_user_role.name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      User ID: {user.id.slice(0, 8)}...
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManagePermissions(user)}
                      >
                        <Shield className="w-4 h-4 mr-1" />
                        Permissions
                      </Button>

                      {/* Show different button based on user status */}
                      {user.is_active !== false ? (
                        // Show Deactivate button for active users
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Deactivate
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Deactivate User
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to deactivate{" "}
                                <strong>{user.name}</strong>? This will prevent
                                them from accessing the system, but their data
                                will be preserved.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeactivateUser(user)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Deactivate User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        // Show Activate button for inactive users
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              Activate
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-green-500" />
                                Activate User
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to activate{" "}
                                <strong>{user.name}</strong>? This will allow
                                them to access the system again.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleActivateUser(user)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Activate User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredUsers.length === 0 && !loading && (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No users found</p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <EditUserForm
              user={selectedUser}
              onSuccess={handleEditUserSuccess}
              onCancel={() => {
                setEditUserDialogOpen(false);
                setSelectedUser(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* User Permissions Dialog */}
      <Dialog
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage User Permissions</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserPermissionsForm
              user={selectedUser}
              onSuccess={handlePermissionsSuccess}
              onCancel={() => {
                setPermissionsDialogOpen(false);
                setSelectedUser(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;

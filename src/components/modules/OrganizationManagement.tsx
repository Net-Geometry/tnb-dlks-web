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
import AddOrganizationForm from "./forms/AddOrganizationForm";
import EditOrganizationForm from "./forms/EditOrganizationForm";
import OrganizationMembersDialog from "./dialogs/OrganizationMembersDialog";
import { OrganizationService } from "@/services/organizationService";
import type { Organization, Profile } from "@/types/database";
import {
  Plus,
  Search,
  Filter,
  Building,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addOrgDialogOpen, setAddOrgDialogOpen] = useState(false);
  const [editOrgDialogOpen, setEditOrgDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalMembers: 0,
  });

  // Load organizations data
  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await OrganizationService.getOrganizations(
        1,
        100,
        searchTerm
      );

      if (response.success && response.data) {
        setOrganizations(response.data);

        // Calculate stats
        const totalMembers = response.data.reduce(
          (sum, org) => sum + (org.member_count || 0),
          0
        );

        setStats({
          total: response.data.length,
          active: response.data.filter((org) => org.is_active !== false).length,
          totalMembers,
        });
      } else {
        setError(response.error || "Failed to load organizations");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrgSuccess = (data: any) => {
    setSuccessMessage(
      `Organization "${data.name}" has been created successfully!`
    );
    setAddOrgDialogOpen(false);
    loadOrganizations(); // Refresh the list

    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleAddOrganization = async (formData: any) => {
    try {
      const result = await OrganizationService.createOrganization(formData);

      if (result.success && result.data) {
        handleAddOrgSuccess(result.data);
      } else {
        setError(result.error || "Failed to create organization");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create organization");
    }
  };

  const handleEditOrganization = (org: Organization) => {
    setSelectedOrganization(org);
    setEditOrgDialogOpen(true);
  };

  const handleUpdateOrganization = async (formData: any) => {
    if (!selectedOrganization) return;

    try {
      const result = await OrganizationService.updateOrganization(
        selectedOrganization.id,
        formData
      );

      if (result.success && result.data) {
        handleEditOrgSuccess(result.data);
      } else {
        setError(result.error || "Failed to update organization");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update organization");
    }
  };

  const handleEditOrgSuccess = (data: any) => {
    setSuccessMessage(
      `Organization "${data.name}" has been updated successfully!`
    );
    setEditOrgDialogOpen(false);
    setSelectedOrganization(null);
    loadOrganizations(); // Refresh the list

    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleViewMembers = (org: Organization) => {
    setSelectedOrganization(org);
    setMembersDialogOpen(true);
  };

  const handleDeleteOrganization = async (org: Organization) => {
    try {
      const result = await OrganizationService.deleteOrganization(org.id);

      if (result.success) {
        setSuccessMessage(
          `Organization "${org.name}" has been deleted successfully!`
        );
        loadOrganizations(); // Refresh the list
      } else {
        setError(result.error || "Failed to delete organization");
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to delete organization");
    }
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.type && org.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Active" : "Inactive";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      government: "bg-blue-100 text-blue-800",
      contractor: "bg-purple-100 text-purple-800",
      vendor: "bg-orange-100 text-orange-800",
      partner: "bg-green-100 text-green-800",
      client: "bg-indigo-100 text-indigo-800",
    };
    return colors[type.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <PageHeader
        title="Organization Management"
        subtitle="Manage organizations, their members, and settings"
      >
        <Dialog open={addOrgDialogOpen} onOpenChange={setAddOrgDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center gap-2"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
            </DialogHeader>
            <AddOrganizationForm
              onSubmit={handleAddOrganization}
              isLoading={loading}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Organizations
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Organizations
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Members
                  </p>
                  <p className="text-2xl font-bold">{stats.totalMembers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
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
                  placeholder="Search organizations by name or type..."
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
              <span className="ml-2 text-gray-600">
                Loading organizations...
              </span>
            </CardContent>
          </Card>
        )}

        {/* Organizations List */}
        {!loading && (
          <div className="grid gap-4">
            {filteredOrganizations.map((org) => (
              <Card key={org.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {getInitials(org.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">{org.name}</CardTitle>
                          <Badge className={getTypeColor(org.type || "")}>
                            {org.type || "Unknown"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 max-w-2xl">
                          {org.description || "No description provided"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{org.member_count || 0} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Created{" "}
                              {new Date(org.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(org.is_active !== false)}>
                      {getStatusText(org.is_active !== false)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">
                        Organization Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span>Type: {org.type || "Not specified"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>
                            Location: {org.location || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">
                        Contact Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{org.contact_phone || "No phone"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{org.contact_email || "No email"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Organization ID: {org.id.slice(0, 8)}...
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewMembers(org)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Members
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditOrganization(org)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <Trash2 className="w-5 h-5 text-red-500" />
                              Delete Organization
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{" "}
                              <strong>{org.name}</strong>? This action cannot be
                              undone. All associated data will be permanently
                              removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteOrganization(org)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Organization
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredOrganizations.length === 0 && !loading && (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No organizations found</p>
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

      {/* Edit Organization Dialog */}
      <Dialog open={editOrgDialogOpen} onOpenChange={setEditOrgDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          {selectedOrganization && (
            <EditOrganizationForm
              organization={selectedOrganization}
              onSubmit={handleUpdateOrganization}
              isLoading={loading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Organization Members Dialog */}
      {selectedOrganization && (
        <OrganizationMembersDialog
          organization={selectedOrganization}
          open={membersDialogOpen}
          onOpenChange={setMembersDialogOpen}
          onMembershipChanged={loadOrganizations}
        />
      )}
    </div>
  );
};

export default OrganizationManagement;

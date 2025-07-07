import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Users,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { OrganizationService } from "@/services/organizationService";
import { UserManagementService } from "@/services/userManagement";
import type { Organization, Profile } from "@/types/database";

interface OrganizationMembersDialogProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMembershipChanged?: () => void;
}

const OrganizationMembersDialog: React.FC<OrganizationMembersDialogProps> = ({
  organization,
  open,
  onOpenChange,
  onMembershipChanged,
}) => {
  const [members, setMembers] = useState<Profile[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [addingMember, setAddingMember] = useState(false);
  const [removingMember, setRemovingMember] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OrganizationService.getOrganizationMembers(
        organization.id
      );
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
      setError("Failed to fetch organization members");
      setMembers([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await UserManagementService.getUsers(1, 100, ""); // Get all users
      if (response.success && response.data) {
        // Filter out users who are already members
        const memberIds = members.map((m) => m.id);
        const available = response.data.filter(
          (user) => !memberIds.includes(user.id) && !user.organization_id
        );
        setAvailableUsers(available);
      }
    } catch (error) {
      console.error("Error fetching available users:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open, organization.id]);

  useEffect(() => {
    if (open && members.length > 0) {
      fetchAvailableUsers();
    }
  }, [open, members]);

  const handleAddMember = async () => {
    if (!selectedUserId) return;

    try {
      setAddingMember(true);
      const response = await OrganizationService.addOrganizationMember(
        organization.id,
        selectedUserId
      );

      if (response.success) {
        await fetchMembers();
        await fetchAvailableUsers();
        setSelectedUserId("");
        setError(null);
        onMembershipChanged?.();
      } else {
        setError(response.error || "Failed to add member");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      setError("Failed to add member to organization");
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      setRemovingMember(userId);
      const response = await OrganizationService.removeOrganizationMember(
        organization.id,
        userId
      );

      if (response.success) {
        await fetchMembers();
        await fetchAvailableUsers();
        setError(null);
        onMembershipChanged?.();
      } else {
        setError(response.error || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      setError("Failed to remove member from organization");
    } finally {
      setRemovingMember(null);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUser = availableUsers.find(
    (user) => user.id === selectedUserId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {organization.name} - Members
          </DialogTitle>
          <DialogDescription>
            Manage organization members by adding or removing users from this
            organization.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Add Member Section */}
          {availableUsers.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <UserPlus className="w-4 h-4" />
                  <h3 className="font-semibold">Add New Member</h3>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      value={selectedUserId}
                      onValueChange={setSelectedUserId}
                      disabled={addingMember}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleAddMember}
                    disabled={!selectedUserId || addingMember}
                    className="flex items-center gap-2"
                  >
                    {addingMember && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Add Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Members List */}
          <ScrollArea className="flex-1 min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading members...</span>
              </div>
            ) : filteredMembers.length > 0 ? (
              <div className="space-y-2">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {member.email}
                          </div>
                          {member.phone_number && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {member.phone_number}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            Joined{" "}
                            {new Date(member.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={member.is_active ? "default" : "secondary"}
                        >
                          {member.is_active ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {member.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {member.dlks_user_role && (
                          <Badge variant="outline">
                            {member.dlks_user_role.name}
                          </Badge>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={removingMember === member.id}
                              className="text-red-600 hover:text-red-700"
                            >
                              {removingMember === member.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <UserMinus className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.name}{" "}
                                from {organization.name}? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveMember(member.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Remove Member
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">
                  {searchTerm
                    ? "No members match your search"
                    : "No members found"}
                </p>
              </div>
            )}
          </ScrollArea>

          {/* Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Total Members: {members.length}</span>
              <span>
                Active: {members.filter((m) => m.is_active).length} | Inactive:{" "}
                {members.filter((m) => !m.is_active).length}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationMembersDialog;

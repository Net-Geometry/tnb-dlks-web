
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageHeader from "@/components/ui/page-header";
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
  UserX
} from 'lucide-react';

const UserManagement = () => {
  const users = [
    {
      id: "USR-001",
      name: "Ahmad Rahman",
      email: "ahmad.rahman@tnb.com.my",
      phone: "+60 12-345-6789",
      role: "Senior Engineer",
      department: "Electrical Operations",
      status: "Active",
      lastLogin: "2024-01-13 14:30",
      joinDate: "2022-03-15",
      permissions: ["Work Orders", "Reports", "JIB Requests"]
    },
    {
      id: "USR-002",
      name: "Siti Nurhaliza",
      email: "siti.nurhaliza@tnb.com.my",
      phone: "+60 19-876-5432",
      role: "Project Manager",
      department: "Network Planning",
      status: "Active",
      lastLogin: "2024-01-13 16:45",
      joinDate: "2021-07-20",
      permissions: ["Full Access", "User Management", "Purchase Orders"]
    },
    {
      id: "USR-003",
      name: "Kumar Selvam",
      email: "kumar.selvam@tnb.com.my",
      phone: "+60 16-234-5678",
      role: "Field Technician",
      department: "Maintenance",
      status: "Inactive",
      lastLogin: "2024-01-10 09:15",
      joinDate: "2023-11-05",
      permissions: ["Work Orders", "LKS Status"]
    },
    {
      id: "USR-004",
      name: "Lim Wei Ming",
      email: "lim.weiming@tnb.com.my",
      phone: "+60 17-345-6789",
      role: "Safety Inspector",
      department: "Safety & Compliance",
      status: "Active",
      lastLogin: "2024-01-13 11:20",
      joinDate: "2020-01-10",
      permissions: ["JIB Requests", "Safety Reports", "Compliance"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <PageHeader 
        title="User Management"
        subtitle="Manage system users, roles, and permissions"
      >
        <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center gap-2" variant="outline">
          <Plus className="w-4 h-4" />
          Add New User
        </Button>
      </PageHeader>

      <div className="w-full px-6 py-8 space-y-6">

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">156</p>
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
                <p className="text-2xl font-bold text-green-600">142</p>
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
                <p className="text-2xl font-bold text-red-600">14</p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold">12</p>
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
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {users.map((user) => (
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
                      <Badge variant="outline">{user.id}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{user.role}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Building className="w-4 h-4" />
                      <span>{user.department}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">Account Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Joined: {user.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Last Login: {user.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Permissions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission, index) => (
                    <Badge key={index} variant="secondary">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  User ID: {user.id}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Permissions
                  </Button>
                  <Button size="sm">
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </div>
  );
};

export default UserManagement;

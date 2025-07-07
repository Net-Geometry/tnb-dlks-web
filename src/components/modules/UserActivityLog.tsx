import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeader from "@/components/ui/page-header";
import { ActivityLogService } from "@/services/activityLogService";
import type { UserActivityLog } from "@/types/database";
// Import test utility for debugging
import { testActivityLogService } from "@/utils/activityLogTest";
import {
  Activity,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Globe,
  Monitor,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Download,
  Eye,
} from "lucide-react";

// Activity type options for filtering
const ACTIVITY_TYPES = [
  { value: "all", label: "All Activities" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
  { value: "USER_CREATED", label: "User Created" },
  { value: "USER_UPDATED", label: "User Updated" },
  { value: "USER_ACTIVATED", label: "User Activated" },
  { value: "USER_DEACTIVATED", label: "User Deactivated" },
  { value: "ORGANIZATION_CREATED", label: "Organization Created" },
  { value: "ORGANIZATION_UPDATED", label: "Organization Updated" },
  { value: "ORGANIZATION_DELETED", label: "Organization Deleted" },
  { value: "USER_ASSIGNED_TO_ORG", label: "User Assigned to Organization" },
  { value: "USER_REMOVED_FROM_ORG", label: "User Removed from Organization" },
] as const;

// Entity type options for filtering
const ENTITY_TYPES = [
  { value: "all", label: "All Entities" },
  { value: "USER", label: "User" },
  { value: "ORGANIZATION", label: "Organization" },
  { value: "WORK_ORDER", label: "Work Order" },
  { value: "PURCHASE_ORDER", label: "Purchase Order" },
  { value: "REPORT", label: "Report" },
] as const;

const UserActivityLog = () => {
  const [activities, setActivities] = useState<UserActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivityType, setSelectedActivityType] = useState("all");
  const [selectedEntityType, setSelectedEntityType] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });

  const pageSize = 20;

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading activities with params:", {
        currentPage,
        pageSize,
        selectedActivityType,
        selectedEntityType,
        dateRange,
      });

      const response = await ActivityLogService.getUserActivityLogs(
        currentPage,
        pageSize,
        undefined, // userId - get all if not specified
        selectedActivityType === "all" ? undefined : selectedActivityType,
        selectedEntityType === "all" ? undefined : selectedEntityType,
        dateRange.startDate || undefined,
        dateRange.endDate || undefined
      );

      console.log("Activity logs response:", response);

      if (response.success) {
        setActivities(response.data || []);
        setTotalPages(Math.ceil((response.total || 0) / pageSize));

        // Show message if table doesn't exist or there are permission issues
        if (response.message) {
          setError(response.message);
        }

        // Calculate stats
        const activities = response.data || [];
        const today = new Date().toDateString();
        const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        setStats({
          total: response.total || 0,
          today: activities.filter(
            (activity) => new Date(activity.created_at).toDateString() === today
          ).length,
          thisWeek: activities.filter(
            (activity) => new Date(activity.created_at) >= thisWeek
          ).length,
          thisMonth: activities.filter(
            (activity) => new Date(activity.created_at) >= thisMonth
          ).length,
        });
      } else {
        console.error("Failed to load activities:", response.error);
        setError(response.error || "Failed to load activities");
        // Set empty data when there's an error
        setActivities([]);
        setStats({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
      }
    } catch (err: any) {
      console.error("Error loading activities:", err);
      setError(err.message || "An unexpected error occurred");
      // Set empty data when there's an error
      setActivities([]);
      setStats({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedActivityType, selectedEntityType, dateRange.startDate, dateRange.endDate]);

  const handleRefresh = () => {
    loadActivities();
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadActivities();
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "LOGIN":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "LOGOUT":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "USER_CREATED":
      case "USER_UPDATED":
        return <User className="w-4 h-4 text-blue-600" />;
      case "USER_ACTIVATED":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "USER_DEACTIVATED":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "ORGANIZATION_CREATED":
      case "ORGANIZATION_UPDATED":
      case "ORGANIZATION_DELETED":
        return <Activity className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case "LOGIN":
      case "USER_ACTIVATED":
        return "bg-green-100 text-green-800";
      case "LOGOUT":
      case "USER_DEACTIVATED":
        return "bg-red-100 text-red-800";
      case "USER_CREATED":
      case "USER_UPDATED":
        return "bg-blue-100 text-blue-800";
      case "ORGANIZATION_CREATED":
      case "ORGANIZATION_UPDATED":
      case "ORGANIZATION_DELETED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredActivities = activities.filter(
    (activity) =>
      activity.activity_description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <PageHeader
        title="User Activity Log"
        subtitle="Monitor user activities and system events"
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={testActivityLogService}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Eye className="w-4 h-4 mr-2" />
            Test
          </Button>
          <Button
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </PageHeader>

      <div className="w-full px-6 py-8 space-y-6">
        {/* Error Messages */}
        {error && (
          <Alert
            variant={
              error.includes("database setup") ? "default" : "destructive"
            }
          >
            <XCircle className="w-4 h-4" />
            <AlertDescription>
              {error}
              {error.includes("database setup") && (
                <div className="mt-2 text-sm">
                  <p>To set up the activity log table:</p>
                  <ol className="list-decimal list-inside mt-1 ml-4">
                    <li>Go to your Supabase dashboard</li>
                    <li>Open the SQL Editor</li>
                    <li>
                      Run the SQL script in{" "}
                      <code>/database/activity_log_table.sql</code>
                    </li>
                  </ol>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Activities
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.today}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.thisWeek}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.thisMonth}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search activities..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Activity Type</Label>
                <Select
                  value={selectedActivityType}
                  onValueChange={setSelectedActivityType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Entity Type</Label>
                <Select
                  value={selectedEntityType}
                  onValueChange={setSelectedEntityType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTITY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSearch}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">
                  Loading activities...
                </span>
              </div>
            ) : filteredActivities.length > 0 ? (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.activity_type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getActivityColor(
                                activity.activity_type
                              )}
                            >
                              {activity.activity_type}
                            </Badge>
                            {activity.entity_type && (
                              <Badge variant="outline">
                                {activity.entity_type}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(activity.created_at)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-900 mt-1">
                          {activity.activity_description}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {activity.profile && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{activity.profile.name}</span>
                            </div>
                          )}
                          {activity.ip_address && (
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              <span>{activity.ip_address}</span>
                            </div>
                          )}
                          {activity.user_agent && (
                            <div className="flex items-center gap-1">
                              <Monitor className="w-3 h-3" />
                              <span className="truncate max-w-xs">
                                {activity.user_agent}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No activities found</p>
                {error ? (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Database Setup Required:</strong> The activity log
                      table hasn't been created yet.
                    </p>
                    <p className="text-sm text-yellow-700 mt-2">
                      Please run the SQL queries provided in the implementation
                      documentation to create the required database tables.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Try adjusting your search criteria or date range, or start
                    using the system to generate activity logs.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserActivityLog;

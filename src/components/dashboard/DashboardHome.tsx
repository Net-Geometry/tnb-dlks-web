
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  FileText, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';

const DashboardHome = () => {
  const stats = [
    {
      title: "Active Work Orders",
      value: "124",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Pending Approvals",
      value: "18",
      change: "-5%",
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Completed Today",
      value: "32",
      change: "+8%",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Critical Issues",
      value: "3",
      change: "-2%",
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Work Order",
      title: "Electrical maintenance at Substation A",
      status: "In Progress",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "Purchase Order",
      title: "New transformer procurement",
      status: "Approved",
      time: "4 hours ago"
    },
    {
      id: 3,
      type: "JIB Request",
      title: "Safety inspection required",
      status: "Pending",
      time: "6 hours ago"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <Badge variant="outline" className="text-sm">
          Last updated: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {stat.change}
                  </span>
                  {' '}from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {activity.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="font-medium text-sm text-foreground">{activity.title}</p>
                  </div>
                  <Badge 
                    variant={activity.status === 'Approved' ? 'default' : 
                            activity.status === 'In Progress' ? 'secondary' : 'outline'}
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-950/70 rounded-lg text-left transition-colors">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <div className="font-medium text-sm text-foreground">Create Work Order</div>
                <div className="text-xs text-muted-foreground">Start new work request</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 dark:bg-green-950/50 dark:hover:bg-green-950/70 rounded-lg text-left transition-colors">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                <div className="font-medium text-sm text-foreground">View Reports</div>
                <div className="text-xs text-muted-foreground">Performance analytics</div>
              </button>
              <button className="p-4 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/50 dark:hover:bg-orange-950/70 rounded-lg text-left transition-colors">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
                <div className="font-medium text-sm text-foreground">Manage Users</div>
                <div className="text-xs text-muted-foreground">User administration</div>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-950/70 rounded-lg text-left transition-colors">
                <AlertCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                <div className="font-medium text-sm text-foreground">System Status</div>
                <div className="text-xs text-muted-foreground">Monitor health</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;

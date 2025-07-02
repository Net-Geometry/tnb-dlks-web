
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  Globe,
  Palette,
  Key,
  Save,
  RefreshCw
} from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = React.useState({
    workOrders: true,
    purchaseOrders: true,
    jibRequests: false,
    systemAlerts: true,
    emailNotifications: true
  });

  const [systemSettings, setSystemSettings] = React.useState({
    autoBackup: true,
    maintenanceMode: false,
    debugMode: false,
    dataRetention: 365
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure system preferences and settings</p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Display Name</label>
                <Input placeholder="Enter display name" defaultValue="System Administrator" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <Input placeholder="admin@tnb.com.my" defaultValue="admin@tnb.com.my" />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="en">English</option>
                  <option value="ms">Bahasa Malaysia</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Timezone</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="Asia/Kuala_Lumpur">Asia/Kuala Lumpur (GMT+8)</option>
                  <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Work Order Updates</p>
                  <p className="text-sm text-gray-600">Get notified about work order changes</p>
                </div>
                <Switch 
                  checked={notifications.workOrders}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, workOrders: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Purchase Order Approvals</p>
                  <p className="text-sm text-gray-600">Notifications for PO approvals</p>
                </div>
                <Switch 
                  checked={notifications.purchaseOrders}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, purchaseOrders: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">JIB Requests</p>
                  <p className="text-sm text-gray-600">JIB inspection notifications</p>
                </div>
                <Switch 
                  checked={notifications.jibRequests}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, jibRequests: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Alerts</p>
                  <p className="text-sm text-gray-600">Critical system notifications</p>
                </div>
                <Switch 
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, systemAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Password Requirements</label>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Minimum 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Require uppercase letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Require numbers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Require special characters</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium mb-2 block">Session Timeout (minutes)</label>
                <Input type="number" defaultValue="30" />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Login Attempts Limit</label>
                <Input type="number" defaultValue="5" />
              </div>

              <Button variant="outline" className="w-full">
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Automatic Backup</p>
                  <p className="text-sm text-gray-600">Daily system backup at 2:00 AM</p>
                </div>
                <Switch 
                  checked={systemSettings.autoBackup}
                  onCheckedChange={(checked) => 
                    setSystemSettings(prev => ({ ...prev, autoBackup: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-gray-600">Restrict system access</p>
                </div>
                <Switch 
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => 
                    setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Debug Mode</p>
                  <p className="text-sm text-gray-600">Enable detailed logging</p>
                </div>
                <Switch 
                  checked={systemSettings.debugMode}
                  onCheckedChange={(checked) => 
                    setSystemSettings(prev => ({ ...prev, debugMode: checked }))
                  }
                />
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium mb-2 block">Data Retention (days)</label>
                <Input 
                  type="number" 
                  value={systemSettings.dataRetention}
                  onChange={(e) => 
                    setSystemSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) }))
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Backup Now
                </Button>
                <Button variant="outline" className="flex-1">
                  <Database className="w-4 h-4 mr-2" />
                  View Logs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Application Version</h4>
              <p className="text-sm text-gray-600">DLKS Phase 2 v2.1.0</p>
              <Badge variant="secondary" className="mt-1">Latest</Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Database Status</h4>
              <p className="text-sm text-gray-600">Connected</p>
              <Badge variant="default" className="mt-1 bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Last Backup</h4>
              <p className="text-sm text-gray-600">2024-01-13 02:00:00</p>
              <Badge variant="outline" className="mt-1">Successful</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

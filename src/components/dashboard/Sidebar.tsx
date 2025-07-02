import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  Briefcase,
  ShoppingCart,
  FileText,
  Activity,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", key: "dashboard" },
    {
      icon: Briefcase,
      label: "Work Management",
      path: "/work-management",
      key: "work",
    },
    {
      icon: ShoppingCart,
      label: "Purchase Order",
      path: "/purchase-order",
      key: "po",
    },
    { icon: FileText, label: "JIB", path: "/jib", key: "jib" },
    { icon: Activity, label: "LKS Status", path: "/lks-status", key: "lks" },
    {
      icon: Users,
      label: "User Management",
      path: "/user-management",
      key: "users",
    },
    { icon: Settings, label: "Settings", path: "/settings", key: "settings" },
  ];

  // Filter menu items based on user permissions
  const getFilteredMenuItems = () => {
    if (user?.user_metadata?.role === "TNB Super Admin") return menuItems;

    // Filter based on user level and permissions
    return menuItems.filter((item) => {
      if (
        item.key === "users" &&
        !user?.user_metadata?.permissions?.includes("manage_users")
      ) {
        return false;
      }
      return true;
    });
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                DLKS Phase 2
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                TNB Work System
              </p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle(!collapsed)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {getFilteredMenuItems().map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-purple-100 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 border-r-4 border-purple-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
                  }`
                }
              >
                <item.icon
                  className={`w-5 h-5 ${collapsed ? "mx-auto" : ""}`}
                />
                {!collapsed && (
                  <span className="font-medium group-hover:translate-x-1 transition-transform">
                    {item.label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {!collapsed && user && (
          <>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user.user_metadata?.name || user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.user_metadata?.role || "User"}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 truncate">
                  {user.user_metadata?.company || "DLKS System"}
                </p>
              </div>
            </div>
          </>
        )}

        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full ${
            collapsed ? "p-2" : "justify-start"
          } text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400`}
        >
          <LogOut className={`w-5 h-5 ${collapsed ? "mx-auto" : "mr-3"}`} />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

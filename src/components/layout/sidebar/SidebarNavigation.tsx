import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import { SidebarNavigationItem } from "./SidebarNavigationItem";
import { MenuItem } from "./types";
import {
  Home,
  Briefcase,
  ShoppingCart,
  FileText,
  Activity,
  Users,
  Settings,
  Building,
  History,
} from "lucide-react";

interface SidebarNavigationProps {
  collapsed: boolean;
  user: User | null;
}

export const SidebarNavigation = ({
  collapsed,
  user,
}: SidebarNavigationProps) => {
  // State to manage which parent item is currently expanded (accordion behavior)
  const [expandedParent, setExpandedParent] = useState<string | null>(null);

  // Debug: Log user object to see its structure
  console.log("SidebarNavigation - Current user:", user);
  console.log("SidebarNavigation - User metadata:", user?.user_metadata);
  console.log(
    "SidebarNavigation - User permissions:",
    user?.user_metadata?.permissions
  );

  const menuItems: MenuItem[] = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/dashboard",
      key: "dashboard",
    },
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
    {
      icon: Activity,
      label: "LKS Status",
      path: "/lks-status",
      key: "lks",
    },
    {
      icon: Users,
      label: "Administration",
      path: "/administration",
      key: "admin",
      subItems: [
        {
          icon: Users,
          label: "User Management",
          path: "/user-management",
          key: "user-management",
        },
        {
          icon: Building,
          label: "Organization Management",
          path: "/organization-management",
          key: "organization-management",
        },
        {
          icon: History,
          label: "Activity Log",
          path: "/activity-log",
          key: "activity-log",
        },
        {
          icon: Settings,
          label: "Settings",
          path: "/settings",
          key: "settings",
        },
      ],
    },
  ];

  // Filter menu items based on user permissions
  const getFilteredMenuItems = () => {
    if (user?.user_metadata?.role === "TNB Super Admin") return menuItems;

    // Temporarily disable admin filtering for testing - REMOVE THIS LATER
    return menuItems;

    // Filter based on user level and permissions
    // return menuItems.filter((item) => {
    //   if (
    //     item.key === "admin" &&
    //     !user?.user_metadata?.permissions?.includes("manage_users")
    //   ) {
    //     return false;
    //   }
    //   return true;
    // });
  };

  // Handle accordion behavior - only one parent can be expanded at a time
  const handleToggleExpanded = (itemKey: string) => {
    // If clicking on the same item, toggle it
    if (expandedParent === itemKey) {
      setExpandedParent(null);
    } else {
      // If clicking on a different item, expand it (and collapse others - accordion behavior)
      setExpandedParent(itemKey);
    }
  };

  return (
    <nav
      className={`flex-1 transition-all duration-300 ${
        collapsed ? "p-2" : "p-4"
      }`}
    >
      <ul className="space-y-2">
        {getFilteredMenuItems().map((item) => (
          <li key={item.key}>
            <SidebarNavigationItem
              icon={item.icon}
              label={item.label}
              path={item.path}
              collapsed={collapsed}
              subItems={item.subItems}
              isExpanded={expandedParent === item.key}
              onToggleExpanded={() => handleToggleExpanded(item.key)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

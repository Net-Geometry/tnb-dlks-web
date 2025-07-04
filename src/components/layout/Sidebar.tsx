import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  SidebarHeader, 
  SidebarNavigation, 
  SidebarUserProfile 
} from "./sidebar/index";

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

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <SidebarHeader collapsed={collapsed} onToggle={onToggle} />
      <SidebarNavigation collapsed={collapsed} user={user} />
      <SidebarUserProfile collapsed={collapsed} user={user} onLogout={handleLogout} />
    </div>
  );
};

export default Sidebar;

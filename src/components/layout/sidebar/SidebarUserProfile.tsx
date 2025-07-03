import React from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

interface SidebarUserProfileProps {
  collapsed: boolean;
  user: User | null;
  onLogout: () => void;
}

export const SidebarUserProfile = ({ collapsed, user, onLogout }: SidebarUserProfileProps) => {
  return (
    <div className={`border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${collapsed ? 'p-2' : 'p-4'}`}>
      {/* User Profile - Fixed height container to prevent vertical movement */}
      {user && (
        <div className={`${collapsed ? 'h-14' : 'h-auto'} transition-all duration-300 mb-3`}>
          {collapsed ? (
            /* Collapsed state - Show only avatar */
            <div className="flex justify-center h-full items-center">
              <Avatar className="w-10 h-10 shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200" title={`${user.user_metadata?.name || user.email} - ${user.user_metadata?.role || "User"}`}>
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            /* Expanded state - Show full profile */
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Avatar className="w-10 h-10 shrink-0">
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
          )}
        </div>
      )}

      {/* Logout Button - Fixed height */}
      <div className="h-10">
        <Button
          variant="ghost"
          onClick={onLogout}
          className={`w-full h-full transition-all duration-300 ${
            collapsed ? "justify-center" : "justify-start"
          } text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 relative group`}
        >
          <LogOut className={`w-5 h-5 shrink-0 transition-all duration-300 ${collapsed ? "" : "mr-3"}`} />
          {!collapsed && <span className="transition-all duration-300">Logout</span>}
          
          {/* Tooltip for collapsed logout button */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

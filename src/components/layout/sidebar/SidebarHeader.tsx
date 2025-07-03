import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

export const SidebarHeader = ({ collapsed, onToggle }: SidebarHeaderProps) => {
  return (
    <div className={`flex items-center h-16 ${collapsed ? 'justify-center px-3' : 'justify-between px-4'} border-b border-gray-200 dark:border-gray-700 transition-all duration-300`}>
      {/* Logo Section - Clickable when collapsed */}
      <div 
        className={`${collapsed ? 'flex items-center justify-center' : 'flex items-center gap-3 min-w-0'} ${
          collapsed 
            ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 transition-all duration-200" 
            : ""
        }`}
        onClick={collapsed ? () => onToggle(false) : undefined}
        title={collapsed ? "Click to expand sidebar" : undefined}
      >
        {/* DLKS Logo - Always visible */}
        <div className={`w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
          collapsed ? "hover:scale-105" : ""
        }`}>
          <Zap className="w-6 h-6 text-white" />
        </div>
        
        {/* Text content - Hidden when collapsed */}
        {!collapsed && (
          <div className="min-w-0 flex-1 transition-all duration-300">
            <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
              DLKS Phase 2
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              TNB Work System
            </p>
          </div>
        )}
      </div>
      
      {/* Collapse button - Only visible when expanded */}
      {!collapsed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0 transition-all duration-200"
          title="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

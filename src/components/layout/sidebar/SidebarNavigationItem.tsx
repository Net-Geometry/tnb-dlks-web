import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LucideIcon, ChevronDown, ChevronRight } from "lucide-react";
import { SubMenuItem } from "./types";

interface SidebarNavigationItemProps {
  icon: LucideIcon;
  label: string;
  path?: string;
  collapsed: boolean;
  subItems?: SubMenuItem[];
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export const SidebarNavigationItem = ({ 
  icon: Icon, 
  label, 
  path, 
  collapsed,
  subItems,
  isExpanded = false,
  onToggleExpanded
}: SidebarNavigationItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasSubItems = subItems && subItems.length > 0;

  // Check if any submenu item is currently active
  const isAnySubItemActive = hasSubItems && subItems.some(item => {
    // Exact match for submenu items
    return location.pathname === item.path || 
           (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
  });
  
  // Check if current item is active (for simple items)
  const isCurrentItemActive = path && (
    location.pathname === path || 
    (path !== '/' && location.pathname.startsWith(path + '/'))
  );
  
  // Parent item should be highlighted if any subitem is active OR if the parent itself is active
  const isParentActive = isAnySubItemActive || isCurrentItemActive;

  // Auto-expand if any submenu item is active (only when not manually controlled)
  React.useEffect(() => {
    if (isAnySubItemActive && !collapsed && !isExpanded && onToggleExpanded) {
      // Only auto-expand if no other parent is currently expanded
      // Use a small delay to avoid interfering with manual clicks
      const timeout = setTimeout(() => {
        onToggleExpanded();
      }, 200);
      
      return () => clearTimeout(timeout);
    }
  }, [isAnySubItemActive, collapsed]);

  // Render simple tooltip for individual items
  const renderSimpleTooltip = (itemLabel: string) => {
    return (
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
        {itemLabel}
      </div>
    );
  };

  // Handle click for parent items with submenus
  const handleParentClick = (e: React.MouseEvent) => {
    if (hasSubItems && collapsed) {
      // In collapsed mode, single click navigates, double click toggles accordion
      if (e.detail === 1 && path) {
        // Single click - navigate to parent path
        return; // Let the NavLink handle navigation
      } else if (e.detail === 2) {
        // Double click - toggle submenu expansion (accordion behavior)
        e.preventDefault();
        onToggleExpanded?.();
      }
    } else if (hasSubItems && !collapsed && path) {
      // If parent has both path and submenus, navigate to parent path
      // The chevron button will handle submenu expansion separately
      return;
    } else if (hasSubItems && !collapsed) {
      // If parent has no path, just toggle submenu
      e.preventDefault();
      onToggleExpanded?.();
    }
  };

  // Handle chevron click for submenu expansion
  const handleChevronClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleExpanded?.();
  };

  // If it's a simple item without submenus, render the standard NavLink
  if (!hasSubItems) {
    return (
      <NavLink
        to={path!}
        className={({ isActive }) => {
          // Enhanced active state logic for main menu items
          const isActiveRoute = isActive || 
                              isCurrentItemActive || 
                              (path !== '/' && location.pathname.startsWith(path + '/'));
          
          return `flex items-center ${collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-3'} rounded-lg transition-all duration-300 group relative ${
            isActiveRoute
              ? "bg-gradient-to-r from-purple-100 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 border-r-4 border-purple-500"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
          }`;
        }}
      >
        <Icon className={`w-5 h-5 shrink-0 transition-all duration-300`} />
        
        {!collapsed && (
          <span className="font-medium group-hover:translate-x-1 transition-transform truncate">
            {label}
          </span>
        )}
        
        {/* Tooltip for collapsed state */}
        {collapsed && renderSimpleTooltip(label)}
      </NavLink>
    );
  }

  // For items with submenus
  return (
    <div>
      {/* Parent Item */}
      {path ? (
        // If parent has a path, always make it a NavLink (navigable in both modes)
        <NavLink
          to={path}
          onClick={handleParentClick}
          className={({ isActive }) => {
            const isActiveRoute = isActive || isCurrentItemActive;
            return `flex items-center ${collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-3'} rounded-lg transition-all duration-300 group relative ${
              isParentActive
                ? "bg-gradient-to-r from-purple-100 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 border-r-4 border-purple-500"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
            }`;
          }}
        >
          <Icon className={`w-5 h-5 shrink-0 transition-all duration-300`} />
          
          {!collapsed && (
            <>
              <span className="font-medium group-hover:translate-x-1 transition-transform truncate flex-1">
                {label}
              </span>
              {/* Chevron for expand/collapse - separate clickable area */}
              <button
                onClick={handleChevronClick}
                className="w-6 h-6 shrink-0 hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex items-center justify-center"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                )}
              </button>
            </>
          )}
          
          {/* Tooltip for collapsed state with subitems */}
          {collapsed && renderSimpleTooltip(label)}
        </NavLink>
      ) : (
        // If parent has no path, make it a div with click handler
        <div
          onClick={handleParentClick}
          className={`flex items-center ${collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-3'} rounded-lg transition-all duration-300 group relative cursor-pointer ${
            isParentActive
              ? "bg-gradient-to-r from-purple-100 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 border-r-4 border-purple-500"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
          }`}
        >
          <Icon className={`w-5 h-5 shrink-0 transition-all duration-300`} />
          
          {!collapsed && (
            <>
              <span className="font-medium group-hover:translate-x-1 transition-transform truncate flex-1">
                {label}
              </span>
              {/* Chevron for expand/collapse */}
              <div className="w-4 h-4 shrink-0">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                )}
              </div>
            </>
          )}
          
          {/* Tooltip for collapsed state with subitems */}
          {collapsed && renderSimpleTooltip(label)}
        </div>
      )}

      {/* Submenu Items - Show when expanded OR when collapsed and expanded */}
      {((collapsed && isExpanded) || (!collapsed && isExpanded)) && (
        <div className={`space-y-1 ${collapsed ? 'mt-1 ml-2' : 'ml-6 mt-1 pl-3'}`}>
          {subItems.map((subItem) => (
            <NavLink
              key={subItem.key}
              to={subItem.path}
              className={({ isActive }) => {
                // Enhanced active state logic for submenu items
                const isActiveRoute = isActive || 
                                    location.pathname === subItem.path || 
                                    (subItem.path !== '/' && location.pathname.startsWith(subItem.path + '/'));
                
                return `flex items-center ${collapsed ? 'justify-center px-1 py-2 ml-1' : 'gap-3 px-3 py-2'} rounded-md transition-all duration-300 group text-sm relative ${
                  collapsed ? 'border-l-2 border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/30' : ''
                } ${
                  isActiveRoute
                    ? collapsed 
                      ? "text-purple-600 dark:text-purple-400 font-medium border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/20"
                      : "text-purple-600 dark:text-purple-400 font-medium"
                    : collapsed
                      ? "text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 hover:border-l-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-900/10"
                      : "text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400"
                }`;
              }}
            >
              <subItem.icon className={`${collapsed ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0`} />
              {!collapsed && (
                <span className="font-normal group-hover:translate-x-1 transition-transform truncate">
                  {subItem.label}
                </span>
              )}
              
              {/* Tooltip for collapsed submenu items */}
              {collapsed && renderSimpleTooltip(subItem.label)}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

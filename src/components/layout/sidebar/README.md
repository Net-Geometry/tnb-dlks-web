# Sidebar Components with Submenu Support 🆕

This directory contains the modular sidebar components for the DLKS Phase 2 dashboard layout.

## 🎉 NEW FEATURE: Submenu Support

The sidebar now supports **nested menu items** with expandable/collapsible submenus!

### Key Features:
- **Accordion Behavior**: Only one parent menu can be expanded at a time - expanding one collapses others
- **Parent Highlighting**: Parent menu items are highlighted when any of their submenus are active OR when the parent itself is active
- **Clickable Parents**: Parent items can have their own routes and be navigated to directly
- **Collapsed Mode Navigation**: In collapsed mode, single click navigates to parent paths (primary action)
- **Collapsed Mode Accordion**: In collapsed mode, double click toggles accordion behavior (expand/collapse submenus)
- **Auto-Expansion**: Submenus automatically expand when a child item is active
- **Smart Path Matching**: Supports both exact path matching and prefix matching for nested routes
- **Simple Tooltips**: Individual item tooltips when hovering (parent shows parent, submenu shows submenu)
- **Dual Navigation**: In expanded mode - parent items can be clicked to navigate, chevron buttons control submenu expansion

## Components

### `SidebarHeader.tsx`
- Contains the DLKS logo and collapse/expand toggle button
- The logo remains visible when collapsed
- Handles the sidebar state toggle

### `SidebarNavigation.tsx`
- Manages the main navigation menu items
- **NEW**: Handles accordion behavior - only one parent can be expanded at a time
- Handles user permission-based filtering
- Uses `SidebarNavigationItem` for individual menu items

### `SidebarNavigationItem.tsx`
- Individual navigation menu item component
- **NEW**: Supports nested submenus with expand/collapse functionality
- **NEW**: Visual hierarchy with distinct styling for parent vs submenu items
- **NEW**: Parent items can have their own routes and be navigated to directly
- **NEW**: Separate chevron buttons for submenu expansion (when parent has a path)
- **NEW**: Parent highlighting when any submenu item is active OR when parent itself is active
- **NEW**: Auto-expansion of submenus when child items are active
- **NEW**: Enhanced path matching (exact match + prefix matching for nested routes)
- **NEW**: Submenus visible directly in collapsed sidebar (not hidden in tooltips)
- **NEW**: Enhanced visual differentiation in collapsed mode (submenu items have smaller icons, left border, and subtle background)
- **Parent items**: Bold styling with gradient backgrounds and right border
- **Submenu items**: Clean, minimal styling with simple color changes for active states
- Includes hover effects and active state styling
- Shows tooltips when sidebar is collapsed
- Handles proper icon sizing for collapsed state

### `SidebarUserProfile.tsx`
- Displays user profile information when expanded
- Shows user avatar when collapsed for visual identity
- Shows logout button with tooltip when collapsed
- Handles user authentication state

## Features

- **Responsive Design**: Adapts to collapsed/expanded states
- **Accordion Behavior**: Only one parent menu can be expanded at a time - expanding one automatically collapses others
- **Collapsed Mode Navigation**: In collapsed mode, single click on parent items navigates to parent paths
- **Collapsed Mode Accordion**: In collapsed mode, double click on parent items toggles accordion behavior
- **Submenu Support**: Nested menu items with expand/collapse functionality
- **Clickable Parents**: Parent items can have their own routes and be navigated to directly
- **Collapsed Mode Navigation**: Submenus are visible and expandable directly in the collapsed sidebar
- **Visual Differentiation**: In collapsed mode, submenu items have distinct styling (smaller icons, left border, subtle background)
- **Smart Tooltips**: Simple tooltips showing individual item names when hovering
- **Dual Navigation**: 
  - Expanded mode: Parent items can be clicked to navigate, separate chevron buttons control submenu expansion
  - Collapsed mode: Single click navigates to parent, double click toggles accordion, right-click is default behavior
- **Visual Hierarchy**: Clear distinction between parent and submenu items in both modes
  - Parent items: Bold styling with gradient backgrounds and right border indicators
  - Submenu items (expanded): Simple, clean styling with just color changes for active states
  - Submenu items (collapsed): Smaller icons, left border, subtle background, and indentation
- **Parent Highlighting**: Parent menu items highlighted when submenus are active OR when parent itself is active
- **Auto-Expansion**: Submenus auto-expand when child items are active
- **Smart Path Matching**: Enhanced route matching for nested paths
- **Enhanced Tooltips**: Simple tooltips showing individual item names when hovering
- **Proper Icon Sizing**: Icons maintain appropriate size when collapsed
- **Persistent Logo**: DLKS logo always visible
- **User Avatar**: Profile picture remains visible when collapsed
- **Permission-based Navigation**: Filters menu items based on user permissions
- **Dark Mode Support**: Full dark mode compatibility
- **Smooth Animations**: Horizontal-only transitions for stable layout

## Usage

```tsx
import { SidebarHeader, SidebarNavigation, SidebarUserProfile } from "@/components/layout/sidebar";

// Used in the main Sidebar component
<SidebarHeader collapsed={collapsed} onToggle={onToggle} />
<SidebarNavigation collapsed={collapsed} user={user} />
<SidebarUserProfile collapsed={collapsed} user={user} onLogout={handleLogout} />
```

## Benefits

- **Modular**: Each component has a single responsibility
- **Maintainable**: Easy to update individual parts
- **Reusable**: Components can be used independently
- **Type Safe**: Full TypeScript support
- **Accessible**: Proper ARIA attributes and keyboard navigation
- **Properly Organized**: Located in layout folder for better project structure

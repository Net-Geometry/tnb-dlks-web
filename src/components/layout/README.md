# Layout Components

This directory contains all layout-related components for the DLKS Phase 2 application.

## Components

### `DashboardLayout.tsx`
- **Main layout wrapper** for the dashboard application
- Manages sidebar state (collapsed/expanded)
- Provides the overall structure: Sidebar + Header + Main Content
- Handles responsive behavior and layout transitions

### `Sidebar.tsx`
- **Main sidebar component** that contains all sidebar functionality
- Integrates all sidebar sub-components
- Manages authentication state and user context
- Handles logout functionality

### `Header.tsx`
- **Top navigation bar** component
- Contains theme toggle, user actions, and other header elements
- Responsive design for different screen sizes

### `sidebar/` Directory
Contains modular sidebar components:
- **`SidebarHeader.tsx`** - Logo and collapse toggle
- **`SidebarNavigation.tsx`** - Navigation menu with permission filtering
- **`SidebarNavigationItem.tsx`** - Individual menu items with tooltips
- **`SidebarUserProfile.tsx`** - User profile and logout section

## Architecture Benefits

### **Proper Separation of Concerns**
- **Layout Components**: Handle UI structure and presentation
- **Dashboard Components**: Handle business logic and data
- **Clear Boundaries**: Easy to maintain and extend

### **Better Organization**
- **Logical Grouping**: All layout-related code in one place
- **Modular Design**: Each component has a single responsibility
- **Reusable**: Components can be used across different parts of the app

### **Developer Experience**
- **Intuitive Structure**: Easy to find and modify layout components
- **Clean Imports**: Simple import paths from `@/components/layout`
- **Type Safety**: Full TypeScript support throughout

## Usage

```tsx
// Import the main layout
import { DashboardLayout } from "@/components/layout";

// Use in your pages
<DashboardLayout>
  <YourPageContent />
</DashboardLayout>

// Or import specific components
import { Sidebar, Header } from "@/components/layout";
```

## File Structure

```
src/components/layout/
├── index.ts                    # Main exports
├── DashboardLayout.tsx         # Main layout wrapper
├── Sidebar.tsx                 # Main sidebar
├── Header.tsx                  # Top header
├── sidebar/
│   ├── index.ts               # Sidebar exports
│   ├── SidebarHeader.tsx      # Logo & toggle
│   ├── SidebarNavigation.tsx  # Menu items
│   ├── SidebarNavigationItem.tsx # Individual items
│   └── SidebarUserProfile.tsx # User section
└── README.md                  # This file
```

## Features

- **Responsive Design**: Adapts to different screen sizes
- **Dark Mode Support**: Full theme compatibility
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Animations**: Smooth transitions and hover effects
- **Permission-based**: Navigation filtered by user permissions
- **Type Safe**: Full TypeScript support

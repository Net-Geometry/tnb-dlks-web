import { 
  Home, 
  Briefcase, 
  ShoppingCart, 
  FileText, 
  Activity, 
  Users, 
  Settings 
} from 'lucide-react'

export interface MenuItem {
  icon: any;
  label: string;
  path: string;
  key: string;
  requiredPermissions?: string[];
  allowedRoles?: string[];
}

export const menuItems: MenuItem[] = [
  { 
    icon: Home, 
    label: 'Dashboard', 
    path: '/dashboard', 
    key: 'dashboard' 
  },
  { 
    icon: Briefcase, 
    label: 'Work Management', 
    path: '/work-management', 
    key: 'work' 
  },
  { 
    icon: ShoppingCart, 
    label: 'Purchase Order', 
    path: '/purchase-order', 
    key: 'po' 
  },
  { 
    icon: FileText, 
    label: 'JIB', 
    path: '/jib', 
    key: 'jib' 
  },
  { 
    icon: Activity, 
    label: 'LKS Status', 
    path: '/lks-status', 
    key: 'lks' 
  },
  { 
    icon: Users, 
    label: 'User Management', 
    path: '/user-management', 
    key: 'users',
    requiredPermissions: ['manage_users'],
    allowedRoles: ['TNB Super Admin', 'Admin']
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    path: '/settings', 
    key: 'settings' 
  },
]

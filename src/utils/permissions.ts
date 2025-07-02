import { MenuItem } from '../config/menuItems'

export interface User {
  name: string;
  email: string;
  role: string;
  company: string;
  permissions: string[];
}

/**
 * Check if user has required permissions
 */
export const hasPermission = (user: User | null, permissions: string[]): boolean => {
  if (!user || !permissions || permissions.length === 0) return true
  return permissions.every(permission => user.permissions?.includes(permission))
}

/**
 * Check if user has required role
 */
export const hasRole = (user: User | null, roles: string[]): boolean => {
  if (!user || !roles || roles.length === 0) return true
  return roles.includes(user.role)
}

/**
 * Check if user is super admin (has access to everything)
 */
export const isSuperAdmin = (user: User | null): boolean => {
  return user?.role === 'TNB Super Admin' || user?.role === 'Admin'
}

/**
 * Filter menu items based on user permissions and roles
 */
export const getFilteredMenuItems = (menuItems: MenuItem[], user: User | null): MenuItem[] => {
  // Super admins see everything
  if (isSuperAdmin(user)) return menuItems
  
  // Filter based on user permissions and roles
  return menuItems.filter(item => {
    // Check if item requires specific permissions
    if (item.requiredPermissions && !hasPermission(user, item.requiredPermissions)) {
      return false
    }
    
    // Check if item requires specific roles
    if (item.allowedRoles && !hasRole(user, item.allowedRoles)) {
      return false
    }
    
    return true
  })
}

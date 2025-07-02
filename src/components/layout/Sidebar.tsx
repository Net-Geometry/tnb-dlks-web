import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/component/ui/Button'
import { Avatar, AvatarFallback } from '@/component/ui/Avatar'
import { UserAuth } from '@/context/AuthContext'
import { menuItems } from '@/config/menuItems'
import { getFilteredMenuItems, User } from '@/utils/permissions'
import { 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { session, signOut } = UserAuth()
  const navigate = useNavigate()

  // Mock user data - replace this with actual user data from your backend
  const user: User | null = session?.user ? {
    name: session.user.email?.split('@')[0] || 'User',
    email: session.user.email || '',
    role: 'Admin', // This should come from your user profile/database
    company: 'DLKS System', // This should come from your user profile/database
    permissions: ['manage_users'] // This should come from your user profile/database
  } : null

  const handleLogout = async () => {
    await signOut()
    navigate('/signin')
  }

  return (
    <div className={`fixed left-0 top-0 h-full bg-card shadow-xl border-r border-border transition-all duration-300 z-30 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">DLKS System</h1>
              <p className="text-xs text-muted-foreground">Work Management</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle(!collapsed)}
          className="p-2 hover:bg-accent"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {getFilteredMenuItems(menuItems, user).map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary/10 text-primary border-r-4 border-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`
                }
              >
                <item.icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
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
      <div className="border-t border-border p-4">
        {!collapsed && user && (
          <>
            <div className="flex items-center gap-3 p-3 bg-accent rounded-lg mb-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                <p className="text-xs text-primary truncate">{user?.company}</p>
              </div>
            </div>
          </>
        )}
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full ${collapsed ? 'p-2' : 'justify-start'} text-destructive hover:bg-destructive/10 hover:text-destructive`}
        >
          <LogOut className={`w-5 h-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
          {!collapsed && 'Logout'}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar

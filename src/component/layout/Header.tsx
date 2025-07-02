import React, { useState } from 'react'
import { Button } from '@/component/ui/Button'
import { Badge } from '@/component/ui/Badge'
import { Input } from '@/component/ui/Input'
import { ThemeToggle } from '@/component/ui/ThemeToggle'
import { UserAuth } from '@/context/AuthContext'
import { Bell, Menu, Search } from 'lucide-react'

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { session } = UserAuth()
  const [notifications] = useState(3) // Mock notification count

  // Mock user data - replace this with actual user data from your backend
  const user = session?.user ? {
    name: session.user.email?.split('@')[0] || 'User',
    email: session.user.email || '',
    role: 'Admin', // This should come from your user profile/database
    company: 'DLKS System', // This should come from your user profile/database
  } : null

  return (
    <header className="bg-card shadow-sm border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleSidebar} 
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64 bg-background"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user && (
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role} • {user.company}</p>
            </div>
          )}
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                {notifications}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header

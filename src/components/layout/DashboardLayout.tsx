import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '@/context/AuthContext'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { session } = UserAuth()
  const navigate = useNavigate()

  // If no session, redirect to sign in
  if (!session) {
    navigate('/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="p-6 bg-background min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
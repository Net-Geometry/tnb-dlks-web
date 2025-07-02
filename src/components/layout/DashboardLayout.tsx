import React from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children}:DashboardLayoutProps) => {
  return (
    <div>
        DashboardLayout
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout;
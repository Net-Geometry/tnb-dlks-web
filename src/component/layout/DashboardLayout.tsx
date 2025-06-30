import React from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children}:DashboardLayoutProps) => {
  return (
    <div>
        DashboardLayout
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout;
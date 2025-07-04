import React from 'react';
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  children, 
  className = "" 
}) => {
  return (
    <div className={`bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white px-6 py-8 w-full ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {subtitle && (
            <p className="text-purple-100">{subtitle}</p>
          )}
        </div>
        {children && (
          <div className="flex gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

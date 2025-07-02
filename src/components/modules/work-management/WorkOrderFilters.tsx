
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download } from 'lucide-react';

export const WorkOrderFilters = () => {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filter & Search</h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by Work Order number, contractor, or location..."
              className="pl-12 h-12 text-base bg-gray-50 border-gray-300 focus:bg-white"
            />
          </div>
          
          <div className="flex gap-3">
            <select className="px-4 py-3 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option>All Types</option>
              <option>Cable Work</option>
              <option>Substation</option>
              <option>Maintenance</option>
            </select>
            
            <select className="px-4 py-3 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option>All Status</option>
              <option>In Progress</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
            
            <Button variant="outline" className="flex items-center gap-2 px-6">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  PlayCircle, 
  Clock, 
  AlertTriangle, 
  CheckCircle 
} from 'lucide-react';

export const WorkOrderSummary = () => {
  const summaryStats = [
    { label: 'Total', value: '12', icon: FileText, color: 'text-blue-600' },
    { label: 'In Progress', value: '4', icon: PlayCircle, color: 'text-blue-500' },
    { label: 'Pending', value: '3', icon: Clock, color: 'text-yellow-600' },
    { label: 'Overdue', value: '2', icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Completed', value: '3', icon: CheckCircle, color: 'text-green-600' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {summaryStats.map((stat, index) => (
        <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from 'lucide-react';

interface WorkLineItemSectionProps {
  workLineItem: {
    serviceId: string;
    description: string;
    unit: string;
    unitRate: number;
  };
}

const WorkLineItemSection: React.FC<WorkLineItemSectionProps> = ({ workLineItem }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Work Line Item Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Service ID</p>
            <p className="text-gray-900 font-semibold">{workLineItem.serviceId}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Unit</p>
            <p className="text-gray-900">{workLineItem.unit}</p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className="text-sm font-medium text-gray-700">Description</p>
            <p className="text-gray-900">{workLineItem.description}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Unit Rate</p>
            <p className="text-gray-900 font-semibold">RM {workLineItem.unitRate.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkLineItemSection;

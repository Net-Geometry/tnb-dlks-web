
import React from 'react';
import { WorkOrderCard } from './WorkOrderCard';

interface WorkOrder {
  id: string;
  status: string[];
  contractor: string;
  workPeriod: string;
  workTypes: string;
  issuedDate: string;
  workSiteLocation: string;
  primaryAction: string;
  actionColor: string;
  documentType: 'AMK' | 'AKK';
  projectNo?: string;
  purchaseOrderNo?: string;
  tcsComplaintNo?: string;
  phoneNo?: string;
  contractorAddress?: string;
  isAcknowledged?: boolean;
}

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onViewDetails: (orderId: string, documentType: 'AMK' | 'AKK') => void;
}

export const WorkOrderList: React.FC<WorkOrderListProps> = ({ workOrders, onViewDetails }) => {
  return (
    <div className="space-y-4">
      {workOrders.map((order) => (
        <WorkOrderCard 
          key={order.id}
          order={order}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

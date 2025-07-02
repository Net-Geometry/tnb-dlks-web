import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import WorkOrderDetail from "./WorkOrderDetail";
import AMKAKKManagement from "./AMKAKKManagement";
import { WorkOrderHeader } from "./work-management/WorkOrderHeader";
import { WorkOrderSummary } from "./work-management/WorkOrderSummary";
import { WorkOrderFilters } from "./work-management/WorkOrderFilters";
import { WorkOrderList } from "./work-management/WorkOrderList";

const WorkManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    type: "AMK" | "AKK";
  } | null>(null);

  // If user is a Technician, show AMK/AKK Management instead
  if (user?.user_metadata?.role === "Technician") {
    return <AMKAKKManagement />;
  }

  const workOrders = [
    {
      id: "AMK-2024-001",
      status: ["Planned", "In Progress"],
      contractor: "PowerTech Solutions Sdn Bhd",
      workPeriod: "20/01/2024 - 15/03/2024",
      workTypes: "Underground Cable Work, Substation Installation",
      issuedDate: "15/01/2024",
      workSiteLocation:
        "Jalan Ampang, KL - Substation Alpha Upgrade Project Site Location with detailed address information",
      primaryAction: "Acknowledge Work",
      actionColor: "bg-blue-600 hover:bg-blue-700",
      documentType: "AMK" as const,
      projectNo: "TNB-KL-2024-UG-001",
      contractorAddress:
        "No. 123, Jalan Teknologi, Taman Industri, 47100 Puchong, Selangor",
      isAcknowledged: false,
    },
    {
      id: "AMK-2024-002",
      status: ["Completed"],
      contractor: "ElectroServ Engineering Sdn Bhd",
      workPeriod: "01/02/2024 - 28/02/2024",
      workTypes: "Overhead Line Maintenance, Pole Replacement",
      issuedDate: "25/01/2024",
      workSiteLocation:
        "Jalan Sultan Ismail, KL - Overhead Line Section 5A-7B Maintenance Works",
      primaryAction: "View Report",
      actionColor: "bg-green-600 hover:bg-green-700",
      documentType: "AMK" as const,
      projectNo: "TNB-KL-2024-OH-002",
      isAcknowledged: true,
    },
    {
      id: "AKK-2024-001",
      status: ["Critical", "Pending"],
      contractor: "Emergency Power Solutions Ltd",
      workPeriod: "18/01/2024 - 20/01/2024",
      workTypes: "Emergency Repair, Direct Connection",
      issuedDate: "18/01/2024 09:30",
      workSiteLocation:
        "Emergency repair at Distribution Point Beta - Residential Area Power Restoration",
      primaryAction: "Issue Revision",
      actionColor: "bg-red-600 hover:bg-red-700",
      documentType: "AKK" as const,
      tcsComplaintNo: "TCS-2024-0118-URGENT",
      phoneNo: "+60 12-345 6789",
      isAcknowledged: false,
    },
    {
      id: "AMK-2024-003",
      status: ["Overdue"],
      contractor: "Grid Solutions Malaysia Sdn Bhd",
      workPeriod: "10/01/2024 - 31/01/2024",
      workTypes: "Transformer Installation, Protection System Upgrade",
      issuedDate: "05/01/2024",
      workSiteLocation:
        "Substation Charlie - 132kV/33kV Main Transformer Bay Upgrade Works",
      primaryAction: "Follow Up",
      actionColor: "bg-orange-600 hover:bg-orange-700",
      documentType: "AMK" as const,
      projectNo: "TNB-SEL-2024-TX-003",
      purchaseOrderNo: "PO-TNB-2024-0105",
      isAcknowledged: false,
    },
    {
      id: "AKK-2024-002",
      status: ["In Progress"],
      contractor: "FastFix Electrical Services",
      workPeriod: "22/01/2024 - 23/01/2024",
      workTypes: "Cable Fault Repair, Service Restoration",
      issuedDate: "22/01/2024 14:15",
      workSiteLocation:
        "Underground Cable Fault - Commercial District Section 3C Service Restoration Works",
      primaryAction: "Monitor Progress",
      actionColor: "bg-blue-600 hover:bg-blue-700",
      documentType: "AKK" as const,
      tcsComplaintNo: "TCS-2024-0122-UG",
      phoneNo: "+60 11-987 6543",
      isAcknowledged: true,
    },
  ];

  const handleViewDetails = (orderId: string, documentType: "AMK" | "AKK") => {
    setSelectedOrder({ id: orderId, type: documentType });
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  // Show detail view if an order is selected
  if (selectedOrder) {
    return (
      <WorkOrderDetail
        documentId={selectedOrder.id}
        documentType={selectedOrder.type}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <WorkOrderHeader />

      <div className="w-full px-6 py-8 space-y-8">
        <WorkOrderSummary />
        <WorkOrderFilters />
        <WorkOrderList
          workOrders={workOrders}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default WorkManagement;

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Calendar,
  FileText,
  Eye,
  Download,
  CheckCircle,
  MapPin,
  Phone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { WorkAcknowledgementModal } from "./WorkAcknowledgementModal";

// Status constants following the correct process flows
const AMK_STATUSES = {
  PENDING: "Pending Acknowledgement",
  ACKNOWLEDGED: "Acknowledged",
  REJECTED: "Rejected",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
} as const;

const AKK_STATUSES = {
  PENDING: "Pending Acknowledgement",
  ACKNOWLEDGED: "Acknowledged",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
} as const;

type AMKStatus = (typeof AMK_STATUSES)[keyof typeof AMK_STATUSES];
type AKKStatus = (typeof AKK_STATUSES)[keyof typeof AKK_STATUSES];

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
  documentType: "AMK" | "AKK";
  projectNo?: string;
  purchaseOrderNo?: string;
  tcsComplaintNo?: string;
  phoneNo?: string;
  contractorAddress?: string;
  isAcknowledged?: boolean;
}

interface WorkOrderCardProps {
  order: WorkOrder;
  onViewDetails: (orderId: string, documentType: "AMK" | "AKK") => void;
}

export const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  order,
  onViewDetails,
}) => {
  const { user } = useAuth();
  const [isAcknowledgementModalOpen, setIsAcknowledgementModalOpen] =
    useState(false);
  const [isOrderAcknowledged, setIsOrderAcknowledged] = useState(
    order.isAcknowledged || false
  );

  const getStatusColor = (status: string, documentType: "AMK" | "AKK") => {
    if (documentType === "AMK") {
      switch (status as AMKStatus) {
        case AMK_STATUSES.PENDING:
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case AMK_STATUSES.ACKNOWLEDGED:
          return "bg-green-100 text-green-800 border-green-200";
        case AMK_STATUSES.REJECTED:
          return "bg-red-100 text-red-800 border-red-200";
        case AMK_STATUSES.IN_PROGRESS:
          return "bg-blue-100 text-blue-800 border-blue-200";
        case AMK_STATUSES.COMPLETED:
          return "bg-green-100 text-green-800 border-green-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    } else {
      switch (status as AKKStatus) {
        case AKK_STATUSES.PENDING:
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case AKK_STATUSES.ACKNOWLEDGED:
          return "bg-green-100 text-green-800 border-green-200";
        case AKK_STATUSES.IN_PROGRESS:
          return "bg-blue-100 text-blue-800 border-blue-200";
        case AKK_STATUSES.COMPLETED:
          return "bg-green-100 text-green-800 border-green-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }
  };

  const canAcknowledgeWork = () => {
    return user?.dlks_user_role?.name === "Vendor" && !isOrderAcknowledged;
  };

  const handleAcknowledgeWork = () => {
    setIsAcknowledgementModalOpen(true);
  };

  const handleAcknowledgementSubmit = async (acknowledgementData: any) => {
    // In a real app, this would make an API call to save the acknowledgement
    console.log("Acknowledgement submitted:", acknowledgementData);

    // Update the local state
    setIsOrderAcknowledged(true);
    setIsAcknowledgementModalOpen(false);

    // Here you would typically update the order in your data store
    // and refresh the list or update the parent component
  };

  const handleDownloadPDF = () => {
    // PDF download logic would go here
    console.log("Downloading PDF for:", order.id);
  };

  return (
    <>
      <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Left Section */}
            <div className="flex-1 space-y-4">
              {/* Top Row - ID and Status */}
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-bold text-blue-600">{order.id}</h3>
                <div className="flex gap-2">
                  {order.status.map((status, idx) => (
                    <Badge
                      key={idx}
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        status,
                        order.documentType
                      )}`}
                    >
                      {status}
                    </Badge>
                  ))}
                  {isOrderAcknowledged && (
                    <Badge className="px-3 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200">
                      Acknowledged
                    </Badge>
                  )}
                </div>
              </div>

              {/* Main Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {order.documentType === "AMK"
                      ? "Instruction To:"
                      : "Contractor Name:"}
                  </span>
                  <span>{order.contractor}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {order.documentType === "AMK"
                      ? "Work Period:"
                      : "Issue Date/Time:"}
                  </span>
                  <span>
                    {order.documentType === "AMK"
                      ? order.workPeriod
                      : order.issuedDate}
                  </span>
                </div>

                {order.documentType === "AMK" && order.projectNo && (
                  <div className="flex items-start gap-2 text-gray-700">
                    <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="font-medium">Project No.:</span>
                    <span>{order.projectNo}</span>
                  </div>
                )}

                {order.documentType === "AKK" && order.tcsComplaintNo && (
                  <div className="flex items-start gap-2 text-gray-700">
                    <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="font-medium">TCS Complaint No.:</span>
                    <span>{order.tcsComplaintNo}</span>
                  </div>
                )}

                <div className="flex items-start gap-2 text-gray-700">
                  <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                  <span className="font-medium">Work Type:</span>
                  <span>{order.workTypes}</span>
                </div>

                {order.phoneNo && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Phone No.:</span>
                    <span>{order.phoneNo}</span>
                  </div>
                )}
              </div>

              {/* Work Site Location */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  Work Location
                </h4>
                <p className="text-gray-700">{order.workSiteLocation}</p>
                {order.contractorAddress && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Contractor Address:</span>{" "}
                    {order.contractorAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[200px]">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 flex-1 lg:flex-none"
                onClick={() => onViewDetails(order.id, order.documentType)}
              >
                <Eye className="w-4 h-4" />
                View Details
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 flex-1 lg:flex-none"
                onClick={handleDownloadPDF}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>

              {canAcknowledgeWork() && (
                <Button
                  size="sm"
                  className="flex items-center gap-2 text-white flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                  onClick={handleAcknowledgeWork}
                >
                  <CheckCircle className="w-4 h-4" />
                  Acknowledge Work
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Acknowledgement Modal */}
      <WorkAcknowledgementModal
        isOpen={isAcknowledgementModalOpen}
        onClose={() => setIsAcknowledgementModalOpen(false)}
        workOrderId={order.id}
        documentType={order.documentType}
        onAcknowledge={handleAcknowledgementSubmit}
      />
    </>
  );
};

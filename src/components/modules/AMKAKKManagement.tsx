import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/ui/page-header";
import WorkOrderDetail from './WorkOrderDetail';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Calendar,
  Building,
  XCircle
} from 'lucide-react';

// Valid status transitions for AMK and AKK
const AMK_STATUSES = {
  PENDING: 'Pending Acknowledgement',
  ACKNOWLEDGED: 'Acknowledged', 
  REJECTED: 'Rejected',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
} as const;

const AKK_STATUSES = {
  PENDING: 'Pending Acknowledgement',
  ACKNOWLEDGED: 'Acknowledged',
  IN_PROGRESS: 'In Progress', 
  COMPLETED: 'Completed'
} as const;

type AMKStatus = typeof AMK_STATUSES[keyof typeof AMK_STATUSES];
type AKKStatus = typeof AKK_STATUSES[keyof typeof AKK_STATUSES];

const AMKAKKManagement = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<{ id: string; type: 'AMK' | 'AKK' } | null>(null);

  const handleCreatePlanned = () => {
    navigate('/amk-form');
  };

  const handleCreateUnplanned = () => {
    navigate('/akk-form');
  };

  const handleViewDetails = (orderId: string, documentType: 'AMK' | 'AKK') => {
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

  const summaryStats = [
    { label: 'Total', value: '5', icon: FileText, color: 'text-blue-600' },
    { label: 'Pending', value: '2', icon: Clock, color: 'text-yellow-600' },
    { label: 'Acknowledged', value: '2', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Rejected', value: '1', icon: XCircle, color: 'text-red-600' },
    { label: 'Completed', value: '1', icon: CheckCircle, color: 'text-green-600' }
  ];

  // Updated work orders with correct status flow
  const workOrders = [
    {
      id: "AMK-2024-001",
      status: [AMK_STATUSES.PENDING] as AMKStatus[],
      statusColors: ["bg-yellow-100 text-yellow-800"],
      contractor: "PowerTech Solutions Sdn Bhd",
      workPeriod: "20/01/2024 - 15/03/2024",
      workTypes: "Underground Cable Work, Substation Installation",
      issuedDate: "15/01/2024",
      workSiteLocation: "Jalan Ampang, KL - Substation Alpha Upgrade",
      type: "AMK" as const,
      projectNo: "TNB-2024-PROJECT-001",
      poNumber: "PO-2024-001"
    },
    {
      id: "AKK-2024-001",
      status: [AKK_STATUSES.PENDING] as AKKStatus[],
      statusColors: ["bg-yellow-100 text-yellow-800"],
      contractor: "Emergency Power Solutions Ltd",
      workPeriod: "18/01/2024 - 20/01/2024",
      workTypes: "Emergency Power Restoration, Direct Connection",
      issuedDate: "18/01/2024 09:30",
      workSiteLocation: "Bukit Bintang, KL - Commercial District",
      type: "AKK" as const,
      tcsNumber: "TCS-2024-EMRG-001",
      phoneNo: "+60 12-345 6789"
    },
    {
      id: "AMK-2024-002",
      status: [AMK_STATUSES.ACKNOWLEDGED, AMK_STATUSES.IN_PROGRESS] as AMKStatus[],
      statusColors: ["bg-green-100 text-green-800", "bg-blue-100 text-blue-800"],
      contractor: "ElectroServ Engineering Sdn Bhd",
      workPeriod: "01/02/2024 - 28/02/2024",
      workTypes: "Overhead Line Maintenance, Pole Replacement",
      issuedDate: "25/01/2024",
      workSiteLocation: "Jalan Sultan Ismail, KL - Overhead Line Section 5A-7B",
      type: "AMK" as const,
      projectNo: "TNB-KL-2024-OH-002"
    },
    {
      id: "AKK-2024-002",
      status: [AKK_STATUSES.ACKNOWLEDGED, AKK_STATUSES.COMPLETED] as AKKStatus[],
      statusColors: ["bg-green-100 text-green-800", "bg-green-100 text-green-800"],
      contractor: "FastFix Electrical Services",
      workPeriod: "22/01/2024 - 23/01/2024",
      workTypes: "Cable Fault Repair, Service Restoration",
      issuedDate: "22/01/2024 14:15",
      workSiteLocation: "Underground Cable Fault - Commercial District Section 3C",
      type: "AKK" as const,
      tcsNumber: "TCS-2024-0122-UG",
      phoneNo: "+60 11-987 6543"
    },
    {
      id: "AMK-2024-003",
      status: [AMK_STATUSES.REJECTED] as AMKStatus[],
      statusColors: ["bg-red-100 text-red-800"],
      contractor: "Grid Solutions Malaysia Sdn Bhd",
      workPeriod: "10/01/2024 - 31/01/2024",
      workTypes: "Transformer Installation, Protection System Upgrade",
      issuedDate: "05/01/2024",
      workSiteLocation: "Substation Charlie - 132kV/33kV Main Transformer Bay",
      type: "AMK" as const,
      projectNo: "TNB-SEL-2024-TX-003",
      rejectionReason: "Conflicting with scheduled maintenance window",
      revision: "v2"
    }
  ];

  const getStatusBadgeColor = (status: string, type: 'AMK' | 'AKK') => {
    if (type === 'AMK') {
      switch (status as AMKStatus) {
        case AMK_STATUSES.PENDING:
          return "bg-yellow-100 text-yellow-800";
        case AMK_STATUSES.ACKNOWLEDGED:
          return "bg-green-100 text-green-800";
        case AMK_STATUSES.REJECTED:
          return "bg-red-100 text-red-800";
        case AMK_STATUSES.IN_PROGRESS:
          return "bg-blue-100 text-blue-800";
        case AMK_STATUSES.COMPLETED:
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else {
      switch (status as AKKStatus) {
        case AKK_STATUSES.PENDING:
          return "bg-yellow-100 text-yellow-800";
        case AKK_STATUSES.ACKNOWLEDGED:
          return "bg-green-100 text-green-800";
        case AKK_STATUSES.IN_PROGRESS:
          return "bg-blue-100 text-blue-800";
        case AKK_STATUSES.COMPLETED:
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  const getActionButtonText = (statuses: AMKStatus[] | AKKStatus[], type: 'AMK' | 'AKK'): string => {
    const currentStatus = statuses[statuses.length - 1];
    
    if (type === 'AMK') {
      switch (currentStatus) {
        case AMK_STATUSES.PENDING:
          return "Pending Response";
        case AMK_STATUSES.ACKNOWLEDGED:
          return "Start Work";
        case AMK_STATUSES.REJECTED:
          return "Revise & Resend";
        case AMK_STATUSES.IN_PROGRESS:
          return "Update Progress";
        case AMK_STATUSES.COMPLETED:
          return "View Report";
        default:
          return "Edit";
      }
    } else {
      switch (currentStatus) {
        case AKK_STATUSES.PENDING:
          return "Pending Response";
        case AKK_STATUSES.ACKNOWLEDGED:
          return "Start Work";
        case AKK_STATUSES.IN_PROGRESS:
          return "Update Progress";
        case AKK_STATUSES.COMPLETED:
          return "View Report";
        default:
          return "Edit";
      }
    }
  };

  const getActionButtonColor = (statuses: AMKStatus[] | AKKStatus[], type: 'AMK' | 'AKK'): string => {
    const currentStatus = statuses[statuses.length - 1];
    
    if (type === 'AMK') {
      // Handle AMK status colors
      if (currentStatus === AMK_STATUSES.REJECTED) {
        return "bg-orange-600 hover:bg-orange-700";
      }
      if (currentStatus === AMK_STATUSES.COMPLETED) {
        return "bg-green-600 hover:bg-green-700";
      }
      if (currentStatus === AMK_STATUSES.PENDING) {
        return "bg-gray-400 hover:bg-gray-500 cursor-not-allowed";
      }
      // Default for other AMK statuses (ACKNOWLEDGED, IN_PROGRESS)
      return "bg-blue-600 hover:bg-blue-700";
    } else {
      // Handle AKK status colors
      if (currentStatus === AKK_STATUSES.COMPLETED) {
        return "bg-green-600 hover:bg-green-700";
      }
      if (currentStatus === AKK_STATUSES.PENDING) {
        return "bg-gray-400 hover:bg-gray-500 cursor-not-allowed";
      }
      // Default for other AKK statuses (ACKNOWLEDGED, IN_PROGRESS)
      return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <PageHeader 
        title="Work Management"
        subtitle="Create and manage work instructions (Planned & Emergency)"
      >
        <Button 
          onClick={handleCreatePlanned}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          Create AMK (Planned)
        </Button>
        <Button 
          onClick={handleCreateUnplanned}
          className="bg-red-500/80 hover:bg-red-600/90 text-white border-red-300/30 flex items-center gap-2"
          variant="outline"
        >
          <AlertTriangle className="w-4 h-4" />
          Create AKK (Emergency)
        </Button>
      </PageHeader>

      <div className="w-full px-6 py-8 space-y-8">
        {/* Summary Cards */}
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

        {/* Filter & Search */}
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
                  placeholder="Search by AMK/AKK number, contractor, or location..."
                  className="pl-12 h-12 text-base bg-gray-50 border-gray-300 focus:bg-white"
                />
              </div>
              
              <div className="flex gap-3">
                <select className="px-4 py-3 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>All Types</option>
                  <option>AMK (Planned)</option>
                  <option>AKK (Emergency)</option>
                </select>
                
                <select className="px-4 py-3 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>All Status</option>
                  <option>Pending Acknowledgement</option>
                  <option>Acknowledged</option>
                  <option>Rejected</option>
                  <option>In Progress</option>
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

        {/* Work Orders List */}
        <div className="space-y-4">
          {workOrders.map((order) => (
            <Card key={order.id} className="bg-white shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Section */}
                  <div className="flex-1 space-y-4">
                    {/* Top Row - ID and Status */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        {order.type === 'AKK' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                        <h3 className="text-2xl font-bold text-blue-600">{order.id}</h3>
                      </div>
                      <div className="flex gap-2">
                        {order.status.map((status, idx) => (
                          <Badge 
                            key={idx}
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(status, order.type)}`}
                          >
                            {status}
                          </Badge>
                        ))}
                        {order.revision && (
                          <Badge className="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-800">
                            {order.revision}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Main Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Contractor:</span>
                        <span>{order.contractor}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {order.type === 'AMK' ? 'Work Period:' : 'Issue Date/Time:'}
                        </span>
                        <span>{order.type === 'AMK' ? order.workPeriod : order.issuedDate}</span>
                      </div>
                      
                      {order.projectNo && (
                        <div className="flex items-start gap-2 text-gray-700">
                          <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="font-medium">Project No.:</span>
                          <span>{order.projectNo}</span>
                        </div>
                      )}

                      {order.tcsNumber && (
                        <div className="flex items-start gap-2 text-gray-700">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                          <span className="font-medium">TCS Number:</span>
                          <span>{order.tcsNumber}</span>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-2 text-gray-700 md:col-span-2">
                        <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                        <span className="font-medium">Work Types:</span>
                        <span>{order.workTypes}</span>
                      </div>
                    </div>

                    {/* Work Site Location */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Work Site Location</h4>
                      <p className="text-gray-700">{order.workSiteLocation}</p>
                    </div>

                    {/* Rejection Reason (if applicable) */}
                    {order.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h4 className="font-semibold text-red-800 mb-1 flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Rejection Reason
                        </h4>
                        <p className="text-red-700 text-sm">{order.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Action Buttons */}
                  <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 flex-1 lg:flex-none"
                      onClick={() => handleViewDetails(order.id, order.type)}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    
                    <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1 lg:flex-none">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    
                    <Button 
                      size="sm" 
                      className={`flex items-center gap-2 text-white flex-1 lg:flex-none ${getActionButtonColor(order.status, order.type)}`}
                      disabled={order.status.includes(AMK_STATUSES.PENDING) || order.status.includes(AKK_STATUSES.PENDING)}
                    >
                      <Edit className="w-4 h-4" />
                      {getActionButtonText(order.status, order.type)}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AMKAKKManagement;

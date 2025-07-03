
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Building,
  Calendar,
  DollarSign,
  FileText,
  User,
  ShoppingCart,
  Edit,
  Printer,
  Download
} from 'lucide-react';

const PurchaseOrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - in real app, fetch based on ID
  const purchaseOrder = {
    id: "PO-2024-001",
    title: "High Voltage Transformers",
    projectNo: "TNB-2024-HV-001",
    vendor: "Siemens Malaysia",
    amount: "RM 450,000",
    status: "Approved",
    requestedBy: "Electrical Department",
    requestDate: "2024-01-10",
    deliveryDate: "2024-02-15",
    workDescription: "Supply and installation of high voltage transformers for substation upgrade project in Kuala Lumpur region.",
    jobScope: ["Transformer Installation", "Testing & Commissioning", "Site Preparation", "Documentation"]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-purple-100 text-purple-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBackToPO = () => {
    navigate('/purchase-order');
  };

  const handleEdit = () => {
    navigate(`/purchase-order/edit/${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In real app, generate and download PDF
    console.log('Downloading PDF for:', purchaseOrder.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToPO} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Purchase Orders
          </Button>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{purchaseOrder.id}</h1>
          </div>
        </div>
        <Badge className={getStatusColor(purchaseOrder.status)}>
          {purchaseOrder.status}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="w-4 h-4" />
          Print
        </Button>
        <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button onClick={handleEdit} className="flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      </div>

      {/* Main Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{purchaseOrder.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">PO Number</label>
                <p className="text-lg font-semibold">{purchaseOrder.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Project No.</label>
                <p className="text-lg">{purchaseOrder.projectNo}</p>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Contractor Name</label>
                  <p className="text-lg">{purchaseOrder.vendor}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">PO Amount</label>
                  <p className="text-lg font-semibold text-green-600">{purchaseOrder.amount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Requested By</label>
                  <p className="text-lg">{purchaseOrder.requestedBy}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">PO Status</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(purchaseOrder.status)}>
                    {purchaseOrder.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <label className="text-sm font-medium text-gray-600">Requested Date</label>
                <p className="text-lg">{purchaseOrder.requestDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <label className="text-sm font-medium text-gray-600">Delivery Date</label>
                <p className="text-lg">{purchaseOrder.deliveryDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Work Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-600">Work Description</label>
            </div>
            <p className="text-gray-800 leading-relaxed">{purchaseOrder.workDescription}</p>
          </div>

          {/* Job Scope */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-3 block">Job Scope</label>
            <div className="flex flex-wrap gap-2">
              {purchaseOrder.jobScope.map((scope, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {scope}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrderDetail;

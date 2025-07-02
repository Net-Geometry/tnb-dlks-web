
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  FileText,
  Download,
  Printer,
  Edit,
  CheckCircle,
  Building,
  Calendar,
  AlertTriangle,
  ClipboardList,
  Shield,
  Clock,
  Camera,
  Package,
  Users,
  Phone
} from 'lucide-react';
import { AMKSections } from './detail-sections/AMKSections';
import { AKKSections } from './detail-sections/AKKSections';

interface WorkOrderDetailProps {
  documentId: string;
  documentType: 'AMK' | 'AKK';
  onBack: () => void;
}

const WorkOrderDetail: React.FC<WorkOrderDetailProps> = ({ 
  documentId, 
  documentType, 
  onBack 
}) => {
  // Mock data - in real app this would come from API
  const mockAMKData = {
    id: "AMK-2024-001",
    status: "In Progress",
    instructionTo: "PowerTech Solutions Sdn Bhd",
    date: "15/01/2024",
    workLocation: "Jalan Ampang, KL - Substation Alpha Upgrade",
    projectNo: "TNB-2024-PROJECT-001",
    workCode: "SUB-UPGRADE-001",
    purchaseOrderNo: "PO-2024-001",
    workTypes: {
      undergroundCable: true,
      poleConduit: false,
      supplyConduit: true,
      substationWork: true,
      directConnection: false,
      hddWork: false,
      utilityMapping: false,
      millingPaving: false,
      transportation: true,
      others: "Transformer testing and commissioning"
    },
    preStartChecklist: {
      workPlan: true,
      workEquipment: true,
      safetyEquipment: true,
      compliance: false
    },
    workStartDate: "20/01/2024",
    proposedCompletionDate: "15/03/2024",
    signatures: {
      projectSupervisor: {
        name: "Ahmad bin Hassan",
        staffNo: "TNB001234",
        position: "Project Supervisor"
      },
      epi: {
        name: "Siti Aminah binti Rahman",
        staffNo: "TNB005678",
        position: "EPI Engineer"
      }
    }
  };

  const mockAKKData = {
    id: "AKK-2024-001",
    status: "Critical",
    tcsComplaintNo: "TCS-2024-EMRG-001",
    issueDatetime: "08/01/2024 - 14:30",
    contractorName: "Emergency Power Solutions Sdn Bhd",
    contractorAddress: "No. 123, Jalan Industri 5/2",
    postcode: "40000",
    city: "Shah Alam",
    state: "Selangor",
    phoneNo: "03-5521-1234",
    workType: "Emergency Power Restoration",
    workLocation: "Bukit Bintang, KL - Commercial District",
    generalInstruction: "Immediate restoration of power supply to critical commercial area. Priority repair of damaged transformer and associated equipment. Ensure safety protocols are followed due to high pedestrian traffic in the area.",
    issuedBy: {
      apName: "Encik Mohd Farid bin Ahmad",
      staffNo: "TNB009876"
    }
  };

  const data = documentType === 'AMK' ? mockAMKData : mockAKKData;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // PDF download logic would go here
    console.log('Downloading PDF...');
  };

  const handleEdit = () => {
    // Edit logic would go here
    console.log('Opening edit mode...');
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full print:bg-white">
      {/* Header - Hidden in print */}
      <div className="bg-purple-700 text-white px-6 py-6 print:hidden">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="text-white border-white hover:bg-white hover:text-purple-700 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{data.id}</h1>
              <p className="text-purple-100">
                {documentType === 'AMK' ? 'Work Commencement Instruction' : 'Emergency Work Instruction'} Details
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(data.status)}`}>
              {data.status}
            </Badge>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="text-white border-white hover:bg-white hover:text-purple-700 bg-transparent"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadPDF}
                className="text-white border-white hover:bg-white hover:text-purple-700 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEdit}
                className="text-white border-white hover:bg-white hover:text-purple-700 bg-transparent"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Header - Only visible in print */}
      <div className="hidden print:block print:mb-6">
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{data.id}</h1>
          <p className="text-lg text-gray-700">
            {documentType === 'AMK' ? 'Work Commencement Instruction' : 'Emergency Work Instruction'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Status: {data.status} | Generated on: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8 print:px-8 print:py-0 space-y-8">
        {documentType === 'AMK' ? (
          <AMKSections data={mockAMKData} />
        ) : (
          <AKKSections data={mockAKKData} />
        )}
      </div>
    </div>
  );
};

export default WorkOrderDetail;

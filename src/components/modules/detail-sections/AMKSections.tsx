import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Calendar, AlertTriangle, Shield, Camera, Package, Users, ClipboardList } from 'lucide-react';
interface AMKData {
  id: string;
  status: string;
  instructionTo: string;
  date: string;
  workLocation: string;
  projectNo: string;
  workCode: string;
  purchaseOrderNo: string;
  workTypes: {
    undergroundCable: boolean;
    poleConduit: boolean;
    supplyConduit: boolean;
    substationWork: boolean;
    directConnection: boolean;
    hddWork: boolean;
    utilityMapping: boolean;
    millingPaving: boolean;
    transportation: boolean;
    others: string;
  };
  preStartChecklist: {
    workPlan: boolean;
    workEquipment: boolean;
    safetyEquipment: boolean;
    compliance: boolean;
  };
  workStartDate: string;
  proposedCompletionDate: string;
  signatures: {
    projectSupervisor: {
      name: string;
      staffNo: string;
      position: string;
    };
    epi: {
      name: string;
      staffNo: string;
      position: string;
    };
  };
}
interface AMKSectionsProps {
  data: AMKData;
}
export const AMKSections: React.FC<AMKSectionsProps> = ({
  data
}) => {
  const getSelectedWorkTypes = () => {
    const workTypeLabels = {
      undergroundCable: 'Underground Cable Work',
      poleConduit: 'Cable Laying / Pole Installation',
      supplyConduit: 'Power Supply / Footpath Supply',
      substationWork: 'Substation Installation / Dismantling',
      directConnection: 'Direct Connection and Termination',
      hddWork: 'HDD Work',
      utilityMapping: 'Utility Mapping',
      millingPaving: 'Milling and Paving',
      transportation: 'Lifting and Crane Work'
    };
    const selected = [];
    Object.entries(data.workTypes).forEach(([key, value]) => {
      if (key !== 'others' && value) {
        selected.push(workTypeLabels[key as keyof typeof workTypeLabels]);
      }
    });
    if (data.workTypes.others) {
      selected.push(`Others: ${data.workTypes.others}`);
    }
    return selected;
  };
  const getChecklistItems = () => {
    const checklistLabels = {
      workPlan: 'Prepare work plan',
      workEquipment: 'Ensure sufficient equipment and usage',
      safetyEquipment: 'Ensure sufficient safety equipment and usage',
      compliance: 'Comply with TNB Work Regulations'
    };
    return Object.entries(data.preStartChecklist).map(([key, value]) => ({
      label: checklistLabels[key as keyof typeof checklistLabels],
      checked: value
    }));
  };
  return <div className="space-y-6">
      {/* Section 1: Work Order Information */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            1. Work Order Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">To</label>
              <p className="text-gray-900 font-medium">{data.instructionTo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Worksite Information</label>
              <p className="text-gray-900 font-medium">Main Electrical Distribution Project</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Work Location</label>
              <p className="text-gray-900 font-medium">{data.workLocation}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Project Number / User Connection Number</label>
              <p className="text-gray-900 font-medium">{data.projectNo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Work Code</label>
              <p className="text-gray-900 font-medium">{data.workCode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Purchase Order Number</label>
              <p className="text-gray-900 font-medium">{data.purchaseOrderNo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Work Type Selection */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            2. Work Type Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getSelectedWorkTypes().map((workType, index) => <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-900">{workType}</span>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Pre-Work Checklist */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            3. Pre-Work Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getChecklistItems().map((item, index) => <div key={index} className="flex items-center gap-2">
                {item.checked ? <CheckCircle className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>}
                <span className={`${item.checked ? 'text-gray-900' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Safety Instructions */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            4. Safety Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 print:bg-gray-50">
            <p className="text-sm text-gray-700">
              It is essential that all safety procedures and regulations are followed at all times while working on-site. 
              This includes personal protective equipment (PPE) and other regulations stipulated by local authorities. 
              You are also responsible for addressing all complaints and claims from local authorities (PBT) and the 
              public while working on-site.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Work Duration */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            5. Work Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Start Date</label>
              <p className="text-gray-900 font-medium">{data.workStartDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Estimated Completion Date</label>
              <p className="text-gray-900 font-medium">{data.proposedCompletionDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Plan Submission */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            6. Plan Submission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 print:bg-gray-50">
            <p className="text-sm text-gray-700 font-medium mb-2">
              The following documents are required within 7 days of task completion:
            </p>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              <li>As-built drawings HT and LV</li>
              <li>Earthing test result (if applicable)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Before and After Work Images */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            7. Before and After Work Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
            <p className="text-sm text-gray-700">
              Please provide images before and after the work is done.
            </p>
            
          </div>
        </CardContent>
      </Card>

      {/* Section 8: Credit and Scrap Period */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <Package className="w-5 h-5" />
            8. Credit and Scrap Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 print:bg-gray-50">
            <p className="text-sm text-gray-700">
              It is TNB's policy that all items must be credited and scrapped within 7 days from the completion date.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 9: Work Instruction Signatures */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            9. Work Instruction Signatures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Project Supervisor</label>
              <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="font-medium text-gray-900">{data.signatures.projectSupervisor.name}</p>
                <p className="text-sm text-gray-600">Staff No: {data.signatures.projectSupervisor.staffNo}</p>
                <p className="text-sm text-gray-600">{data.signatures.projectSupervisor.position}</p>
                <div className="mt-2 h-12 border-t border-gray-300 flex items-end justify-center">
                  <span className="text-xs text-gray-500">Signature</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">EPI</label>
              <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="font-medium text-gray-900">{data.signatures.epi.name}</p>
                <p className="text-sm text-gray-600">Staff No: {data.signatures.epi.staffNo}</p>
                <p className="text-sm text-gray-600">{data.signatures.epi.position}</p>
                <div className="mt-2 h-12 border-t border-gray-300 flex items-end justify-center">
                  <span className="text-xs text-gray-500">Signature</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 10: Work Acknowledgement */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            10. Work Acknowledgement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Contractor / Team Leader Name</label>
                <p className="text-gray-900 font-medium">To be filled by contractor</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Employee Number</label>
                <p className="text-gray-900 font-medium">To be filled by contractor</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Position</label>
                <p className="text-gray-900 font-medium">To be filled by contractor</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Contractor Signature</label>
              <div className="mt-2 w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-end justify-center pb-2">
                <span className="text-xs text-gray-500">Contractor Signature</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
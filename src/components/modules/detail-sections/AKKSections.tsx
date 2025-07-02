
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  FileText, 
  Building,
  Phone,
  Users
} from 'lucide-react';

interface AKKData {
  id: string;
  status: string;
  tcsComplaintNo: string;
  issueDatetime: string;
  contractorName: string;
  contractorAddress: string;
  postcode: string;
  city: string;
  state: string;
  phoneNo: string;
  workType: string;
  workLocation: string;
  generalInstruction: string;
  issuedBy: {
    apName: string;
    staffNo: string;
  };
}

interface AKKSectionsProps {
  data: AKKData;
}

export const AKKSections: React.FC<AKKSectionsProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Section 1: Emergency Instruction Header */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-red-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            1. Emergency Instruction Header
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Emergency Instruction Number (AKK NO)</label>
              <p className="text-gray-900 font-medium">{data.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Complaint Number (NO ADUAN TCS)</label>
              <p className="text-gray-900 font-medium">{data.tcsComplaintNo}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Date Issued (TARIKH DIKELUARKAN)</label>
              <p className="text-gray-900 font-medium">{data.issueDatetime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Contractor Details */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-red-900 flex items-center gap-2">
            <Building className="w-5 h-5" />
            2. Contractor Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Contractor Name (NAMA KONTRAKTOR)</label>
            <p className="text-gray-900 font-medium">{data.contractorName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Contractor Address (ALAMAT KONTRAKTOR)</label>
            <p className="text-gray-900 font-medium whitespace-pre-line">{data.contractorAddress}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Postal Code (POSKOD)</label>
              <p className="text-gray-900 font-medium">{data.postcode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">City / District (BANDAR / DAERAH)</label>
              <p className="text-gray-900 font-medium">{data.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">State (NEGERI)</label>
              <p className="text-gray-900 font-medium">{data.state}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Phone Number (NO TELEFON)</label>
            <p className="text-gray-900 font-medium flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {data.phoneNo}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Work Details */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-red-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            3. Work Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Work Type (JENIS KERJA)</label>
            <p className="text-gray-900 font-medium">{data.workType}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Work Location (LOKASI KERJA)</label>
            <p className="text-gray-900 font-medium">{data.workLocation}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">General Instructions (ARAHAN AM)</label>
            <p className="text-gray-900 font-medium whitespace-pre-line">{data.generalInstruction}</p>
          </div>
          
          {/* Static Instruction Text */}
          <div className="bg-red-50 border-l-4 border-red-400 p-4 print:bg-gray-50">
            <p className="text-sm text-gray-700">
              Please carry out the work as detailed below according to the specifications and pricing set in the TNB contract or schedule.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Issued By */}
      <Card className="print:shadow-none print:border-2 print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-xl text-red-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            4. Issued By
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Issuer's Name (NAMA AP)</label>
              <p className="text-gray-900 font-medium">{data.issuedBy.apName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Employee Number (NO PEKERJA)</label>
              <p className="text-gray-900 font-medium">{data.issuedBy.staffNo}</p>
            </div>
          </div>
          
          {/* Static Note */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 print:bg-gray-50">
            <p className="text-sm text-gray-700 font-medium">
              Note: This work instruction must be accompanied by the original bill for payment claims. 
              This is a computer-generated document, no signature is required.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

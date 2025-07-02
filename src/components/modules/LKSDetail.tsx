
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar, 
  MapPin, 
  User, 
  Building, 
  DollarSign,
  CheckCircle,
  Clock,
  Edit,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
  MessageSquare,
  Eye
} from 'lucide-react';

interface LKSDetail {
  id: string;
  title: string;
  poNumber: string;
  projectName: string;
  contractor: string;
  location: string;
  jobScope: string[];
  preparedBy: string;
  status: 'Draft' | 'Submitted' | 'Reviewed' | 'Approved' | 'Reupdate';
  submittedDate: string;
  totalAmount: string;
  workItems: number;
  comments: string;
  documents: {
    [key: string]: {
      uploaded: boolean;
      verified: boolean;
      fileName?: string;
    };
  };
  images: {
    before: { count: number; thumbnails: string[]; validated: boolean };
    during: { count: number; thumbnails: string[]; validated: boolean };
    after: { count: number; thumbnails: string[]; validated: boolean };
  };
}

// Mock data for demonstration
const mockLKSData: { [key: string]: LKSDetail } = {
  "LKS-2024-001": {
    id: "LKS-2024-001",
    title: "Substation Maintenance - Shah Alam",
    poNumber: "PO-2024-001",
    projectName: "Shah Alam Electrical Upgrade",
    contractor: "KKB Contractor Sdn Bhd",
    location: "Shah Alam, Selangor",
    jobScope: ["Pencawang", "Protection", "SCADA"],
    preparedBy: "Ahmad Rahman",
    status: "Approved",
    submittedDate: "2024-01-15",
    totalAmount: "RM 45,000",
    workItems: 5,
    comments: "All requirements met successfully. Excellent work quality and documentation.",
    documents: {
      "Arahan Mula Kerja (AMK)/AKK": { uploaded: true, verified: true, fileName: "amk_001.pdf" },
      "As Built Drawing": { uploaded: true, verified: true, fileName: "as_built_001.pdf" },
      "HDD Profile": { uploaded: true, verified: true, fileName: "hdd_profile_001.pdf" },
      "Data Asset": { uploaded: true, verified: true, fileName: "data_asset_001.xlsx" },
      "Testing Report": { uploaded: true, verified: true, fileName: "testing_report_001.pdf" },
      "Gambar Sebelum, Semasa, Selepas": { uploaded: true, verified: true }
    },
    images: {
      before: { count: 2, thumbnails: ["thumb1.jpg", "thumb2.jpg"], validated: true },
      during: { count: 1, thumbnails: ["thumb3.jpg"], validated: true },
      after: { count: 2, thumbnails: ["thumb4.jpg", "thumb5.jpg"], validated: true }
    }
  }
};

// Document requirements matrix based on job scope
const documentMatrix: { [key: string]: string[] } = {
  "Civil": [
    "Arahan Mula Kerja (AMK)/AKK",
    "Joint Measurement Sheet (JMS)",
    "Jadual Imbangan Penggunaan Barang",
    "As Built Drawing",
    "GI Slip (Credit or Scrap)",
    "Delivery Slip",
    "Gambar Sebelum, Semasa, Selepas"
  ],
  "Pencawang": [
    "Arahan Mula Kerja (AMK)/AKK",
    "As Built Drawing",
    "Testing Report",
    "Gambar Sebelum, Semasa, Selepas"
  ],
  "HDD": [
    "Arahan Mula Kerja (AMK)/AKK",
    "HDD Profile",
    "As Built Drawing",
    "Testing Report",
    "Gambar Sebelum, Semasa, Selepas"
  ],
  "Protection": [
    "Arahan Mula Kerja (AMK)/AKK",
    "Testing Report",
    "Configuration File",
    "As Built Drawing",
    "Gambar Sebelum, Semasa, Selepas"
  ],
  "SCADA": [
    "Arahan Mula Kerja (AMK)/AKK",
    "Data Asset",
    "Testing Report",
    "Configuration File",
    "Gambar Sebelum, Semasa, Selepas"
  ],
  "Metering AMI": [
    "Arahan Mula Kerja (AMK)/AKK",
    "Testing Report",
    "Data Asset",
    "Installation Certificate",
    "Gambar Sebelum, Semasa, Selepas"
  ]
};

const LKSDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const lksData = id ? mockLKSData[id] : null;

  if (!lksData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">LKS Not Found</h2>
            <p className="text-gray-600 mb-4">The requested LKS submission could not be found.</p>
            <Button onClick={() => navigate('/dashboard/lks-status')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to LKS Status
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Reupdate':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Reviewed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Submitted':
        return <Clock className="w-4 h-4" />;
      case 'Draft':
        return <Edit className="w-4 h-4" />;
      case 'Reupdate':
        return <RefreshCw className="w-4 h-4" />;
      case 'Reviewed':
        return <Eye className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getRequiredDocuments = () => {
    const allDocs = new Set<string>();
    lksData.jobScope.forEach(scope => {
      const docs = documentMatrix[scope] || [];
      docs.forEach(doc => allDocs.add(doc));
    });
    return Array.from(allDocs);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    // Simulate PDF export
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    // In real implementation, trigger PDF download
    console.log('Exporting LKS PDF for:', lksData.id);
  };

  const requiredDocuments = getRequiredDocuments();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/lks-status')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to LKS Status
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">
              LKS Submission Detail
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className={`${getStatusColor(lksData.status)} flex items-center gap-1 px-3 py-1 text-sm font-medium border`}>
                {getStatusIcon(lksData.status)}
                {lksData.status}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="font-medium">{lksData.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">PO: {lksData.poNumber}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Project Name</p>
                <p className="text-gray-900">{lksData.projectName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Project Location
                </p>
                <p className="text-gray-900">{lksData.location}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Contractor Name</p>
                <p className="text-gray-900">{lksData.contractor}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Date
                </p>
                <p className="text-gray-900">{lksData.submittedDate}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Prepared By
                </p>
                <p className="text-gray-900">{lksData.preparedBy}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Work Items</p>
                <p className="text-gray-900 font-semibold">{lksData.workItems}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Job Scope</p>
                <div className="flex flex-wrap gap-1">
                  {lksData.jobScope.map((scope) => (
                    <Badge key={scope} variant="outline" className="text-xs">
                      {scope}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-600 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">{lksData.totalAmount}</p>
            </div>
          </CardContent>
        </Card>

        {/* Documents Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Required Documents
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Based on job scope: {lksData.jobScope.join(', ')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Required Document</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification Status</TableHead>
                    <TableHead>File Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requiredDocuments.map((docName) => {
                    const doc = lksData.documents[docName];
                    return (
                      <TableRow key={docName}>
                        <TableCell className="font-medium">{docName}</TableCell>
                        <TableCell>
                          <Badge variant={doc?.uploaded ? "default" : "outline"} className="text-xs">
                            {doc?.uploaded ? "Uploaded" : "Missing"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {doc?.verified ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={doc?.verified ? "text-green-700" : "text-red-700"}>
                              {doc?.verified ? "Valid" : "Invalid"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {doc?.fileName || "—"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Images Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-orange-600 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Image Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(lksData.images).map(([type, data]) => (
                <div key={type} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 capitalize">{type} Work Images</h4>
                    <Badge variant={data.validated ? "default" : "outline"} className="text-xs">
                      {data.validated ? "Validated" : "Pending"}
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-900">{data.count} Images</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Status: {data.count > 0 ? "Uploaded" : "Missing"}
                    </p>
                  </div>
                  
                  {data.count > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {data.thumbnails.slice(0, 4).map((thumb, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded border text-xs flex items-center justify-center text-gray-500">
                          IMG {index + 1}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        {lksData.comments && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comments & Remarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Supervisor Comments:</p>
                    <p className="text-blue-800">{lksData.comments}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LKSDetail;

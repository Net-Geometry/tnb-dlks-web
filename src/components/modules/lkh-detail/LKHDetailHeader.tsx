
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Edit, CheckCircle, Clock, Eye, RefreshCw, FileText, User } from 'lucide-react';

interface LKHDetailHeaderProps {
  lkhData: {
    id: string;
    poNumber: string;
    status: string;
  };
  user: any;
  canEdit: boolean;
  canApprove: boolean;
}

const LKHDetailHeader: React.FC<LKHDetailHeaderProps> = ({ lkhData, user, canEdit, canApprove }) => {
  const navigate = useNavigate();

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

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">
            LKH Submission Detail
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Badge className={`${getStatusColor(lkhData.status)} flex items-center gap-1 px-3 py-1 text-sm font-medium border`}>
              {getStatusIcon(lkhData.status)}
              {lkhData.status}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span className="font-medium">{lkhData.id}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">PO: {lkhData.poNumber}</span>
            </div>
            {user && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>Viewing as: {user.role}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            
            {canEdit && lkhData.status !== 'Approved' && (
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit LKH
              </Button>
            )}
            
            {canApprove && lkhData.status === 'Submitted' && (
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LKHDetailHeader;

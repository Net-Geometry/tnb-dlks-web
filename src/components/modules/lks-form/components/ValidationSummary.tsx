
import React from 'react';
import { Camera, CheckCircle, XCircle } from 'lucide-react';

interface LocationImage {
  file: File | null;
  timestamp: string;
  gps?: string;
  isValidated?: boolean;
  imageUrl?: string;
}

interface ValidationSummaryProps {
  lkhImages: {
    beforeWork: LocationImage;
    duringWork: LocationImage;
    afterWork: LocationImage;
  };
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({ lkhImages }) => {
  const validatedCount = Object.values(lkhImages).filter(img => img.isValidated).length;
  const notValidatedCount = Object.values(lkhImages).filter(img => !img.isValidated).length;
  const totalCount = Object.values(lkhImages).filter(img => img.imageUrl).length;

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-center gap-2 text-green-700">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Validated Images</span>
        </div>
        <div className="text-2xl font-bold text-green-800 mt-1">
          {validatedCount}
        </div>
      </div>
      
      <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center justify-center gap-2 text-red-700">
          <XCircle className="w-4 h-4" />
          <span className="font-medium">Not Validated</span>
        </div>
        <div className="text-2xl font-bold text-red-800 mt-1">
          {notValidatedCount}
        </div>
      </div>
      
      <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-center gap-2 text-gray-700">
          <Camera className="w-4 h-4" />
          <span className="font-medium">Total Images</span>
        </div>
        <div className="text-2xl font-bold text-gray-800 mt-1">
          {totalCount}
        </div>
      </div>
    </div>
  );
};

export default ValidationSummary;

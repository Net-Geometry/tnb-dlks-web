
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, CheckCircle, AlertCircle } from 'lucide-react';

interface SignatureSectionProps {
  signature: {
    fullName: string;
    position: string;
    date: string;
    remarks: string;
    signed: boolean;
  };
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ signature }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-indigo-600 flex items-center gap-2">
          <PenTool className="w-5 h-5" />
          Signature & Submission
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Full Name</p>
            <p className="text-gray-900">{signature.fullName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Position</p>
            <p className="text-gray-900">{signature.position}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Date</p>
            <p className="text-gray-900">{signature.date}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Signature Status</p>
            <div className="flex items-center gap-2">
              {signature.signed ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className={signature.signed ? "text-green-700" : "text-red-700"}>
                {signature.signed ? "Signed" : "Not Signed"}
              </span>
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className="text-sm font-medium text-gray-700">Remarks</p>
            <p className="text-gray-900">{signature.remarks}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureSection;

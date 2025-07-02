
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle } from 'lucide-react';

interface SafetyDeclarationSectionProps {
  safetyDeclaration: {
    csqa: boolean;
    hirac: boolean;
  };
}

const SafetyDeclarationSection: React.FC<SafetyDeclarationSectionProps> = ({ safetyDeclaration }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-red-600 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Safety & Quality Declaration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              safetyDeclaration.csqa ? 'bg-green-100 border-green-500' : 'border-gray-300'
            }`}>
              {safetyDeclaration.csqa && <CheckCircle className="w-3 h-3 text-green-600" />}
            </div>
            <div>
              <p className="font-medium text-gray-900">CSQA (Customer Service Quality Assurance)</p>
              <p className="text-sm text-gray-600">
                {safetyDeclaration.csqa ? 'Confirmed' : 'Not Confirmed'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              safetyDeclaration.hirac ? 'bg-green-100 border-green-500' : 'border-gray-300'
            }`}>
              {safetyDeclaration.hirac && <CheckCircle className="w-3 h-3 text-green-600" />}
            </div>
            <div>
              <p className="font-medium text-gray-900">HIRAC (Hazard Identification Risk Assessment Control)</p>
              <p className="text-sm text-gray-600">
                {safetyDeclaration.hirac ? 'Confirmed' : 'Not Confirmed'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyDeclarationSection;

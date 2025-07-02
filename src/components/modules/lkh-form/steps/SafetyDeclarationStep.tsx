
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle, Shield, Edit } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SafetyDeclarationData {
  csqa: boolean;
  hirac: boolean;
}

interface SafetyDeclarationStepProps {
  data: SafetyDeclarationData;
  onChange: (data: Partial<SafetyDeclarationData>) => void;
}

const SafetyDeclarationStep: React.FC<SafetyDeclarationStepProps> = ({ data, onChange }) => {
  const handleCheckboxChange = (field: keyof SafetyDeclarationData, checked: boolean) => {
    onChange({ [field]: checked });
  };

  const handleEditDeclaration = () => {
    // Toggle both checkbox states
    const newCsqaState = !data.csqa;
    const newHiracState = !data.hirac;
    
    onChange({ 
      csqa: newCsqaState,
      hirac: newHiracState 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-600">
                Safety & Quality Declaration
              </CardTitle>
            </div>
          </div>
          <Button 
            variant="link" 
            onClick={handleEditDeclaration}
            className="text-blue-600 hover:text-blue-700 p-0 h-auto"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit Declaration
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* CSQA Checkbox */}
            <div className={cn(
              "flex items-center justify-between p-4 rounded-lg border transition-colors",
              data.csqa 
                ? "border-green-200 bg-green-50" 
                : "border-gray-200 bg-white hover:bg-gray-50"
            )}>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="csqa-checkbox"
                  checked={data.csqa}
                  onCheckedChange={(checked) => handleCheckboxChange('csqa', checked as boolean)}
                />
                <label 
                  htmlFor="csqa-checkbox"
                  className="text-sm font-medium cursor-pointer"
                >
                  CSQA (Compliance to Safety & Quality Assurance)
                </label>
              </div>
              <div className="flex items-center">
                {data.csqa ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>

            {/* HIRAC Checkbox */}
            <div className={cn(
              "flex items-center justify-between p-4 rounded-lg border transition-colors",
              data.hirac 
                ? "border-green-200 bg-green-50" 
                : "border-gray-200 bg-white hover:bg-gray-50"
            )}>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hirac-checkbox"
                  checked={data.hirac}
                  onCheckedChange={(checked) => handleCheckboxChange('hirac', checked as boolean)}
                />
                <label 
                  htmlFor="hirac-checkbox"
                  className="text-sm font-medium cursor-pointer"
                >
                  HIRAC (Hazard Identification, Risk Assessment & Control)
                </label>
              </div>
              <div className="flex items-center">
                {data.hirac ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
          </div>

          {/* Declaration Statement */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Declaration Statement</h4>
                <p className="text-sm text-blue-700">
                  By checking these items, I declare that all safety protocols and quality standards 
                  have been followed during the execution of this work. I understand that false 
                  declarations may result in disciplinary action.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Completed: {(data.csqa ? 1 : 0) + (data.hirac ? 1 : 0)} / 2 items
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyDeclarationStep;

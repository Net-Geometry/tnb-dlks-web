
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Calendar, MapPin, User, X, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProjectInfoData {
  poNumber: string;
  projectName: string;
  contractorName: string;
  workLocation: string;
  jobScopes: string[];
  preparedBy: string;
  date: string;
}

interface ProjectInformationStepProps {
  data: ProjectInfoData;
  onChange: (data: Partial<ProjectInfoData>) => void;
}

interface POData {
  projectName: string;
  contractorName: string;
  workLocation: string;
  jobScopes: string[];
}

const jobScopeOptions = [
  'Pencawang',
  'Civil',
  'Mill & Pave',
  'HDD',
  'Jointing',
  'Pengujian',
  'Umap',
  'Street Lighting',
  'Metering AMI',
  'Metering DO',
  'SCADA',
  'Protection',
  'Rehab',
  'Turnkey'
];

// Mock function to simulate PO data fetching
const fetchPOData = async (poNumber: string): Promise<POData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock data for demonstration
  const mockPOData: { [key: string]: POData } = {
    'PO-2024-001': {
      projectName: 'Substation Upgrade - Kuala Lumpur Central',
      contractorName: 'ABC Engineering Sdn Bhd',
      workLocation: 'Jalan Raja Laut, Kuala Lumpur',
      jobScopes: ['Pencawang', 'Protection', 'SCADA']
    },
    'PO-2024-002': {
      projectName: 'Distribution Network Enhancement - Selangor',
      contractorName: 'XYZ Construction Sdn Bhd',
      workLocation: 'Shah Alam, Selangor',
      jobScopes: ['Civil', 'Street Lighting', 'Metering AMI']
    },
    'PO-2024-003': {
      projectName: 'Cable Installation Project - Penang',
      contractorName: 'Cable Pro Sdn Bhd',
      workLocation: 'Georgetown, Penang',
      jobScopes: ['HDD', 'Jointing', 'Pengujian']
    }
  };
  
  return mockPOData[poNumber] || null;
};

const ProjectInformationStep: React.FC<ProjectInformationStepProps> = ({ data, onChange }) => {
  const [isLoadingPO, setIsLoadingPO] = useState(false);
  const [poError, setPOError] = useState<string | null>(null);
  const [poValidated, setPOValidated] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const handleJobScopeAdd = (scope: string) => {
    if (!data.jobScopes.includes(scope)) {
      onChange({
        jobScopes: [...data.jobScopes, scope]
      });
    }
  };

  const handleJobScopeRemove = (scope: string) => {
    onChange({
      jobScopes: data.jobScopes.filter(s => s !== scope)
    });
  };

  const handlePONumberChange = async (poNumber: string) => {
    onChange({ poNumber });
    setPOError(null);
    setPOValidated(false);
    setIsAutoFilled(false);

    // Clear auto-filled fields when PO number changes
    if (poNumber !== data.poNumber) {
      onChange({
        projectName: '',
        contractorName: '',
        workLocation: '',
        jobScopes: []
      });
    }

    // Only fetch if PO number has meaningful content
    if (poNumber.trim().length >= 3) {
      setIsLoadingPO(true);
      
      try {
        const poData = await fetchPOData(poNumber.trim());
        
        if (poData) {
          // Auto-fill fields with PO data
          onChange({
            projectName: poData.projectName,
            contractorName: poData.contractorName,
            workLocation: poData.workLocation,
            jobScopes: poData.jobScopes
          });
          setPOValidated(true);
          setIsAutoFilled(true);
        } else {
          setPOError('Invalid PO Number. Please check and try again.');
        }
      } catch (error) {
        setPOError('Failed to validate PO Number. Please try again.');
      } finally {
        setIsLoadingPO(false);
      }
    }
  };

  // Reset states when component mounts or data changes externally
  useEffect(() => {
    if (!data.poNumber) {
      setPOValidated(false);
      setIsAutoFilled(false);
      setPOError(null);
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Project Information
          </CardTitle>
          <p className="text-sm text-gray-600">
            Enter the PO number to auto-populate project details and select applicable job scopes
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PO Number and Validation */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="poNumber">PO Number *</Label>
              <div className="relative">
                <Input
                  id="poNumber"
                  value={data.poNumber}
                  onChange={(e) => handlePONumberChange(e.target.value)}
                  placeholder="Enter PO Number (e.g., PO-2024-001)"
                  className="font-medium pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isLoadingPO && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                  {poValidated && !isLoadingPO && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {poError && !isLoadingPO && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
              </div>
            </div>

            {/* PO Validation Messages */}
            {poError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {poError}
                </AlertDescription>
              </Alert>
            )}

            {poValidated && !poError && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  PO Number validated successfully. Project details have been auto-populated.
                </AlertDescription>
              </Alert>
            )}

            {isLoadingPO && (
              <Alert className="border-blue-200 bg-blue-50">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                <AlertDescription className="text-blue-700">
                  Validating PO Number and fetching project details...
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Auto-populated Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="flex items-center gap-2">
                Project Name
                {isAutoFilled && <Badge variant="secondary" className="text-xs">Auto-filled</Badge>}
              </Label>
              <Input
                id="projectName"
                value={data.projectName}
                onChange={(e) => onChange({ projectName: e.target.value })}
                placeholder="Will be auto-populated from PO"
                className={isAutoFilled ? "bg-gray-50 text-gray-700" : ""}
                readOnly={isAutoFilled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractorName" className="flex items-center gap-2">
                Contractor Name
                {isAutoFilled && <Badge variant="secondary" className="text-xs">Auto-filled</Badge>}
              </Label>
              <Input
                id="contractorName"
                value={data.contractorName}
                onChange={(e) => onChange({ contractorName: e.target.value })}
                placeholder="Will be auto-populated from PO"
                className={isAutoFilled ? "bg-gray-50 text-gray-700" : ""}
                readOnly={isAutoFilled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workLocation" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Work Location
                {isAutoFilled && <Badge variant="secondary" className="text-xs">Auto-filled</Badge>}
              </Label>
              <Input
                id="workLocation"
                value={data.workLocation}
                onChange={(e) => onChange({ workLocation: e.target.value })}
                placeholder="Will be auto-populated from PO"
                className={isAutoFilled ? "bg-gray-50 text-gray-700" : ""}
                readOnly={isAutoFilled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preparedBy" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Prepared By *
              </Label>
              <Input
                id="preparedBy"
                value={data.preparedBy}
                onChange={(e) => onChange({ preparedBy: e.target.value })}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={data.date}
                onChange={(e) => onChange({ date: e.target.value })}
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Scope Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
            Job Scope Selection *
            {isAutoFilled && <Badge variant="secondary" className="text-xs">Auto-populated from PO</Badge>}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {isAutoFilled 
              ? "Job scopes have been auto-populated from the PO. You can modify them if needed."
              : "Select one or more job scopes that apply to this project"
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Scope Selector */}
          <div className="space-y-2">
            <Label>Add Job Scope</Label>
            <Select onValueChange={handleJobScopeAdd}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job scope to add" />
              </SelectTrigger>
              <SelectContent>
                {jobScopeOptions
                  .filter(scope => !data.jobScopes.includes(scope))
                  .map((scope) => (
                    <SelectItem key={scope} value={scope}>
                      {scope}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Job Scopes */}
          {data.jobScopes.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Job Scopes ({data.jobScopes.length})</Label>
              <div className="flex flex-wrap gap-2">
                {data.jobScopes.map((scope) => (
                  <Badge 
                    key={scope} 
                    variant={isAutoFilled ? "default" : "secondary"}
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {scope}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleJobScopeRemove(scope)}
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              {isAutoFilled && (
                <p className="text-xs text-gray-600">
                  These job scopes were auto-populated from the PO. Click the X to remove any that don't apply.
                </p>
              )}
            </div>
          )}

          {data.jobScopes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No job scopes selected</p>
              <p className="text-sm">
                {poValidated 
                  ? "This PO has no associated job scopes. Please add them manually."
                  : "Enter a valid PO number to auto-populate job scopes, or add them manually"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Required Fields Summary:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className={`flex items-center gap-2 ${data.poNumber ? 'text-green-700' : 'text-red-700'}`}>
            <span className={`w-2 h-2 rounded-full ${data.poNumber ? 'bg-green-500' : 'bg-red-500'}`}></span>
            PO Number {poValidated && <CheckCircle className="w-3 h-3 text-green-500" />}
          </div>
          <div className={`flex items-center gap-2 ${data.preparedBy ? 'text-green-700' : 'text-red-700'}`}>
            <span className={`w-2 h-2 rounded-full ${data.preparedBy ? 'bg-green-500' : 'bg-red-500'}`}></span>
            Prepared By
          </div>
          <div className={`flex items-center gap-2 ${data.jobScopes.length > 0 ? 'text-green-700' : 'text-red-700'}`}>
            <span className={`w-2 h-2 rounded-full ${data.jobScopes.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
            Job Scope(s) {data.jobScopes.length > 0 && `(${data.jobScopes.length})`}
          </div>
          <div className={`flex items-center gap-2 ${poValidated ? 'text-green-700' : 'text-orange-700'}`}>
            <span className={`w-2 h-2 rounded-full ${poValidated ? 'bg-green-500' : 'bg-orange-500'}`}></span>
            PO Validation {poValidated ? 'Complete' : 'Pending'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInformationStep;

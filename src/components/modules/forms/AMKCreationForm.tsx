
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AMKFormData {
  contractorName: string;
  contractorId: string;
  poNumber: string;
  jobScope: string[];
  proposedStartDate: string;
  proposedEndDate: string;
  actualStartDate: string;
  actualEndDate: string;
  tnbSupervisorStaffId: string;
  workLocation: string;
  workDescription: string;
}

interface FormErrors {
  contractorName?: string;
  contractorId?: string;
  poNumber?: string;
  jobScope?: string;
  proposedStartDate?: string;
  proposedEndDate?: string;
  tnbSupervisorStaffId?: string;
  workLocation?: string;
  workDescription?: string;
}

const jobScopeOptions = [
  'Pencawang',
  'Civil',
  'Mill & Pave',
  'HDD',
  'Jointing',
  'Pengujian',
  'UMAP',
  'Street Lighting',
  'Metering AMI',
  'Metering DO',
  'SCADA',
  'Protection',
  'Rehab',
  'Turn Key'
];

const contractors = [
  { id: 'CONT-001', name: 'PowerTech Solutions Sdn Bhd' },
  { id: 'CONT-002', name: 'ElectroServ Engineering Sdn Bhd' },
  { id: 'CONT-003', name: 'Grid Solutions Malaysia Sdn Bhd' },
  { id: 'CONT-004', name: 'Siemens Malaysia Sdn Bhd' },
  { id: 'CONT-005', name: 'Emergency Power Solutions Ltd' }
];

const AMKCreationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<AMKFormData>({
    contractorName: '',
    contractorId: '',
    poNumber: '',
    jobScope: [],
    proposedStartDate: '',
    proposedEndDate: '',
    actualStartDate: '',
    actualEndDate: '',
    tnbSupervisorStaffId: '',
    workLocation: '',
    workDescription: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.contractorName.trim()) {
      newErrors.contractorName = 'Contractor Name is required';
    }
    
    if (!formData.contractorId.trim()) {
      newErrors.contractorId = 'Contractor ID is required';
    }
    
    if (!formData.poNumber.trim()) {
      newErrors.poNumber = 'PO Number is required';
    }
    
    if (formData.jobScope.length === 0) {
      newErrors.jobScope = 'At least one Job Scope must be selected';
    }

    if (!formData.proposedStartDate) {
      newErrors.proposedStartDate = 'Proposed Start Date is required';
    }

    if (!formData.proposedEndDate) {
      newErrors.proposedEndDate = 'Proposed End Date is required';
    }

    if (!formData.tnbSupervisorStaffId.trim()) {
      newErrors.tnbSupervisorStaffId = 'TNB Supervisor Staff ID is required';
    }

    if (!formData.workLocation.trim()) {
      newErrors.workLocation = 'Work Location is required';
    }

    if (!formData.workDescription.trim()) {
      newErrors.workDescription = 'Work Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AMKFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleContractorChange = (contractorId: string) => {
    const selectedContractor = contractors.find(c => c.id === contractorId);
    setFormData(prev => ({
      ...prev,
      contractorId,
      contractorName: selectedContractor?.name || ''
    }));
    
    if (errors.contractorId || errors.contractorName) {
      setErrors(prev => ({
        ...prev,
        contractorId: undefined,
        contractorName: undefined
      }));
    }
  };

  const handleJobScopeChange = (scope: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      jobScope: checked 
        ? [...prev.jobScope, scope]
        : prev.jobScope.filter(s => s !== scope)
    }));
    
    if (errors.jobScope) {
      setErrors(prev => ({
        ...prev,
        jobScope: undefined
      }));
    }
  };

  const handleSendAMK = () => {
    if (validateForm()) {
      // Generate AMK ID
      const amkId = `AMK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      console.log('Creating AMK with data:', { 
        ...formData, 
        amkId, 
        status: 'Pending Acknowledgement', // Ensure correct initial status
        createdDate: new Date().toISOString(),
        processFlow: 'AMK Creation → Pending Acknowledgement → Acknowledged/Rejected → In Progress → Completed'
      });
      
      toast({
        title: "AMK Created Successfully",
        description: `${amkId} has been sent to ${formData.contractorName} for acknowledgement. Status: Pending Acknowledgement`,
      });
      
      navigate('/dashboard/amk-akk-management');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/amk-akk-management');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create AMK (Planned Work)</h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader className="border-b bg-purple-50">
          <CardTitle className="text-2xl font-bold text-purple-800">Work Commencement Instruction (AMK)</CardTitle>
          <p className="text-purple-600">Fill in the details for planned work instruction</p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contractor Selection */}
            <div className="md:col-span-2">
              <Label htmlFor="contractor" className="text-sm font-medium">
                Contractor <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={handleContractorChange} value={formData.contractorId}>
                <SelectTrigger className={errors.contractorId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a contractor" />
                </SelectTrigger>
                <SelectContent>
                  {contractors.map((contractor) => (
                    <SelectItem key={contractor.id} value={contractor.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{contractor.name}</span>
                        <span className="text-xs text-gray-500">{contractor.id}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.contractorId && (
                <p className="mt-1 text-sm text-red-500">{errors.contractorId}</p>
              )}
            </div>

            {/* PO Number */}
            <div>
              <Label htmlFor="poNumber" className="text-sm font-medium">
                PO Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="poNumber"
                value={formData.poNumber}
                onChange={(e) => handleInputChange('poNumber', e.target.value)}
                placeholder="e.g., PO-2024-001"
                className={errors.poNumber ? 'border-red-500' : ''}
              />
              {errors.poNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.poNumber}</p>
              )}
            </div>

            {/* TNB Supervisor Staff ID */}
            <div>
              <Label htmlFor="tnbSupervisorStaffId" className="text-sm font-medium">
                TNB Supervisor Staff ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tnbSupervisorStaffId"
                value={formData.tnbSupervisorStaffId}
                onChange={(e) => handleInputChange('tnbSupervisorStaffId', e.target.value)}
                placeholder="e.g., TNB001234"
                className={errors.tnbSupervisorStaffId ? 'border-red-500' : ''}
              />
              {errors.tnbSupervisorStaffId && (
                <p className="mt-1 text-sm text-red-500">{errors.tnbSupervisorStaffId}</p>
              )}
            </div>

            {/* Proposed Dates */}
            <div>
              <Label htmlFor="proposedStartDate" className="text-sm font-medium">
                Proposed Start Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="proposedStartDate"
                  type="date"
                  value={formData.proposedStartDate}
                  onChange={(e) => handleInputChange('proposedStartDate', e.target.value)}
                  className={`pl-10 ${errors.proposedStartDate ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.proposedStartDate && (
                <p className="mt-1 text-sm text-red-500">{errors.proposedStartDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="proposedEndDate" className="text-sm font-medium">
                Proposed End Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="proposedEndDate"
                  type="date"
                  value={formData.proposedEndDate}
                  onChange={(e) => handleInputChange('proposedEndDate', e.target.value)}
                  className={`pl-10 ${errors.proposedEndDate ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.proposedEndDate && (
                <p className="mt-1 text-sm text-red-500">{errors.proposedEndDate}</p>
              )}
            </div>

            {/* Actual Dates (Optional) */}
            <div>
              <Label htmlFor="actualStartDate" className="text-sm font-medium">
                Actual Start Date <span className="text-gray-400">(Optional)</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="actualStartDate"
                  type="date"
                  value={formData.actualStartDate}
                  onChange={(e) => handleInputChange('actualStartDate', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="actualEndDate" className="text-sm font-medium">
                Actual End Date <span className="text-gray-400">(Optional)</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="actualEndDate"
                  type="date"
                  value={formData.actualEndDate}
                  onChange={(e) => handleInputChange('actualEndDate', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Work Location */}
            <div className="md:col-span-2">
              <Label htmlFor="workLocation" className="text-sm font-medium">
                Work Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="workLocation"
                value={formData.workLocation}
                onChange={(e) => handleInputChange('workLocation', e.target.value)}
                placeholder="e.g., Jalan Ampang, KL - Substation Alpha Upgrade"
                className={errors.workLocation ? 'border-red-500' : ''}
              />
              {errors.workLocation && (
                <p className="mt-1 text-sm text-red-500">{errors.workLocation}</p>
              )}
            </div>

            {/* Work Description */}
            <div className="md:col-span-2">
              <Label htmlFor="workDescription" className="text-sm font-medium">
                Work Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="workDescription"
                value={formData.workDescription}
                onChange={(e) => handleInputChange('workDescription', e.target.value)}
                placeholder="Describe the work to be performed..."
                className={errors.workDescription ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.workDescription && (
                <p className="mt-1 text-sm text-red-500">{errors.workDescription}</p>
              )}
            </div>

            {/* Job Scope */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium">
                Job Scope <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border border-gray-300 rounded-md bg-gray-50">
                {jobScopeOptions.map((scope) => (
                  <div key={scope} className="flex items-center space-x-2">
                    <Checkbox
                      id={scope}
                      checked={formData.jobScope.includes(scope)}
                      onCheckedChange={(checked) => handleJobScopeChange(scope, checked as boolean)}
                    />
                    <Label 
                      htmlFor={scope} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {scope}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.jobScope && (
                <p className="mt-1 text-sm text-red-500">{errors.jobScope}</p>
              )}
              {formData.jobScope.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Selected: {formData.jobScope.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendAMK}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Send AMK
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AMKCreationForm;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AKKFormData {
  contractorName: string;
  contractorId: string;
  contractorAddress: string;
  phoneNo: string;
  tcsNumber: string;
  jobScope: string[];
  workLocation: string;
  generalInstruction: string;
  tnbSupervisorStaffId: string;
  issuedBy: string;
}

interface FormErrors {
  contractorName?: string;
  contractorId?: string;
  contractorAddress?: string;
  phoneNo?: string;
  tcsNumber?: string;
  jobScope?: string;
  workLocation?: string;
  generalInstruction?: string;
  tnbSupervisorStaffId?: string;
  issuedBy?: string;
}

const emergencyJobScopes = [
  'Emergency Power Restoration',
  'Cable Fault Repair',
  'Transformer Repair',
  'Line Clearance',
  'Equipment Replacement',
  'Safety Isolation',
  'Street Light Repair',
  'Direct Connection',
  'Service Restoration',
  'Emergency Maintenance'
];

const contractors = [
  { id: 'CONT-001', name: 'PowerTech Solutions Sdn Bhd', address: 'No. 123, Jalan Teknologi, 47100 Puchong, Selangor', phone: '+60 3-8065 1234' },
  { id: 'CONT-002', name: 'ElectroServ Engineering Sdn Bhd', address: 'No. 456, Jalan Industri, 40000 Shah Alam, Selangor', phone: '+60 3-5521 5678' },
  { id: 'CONT-003', name: 'Emergency Power Solutions Ltd', address: 'No. 789, Jalan Perdana, 50460 Kuala Lumpur', phone: '+60 3-2161 9012' },
  { id: 'CONT-004', name: 'FastFix Electrical Services', address: 'No. 321, Jalan Ampang, 50450 Kuala Lumpur', phone: '+60 11-987 6543' },
  { id: 'CONT-005', name: 'Grid Solutions Malaysia Sdn Bhd', address: 'No. 654, Jalan Tun Razak, 50400 Kuala Lumpur', phone: '+60 3-2718 3456' }
];

const AKKCreationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<AKKFormData>({
    contractorName: '',
    contractorId: '',
    contractorAddress: '',
    phoneNo: '',
    tcsNumber: '',
    jobScope: [],
    workLocation: '',
    generalInstruction: '',
    tnbSupervisorStaffId: '',
    issuedBy: ''
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
    
    if (!formData.contractorAddress.trim()) {
      newErrors.contractorAddress = 'Contractor Address is required';
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone Number is required';
    }
    
    if (!formData.tcsNumber.trim()) {
      newErrors.tcsNumber = 'TCS Number is required';
    }
    
    if (formData.jobScope.length === 0) {
      newErrors.jobScope = 'At least one Job Scope must be selected';
    }

    if (!formData.workLocation.trim()) {
      newErrors.workLocation = 'Work Location is required';
    }

    if (!formData.generalInstruction.trim()) {
      newErrors.generalInstruction = 'General Instruction is required';
    }

    if (!formData.tnbSupervisorStaffId.trim()) {
      newErrors.tnbSupervisorStaffId = 'TNB Supervisor Staff ID is required';
    }

    if (!formData.issuedBy.trim()) {
      newErrors.issuedBy = 'Issued By is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AKKFormData, value: string) => {
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
      contractorName: selectedContractor?.name || '',
      contractorAddress: selectedContractor?.address || '',
      phoneNo: selectedContractor?.phone || ''
    }));
    
    if (errors.contractorId || errors.contractorName || errors.contractorAddress || errors.phoneNo) {
      setErrors(prev => ({
        ...prev,
        contractorId: undefined,
        contractorName: undefined,
        contractorAddress: undefined,
        phoneNo: undefined
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

  const handleSendAKK = () => {
    if (validateForm()) {
      // Generate AKK ID and current datetime
      const akkId = `AKK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      const issueDatetime = new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      console.log('Creating AKK with data:', { 
        ...formData, 
        akkId, 
        issueDatetime,
        status: 'Pending Acknowledgement', // Ensure correct initial status
        processFlow: 'AKK Creation → Pending Acknowledgement → Acknowledged → In Progress → Completed'
      });
      
      toast({
        title: "AKK Created Successfully",
        description: `${akkId} has been sent to ${formData.contractorName} for immediate acknowledgement. Status: Pending Acknowledgement`,
      });
      
      navigate('/amk-akk-management');
    }
  };

  const handleCancel = () => {
    navigate('/amk-akk-management');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Create AKK (Emergency Work)</h1>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader className="border-b bg-red-50">
          <CardTitle className="text-2xl font-bold text-red-800 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Emergency Work Instruction (AKK)
          </CardTitle>
          <p className="text-red-600">Urgent work instruction requiring immediate attention</p>
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
                        <span className="text-xs text-gray-500">{contractor.phone}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.contractorId && (
                <p className="mt-1 text-sm text-red-500">{errors.contractorId}</p>
              )}
            </div>

            {/* Contractor Address */}
            <div className="md:col-span-2">
              <Label htmlFor="contractorAddress" className="text-sm font-medium">
                Contractor Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contractorAddress"
                value={formData.contractorAddress}
                onChange={(e) => handleInputChange('contractorAddress', e.target.value)}
                placeholder="Contractor address"
                className={errors.contractorAddress ? 'border-red-500' : ''}
                readOnly={!!formData.contractorId}
              />
              {errors.contractorAddress && (
                <p className="mt-1 text-sm text-red-500">{errors.contractorAddress}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phoneNo" className="text-sm font-medium">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNo"
                value={formData.phoneNo}
                onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                placeholder="e.g., +60 3-1234 5678"
                className={errors.phoneNo ? 'border-red-500' : ''}
                readOnly={!!formData.contractorId}
              />
              {errors.phoneNo && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNo}</p>
              )}
            </div>

            {/* TCS Number */}
            <div>
              <Label htmlFor="tcsNumber" className="text-sm font-medium">
                TCS Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tcsNumber"
                value={formData.tcsNumber}
                onChange={(e) => handleInputChange('tcsNumber', e.target.value)}
                placeholder="e.g., TCS-2024-EMRG-001"
                className={errors.tcsNumber ? 'border-red-500' : ''}
              />
              {errors.tcsNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.tcsNumber}</p>
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

            {/* Issued By */}
            <div>
              <Label htmlFor="issuedBy" className="text-sm font-medium">
                Issued By <span className="text-red-500">*</span>
              </Label>
              <Input
                id="issuedBy"
                value={formData.issuedBy}
                onChange={(e) => handleInputChange('issuedBy', e.target.value)}
                placeholder="e.g., Encik Ahmad bin Hassan"
                className={errors.issuedBy ? 'border-red-500' : ''}
              />
              {errors.issuedBy && (
                <p className="mt-1 text-sm text-red-500">{errors.issuedBy}</p>
              )}
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
                placeholder="e.g., Bukit Bintang, KL - Commercial District"
                className={errors.workLocation ? 'border-red-500' : ''}
              />
              {errors.workLocation && (
                <p className="mt-1 text-sm text-red-500">{errors.workLocation}</p>
              )}
            </div>

            {/* General Instruction */}
            <div className="md:col-span-2">
              <Label htmlFor="generalInstruction" className="text-sm font-medium">
                General Instruction <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="generalInstruction"
                value={formData.generalInstruction}
                onChange={(e) => handleInputChange('generalInstruction', e.target.value)}
                placeholder="Provide detailed instructions for the emergency work..."
                className={errors.generalInstruction ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.generalInstruction && (
                <p className="mt-1 text-sm text-red-500">{errors.generalInstruction}</p>
              )}
            </div>

            {/* Job Scope */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium">
                Emergency Job Scope <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-red-300 rounded-md bg-red-50">
                {emergencyJobScopes.map((scope) => (
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
              onClick={handleSendAKK}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Send AKK (Emergency)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AKKCreationForm;

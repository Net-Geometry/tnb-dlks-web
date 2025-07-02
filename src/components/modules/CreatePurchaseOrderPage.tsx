
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FormData {
  poNumber: string;
  projectNo: string;
  contractorName: string;
  poAmount: string;
  workDescription: string;
  jobScope: string[];
  assignedTechnician: string;
}

interface FormErrors {
  poNumber?: string;
  projectNo?: string;
  contractorName?: string;
  poAmount?: string;
  workDescription?: string;
  jobScope?: string;
  assignedTechnician?: string;
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

const technicians = [
  { id: 'TECH-001', name: 'Ahmad Rahman', specialization: 'Electrical Operations' },
  { id: 'TECH-002', name: 'Kumar Selvam', specialization: 'Maintenance' },
  { id: 'TECH-003', name: 'Lim Wei Ming', specialization: 'Safety & Compliance' },
  { id: 'TECH-004', name: 'Siti Aminah', specialization: 'Civil Engineering' },
  { id: 'TECH-005', name: 'Muhammad Faiz', specialization: 'Protection Systems' }
];

const CreatePurchaseOrderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    poNumber: '',
    projectNo: '',
    contractorName: '',
    poAmount: '',
    workDescription: '',
    jobScope: [],
    assignedTechnician: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.poNumber.trim()) {
      newErrors.poNumber = 'PO Number is required';
    }
    
    if (!formData.projectNo.trim()) {
      newErrors.projectNo = 'Project No. is required';
    }
    
    if (!formData.contractorName.trim()) {
      newErrors.contractorName = 'Contractor Name is required';
    }
    
    if (!formData.poAmount.trim()) {
      newErrors.poAmount = 'PO Amount is required';
    }
    
    if (!formData.workDescription.trim()) {
      newErrors.workDescription = 'Work Description is required';
    }
    
    if (formData.jobScope.length === 0) {
      newErrors.jobScope = 'At least one Job Scope must be selected';
    }

    if (!formData.assignedTechnician) {
      newErrors.assignedTechnician = 'Assigned Technician is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
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
    
    // Clear job scope error when user makes a selection
    if (errors.jobScope) {
      setErrors(prev => ({
        ...prev,
        jobScope: undefined
      }));
    }
  };

  const handleTechnicianChange = (value: string) => {
    handleInputChange('assignedTechnician', value);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Creating PO with data:', formData);
      toast({
        title: "Purchase Order Created",
        description: `PO ${formData.poNumber} has been created successfully.`,
      });
      navigate('/dashboard/purchase-order');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/purchase-order');
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Handle decimal formatting
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      // If more than one decimal point, keep only the first one
      parts[1] = parts.slice(1).join('');
      return parts[0] + '.' + parts[1];
    }
    
    return numericValue;
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value);
    handleInputChange('poAmount', formatted);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Purchase Order</h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">Purchase Order Information</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PO Number Field */}
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

            {/* Project No Field */}
            <div>
              <Label htmlFor="projectNo" className="text-sm font-medium">
                Project No. <span className="text-red-500">*</span>
              </Label>
              <Input
                id="projectNo"
                value={formData.projectNo}
                onChange={(e) => handleInputChange('projectNo', e.target.value)}
                placeholder="e.g., TNB-2024-PROJECT-001"
                className={errors.projectNo ? 'border-red-500' : ''}
              />
              {errors.projectNo && (
                <p className="mt-1 text-sm text-red-500">{errors.projectNo}</p>
              )}
            </div>

            {/* Contractor Name Field */}
            <div>
              <Label htmlFor="contractorName" className="text-sm font-medium">
                Contractor Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contractorName"
                value={formData.contractorName}
                onChange={(e) => handleInputChange('contractorName', e.target.value)}
                placeholder="e.g., Siemens Malaysia Sdn Bhd"
                className={errors.contractorName ? 'border-red-500' : ''}
              />
              {errors.contractorName && (
                <p className="mt-1 text-sm text-red-500">{errors.contractorName}</p>
              )}
            </div>

            {/* PO Amount Field */}
            <div>
              <Label htmlFor="poAmount" className="text-sm font-medium">
                PO Amount (RM) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">RM</span>
                <Input
                  id="poAmount"
                  value={formData.poAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  className={`pl-12 ${errors.poAmount ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.poAmount && (
                <p className="mt-1 text-sm text-red-500">{errors.poAmount}</p>
              )}
            </div>

            {/* Assigned Technician Field */}
            <div className="md:col-span-2">
              <Label htmlFor="assignedTechnician" className="text-sm font-medium">
                Assigned Technician <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={handleTechnicianChange} value={formData.assignedTechnician}>
                <SelectTrigger className={errors.assignedTechnician ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{tech.name}</span>
                        <span className="text-xs text-gray-500">{tech.specialization}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedTechnician && (
                <p className="mt-1 text-sm text-red-500">{errors.assignedTechnician}</p>
              )}
            </div>

            {/* Work Description Field */}
            <div className="md:col-span-2">
              <Label htmlFor="workDescription" className="text-sm font-medium">
                Work Description <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="workDescription"
                value={formData.workDescription}
                onChange={(e) => handleInputChange('workDescription', e.target.value)}
                placeholder="Describe the work to be performed..."
                className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.workDescription ? 'border-red-500' : ''}`}
                rows={3}
              />
              {errors.workDescription && (
                <p className="mt-1 text-sm text-red-500">{errors.workDescription}</p>
              )}
            </div>

            {/* Job Scope Field - Multiple Selection */}
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
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Create Purchase Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePurchaseOrderPage;

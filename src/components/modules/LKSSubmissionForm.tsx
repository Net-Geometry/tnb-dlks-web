import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save, Send, Download } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import ProjectInformationStep from './lks-form/steps/ProjectInformationStep';
import DynamicDocumentUploadStep from './lks-form/steps/DynamicDocumentUploadStep';
import LocationImagesStep from './lks-form/steps/LocationImagesStep';
import SignatureSubmissionStep from './lks-form/steps/SignatureSubmissionStep';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
interface LKSFormData {
  projectInfo: {
    poNumber: string;
    projectName: string;
    contractorName: string;
    workLocation: string;
    jobScopes: string[];
    preparedBy: string;
    date: string;
  };
  locationImages: {
    beforeWork: {
      file: File | null;
      timestamp: string;
      gps?: string;
    };
    duringWork: {
      file: File | null;
      timestamp: string;
      gps?: string;
    };
    afterWork: {
      file: File | null;
      timestamp: string;
      gps?: string;
    };
  };
  signature: {
    fullName: string;
    position: string;
    date: string;
    remarks: string;
    signatureData: string;
  };
}
interface LKSSubmissionFormProps {
  onSaveDraft: (data: LKSFormData) => void;
  onSubmit: (data: LKSFormData) => void;
  onExportPDF: (data: LKSFormData) => void;
  initialData?: Partial<LKSFormData>;
  status?: 'draft' | 'submitted' | 'approved' | 'rejected';
}
const steps = [{
  id: 1,
  title: 'Project Information',
  subtitle: 'Basic project details'
}, {
  id: 2,
  title: 'Document Upload',
  subtitle: 'Required documents based on job scope'
}, {
  id: 3,
  title: 'Location Images',
  subtitle: 'Before, during, and after work images'
}, {
  id: 4,
  title: 'Signature & Submission',
  subtitle: 'Sign and submit the LKS'
}];
const LKSSubmissionForm: React.FC<LKSSubmissionFormProps> = ({
  onSaveDraft,
  onSubmit,
  onExportPDF,
  initialData = {},
  status = 'draft'
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LKSFormData>({
    projectInfo: {
      poNumber: '',
      projectName: '',
      contractorName: '',
      workLocation: '',
      jobScopes: [],
      preparedBy: '',
      date: new Date().toISOString().split('T')[0],
      ...initialData.projectInfo
    },
    locationImages: {
      beforeWork: {
        file: null,
        timestamp: '',
        gps: ''
      },
      duringWork: {
        file: null,
        timestamp: '',
        gps: ''
      },
      afterWork: {
        file: null,
        timestamp: '',
        gps: ''
      },
      ...initialData.locationImages
    },
    signature: {
      fullName: '',
      position: '',
      date: new Date().toISOString().split('T')[0],
      remarks: '',
      signatureData: '',
      ...initialData.signature
    }
  });
  const {
    uploadedDocuments,
    updateDocuments,
    removeAllDocuments,
    clearAllDocuments,
    getValidationResult,
    getTotalFileCount
  } = useDocumentUpload(formData.projectInfo.jobScopes);
  const updateFormData = <T extends keyof LKSFormData,>(step: T, data: Partial<LKSFormData[T]>) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        ...data
      }
    }));
  };
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleSaveDraft = () => {
    onSaveDraft(formData);
  };
  const handleSubmit = () => {
    const validationResult = getValidationResult();
    if (!validationResult.isValid) {
      alert(`Please upload all required documents: ${validationResult.missingDocuments.join(', ')}`);
      return;
    }
    if (!formData.signature.fullName || !formData.signature.position || !formData.signature.signatureData) {
      alert('Please complete the signature section before submitting.');
      return;
    }
    onSubmit(formData);
  };
  const handleExportPDF = () => {
    onExportPDF(formData);
  };
  const isFormValid = () => {
    const validationResult = getValidationResult();
    return validationResult.isValid && formData.signature.fullName && formData.signature.position && formData.signature.signatureData && formData.projectInfo.poNumber && formData.projectInfo.jobScopes.length > 0;
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ProjectInformationStep data={formData.projectInfo} onChange={data => updateFormData('projectInfo', data)} />;
      case 2:
        return <DynamicDocumentUploadStep selectedJobScopes={formData.projectInfo.jobScopes} uploadedDocuments={uploadedDocuments} onChange={updateDocuments} />;
      case 3:
        return <LocationImagesStep data={formData.locationImages} onChange={data => updateFormData('locationImages', data)} />;
      case 4:
        return <SignatureSubmissionStep data={formData.signature} onChange={data => updateFormData('signature', data)} />;
      default:
        return null;
    }
  };
  const progress = currentStep / steps.length * 100;
  return <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-600">
                LKS Submission
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={status === 'approved' ? 'secondary' : status === 'rejected' ? 'destructive' : 'outline'} className="text-sm">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {/* Step Title */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {steps[currentStep - 1].title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {steps[currentStep - 1].subtitle}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {renderStepContent()}
      </div>

      {/* Navigation and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>

              <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>

              {currentStep < steps.length ? <Button onClick={nextStep} className="flex items-center gap-2">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button> : <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 flex items-center gap-2" disabled={!isFormValid()}>
                  <Send className="w-4 h-4" />
                  Submit LKS
                </Button>}
            </div>
          </div>

          {/* Status Information */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default LKSSubmissionForm;
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, ArrowLeft, FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import WorkLineItemStep from './lkh-form/steps/WorkLineItemStep';
import WorkLogStep from './lkh-form/steps/WorkLogStep';
import SafetyDeclarationStep from './lkh-form/steps/SafetyDeclarationStep';
import DocumentUploadStep from './lkh-form/steps/DocumentUploadStep';
import LocationImagesStep from './lkh-form/steps/LocationImagesStep';
import SignatureSubmissionStep from './lkh-form/steps/SignatureSubmissionStep';

export interface LKHFormData {
  // Step 1
  workLineItem: {
    serviceId: string;
    description: string;
    unit: string;
    unitRate: number;
  };
  // Step 2
  workLog: Array<{
    id: string;
    date: Date | undefined;
    taskDescription: string;
    actionTaken: string;
    notes: string;
  }>;
  // Step 3
  safetyDeclaration: {
    csqa: boolean;
    hirac: boolean;
  };
  // Step 4
  documents: Array<{
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
  }>;
  // Step 5
  locationImages: {
    beforeWork: { file: File | null; timestamp: string; gps?: string };
    duringWork: { file: File | null; timestamp: string; gps?: string };
    afterWork: { file: File | null; timestamp: string; gps?: string };
  };
  // Step 6
  signature: {
    fullName: string;
    position: string;
    date: string;
    remarks: string;
    signatureData: string;
  };
}

const steps = [
  { id: 1, title: 'Work Line Item Details', subtitle: 'Auto-Generated' },
  { id: 2, title: 'Work Log', subtitle: 'Manual Input' },
  { id: 3, title: 'Safety & Quality Declaration', subtitle: 'Checklist' },
  { id: 4, title: 'Document Upload', subtitle: 'Files & Documents' },
  { id: 5, title: 'Location Images', subtitle: 'Before/During/After' },
  { id: 6, title: 'Signature & Submission', subtitle: 'Final Step' },
];

const NewLKHPage: React.FC = () => {
  const navigate = useNavigate();
  const { id, serviceId } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LKHFormData>({
    workLineItem: {
      serviceId: serviceId || '',
      description: '',
      unit: '',
      unitRate: 0,
    },
    workLog: [],
    safetyDeclaration: {
      csqa: false,
      hirac: false,
    },
    documents: [],
    locationImages: {
      beforeWork: { file: null, timestamp: '', gps: '' },
      duringWork: { file: null, timestamp: '', gps: '' },
      afterWork: { file: null, timestamp: '', gps: '' },
    },
    signature: {
      fullName: '',
      position: '',
      date: new Date().toISOString().split('T')[0],
      remarks: '',
      signatureData: '',
    },
  });

  const updateFormData = <T extends keyof LKHFormData>(step: T, data: Partial<LKHFormData[T]>) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
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

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('LKH Form Data:', formData);
    
    toast({
      title: "LKH Submitted Successfully",
      description: "Your LKH report has been submitted for review.",
    });
    
    // Navigate back to work summary with success message
    navigate(`/purchase-order/work-summary/${id}`);
  };

  const handleSaveDraft = () => {
    // Here you would typically send the data to your backend with draft status
    console.log('Saving LKH as Draft:', formData);
    
    toast({
      title: "Draft Saved",
      description: "Your LKH report has been saved as a draft.",
    });
    
    // Optionally navigate back or stay on the current step
    // navigate(`/purchase-order/work-summary/${id}`);
  };

  const handleBackToWorkSummary = () => {
    navigate(`/purchase-order/work-summary/${id}`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <WorkLineItemStep
            data={formData.workLineItem}
            onChange={(data) => updateFormData('workLineItem', data)}
            serviceId={serviceId || ''}
          />
        );
      case 2:
        return (
          <WorkLogStep
            data={formData.workLog}
            onChange={(data) => setFormData(prev => ({ ...prev, workLog: data }))}
          />
        );
      case 3:
        return (
          <SafetyDeclarationStep
            data={formData.safetyDeclaration}
            onChange={(data) => updateFormData('safetyDeclaration', data)}
          />
        );
      case 4:
        return (
          <DocumentUploadStep
            data={formData.documents}
            onChange={(data) => setFormData(prev => ({ ...prev, documents: data }))}
          />
        );
      case 5:
        return (
          <LocationImagesStep
            data={formData.locationImages}
            onChange={(data) => updateFormData('locationImages', data)}
          />
        );
      case 6:
        return (
          <SignatureSubmissionStep
            data={formData.signature}
            onChange={(data) => updateFormData('signature', data)}
          />
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-8 px-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={handleBackToWorkSummary} 
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Work Summary
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">New LKH Submission</h1>
          <p className="text-gray-600">Complete all steps to submit your LKH report</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Progress Bar */}
          <div className="space-y-2 mb-8">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600 mt-2">
              {steps[currentStep - 1].subtitle}
            </p>
          </div>

          {/* Step Content */}
          <div className="min-h-[500px] mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <FileText className="w-4 h-4" />
                Save as Draft
              </Button>
            </div>

            {currentStep < steps.length ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Submit LKH
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLKHPage;

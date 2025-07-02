
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WorkLineItemStep from './steps/WorkLineItemStep';
import WorkLogStep from './steps/WorkLogStep';
import SafetyDeclarationStep from './steps/SafetyDeclarationStep';
import DocumentUploadStep from './steps/DocumentUploadStep';
import LocationImagesStep from './steps/LocationImagesStep';
import SignatureSubmissionStep from './steps/SignatureSubmissionStep';

interface NewLKHDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string;
  onSubmit: (data: any) => void;
}

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

const NewLKHDialog: React.FC<NewLKHDialogProps> = ({ open, onOpenChange, serviceId, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LKHFormData>({
    workLineItem: {
      serviceId: '',
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
    onSubmit(formData);
    onOpenChange(false);
    // Reset form
    setCurrentStep(1);
    setFormData({
      workLineItem: { serviceId: '', description: '', unit: '', unitRate: 0 },
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
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <WorkLineItemStep
            data={formData.workLineItem}
            onChange={(data) => updateFormData('workLineItem', data)}
            serviceId={serviceId}
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            New LKH Submission
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Title */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {steps[currentStep - 1].subtitle}
            </p>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

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
      </DialogContent>
    </Dialog>
  );
};

export default NewLKHDialog;

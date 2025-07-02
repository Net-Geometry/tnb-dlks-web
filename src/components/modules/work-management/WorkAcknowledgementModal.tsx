
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, User, IdCard, PenTool, CheckCircle } from 'lucide-react';

interface WorkAcknowledgementData {
  contractorName: string;
  position: string;
  employeeNumber: string;
  signature: string; // Base64 or file path
  acknowledgedDate: string;
}

interface WorkAcknowledgementModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  documentType: 'AMK' | 'AKK';
  onAcknowledge: (data: WorkAcknowledgementData) => void;
}

export const WorkAcknowledgementModal: React.FC<WorkAcknowledgementModalProps> = ({
  isOpen,
  onClose,
  workOrderId,
  documentType,
  onAcknowledge
}) => {
  const [formData, setFormData] = useState({
    contractorName: '',
    position: '',
    employeeNumber: '',
    signature: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          signature: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = () => {
    return formData.contractorName.trim() !== '' &&
           formData.position.trim() !== '' &&
           formData.employeeNumber.trim() !== '' &&
           formData.signature !== '';
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    
    try {
      const acknowledgementData: WorkAcknowledgementData = {
        ...formData,
        acknowledgedDate: new Date().toISOString()
      };
      
      await onAcknowledge(acknowledgementData);
      
      // Reset form
      setFormData({
        contractorName: '',
        position: '',
        employeeNumber: '',
        signature: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to acknowledge work:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-5 h-5 text-blue-600" />
            Work Acknowledgement - {workOrderId}
          </DialogTitle>
        </DialogHeader>

        <Card className="border-blue-100 bg-blue-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {documentType}
              </Badge>
              <span className="text-sm text-gray-600">
                Please complete all fields to acknowledge this work instruction.
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Contractor Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <User className="w-5 h-5 text-gray-600" />
              Contractor Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractorName" className="text-sm font-medium">
                  Contractor / Team Leader Name *
                </Label>
                <Input
                  id="contractorName"
                  placeholder="Enter full name"
                  value={formData.contractorName}
                  onChange={(e) => handleInputChange('contractorName', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-medium">
                  Position *
                </Label>
                <Input
                  id="position"
                  placeholder="Enter position/role"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeNumber" className="text-sm font-medium">
                Employee Number *
              </Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="employeeNumber"
                  placeholder="Enter employee number"
                  value={formData.employeeNumber}
                  onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <PenTool className="w-5 h-5 text-gray-600" />
              Digital Signature
            </div>

            <div className="space-y-2">
              <Label htmlFor="signature" className="text-sm font-medium">
                Contractor Signature *
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.signature ? (
                  <div className="space-y-2">
                    <img 
                      src={formData.signature} 
                      alt="Signature" 
                      className="max-h-20 mx-auto"
                    />
                    <p className="text-sm text-green-600 font-medium">
                      Signature uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <PenTool className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      Upload signature image (PNG, JPG, or PDF)
                    </p>
                  </div>
                )}
                <Input
                  id="signature"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleSignatureUpload}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Acknowledging...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Acknowledge Work
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

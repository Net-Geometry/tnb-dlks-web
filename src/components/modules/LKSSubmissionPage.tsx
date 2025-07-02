
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import LKSSubmissionForm from './LKSSubmissionForm';
import { useToast } from "@/hooks/use-toast";

const LKSSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveDraft = async (data: any) => {
    try {
      setIsSubmitting(true);
      // Simulate API call to save draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Draft Saved",
        description: "Your LKS submission has been saved as a draft.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      // Simulate API call to submit LKS
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "LKS Submitted",
        description: "Your LKS submission has been sent for review.",
      });
      
      // Navigate back to LKS status page
      navigate('/dashboard/lks-status');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit LKS. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportPDF = async (data: any) => {
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "PDF Generated",
        description: "Your LKS form has been exported as PDF.",
      });
      
      // In a real implementation, this would trigger a download
      console.log('Exporting PDF with data:', data);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/lks-status')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to LKS Status
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-xl font-semibold text-gray-900">
            New LKS Submission
          </h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-4 sm:px-6 py-6">
        <LKSSubmissionForm
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          onExportPDF={handleExportPDF}
          status="draft"
        />
      </div>
    </div>
  );
};

export default LKSSubmissionPage;

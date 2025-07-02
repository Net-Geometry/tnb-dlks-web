import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  Eye,
  Brain,
  X,
  Clock,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useImageAIAnalysis } from "@/hooks/useImageAIAnalysis";

// Import refactored components
import LKHDetailHeader from "./lkh-detail/LKHDetailHeader";
import WorkLineItemSection from "./lkh-detail/WorkLineItemSection";
import WorkLogSection from "./lkh-detail/WorkLogSection";
import SafetyDeclarationSection from "./lkh-detail/SafetyDeclarationSection";
import DocumentUploadSection from "./lkh-detail/DocumentUploadSection";
import ImagesSection from "./lkh-detail/ImagesSection";
import SignatureSection from "./lkh-detail/SignatureSection";

// Keep existing interfaces and mock data
interface LKHDetail {
  id: string;
  serviceId: string;
  poNumber: string;
  projectName: string;
  contractor: string;
  location: string;
  preparedBy: string;
  status: "Draft" | "Submitted" | "Reviewed" | "Approved" | "Reupdate";
  submittedDate: string;
  workLineItem: {
    serviceId: string;
    description: string;
    unit: string;
    unitRate: number;
  };
  workLog: Array<{
    id: string;
    date: string;
    taskDescription: string;
    actionTaken: string;
    notes: string;
  }>;
  safetyDeclaration: {
    csqa: boolean;
    hirac: boolean;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploaded: boolean;
    verified: boolean;
  }>;
  locationImages: {
    before: {
      count: number;
      validated: boolean;
      timestamp?: string;
      gps?: string;
      imageUrl?: string;
    };
    during: {
      count: number;
      validated: boolean;
      timestamp?: string;
      gps?: string;
      imageUrl?: string;
    };
    after: {
      count: number;
      validated: boolean;
      timestamp?: string;
      gps?: string;
      imageUrl?: string;
    };
  };
  signature: {
    fullName: string;
    position: string;
    date: string;
    remarks: string;
    signed: boolean;
  };
}

// Mock data for demonstration - Updated to include LKS-2024-001
const mockLKHData: {
  [key: string]: LKHDetail;
} = {
  "LKH-2024-001": {
    id: "LKH-2024-001",
    serviceId: "2010105",
    poNumber: "TNB-PO-001-2024",
    projectName: "Shah Alam Electrical Upgrade",
    contractor: "KKB Contractor Sdn Bhd",
    location: "Shah Alam, Selangor",
    preparedBy: "Ahmad Rahman",
    status: "Approved",
    submittedDate: "2024-01-15",
    workLineItem: {
      serviceId: "2010105",
      description: "Supply&Install,Operating Handle,11kV,D",
      unit: "UNIT",
      unitRate: 163.9,
    },
    workLog: [
      {
        id: "1",
        date: "2024-01-15",
        taskDescription: "Initial site inspection and preparation",
        actionTaken: "Completed safety briefing and equipment check",
        notes: "All safety protocols followed",
      },
      {
        id: "2",
        date: "2024-01-16",
        taskDescription: "Installation of operating handle",
        actionTaken: "Successfully installed and tested operating handle",
        notes: "Installation completed as per specifications",
      },
    ],
    safetyDeclaration: {
      csqa: true,
      hirac: true,
    },
    documents: [
      {
        id: "1",
        name: "Installation Manual",
        type: "PDF",
        uploaded: true,
        verified: true,
      },
      {
        id: "2",
        name: "Safety Checklist",
        type: "PDF",
        uploaded: true,
        verified: true,
      },
      {
        id: "3",
        name: "Testing Report",
        type: "PDF",
        uploaded: true,
        verified: false,
      },
    ],
    locationImages: {
      before: {
        count: 2,
        validated: true,
        timestamp: "2024-01-15T08:30:00Z",
        gps: "3.1390, 101.6869",
        imageUrl:
          "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop",
      },
      during: {
        count: 1,
        validated: true,
        timestamp: "2024-01-15T14:45:00Z",
        gps: "3.1390, 101.6869",
        imageUrl:
          "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
      },
      after: {
        count: 2,
        validated: true,
        timestamp: "2024-01-15T17:20:00Z",
        gps: "3.1390, 101.6869",
        imageUrl:
          "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&h=600&fit=crop",
      },
    },
    signature: {
      fullName: "Ahmad Rahman",
      position: "Senior Technician",
      date: "2024-01-15",
      remarks: "Work completed successfully according to specifications",
      signed: true,
    },
  },
  "LKS-2024-001": {
    id: "LKS-2024-001",
    serviceId: "2010105",
    poNumber: "TNB-PO-001-2024",
    projectName: "Shah Alam Electrical Upgrade",
    contractor: "KKB Contractor Sdn Bhd",
    location: "Shah Alam, Selangor",
    preparedBy: "Ahmad Rahman",
    status: "Submitted",
    submittedDate: "2024-01-20",
    workLineItem: {
      serviceId: "2010105",
      description: "Supply&Install,Operating Handle,11kV,D",
      unit: "UNIT",
      unitRate: 163.9,
    },
    workLog: [
      {
        id: "1",
        date: "2024-01-20",
        taskDescription: "Initial site inspection and preparation",
        actionTaken: "Completed safety briefing and equipment check",
        notes: "All safety protocols followed",
      },
      {
        id: "2",
        date: "2024-01-21",
        taskDescription: "Installation of operating handle",
        actionTaken: "Successfully installed and tested operating handle",
        notes: "Installation completed as per specifications",
      },
    ],
    safetyDeclaration: {
      csqa: true,
      hirac: true,
    },
    documents: [
      {
        id: "1",
        name: "Installation Manual",
        type: "PDF",
        uploaded: true,
        verified: true,
      },
      {
        id: "2",
        name: "Safety Checklist",
        type: "PDF",
        uploaded: true,
        verified: true,
      },
      {
        id: "3",
        name: "Testing Report",
        type: "PDF",
        uploaded: true,
        verified: false,
      },
    ],
    locationImages: {
      before: {
        count: 2,
        validated: true,
        timestamp: "2024-01-20T08:30:00Z",
        gps: "3.1390, 101.6869",
        imageUrl:
          "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop",
      },
      during: {
        count: 1,
        validated: false,
        timestamp: "2024-01-20T14:45:00Z",
        gps: "3.1390, 101.6869",
        imageUrl:
          "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
      },
      after: {
        count: 2,
        validated: true,
        timestamp: "2024-01-20T17:20:00Z",
        gps: "3.1390, 101.6869",
        imageUrl:
          "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&h=600&fit=crop",
      },
    },
    signature: {
      fullName: "Ahmad Rahman",
      position: "Senior Technician",
      date: "2024-01-20",
      remarks: "Work completed successfully according to specifications",
      signed: true,
    },
  },
};
const LKHDetail: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { analyzeImage, getAnalysisForType } = useImageAIAnalysis();
  const [selectedImage, setSelectedImage] = useState<{
    type: string;
    url: string;
    timestamp?: string;
    gps?: string;
  } | null>(null);

  // Add state for tracking validation status of each image type
  const [imageValidationStatus, setImageValidationStatus] = useState<{
    [key: string]: {
      validated: boolean;
      validatedBy?: string;
      validatedAt?: string;
    };
  }>({
    before: {
      validated: true,
      validatedBy: "System Auto",
      validatedAt: "2024-01-15T08:35:00Z",
    },
    during: {
      validated: false,
    },
    after: {
      validated: true,
      validatedBy: "Ahmad Rahman",
      validatedAt: "2024-01-15T17:25:00Z",
    },
  });

  // Add state for rejection dialog
  const [rejectionDialog, setRejectionDialog] = useState<{
    open: boolean;
    imageType: string;
    reason: string;
  }>({
    open: false,
    imageType: "",
    reason: "",
  });
  const lkhData = id ? mockLKHData[id] : null;
  console.log("LKH Detail - ID:", id, "Data found:", !!lkhData);

  // Check if user has permission to edit/modify LKH
  const canEdit =
    user &&
    (user.user_metadata?.role === "TNB Super Admin" ||
      user.user_metadata?.permissions?.includes("edit") ||
      user.user_metadata?.permissions?.includes("manage_users"));

  // Check if user has permission to validate/verify documents
  const canValidate =
    user &&
    (user.user_metadata?.role === "TNB Super Admin" ||
      user.user_metadata?.role === "Senior Engineer" ||
      user.user_metadata?.permissions?.includes("validate") ||
      user.user_metadata?.permissions?.includes("verify"));

  // Check if user has permission to approve
  const canApprove =
    user &&
    (user.user_metadata?.role === "TNB Super Admin" ||
      user.user_metadata?.role === "Senior Engineer" ||
      user.user_metadata?.permissions?.includes("validate"));

  // Check if user has access to AI features - only technician level (level 4) and above
  const canUseAI =
    user &&
    (user.user_metadata?.role === "TNB Super Admin" ||
      user.user_metadata?.role === "Technician" ||
      (user.user_metadata?.level && user.user_metadata.level <= 4));
  const handleImageValidation = (imageType: string, isValid: boolean) => {
    const action = isValid ? "validated" : "rejected";
    const currentTime = new Date().toISOString();
    setImageValidationStatus((prev) => ({
      ...prev,
      [imageType]: {
        validated: isValid,
        validatedBy: user?.user_metadata?.name || user?.email || "Unknown",
        validatedAt: currentTime,
      },
    }));
    toast({
      title: `Image ${action}`,
      description: `${
        imageType.charAt(0).toUpperCase() + imageType.slice(1)
      } work image has been ${action} successfully.`,
      variant: isValid ? "default" : "destructive",
    });
    console.log(
      `Image validation: ${imageType} - ${action} by ${
        user?.user_metadata?.name || user?.email
      } at ${currentTime}`
    );
  };
  const handleImageRejection = (imageType: string) => {
    setRejectionDialog({
      open: true,
      imageType,
      reason: "",
    });
  };
  const handleRejectionSubmit = () => {
    if (rejectionDialog.reason.trim()) {
      handleImageValidation(rejectionDialog.imageType, false);
      console.log(
        `Image rejection reason for ${rejectionDialog.imageType}: ${rejectionDialog.reason}`
      );
      toast({
        title: "Image Rejected",
        description: `${
          rejectionDialog.imageType.charAt(0).toUpperCase() +
          rejectionDialog.imageType.slice(1)
        } work image has been rejected with reason: ${rejectionDialog.reason}`,
        variant: "destructive",
      });
      setRejectionDialog({
        open: false,
        imageType: "",
        reason: "",
      });
    } else {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
    }
  };
  const handleAIAnalysis = async (imageType: string, imageUrl: string) => {
    if (!canUseAI) {
      toast({
        title: "Access Denied",
        description:
          "AI analysis is only available for technician-level users and above.",
        variant: "destructive",
      });
      return;
    }
    await analyzeImage(imageType, imageUrl);
  };
  const handleImageClick = (type: string, imageData: any) => {
    if (imageData.imageUrl) {
      setSelectedImage({
        type: type.charAt(0).toUpperCase() + type.slice(1) + " Work Image",
        url: imageData.imageUrl,
        timestamp: imageData.timestamp,
        gps: imageData.gps,
      });
    }
  };
  if (!lkhData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">LKH Not Found</h2>
            <p className="text-gray-600 mb-4">
              The requested LKH submission could not be found.
            </p>
            <p className="text-sm text-gray-500 mb-4">Looking for ID: {id}</p>
            <Button onClick={() => navigate(-1)}>Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <LKHDetailHeader
        lkhData={lkhData}
        user={user}
        canEdit={canEdit}
        canApprove={canApprove}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Access Control Notice */}
        {!canEdit && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">
                  You have read-only access to this LKH submission. Contact your
                  administrator for edit permissions.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Access Notice */}
        {!canUseAI && <Card className="border-purple-200 bg-purple-50"></Card>}

        <WorkLineItemSection workLineItem={lkhData.workLineItem} />
        <WorkLogSection workLog={lkhData.workLog} />
        <SafetyDeclarationSection
          safetyDeclaration={lkhData.safetyDeclaration}
        />
        <DocumentUploadSection
          documents={lkhData.documents}
          canValidate={canValidate}
        />

        <ImagesSection
          locationImages={lkhData.locationImages}
          imageValidationStatus={imageValidationStatus}
          canValidate={canValidate}
          canUseAI={canUseAI}
          onImageClick={handleImageClick}
          onImageValidation={handleImageValidation}
          onImageRejection={handleImageRejection}
          onAIAnalysis={handleAIAnalysis}
          getAnalysisForType={getAnalysisForType}
        />

        <SignatureSection signature={lkhData.signature} />
      </div>

      {/* Enhanced Image Modal with AI Analysis */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedImage?.type}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.type}
                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
              />

              {/* AI Analysis in Modal - Only show if user can use AI */}
              {(() => {
                const imageType = selectedImage.type
                  .toLowerCase()
                  .split(" ")[0];
                const analysisInfo = getAnalysisForType(imageType);
                return (
                  analysisInfo?.result &&
                  canUseAI && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        AI Analysis Results
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-purple-800 mb-1">
                            Reasoning:
                          </p>
                          <p className="text-sm text-purple-700">
                            {analysisInfo.result.reasoning}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-purple-800">
                              Recommendation:{" "}
                            </span>
                            <Badge
                              variant={
                                analysisInfo.result.recommendation === "approve"
                                  ? "default"
                                  : analysisInfo.result.recommendation ===
                                    "reject"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {analysisInfo.result.recommendation.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-sm text-purple-700">
                            <strong>Confidence:</strong>{" "}
                            {Math.round(analysisInfo.result.confidence * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                );
              })()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                {selectedImage.timestamp && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      <strong>Timestamp:</strong>{" "}
                      {new Date(selectedImage.timestamp).toLocaleString()}
                    </span>
                  </div>
                )}
                {selectedImage.gps && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      <strong>GPS:</strong> {selectedImage.gps}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center pt-4 border-t">
                {canUseAI && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const imageType = selectedImage.type
                        .toLowerCase()
                        .split(" ")[0];
                      handleAIAnalysis(imageType, selectedImage.url);
                    }}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze with AI
                  </Button>
                )}

                {canValidate && (
                  <>
                    <Button
                      onClick={() => {
                        const imageType = selectedImage.type
                          .toLowerCase()
                          .split(" ")[0];
                        handleImageValidation(imageType, true);
                        setSelectedImage(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Validate This Image
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        const imageType = selectedImage.type
                          .toLowerCase()
                          .split(" ")[0];
                        handleImageRejection(imageType);
                        setSelectedImage(null);
                      }}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      Reject This Image
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <AlertDialog
        open={rejectionDialog.open}
        onOpenChange={(open) =>
          setRejectionDialog((prev) => ({
            ...prev,
            open,
          }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Image</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this{" "}
              {rejectionDialog.imageType} work image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label
              htmlFor="rejection-reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for Rejection
            </label>
            <Textarea
              id="rejection-reason"
              placeholder="Enter the reason for rejecting this image..."
              value={rejectionDialog.reason}
              onChange={(e) =>
                setRejectionDialog((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              className="w-full"
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setRejectionDialog({
                  open: false,
                  imageType: "",
                  reason: "",
                })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectionSubmit}
              className="bg-red-600 hover:bg-red-700"
            >
              Submit Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default LKHDetail;

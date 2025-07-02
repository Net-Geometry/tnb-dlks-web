import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, CheckCircle, AlertCircle, X, Sparkles, Loader2, Clock, MapPin, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ImageViewModal from './ImageViewModal';

interface ImageData {
  id: string;
  url: string;
  timestamp?: string;
  gps?: string;
  type: 'before' | 'during' | 'after';
  validated?: boolean;
  manualValidation?: 'valid' | 'rejected' | null;
}

interface AIValidationResult {
  imageId: string;
  isValid: boolean;
  reasoning: string;
  confidence: number;
  issues?: string[];
}

interface ImageGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageData[];
  imageType: string;
  canUseAI: boolean;
  canValidate: boolean;
}

const ImageGridModal: React.FC<ImageGridModalProps> = ({
  isOpen,
  onClose,
  images,
  imageType,
  canUseAI,
  canValidate
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationResults, setValidationResults] = useState<AIValidationResult[]>([]);
  const [manualValidations, setManualValidations] = useState<{[key: string]: 'valid' | 'rejected'}>({});
  const [imageViewModal, setImageViewModal] = useState<{
    isOpen: boolean;
    image: ImageData | null;
  }>({
    isOpen: false,
    image: null
  });
  const [rejectionDialog, setRejectionDialog] = useState<{
    isOpen: boolean;
    imageId: string | null;
    reason: string;
  }>({
    isOpen: false,
    imageId: null,
    reason: ''
  });
  const { toast } = useToast();

  // Automatically analyze all images when modal opens and AI is available
  useEffect(() => {
    if (isOpen && canUseAI && images.length > 0 && validationResults.length === 0) {
      analyzeAllImages();
    }
  }, [isOpen, canUseAI, images.length]);

  const analyzeAllImages = async () => {
    if (images.length === 0) return;

    setIsAnalyzing(true);
    const results: AIValidationResult[] = [];

    try {
      toast({
        title: "AI Scanning Started",
        description: `Automatically scanning ${images.length} images for validation...`,
      });

      // Simulate AI analysis for each image
      for (const image of images) {
        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock AI validation results with different scenarios
        const mockResults = [
          {
            imageId: image.id,
            isValid: true,
            reasoning: "Image shows clear documentation of work progress. All safety protocols are visible, equipment is properly positioned, and image quality meets documentation standards.",
            confidence: 0.92,
            issues: []
          },
          {
            imageId: image.id,
            isValid: false,
            reasoning: "Image quality is insufficient for proper documentation. Lighting conditions are poor and key work details are not clearly visible.",
            confidence: 0.87,
            issues: ["Poor lighting", "Blurry details", "Incomplete view of work area"]
          },
          {
            imageId: image.id,
            isValid: false,
            reasoning: "Safety concerns identified in the image. Personnel visible without proper PPE and work area appears unsafe.",
            confidence: 0.94,
            issues: ["Missing PPE", "Unsafe work environment", "Safety barriers not visible"]
          },
          {
            imageId: image.id,
            isValid: true,
            reasoning: "Excellent documentation quality. Work completion is clearly visible, all equipment is properly labeled, and safety standards are met.",
            confidence: 0.96,
            issues: []
          }
        ];

        // Randomly select a result type based on image index
        const resultIndex = Math.floor(Math.random() * mockResults.length);
        results.push(mockResults[resultIndex]);
      }

      setValidationResults(results);
      
      const validCount = results.filter(r => r.isValid).length;
      const invalidCount = results.length - validCount;

      toast({
        title: "AI Scan Complete",
        description: `Scanned ${results.length} images. ${validCount} valid, ${invalidCount} invalid.`,
        variant: invalidCount > 0 ? "destructive" : "default"
      });

    } catch (error) {
      console.error('Error during AI analysis:', error);
      toast({
        title: "AI Scan Failed",
        description: "Failed to analyze images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageSelection = (imageId: string, checked: boolean) => {
    if (checked) {
      setSelectedImages(prev => [...prev, imageId]);
    } else {
      setSelectedImages(prev => prev.filter(id => id !== imageId));
    }
  };

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(img => img.id));
    }
  };

  const getValidationResult = (imageId: string) => {
    return validationResults.find(result => result.imageId === imageId);
  };

  const handleImageClick = (image: ImageData) => {
    setImageViewModal({
      isOpen: true,
      image: image
    });
  };

  const closeImageViewModal = () => {
    setImageViewModal({
      isOpen: false,
      image: null
    });
  };

  const handleRescanImages = () => {
    setValidationResults([]);
    analyzeAllImages();
  };

  const handleManualValidation = (imageId: string, validation: 'valid' | 'rejected') => {
    setManualValidations(prev => ({
      ...prev,
      [imageId]: validation
    }));

    toast({
      title: validation === 'valid' ? "Image Validated" : "Image Rejected",
      description: `Image has been marked as ${validation}.`,
      variant: validation === 'valid' ? "default" : "destructive"
    });
  };

  const handleRejectClick = (imageId: string) => {
    setRejectionDialog({
      isOpen: true,
      imageId: imageId,
      reason: ''
    });
  };

  const handleRejectSubmit = () => {
    if (rejectionDialog.imageId && rejectionDialog.reason.trim()) {
      handleManualValidation(rejectionDialog.imageId, 'rejected');
      
      toast({
        title: "Image Rejected",
        description: `Image rejected: ${rejectionDialog.reason}`,
        variant: "destructive"
      });
      
      setRejectionDialog({
        isOpen: false,
        imageId: null,
        reason: ''
      });
    }
  };

  const handleRejectCancel = () => {
    setRejectionDialog({
      isOpen: false,
      imageId: null,
      reason: ''
    });
  };

  const getImageStatus = (imageId: string) => {
    const manualValidation = manualValidations[imageId];
    if (manualValidation) {
      return manualValidation;
    }
    
    const aiValidation = getValidationResult(imageId);
    if (aiValidation) {
      return aiValidation.isValid ? 'ai-valid' : 'ai-invalid';
    }
    
    return 'pending';
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                {imageType.charAt(0).toUpperCase() + imageType.slice(1)} Work Images
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {images.length} images total • {selectedImages.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  {selectedImages.length === images.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              {canUseAI && (
                <div className="flex items-center gap-2">
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2 text-purple-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Scanning images...</span>
                    </div>
                  ) : validationResults.length > 0 ? (
                    <Button
                      onClick={handleRescanImages}
                      variant="outline"
                      size="sm"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Rescan All Images
                    </Button>
                  ) : null}
                </div>
              )}
            </div>

            {/* AI Scan Status Banner */}
            {canUseAI && (
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 text-purple-700">
                  <Brain className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isAnalyzing ? "AI is automatically scanning all images..." : 
                     validationResults.length > 0 ? "AI scan completed - invalid images highlighted below" :
                     "AI will automatically scan images when loaded"}
                  </span>
                </div>
              </div>
            )}
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {images.map((image) => {
              const isSelected = selectedImages.includes(image.id);
              const validationResult = getValidationResult(image.id);
              const imageStatus = getImageStatus(image.id);
              const manualValidation = manualValidations[image.id];
              
              return (
                <Card key={image.id} className={`relative overflow-hidden transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 
                  manualValidation === 'valid' ? 'ring-2 ring-green-500 shadow-lg' :
                  manualValidation === 'rejected' ? 'ring-2 ring-red-500 shadow-lg' :
                  validationResult && !validationResult.isValid ? 'ring-2 ring-orange-500 shadow-lg' :
                  'hover:shadow-md'
                }`}>
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={`${imageType} work image`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageClick(image)}
                    />
                    
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2" onClick={(e) => e.stopPropagation()}>
                      <div className="bg-white/90 rounded p-1 backdrop-blur-sm">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleImageSelection(image.id, checked as boolean)
                          }
                        />
                      </div>
                    </div>

                    {/* Validation Status Badge */}
                    <div className="absolute top-2 right-2">
                      {manualValidation === 'valid' && (
                        <Badge className="text-xs bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Valid
                        </Badge>
                      )}
                      {manualValidation === 'rejected' && (
                        <Badge variant="destructive" className="text-xs">
                          <X className="w-3 h-3 mr-1" />
                          Rejected
                        </Badge>
                      )}
                      {!manualValidation && validationResult && (
                        <Badge
                          variant={validationResult.isValid ? "secondary" : "destructive"}
                          className={`text-xs ${validationResult.isValid ? 'bg-orange-100 text-orange-800 border-orange-200' : ''}`}
                        >
                          {validationResult.isValid ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          AI {validationResult.isValid ? 'Valid' : 'Invalid'}
                        </Badge>
                      )}
                    </div>

                    {/* Image Metadata */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                      {image.timestamp && (
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(image.timestamp).toLocaleString()}</span>
                        </div>
                      )}
                      {image.gps && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{image.gps}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Manual Validation Buttons */}
                  {canValidate && (
                    <div className="p-3 border-t bg-gray-50">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManualValidation(image.id, 'valid');
                          }}
                          disabled={manualValidation === 'valid'}
                          className={`flex-1 ${
                            manualValidation === 'valid' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          }`}
                          variant={manualValidation === 'valid' ? 'default' : 'outline'}
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Valid
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectClick(image.id);
                          }}
                          disabled={manualValidation === 'rejected'}
                          className={`flex-1 ${
                            manualValidation === 'rejected' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          }`}
                          variant={manualValidation === 'rejected' ? 'destructive' : 'outline'}
                        >
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* AI Analysis Results */}
                  {validationResult && !manualValidation && (
                    <div className="p-3 space-y-2 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">AI Analysis</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(validationResult.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {validationResult.reasoning}
                      </p>
                      
                      {validationResult.issues && validationResult.issues.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-red-700">Issues Found:</span>
                          <ul className="text-xs text-red-600 space-y-1">
                            {validationResult.issues.map((issue, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Validation Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Manually Valid: {Object.values(manualValidations).filter(v => v === 'valid').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsDown className="w-4 h-4 text-red-500" />
                <span>Manually Rejected: {Object.values(manualValidations).filter(v => v === 'rejected').length}</span>
              </div>
              {validationResults.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>AI Valid: {validationResults.filter(r => r.isValid).length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <span>AI Invalid: {validationResults.filter(r => !r.isValid).length}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <AlertDialog open={rejectionDialog.isOpen} onOpenChange={handleRejectCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Image</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this image. This will help improve the validation process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Enter the reason for rejection..."
              value={rejectionDialog.reason}
              onChange={(e) => setRejectionDialog(prev => ({ ...prev, reason: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleRejectCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRejectSubmit}
              disabled={!rejectionDialog.reason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Submit Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image View Modal */}
      <ImageViewModal
        isOpen={imageViewModal.isOpen}
        onClose={closeImageViewModal}
        image={imageViewModal.image}
        validationResult={imageViewModal.image ? getValidationResult(imageViewModal.image.id) : undefined}
      />
    </>
  );
};

export default ImageGridModal;

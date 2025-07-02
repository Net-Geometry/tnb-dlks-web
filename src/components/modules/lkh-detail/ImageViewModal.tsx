
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, AlertCircle, Clock, MapPin, Brain } from 'lucide-react';

interface ImageData {
  id: string;
  url: string;
  timestamp?: string;
  gps?: string;
  type: 'before' | 'during' | 'after';
  validated?: boolean;
}

interface AIValidationResult {
  imageId: string;
  isValid: boolean;
  reasoning: string;
  confidence: number;
  issues?: string[];
}

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: ImageData | null;
  validationResult?: AIValidationResult;
}

const ImageViewModal: React.FC<ImageViewModalProps> = ({
  isOpen,
  onClose,
  image,
  validationResult
}) => {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0">
        <div className="relative">
          {/* Close button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Main image */}
          <div className="relative">
            <img
              src={image.url}
              alt={`${image.type} work image`}
              className="w-full max-h-[70vh] object-contain"
            />
            
            {/* Validation status badge */}
            {validationResult && (
              <div className="absolute top-4 left-4">
                <Badge
                  variant={validationResult.isValid ? "default" : "destructive"}
                  className="text-sm"
                >
                  {validationResult.isValid ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-2" />
                  )}
                  {validationResult.isValid ? 'Valid' : 'Invalid'}
                </Badge>
              </div>
            )}
          </div>

          {/* Image metadata and validation results */}
          <div className="p-6 space-y-4">
            {/* Image metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 capitalize">
                  {image.type} Work Image
                </h3>
                {image.timestamp && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(image.timestamp).toLocaleString()}</span>
                  </div>
                )}
                {image.gps && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{image.gps}</span>
                  </div>
                )}
              </div>

              {/* AI Analysis Results */}
              {validationResult && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">AI Analysis</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(validationResult.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {validationResult.reasoning}
                  </p>
                  
                  {validationResult.issues && validationResult.issues.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-red-700">Issues Found:</span>
                      <ul className="text-sm text-red-600 space-y-1">
                        {validationResult.issues.map((issue, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewModal;

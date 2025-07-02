
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Brain, AlertCircle } from 'lucide-react';
import ImageGridModal from './ImageGridModal';

interface LocationImage {
  count: number;
  validated: boolean;
  timestamp?: string;
  gps?: string;
  imageUrl?: string;
}

interface ImagesSectionProps {
  locationImages: {
    before: LocationImage;
    during: LocationImage;
    after: LocationImage;
  };
  imageValidationStatus: {
    [key: string]: {
      validated: boolean;
      validatedBy?: string;
      validatedAt?: string;
    };
  };
  canValidate: boolean;
  canUseAI: boolean;
  onImageClick: (type: string, imageData: any) => void;
  onImageValidation: (imageType: string, isValid: boolean) => void;
  onImageRejection: (imageType: string) => void;
  onAIAnalysis: (imageType: string, imageUrl: string) => void;
  getAnalysisForType: (type: string) => any;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({
  locationImages,
  imageValidationStatus,
  canValidate,
  canUseAI,
  onImageClick,
  onImageValidation,
  onImageRejection,
  onAIAnalysis,
  getAnalysisForType
}) => {
  const [imageGridModal, setImageGridModal] = useState<{
    isOpen: boolean;
    type: string;
    images: any[];
  }>({
    isOpen: false,
    type: '',
    images: []
  });

  // Generate mock images for grid display
  const generateMockImages = (type: string, count: number = 8) => {
    const mockImages = [
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=400&h=400&fit=crop'
    ];

    return Array.from({ length: count }, (_, index) => ({
      id: `${type}-${index + 1}`,
      url: mockImages[index % mockImages.length],
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      gps: `3.${Math.floor(Math.random() * 9000 + 1000)}, 101.${Math.floor(Math.random() * 9000 + 1000)}`,
      type: type as 'before' | 'during' | 'after',
      validated: Math.random() > 0.3
    }));
  };

  const handleViewAllImages = (type: string) => {
    const mockImages = generateMockImages(type);
    setImageGridModal({
      isOpen: true,
      type,
      images: mockImages
    });
  };

  const closeImageGridModal = () => {
    setImageGridModal({
      isOpen: false,
      type: '',
      images: []
    });
  };

  // Calculate totals
  const totalImages = Object.values(locationImages).reduce((sum, data) => sum + data.count, 0);
  
  // Mock AI invalid count calculation (since we're using mock data)
  const getAIInvalidCount = () => {
    // Simulate that roughly 30% of images are flagged as invalid by AI
    return Math.floor(totalImages * 0.3);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-orange-600 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Images - AI-Powered Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{totalImages}</div>
                  <div className="text-sm text-gray-600">Total Images</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{getAIInvalidCount()}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    AI Invalid
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleViewAllImages('all')} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={totalImages === 0}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                View All Images ({totalImages})
              </Button>
            </div>

            {/* Image Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(locationImages).map(([type, data]) => (
                <div key={type} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">{type} Images</h4>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {data.count}
                    </Badge>
                  </div>
                  
                  {data.count > 0 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewAllImages(type)}
                      className="w-full text-xs"
                    >
                      View {type} images
                    </Button>
                  ) : (
                    <div className="text-center py-2">
                      <ImageIcon className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">No images uploaded</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {canUseAI && getAIInvalidCount() > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {getAIInvalidCount()} images flagged as invalid by AI analysis
                  </span>
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  Click "View All Images" to review and validate flagged images.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Grid Modal */}
      <ImageGridModal
        isOpen={imageGridModal.isOpen}
        onClose={closeImageGridModal}
        images={imageGridModal.images}
        imageType={imageGridModal.type}
        canUseAI={canUseAI}
        canValidate={canValidate}
      />
    </>
  );
};

export default ImagesSection;

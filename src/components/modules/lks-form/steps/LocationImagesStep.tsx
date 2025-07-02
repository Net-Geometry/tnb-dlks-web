
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from 'lucide-react';
import ImageViewSection from '../components/ImageViewSection';
import ValidationSummary from '../components/ValidationSummary';

interface LocationImage {
  file: File | null;
  timestamp: string;
  gps?: string;
  isValidated?: boolean;
  imageUrl?: string;
}

interface LocationImagesData {
  beforeWork: LocationImage;
  duringWork: LocationImage;
  afterWork: LocationImage;
}

interface LocationImagesStepProps {
  data: LocationImagesData;
  onChange: (data: Partial<LocationImagesData>) => void;
  poNumber?: string;
}

const LocationImagesStep: React.FC<LocationImagesStepProps> = ({ 
  data, 
  onChange, 
  poNumber 
}) => {
  // Mock function to simulate fetching LKH images based on PO number
  const getLKHImages = (poNumber: string) => {
    if (poNumber) {
      return {
        beforeWork: {
          file: null,
          timestamp: '2024-01-15T08:30:00Z',
          gps: '3.1390, 101.6869',
          isValidated: true,
          imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop'
        },
        duringWork: {
          file: null,
          timestamp: '2024-01-15T14:45:00Z',
          gps: '3.1390, 101.6869',
          isValidated: false,
          imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop'
        },
        afterWork: {
          file: null,
          timestamp: '2024-01-15T17:20:00Z',
          gps: '3.1390, 101.6869',
          isValidated: true,
          imageUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=400&h=300&fit=crop'
        }
      };
    }
    return null;
  };

  const lkhImages = poNumber ? getLKHImages(poNumber) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">
            Images (View Only)
          </CardTitle>
          <p className="text-sm text-gray-600">
            View images from the LKH submission linked to PO: <span className="font-medium">{poNumber || 'N/A'}</span>
          </p>
        </CardHeader>
        <CardContent>
          {poNumber && lkhImages ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImageViewSection
                title="Before Work Image"
                section="beforeWork"
                lkhImage={lkhImages.beforeWork}
              />
              <ImageViewSection
                title="During Work Image"
                section="duringWork"
                lkhImage={lkhImages.duringWork}
              />
              <ImageViewSection
                title="After Work Image"
                section="afterWork"
                lkhImage={lkhImages.afterWork}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No PO Number Provided</h3>
              <p className="text-sm">
                Please enter a PO number in Step 1 to view associated LKH images
              </p>
            </div>
          )}

          {/* Validation Summary */}
          {poNumber && lkhImages && (
            <ValidationSummary lkhImages={lkhImages} />
          )}

          {/* Guidelines Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">View-Only Information:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• These images were automatically linked from the LKH submission under the PO number you entered</li>
              <li>• The images represent the work at different stages: Before, During, and After</li>
              <li>• GPS coordinates and timestamps are automatically recorded and validated</li>
              <li>• Validation status indicates whether the image has been reviewed and verified</li>
              <li>• You cannot modify or upload new images at this stage</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationImagesStep;

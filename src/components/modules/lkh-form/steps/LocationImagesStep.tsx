
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from 'lucide-react';
import ImageUploadSection from '../components/ImageUploadSection';
import ImageGuidelines from '../components/ImageGuidelines';

interface LocationImage {
  file: File | null;
  timestamp: string;
  gps?: string;
}

interface LocationImagesData {
  beforeWork: LocationImage;
  duringWork: LocationImage;
  afterWork: LocationImage;
}

interface LocationImagesStepProps {
  data: LocationImagesData;
  onChange: (data: Partial<LocationImagesData>) => void;
}

const LocationImagesStep: React.FC<LocationImagesStepProps> = ({ data, onChange }) => {
  const handleImageUpload = (section: keyof LocationImagesData, file: File) => {
    const timestamp = new Date().toISOString();
    onChange({
      [section]: {
        ...data[section],
        file,
        timestamp,
      }
    });
  };

  const handleGPSChange = (section: keyof LocationImagesData, gps: string) => {
    onChange({
      [section]: {
        ...data[section],
        gps,
      }
    });
  };

  const removeImage = (section: keyof LocationImagesData) => {
    onChange({
      [section]: {
        file: null,
        timestamp: '',
        gps: data[section].gps || '',
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">
            Images
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload exactly 1 image for each work stage (before, during, after)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImageUploadSection
              title="Before Work Image"
              section="beforeWork"
              data={data.beforeWork}
              onImageUpload={handleImageUpload}
              onGPSChange={handleGPSChange}
              onRemoveImage={removeImage}
            />
            <ImageUploadSection
              title="During Work Image"
              section="duringWork"
              data={data.duringWork}
              onImageUpload={handleImageUpload}
              onGPSChange={handleGPSChange}
              onRemoveImage={removeImage}
            />
            <ImageUploadSection
              title="After Work Image"
              section="afterWork"
              data={data.afterWork}
              onImageUpload={handleImageUpload}
              onGPSChange={handleGPSChange}
              onRemoveImage={removeImage}
            />
          </div>

          <ImageGuidelines />
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationImagesStep;

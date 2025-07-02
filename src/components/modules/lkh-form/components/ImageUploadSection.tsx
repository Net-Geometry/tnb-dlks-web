
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Trash2, MapPin } from 'lucide-react';

interface LocationImage {
  file: File | null;
  timestamp: string;
  gps?: string;
}

interface ImageUploadSectionProps {
  title: string;
  section: string;
  data: LocationImage;
  onImageUpload: (section: string, file: File) => void;
  onGPSChange: (section: string, gps: string) => void;
  onRemoveImage: (section: string) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  title,
  section,
  data,
  onImageUpload,
  onGPSChange,
  onRemoveImage
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(section, file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Camera className="w-4 h-4 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.file ? (
          <div className="space-y-3">
            <div className="relative">
              <img
                src={URL.createObjectURL(data.file)}
                alt={title}
                className="w-full h-48 object-cover rounded-lg border"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveImage(section)}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-sm text-gray-900">
              <p className="font-medium">1 Image Uploaded</p>
            </div>
            
            {data.timestamp && (
              <div className="text-xs text-gray-500">
                <strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Upload or capture 1 image
            </p>
            <p className="text-xs text-gray-500 mb-3">
              {title.toLowerCase()}
            </p>
            <div className="flex gap-2 justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id={`upload-${section}`}
              />
              <label htmlFor={`upload-${section}`}>
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </span>
                </Button>
              </label>
              
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
                id={`camera-${section}`}
              />
              <label htmlFor={`camera-${section}`}>
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </span>
                </Button>
              </label>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={`gps-${section}`} className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            GPS Coordinates (Optional)
          </Label>
          <Input
            id={`gps-${section}`}
            value={data.gps || ''}
            onChange={(e) => onGPSChange(section, e.target.value)}
            placeholder="e.g., 3.1390, 101.6869"
            className="text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;

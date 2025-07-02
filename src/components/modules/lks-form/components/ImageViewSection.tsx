
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';

interface LocationImage {
  file: File | null;
  timestamp: string;
  gps?: string;
  isValidated?: boolean;
  imageUrl?: string;
}

interface ImageViewSectionProps {
  title: string;
  section: string;
  lkhImage?: LocationImage;
}

const ImageViewSection: React.FC<ImageViewSectionProps> = ({ title, section, lkhImage }) => {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Camera className="w-4 h-4 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lkhImage?.imageUrl ? (
          <div className="space-y-3">
            <div className="relative">
              <img
                src={lkhImage.imageUrl}
                alt={title}
                className="w-full h-48 object-cover rounded-lg border"
              />
              <div className="absolute top-2 right-2">
                <Badge 
                  variant={lkhImage.isValidated ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {lkhImage.isValidated ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {lkhImage.isValidated ? "Validated" : "Not Validated"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-gray-600">
              {lkhImage.timestamp && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span><strong>Timestamp:</strong> {new Date(lkhImage.timestamp).toLocaleString()}</span>
                </div>
              )}
              
              {lkhImage.gps && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span><strong>GPS Coordinates:</strong> {lkhImage.gps}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
            <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium mb-1">
              No image available for this stage
            </p>
            <p className="text-xs text-gray-500">
              Image was not captured during the LKH phase
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageViewSection;

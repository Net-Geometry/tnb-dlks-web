
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, Clock } from 'lucide-react';

const JIBModule = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Construction className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            JIB Module
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Under Development</span>
            </div>
            <p className="text-gray-600">
              This module is currently being developed and will be available soon.
            </p>
            <p className="text-sm text-gray-500">
              Please check back later for updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JIBModule;

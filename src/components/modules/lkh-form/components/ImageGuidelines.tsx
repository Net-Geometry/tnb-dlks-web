
import React from 'react';

const ImageGuidelines: React.FC = () => {
  return (
    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h4 className="font-medium text-yellow-900 mb-2">Image Guidelines:</h4>
      <ul className="text-sm text-yellow-700 space-y-1">
        <li>• Upload exactly 1 clear, well-lit photo for each work stage</li>
        <li>• Include relevant equipment, materials, and surroundings</li>
        <li>• GPS coordinates help with location verification</li>
        <li>• Timestamps are automatically recorded</li>
      </ul>
    </div>
  );
};

export default ImageGuidelines;

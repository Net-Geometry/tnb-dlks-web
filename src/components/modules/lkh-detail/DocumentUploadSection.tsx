
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  uploaded: boolean;
  verified: boolean;
}

interface DocumentUploadSectionProps {
  documents: Document[];
  canValidate: boolean;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ documents, canValidate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Document Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={doc.uploaded ? "default" : "outline"} className="text-xs">
                  {doc.uploaded ? "Uploaded" : "Missing"}
                </Badge>
                <div className="flex items-center gap-1">
                  {doc.verified ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs ${doc.verified ? "text-green-700" : "text-red-700"}`}>
                    {doc.verified ? "Verified" : "Unverified"}
                  </span>
                </div>
                {canValidate && !doc.verified && (
                  <Button size="sm" variant="outline" className="ml-2">
                    Verify
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadSection;

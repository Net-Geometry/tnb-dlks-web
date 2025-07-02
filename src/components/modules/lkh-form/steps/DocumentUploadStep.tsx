
import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Trash2, File } from 'lucide-react';

interface DocumentItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface DocumentUploadStepProps {
  data: DocumentItem[];
  onChange: (data: DocumentItem[]) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ data, onChange }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles: DocumentItem[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.ms-excel'
    ];

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not a supported format. Please upload PDF, DOCX, or XLSX files.`);
        return;
      }

      validFiles.push({
        id: `doc-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    });

    if (validFiles.length > 0) {
      onChange([...data, ...validFiles]);
    }
  }, [data, onChange]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.files = files;
    handleFileUpload({ target: input } as any);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const removeDocument = (id: string) => {
    onChange(data.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (type.includes('word')) return <FileText className="w-6 h-6 text-blue-500" />;
    if (type.includes('sheet') || type.includes('excel')) return <File className="w-6 h-6 text-green-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">
            Document Upload
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload supporting documents (PDF, DOCX, XLSX) - Max 10MB per file
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          >
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.xlsx,.doc,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop files here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files
              </p>
              <Button variant="outline" type="button">
                Choose Files
              </Button>
            </label>
          </div>

          {/* File List */}
          {data.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
              <div className="space-y-2">
                {data.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getFileIcon(doc.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(doc.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Upload Guidelines:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Supported formats: PDF, DOCX, XLSX</li>
              <li>• Maximum file size: 10MB per file</li>
              <li>• You can upload multiple files at once</li>
              <li>• Documents should be clear and legible</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUploadStep;

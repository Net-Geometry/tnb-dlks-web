
import React, { useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Trash2, File, AlertCircle, CheckCircle } from 'lucide-react';
import { getRequiredDocuments, validateRequiredDocuments, DocumentRequirement } from '@/utils/lksDocumentMatrix';

interface DocumentFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface DynamicDocumentUploadStepProps {
  selectedJobScopes: string[];
  uploadedDocuments: { [key: string]: DocumentFile[] };
  onChange: (documentId: string, files: DocumentFile[]) => void;
}

const DynamicDocumentUploadStep: React.FC<DynamicDocumentUploadStepProps> = ({ 
  selectedJobScopes, 
  uploadedDocuments, 
  onChange 
}) => {
  const requiredDocuments = useMemo(() => 
    getRequiredDocuments(selectedJobScopes), 
    [selectedJobScopes]
  );

  const validationResult = useMemo(() => {
    // Convert DocumentFile[] to File[] for validation
    const filesForValidation: { [key: string]: File[] } = {};
    Object.keys(uploadedDocuments).forEach(key => {
      filesForValidation[key] = uploadedDocuments[key].map(docFile => docFile.file);
    });
    return validateRequiredDocuments(selectedJobScopes, filesForValidation);
  }, [selectedJobScopes, uploadedDocuments]);

  const handleFileUpload = useCallback((documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles: DocumentFile[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.ms-excel',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not a supported format. Please upload PDF, DOCX, XLSX, or image files.`);
        return;
      }

      validFiles.push({
        id: `${documentId}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    });

    if (validFiles.length > 0) {
      const currentFiles = uploadedDocuments[documentId] || [];
      onChange(documentId, [...currentFiles, ...validFiles]);
    }
  }, [uploadedDocuments, onChange]);

  const removeDocument = (documentId: string, fileId: string) => {
    const currentFiles = uploadedDocuments[documentId] || [];
    onChange(documentId, currentFiles.filter(file => file.id !== fileId));
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
    if (type.includes('image')) return <File className="w-6 h-6 text-purple-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const DocumentUploadSection: React.FC<{ document: DocumentRequirement }> = ({ document }) => {
    const files = uploadedDocuments[document.id] || [];
    const hasFiles = files.length > 0;
    const isComplete = !document.required || hasFiles;

    return (
      <Card className={`border-2 ${document.required ? (isComplete ? 'border-green-200' : 'border-red-200') : 'border-gray-200'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {isComplete ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                {document.name}
              </CardTitle>
              {document.description && (
                <p className="text-xs text-gray-500 mt-1">{document.description}</p>
              )}
            </div>
            <Badge variant={document.required ? "destructive" : "secondary"} className="text-xs ml-2">
              {document.required ? "Required" : "Optional"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Zone */}
          <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.xlsx,.doc,.xls,.jpg,.jpeg,.png,.gif"
              onChange={(e) => handleFileUpload(document.id, e)}
              className="hidden"
              id={`upload-${document.id}`}
            />
            <label htmlFor={`upload-${document.id}`} className="cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Choose files
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOCX, XLSX, or Images
              </p>
            </label>
          </div>

          {/* File List */}
          {hasFiles && (
            <div className="space-y-2">
              {files.map((file) => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-xs">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(document.id, file.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (selectedJobScopes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Scope Selected</h3>
          <p className="text-gray-600">
            Please select at least one job scope to see the required documents.
          </p>
        </CardContent>
      </Card>
    );
  }

  const requiredDocs = requiredDocuments.filter(doc => doc.required);
  const optionalDocs = requiredDocuments.filter(doc => !doc.required);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">
            Document Upload
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload documents based on selected job scope: {selectedJobScopes.join(', ')}
          </p>
        </CardHeader>
        <CardContent>
          {/* Validation Summary */}
          <div className={`p-4 rounded-lg border mb-6 ${
            validationResult.isValid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {validationResult.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <div>
                <p className={`font-medium ${
                  validationResult.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validationResult.isValid 
                    ? 'All required documents uploaded' 
                    : `${validationResult.missingDocuments.length} required document(s) missing`
                  }
                </p>
                {!validationResult.isValid && (
                  <p className="text-sm text-red-600 mt-1">
                    Missing: {validationResult.missingDocuments.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required Documents */}
      {requiredDocs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Required Documents ({requiredDocs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredDocs.map((doc) => (
                <DocumentUploadSection key={doc.id} document={doc} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optional Documents */}
      {optionalDocs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-gray-600 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Optional Documents ({optionalDocs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {optionalDocs.map((doc) => (
                <DocumentUploadSection key={doc.id} document={doc} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Upload Guidelines:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Supported formats: PDF, DOCX, XLSX, JPG, PNG, GIF</li>
          <li>• Maximum file size: 10MB per file</li>
          <li>• You can upload multiple files per document type</li>
          <li>• All required documents must be uploaded before submission</li>
          <li>• Documents should be clear and legible</li>
        </ul>
      </div>
    </div>
  );
};

export default DynamicDocumentUploadStep;

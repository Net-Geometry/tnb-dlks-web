
import { useState, useCallback } from 'react';
import { validateRequiredDocuments } from '@/utils/lksDocumentMatrix';

interface DocumentFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

export const useDocumentUpload = (selectedJobScopes: string[]) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<{ [key: string]: DocumentFile[] }>({});

  const updateDocuments = useCallback((documentId: string, files: DocumentFile[]) => {
    setUploadedDocuments(prev => ({
      ...prev,
      [documentId]: files
    }));
  }, []);

  const removeAllDocuments = useCallback((documentId: string) => {
    setUploadedDocuments(prev => {
      const updated = { ...prev };
      delete updated[documentId];
      return updated;
    });
  }, []);

  const clearAllDocuments = useCallback(() => {
    setUploadedDocuments({});
  }, []);

  const getValidationResult = useCallback(() => {
    // Convert DocumentFile[] to File[] for validation
    const filesForValidation: { [key: string]: File[] } = {};
    Object.keys(uploadedDocuments).forEach(key => {
      filesForValidation[key] = uploadedDocuments[key].map(docFile => docFile.file);
    });
    return validateRequiredDocuments(selectedJobScopes, filesForValidation);
  }, [selectedJobScopes, uploadedDocuments]);

  const getTotalFileCount = useCallback(() => {
    return Object.values(uploadedDocuments).reduce((total, files) => total + files.length, 0);
  }, [uploadedDocuments]);

  const getDocumentsByType = useCallback((documentId: string) => {
    return uploadedDocuments[documentId] || [];
  }, [uploadedDocuments]);

  return {
    uploadedDocuments,
    updateDocuments,
    removeAllDocuments,
    clearAllDocuments,
    getValidationResult,
    getTotalFileCount,
    getDocumentsByType
  };
};

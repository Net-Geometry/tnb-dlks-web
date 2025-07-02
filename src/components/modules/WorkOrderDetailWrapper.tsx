
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkOrderDetail from './WorkOrderDetail';

const WorkOrderDetailWrapper: React.FC = () => {
  const { id, documentType } = useParams<{ id: string; documentType: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard/amk-akk-management');
  };

  if (!id || !documentType) {
    return <div>Invalid parameters</div>;
  }

  if (documentType !== 'AMK' && documentType !== 'AKK') {
    return <div>Invalid document type</div>;
  }

  return (
    <WorkOrderDetail
      documentId={id}
      documentType={documentType as 'AMK' | 'AKK'}
      onBack={handleBack}
    />
  );
};

export default WorkOrderDetailWrapper;

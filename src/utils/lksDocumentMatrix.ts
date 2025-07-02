
export interface DocumentRequirement {
  id: string;
  name: string;
  required: boolean;
  description?: string;
}

export interface JobScopeDocuments {
  [key: string]: DocumentRequirement[];
}

// Document definitions
export const DOCUMENT_TYPES = {
  AMK_AKK: {
    id: 'amk_akk',
    name: 'Arahan Mula Kerja (AMK)/Arahan Kerja Kecemasan (AKK)',
    description: 'Work commencement or emergency work order'
  },
  JMS: {
    id: 'jms',
    name: 'Joint Measurement Sheet (JMS)',
    description: 'Joint measurement documentation'
  },
  EQUIPMENT_SCHEDULE: {
    id: 'equipment_schedule',
    name: 'Jadual Imbangan Penggunaan Barang',
    description: 'Equipment usage schedule'
  },
  AS_BUILT_DRAWING: {
    id: 'as_built_drawing',
    name: 'As Built Drawing',
    description: 'Final construction drawings'
  },
  GI_SLIP: {
    id: 'gi_slip',
    name: 'GI Slip (Credit or Scrap)',
    description: 'Material credit or scrap slip'
  },
  DELIVERY_SLIP: {
    id: 'delivery_slip',
    name: 'Delivery Slip',
    description: 'Material delivery documentation'
  },
  WORK_IMAGES: {
    id: 'work_images',
    name: 'Gambar Sebelum, Semasa, Selepas berwarna',
    description: 'Before, during, and after work images'
  },
  HDD_PROFILE: {
    id: 'hdd_profile',
    name: 'HDD Profile',
    description: 'Horizontal directional drilling profile (HDD specific)'
  },
  TESTING_REPORT: {
    id: 'testing_report',
    name: 'Laporan Pengujian',
    description: 'Testing report (if required)'
  }
};

// Job scope document requirements matrix
export const JOB_SCOPE_DOCUMENTS: JobScopeDocuments = {
  'Pencawang': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.EQUIPMENT_SCHEDULE, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ],
  'Civil': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.EQUIPMENT_SCHEDULE, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ],
  'Mill & Pave': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ],
  'HDD': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.EQUIPMENT_SCHEDULE, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true },
    { ...DOCUMENT_TYPES.HDD_PROFILE, required: true }
  ],
  'Jointing': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.EQUIPMENT_SCHEDULE, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ],
  'Pengujian': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true },
    { ...DOCUMENT_TYPES.TESTING_REPORT, required: false }
  ],
  'Umap': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ],
  'Street Lighting': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ],
  'Metering AMI': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ],
  'Metering DO': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ],
  'SCADA': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ],
  'Protection': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ],
  'Rehab': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.EQUIPMENT_SCHEDULE, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ],
  'Turnkey': [
    { ...DOCUMENT_TYPES.AMK_AKK, required: true },
    { ...DOCUMENT_TYPES.JMS, required: true },
    { ...DOCUMENT_TYPES.EQUIPMENT_SCHEDULE, required: true },
    { ...DOCUMENT_TYPES.AS_BUILT_DRAWING, required: true },
    { ...DOCUMENT_TYPES.GI_SLIP, required: true },
    { ...DOCUMENT_TYPES.DELIVERY_SLIP, required: true },
    { ...DOCUMENT_TYPES.WORK_IMAGES, required: true }
  ]
};

export const getRequiredDocuments = (selectedJobScopes: string[]): DocumentRequirement[] => {
  if (selectedJobScopes.length === 0) return [];

  // Get all documents from selected job scopes
  const allDocuments = selectedJobScopes.flatMap(scope => 
    JOB_SCOPE_DOCUMENTS[scope] || []
  );

  // Remove duplicates and merge requirements
  const documentMap = new Map<string, DocumentRequirement>();
  
  allDocuments.forEach(doc => {
    const existing = documentMap.get(doc.id);
    if (!existing) {
      documentMap.set(doc.id, { ...doc });
    } else {
      // If any job scope requires it, it becomes required
      documentMap.set(doc.id, {
        ...existing,
        required: existing.required || doc.required
      });
    }
  });

  return Array.from(documentMap.values()).sort((a, b) => {
    // Sort required documents first, then by name
    if (a.required !== b.required) {
      return a.required ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
};

export const validateRequiredDocuments = (
  selectedJobScopes: string[], 
  uploadedDocuments: { [key: string]: File[] }
): { isValid: boolean; missingDocuments: string[] } => {
  const requiredDocs = getRequiredDocuments(selectedJobScopes);
  const requiredDocIds = requiredDocs.filter(doc => doc.required).map(doc => doc.id);
  
  const missingDocuments = requiredDocIds.filter(docId => {
    const files = uploadedDocuments[docId];
    return !files || files.length === 0;
  });

  return {
    isValid: missingDocuments.length === 0,
    missingDocuments: missingDocuments.map(docId => 
      requiredDocs.find(doc => doc.id === docId)?.name || docId
    )
  };
};

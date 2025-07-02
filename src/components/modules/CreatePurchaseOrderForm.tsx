
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface PODetails {
  projectNo: string;
  contractorName: string;
  poAmount: string;
  workDescription: string;
  jobScope: string;
  lineItems: LineItem[];
}

interface CreatePurchaseOrderFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// Mock function to simulate fetching PO details
const fetchPODetails = async (poNumber: string): Promise<PODetails | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data based on PO number pattern
  if (poNumber.match(/^PO-\d{4}-\d{3}$/)) {
    return {
      projectNo: `TNB-2024-PROJECT-${poNumber.split('-')[2]}`,
      contractorName: poNumber.endsWith('001') ? 'Siemens Malaysia Sdn Bhd' : 
                     poNumber.endsWith('002') ? 'Nexans Malaysia Sdn Bhd' :
                     'PowerTech Solutions Sdn Bhd',
      poAmount: `RM ${(Math.random() * 500000 + 50000).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`,
      workDescription: 'High Voltage Equipment Installation and Maintenance',
      jobScope: 'Supply, installation, testing and commissioning of electrical equipment including transformers, switchgear, and protection systems.',
      lineItems: [
        {
          id: '1',
          description: 'High Voltage Transformer 132kV',
          quantity: 2,
          unitPrice: 75000,
          totalPrice: 150000
        },
        {
          id: '2',
          description: 'Protection Relay System',
          quantity: 4,
          unitPrice: 12500,
          totalPrice: 50000
        },
        {
          id: '3',
          description: 'Installation & Commissioning',
          quantity: 1,
          unitPrice: 25000,
          totalPrice: 25000
        }
      ]
    };
  }
  return null;
};

const CreatePurchaseOrderForm = ({ onClose, onSubmit }: CreatePurchaseOrderFormProps) => {
  const [poNumber, setPONumber] = useState('');
  const [poDetails, setPODetails] = useState<PODetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidPO, setIsValidPO] = useState(false);

  const validateAndFetchPO = async () => {
    if (!poNumber.trim()) {
      setError('PO Number is required');
      return;
    }

    // Validate PO Number format (e.g., PO-2024-001)
    const poPattern = /^PO-\d{4}-\d{3}$/;
    if (!poPattern.test(poNumber)) {
      setError('Invalid PO Number format. Expected format: PO-YYYY-XXX (e.g., PO-2024-001)');
      setIsValidPO(false);
      setPODetails(null);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const details = await fetchPODetails(poNumber);
      if (details) {
        setPODetails(details);
        setIsValidPO(true);
        setError('');
      } else {
        setError('PO Number not found in system');
        setIsValidPO(false);
        setPODetails(null);
      }
    } catch (err) {
      setError('Failed to fetch PO details. Please try again.');
      setIsValidPO(false);
      setPODetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePONumberBlur = () => {
    if (poNumber.trim()) {
      validateAndFetchPO();
    }
  };

  const handleSubmit = () => {
    if (isValidPO && poDetails) {
      onSubmit({
        poNumber,
        ...poDetails
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Create New Purchase Order</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Purchase Order Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PO Number Field */}
              <div className="md:col-span-2">
                <Label htmlFor="poNumber" className="text-sm font-medium">
                  PO Number <span className="text-red-500">*</span>
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="poNumber"
                    value={poNumber}
                    onChange={(e) => setPONumber(e.target.value)}
                    onBlur={handlePONumberBlur}
                    placeholder="e.g., PO-2024-001"
                    className={`${error ? 'border-red-500' : isValidPO ? 'border-green-500' : ''}`}
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  {isValidPO && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                  {error && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                  )}
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
              </div>

              {/* Auto-populated fields */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Project No.</Label>
                <Input
                  value={poDetails?.projectNo || ''}
                  readOnly
                  className="mt-1 bg-gray-50"
                  placeholder="Auto-generated"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Contractor Name</Label>
                <Input
                  value={poDetails?.contractorName || ''}
                  readOnly
                  className="mt-1 bg-gray-50"
                  placeholder="Auto-generated"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">PO Amount</Label>
                <Input
                  value={poDetails?.poAmount || ''}
                  readOnly
                  className="mt-1 bg-gray-50"
                  placeholder="Auto-generated"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Work Description</Label>
                <Input
                  value={poDetails?.workDescription || ''}
                  readOnly
                  className="mt-1 bg-gray-50"
                  placeholder="Auto-generated"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Job Scope</Label>
                <textarea
                  value={poDetails?.jobScope || ''}
                  readOnly
                  className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm resize-none"
                  rows={3}
                  placeholder="Auto-generated"
                />
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          {poDetails?.lineItems && poDetails.lineItems.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-3 text-gray-900">Line Order Items in PO</h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Item Description</TableHead>
                      <TableHead className="font-semibold text-center">Qty</TableHead>
                      <TableHead className="font-semibold text-right">Unit Price (RM)</TableHead>
                      <TableHead className="font-semibold text-right">Total (RM)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poDetails.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {item.unitPrice.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {item.totalPrice.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isValidPO || !poDetails}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Create Purchase Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePurchaseOrderForm;

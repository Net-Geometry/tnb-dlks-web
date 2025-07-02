
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorkLineItemData {
  serviceId: string;
  description: string;
  unit: string;
  unitRate: number;
}

interface WorkLineItemStepProps {
  data: WorkLineItemData;
  onChange: (data: Partial<WorkLineItemData>) => void;
  serviceId: string;
}

const WorkLineItemStep: React.FC<WorkLineItemStepProps> = ({ data, onChange, serviceId }) => {
  // Mock data - in real app, this would be fetched based on serviceId
  const mockWorkItemData = {
    serviceId: serviceId || "2010105",
    description: "Supply&Install,Operating Handle,11kV,D - Comprehensive maintenance and upgrade of electrical substation equipment including transformer servicing, switchgear inspection, and protective relay testing.",
    unit: "UNIT",
    unitRate: 163.90
  };

  useEffect(() => {
    // Auto-populate when serviceId is available and data is empty
    if (serviceId && (!data.serviceId || !data.description)) {
      console.log('Auto-populating work line item data:', mockWorkItemData);
      onChange(mockWorkItemData);
    }
  }, [serviceId, data.serviceId, data.description]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">
            Work Line Item Details
          </CardTitle>
          <p className="text-sm text-gray-600">
            These details are auto-generated from the selected Purchase Order
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="serviceId">Service ID</Label>
              <Input
                id="serviceId"
                value={data.serviceId}
                readOnly
                className="bg-gray-50 border-gray-200"
                placeholder="Service ID will be auto-filled"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={data.unit} disabled>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Unit will be auto-filled" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNIT">UNIT</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="KG">KG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              readOnly
              rows={4}
              className="bg-gray-50 border-gray-200 resize-none"
              placeholder="Description will be auto-filled from Purchase Order"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitRate">Unit Rate (RM)</Label>
            <Input
              id="unitRate"
              type="number"
              value={data.unitRate}
              readOnly
              step="0.01"
              className="bg-gray-50 border-gray-200"
              placeholder="0.00"
            />
          </div>

          {!data.serviceId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 text-sm">
                <strong>Note:</strong> Work line item details will be automatically populated once you select a linked Purchase Order or Work Instruction.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkLineItemStep;

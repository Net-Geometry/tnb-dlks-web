
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Save, Send, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const AKKForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    akkNumber: '',
    complaintNumber: '',
    dateIssued: new Date(),
    contractorName: '',
    contractorAddress: '',
    postalCode: '',
    cityDistrict: '',
    state: '',
    phoneNumber: '',
    workType: '',
    workLocation: '',
    generalInstructions: '',
    issuerName: '',
    employeeNumber: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your AKK form has been saved as a draft.",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Form Submitted",
      description: "AKK Emergency Work Instruction has been submitted successfully.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Generated",
      description: "Your AKK form is being prepared for download.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/work-management')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Work Instruction (AKK)</h1>
            <p className="text-gray-600">Date: {format(formData.dateIssued, 'PPP')}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Emergency Instruction Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-900">1. Emergency Instruction Header</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="akkNumber">Emergency Instruction Number (AKK NO)</Label>
                  <Input 
                    id="akkNumber"
                    value={formData.akkNumber}
                    onChange={(e) => handleInputChange('akkNumber', e.target.value)}
                    placeholder="AKK-2024-XXX"
                  />
                </div>
                <div>
                  <Label htmlFor="complaintNumber">Complaint Number (NO ADUAN TCS)</Label>
                  <Input 
                    id="complaintNumber"
                    value={formData.complaintNumber}
                    onChange={(e) => handleInputChange('complaintNumber', e.target.value)}
                    placeholder="TCS-2024-XXX"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Date Issued (TARIKH DIKELUARKAN)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dateIssued && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateIssued ? format(formData.dateIssued, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dateIssued}
                        onSelect={(date) => handleInputChange('dateIssued', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Contractor Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-900">2. Contractor Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contractorName">Contractor Name (NAMA KONTRAKTOR)</Label>
                <Input 
                  id="contractorName"
                  value={formData.contractorName}
                  onChange={(e) => handleInputChange('contractorName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contractorAddress">Contractor Address (ALAMAT KONTRAKTOR)</Label>
                <Textarea 
                  id="contractorAddress"
                  value={formData.contractorAddress}
                  onChange={(e) => handleInputChange('contractorAddress', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code (POSKOD)</Label>
                  <Input 
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cityDistrict">City / District (BANDAR / DAERAH)</Label>
                  <Input 
                    id="cityDistrict"
                    value={formData.cityDistrict}
                    onChange={(e) => handleInputChange('cityDistrict', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State (NEGERI)</Label>
                  <Input 
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number (NO TELEFON)</Label>
                <Input 
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="03-XXXX-XXXX"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Work Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-900">3. Work Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workType">Work Type (JENIS KERJA)</Label>
                <Input 
                  id="workType"
                  value={formData.workType}
                  onChange={(e) => handleInputChange('workType', e.target.value)}
                  placeholder="Emergency Power Restoration, Cable Repair, etc."
                />
              </div>
              <div>
                <Label htmlFor="workLocation">Work Location (LOKASI KERJA)</Label>
                <Input 
                  id="workLocation"
                  value={formData.workLocation}
                  onChange={(e) => handleInputChange('workLocation', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="generalInstructions">General Instructions (ARAHAN AM)</Label>
                <Textarea 
                  id="generalInstructions"
                  value={formData.generalInstructions}
                  onChange={(e) => handleInputChange('generalInstructions', e.target.value)}
                  rows={4}
                  placeholder="Detailed instructions for the emergency work..."
                />
              </div>
              
              {/* Static Instruction Text */}
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-gray-700">
                  Please carry out the work as detailed below according to the specifications and pricing set in the TNB contract or schedule.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Issued By */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-900">4. Issued By</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issuerName">Issuer's Name (NAMA AP)</Label>
                  <Input 
                    id="issuerName"
                    value={formData.issuerName}
                    onChange={(e) => handleInputChange('issuerName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="employeeNumber">Employee Number (NO PEKERJA)</Label>
                  <Input 
                    id="employeeNumber"
                    value={formData.employeeNumber}
                    onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
                  />
                </div>
              </div>
              
              {/* Static Note */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-sm text-gray-700 font-medium">
                  Note: This work instruction must be accompanied by the original bill for payment claims. 
                  This is a computer-generated document, no signature is required.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 pb-8">
          <Button onClick={handleSaveDraft} variant="outline" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit} className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
            <Send className="w-4 h-4" />
            Submit
          </Button>
          <Button onClick={handleExportPDF} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AKKForm;

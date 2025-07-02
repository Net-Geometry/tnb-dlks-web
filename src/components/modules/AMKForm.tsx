import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, FileText, Save, Send, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const AMKForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    to: '',
    worksiteInfo: '',
    workLocation: '',
    projectNumber: '',
    workCode: '',
    purchaseOrderNumber: '',
    workTypes: {
      undergroundCable: false,
      cableLaying: false,
      powerSupply: false,
      substationWork: false,
      directConnection: false,
      hddWork: false,
      utilityMapping: false,
      millingPaving: false,
      liftingCrane: false,
      others: false,
      othersDescription: ''
    },
    preWorkChecklist: {
      workPlan: false,
      equipment: false,
      safetyEquipment: false,
      regulations: false
    },
    startDate: null,
    completionDate: null,
    contractorName: '',
    employeeNumber: '',
    position: ''
  });

  const [currentDate] = useState(new Date());

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      workTypes: {
        ...prev.workTypes,
        [type]: checked
      }
    }));
  };

  const handleChecklistChange = (item: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preWorkChecklist: {
        ...prev.preWorkChecklist,
        [item]: checked
      }
    }));
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your AMK form has been saved as a draft.",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Form Submitted",
      description: "AMK Work Start Instruction has been submitted successfully.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Generated",
      description: "Your AMK form is being prepared for download.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/work-management')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Work Start Instruction (AMK)</h1>
            <p className="text-gray-600">Date: {format(currentDate, 'PPP')}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Work Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">1. Work Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="to">To</Label>
                  <Input 
                    id="to"
                    value={formData.to}
                    onChange={(e) => handleInputChange('to', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="worksiteInfo">Worksite Information</Label>
                  <Input 
                    id="worksiteInfo"
                    value={formData.worksiteInfo}
                    onChange={(e) => handleInputChange('worksiteInfo', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="workLocation">Work Location</Label>
                  <Input 
                    id="workLocation"
                    value={formData.workLocation}
                    onChange={(e) => handleInputChange('workLocation', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="projectNumber">Project Number / User Connection Number</Label>
                  <Input 
                    id="projectNumber"
                    value={formData.projectNumber}
                    onChange={(e) => handleInputChange('projectNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="workCode">Work Code</Label>
                  <Input 
                    id="workCode"
                    value={formData.workCode}
                    onChange={(e) => handleInputChange('workCode', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
                  <Input 
                    id="purchaseOrderNumber"
                    value={formData.purchaseOrderNumber}
                    onChange={(e) => handleInputChange('purchaseOrderNumber', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Work Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">2. Work Type Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: 'undergroundCable', label: 'Underground Cable Work' },
                  { key: 'cableLaying', label: 'Cable Laying / Pole Installation' },
                  { key: 'powerSupply', label: 'Power Supply / Footpath Supply' },
                  { key: 'substationWork', label: 'Substation Installation / Dismantling' },
                  { key: 'directConnection', label: 'Direct Connection and Termination' },
                  { key: 'hddWork', label: 'HDD Work' },
                  { key: 'utilityMapping', label: 'Utility Mapping' },
                  { key: 'millingPaving', label: 'Milling and Paving' },
                  { key: 'liftingCrane', label: 'Lifting and Crane Work' },
                  { key: 'others', label: 'Others' }
                ].map((workType) => (
                  <div key={workType.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={workType.key}
                      checked={formData.workTypes[workType.key as keyof typeof formData.workTypes] as boolean}
                      onCheckedChange={(checked) => handleWorkTypeChange(workType.key, checked === true)}
                    />
                    <Label htmlFor={workType.key} className="text-sm">{workType.label}</Label>
                  </div>
                ))}
              </div>
              {formData.workTypes.others && (
                <div className="mt-4">
                  <Label htmlFor="othersDescription">Other Work Types (Please specify)</Label>
                  <Input 
                    id="othersDescription"
                    value={formData.workTypes.othersDescription}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      workTypes: { ...prev.workTypes, othersDescription: e.target.value }
                    }))}
                    placeholder="Please specify other work types"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Pre-Work Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">3. Pre-Work Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { key: 'workPlan', label: 'Prepare work plan' },
                  { key: 'equipment', label: 'Ensure sufficient equipment and usage' },
                  { key: 'safetyEquipment', label: 'Ensure sufficient safety equipment and usage' },
                  { key: 'regulations', label: 'Comply with TNB Work Regulations' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.key}
                      checked={formData.preWorkChecklist[item.key as keyof typeof formData.preWorkChecklist]}
                      onCheckedChange={(checked) => handleChecklistChange(item.key, checked === true)}
                    />
                    <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Safety Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">4. Safety Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-sm text-gray-700">
                  It is essential that all safety procedures and regulations are followed at all times while working on-site. 
                  This includes personal protective equipment (PPE) and other regulations stipulated by local authorities. 
                  You are also responsible for addressing all complaints and claims from local authorities (PBT) and the 
                  public while working on-site.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Work Duration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">5. Work Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => handleInputChange('startDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Estimated Completion Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.completionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.completionDate ? format(formData.completionDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.completionDate}
                        onSelect={(date) => handleInputChange('completionDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Plan Submission */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">6. Plan Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  The following documents are required within 7 days of task completion:
                </p>
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li>As-built drawings HT and LV</li>
                  <li>Earthing test result (if applicable)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Before and After Work Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">7. Before and After Work Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                <p className="text-sm text-gray-700">
                  Please provide images before and after the work is done.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 8: Credit and Scrap Period */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">8. Credit and Scrap Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                <p className="text-sm text-gray-700">
                  It is TNB's policy that all items must be credited and scrapped within 7 days from the completion date.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 9: Work Instruction Signatures */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">9. Work Instruction Signatures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Project Supervisor's Signature</Label>
                  <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                    Signature Area
                  </div>
                </div>
                <div>
                  <Label>EPI Signature</Label>
                  <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                    Signature Area
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 10: Work Acknowledgement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">10. Work Acknowledgement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contractorName">Contractor / Team Leader Name</Label>
                  <Input 
                    id="contractorName"
                    value={formData.contractorName}
                    onChange={(e) => handleInputChange('contractorName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="employeeNumber">Employee Number</Label>
                  <Input 
                    id="employeeNumber"
                    value={formData.employeeNumber}
                    onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input 
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Contractor Signature</Label>
                <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                  Signature Area
                </div>
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
          <Button onClick={handleSubmit} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
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

export default AMKForm;

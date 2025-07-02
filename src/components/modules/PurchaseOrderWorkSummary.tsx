import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Building,
  Calendar,
  DollarSign,
  FileText,
  User,
  Printer,
  Download,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit,
  Settings
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface WorkItem {
  id: string;
  type: 'original' | 'new' | 'adjustment';
  serviceId: string;
  description: string;
  unit: string;
  rate: number;
  quantityInPO: number;
  poAmount: number;
  actualQuantity: number;
  actualAmount: number;
  lkhSubmissions: any[];
  insertionOrder: number;
}

const PurchaseOrderWorkSummary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [nextInsertionOrder, setNextInsertionOrder] = useState(7);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);

  // Mock data - in real app, fetch based on ID
  const purchaseOrder = {
    id: "TNB-PO-001-2024",
    title: "Substation Maintenance - Shah Alam",
    projectNo: "TNB-2024-SM-001",
    contractor: "TNB Engineering Sdn Bhd",
    amount: "RM 275,000.00",
    workDescription: "Comprehensive maintenance and upgrade of electrical substation equipment including transformer servicing, switchgear inspection, and protective relay testing.",
    jobScope: "Transformer Maintenance, Switchgear Inspection, Relay Testing, Documentation",
    reviewDate: "2024-01-15"
  };

  const originalWorkSummaryData = [
    {
      id: "1",
      serviceId: "2010105",
      description: "Supply&Install,Operating Handle,11kV,D",
      unit: "UNIT",
      rate: 163.90,
      quantityInPO: 1,
      poAmount: 163.90,
      actualQuantity: 0,
      actualAmount: 0.00,
      lkhSubmissions: [
        {
          id: "LKS-2024-001",
          refNumber: "LKH (1)",
          status: "APPROVED",
          remarks: "Transformer oil analysis completed. All parameters within acceptable limits.",
          value: 15000,
          dateSubmitted: "2024-01-20 14:30",
          canEdit: true
        }
      ]
    },
    {
      id: "2",
      serviceId: "2010105",
      description: "Lay Single Core PVC/PVC,L.V.D",
      unit: "M",
      rate: 13.30,
      quantityInPO: 196,
      poAmount: 2606.80,
      actualQuantity: 0,
      actualAmount: 0.00,
      lkhSubmissions: [
        {
          id: "LKS-2024-002",
          refNumber: "LKH (2)",
          status: "PENDING",
          remarks: "Secondary transformer maintenance in progress.",
          value: 15000,
          dateSubmitted: "2024-01-22 09:15",
          canEdit: true
        }
      ]
    },
    {
      id: "3",
      serviceId: "2010107",
      description: "Lay Cable,Fuse Unit/VCB to Tx,LV,D",
      unit: "M",
      rate: 13.30,
      quantityInPO: 90,
      poAmount: 1197.00,
      actualQuantity: 0,
      actualAmount: 0.00,
      lkhSubmissions: []
    },
    {
      id: "4",
      serviceId: "2010107",
      description: "Inst,Tx,= 1500kVA,LV,D",
      unit: "UNIT",
      rate: 954.60,
      quantityInPO: 2,
      poAmount: 1909.20,
      actualQuantity: 0,
      actualAmount: 0.00,
      lkhSubmissions: []
    },
    {
      id: "5",
      serviceId: "2010107",
      description: "Inst,F/Pillar,1600A,LV,D",
      unit: "UNIT",
      rate: 340.10,
      quantityInPO: 2,
      poAmount: 680.20,
      actualQuantity: 0,
      actualAmount: 0.00,
      lkhSubmissions: []
    },
    {
      id: "6",
      serviceId: "2010212",
      description: "SUPP&INST,CABLE BOX,CCT BRK,TX,11kV,D",
      unit: "UNIT",
      rate: 104.30,
      quantityInPO: 4,
      poAmount: 417.20,
      actualQuantity: 0,
      actualAmount: 0.00,
      lkhSubmissions: []
    }
  ];

  // Initialize with original data on first render
  React.useEffect(() => {
    if (workItems.length === 0) {
      const initialItems: WorkItem[] = originalWorkSummaryData.map((item, index) => ({
        ...item,
        type: 'original' as const,
        insertionOrder: index + 1
      }));
      setWorkItems(initialItems);
    }
  }, []);

  // Get all items sorted by insertion order
  const getSortedWorkItems = () => {
    return [...workItems].sort((a, b) => a.insertionOrder - b.insertionOrder);
  };

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => {
      if (prev.includes(rowId)) {
        return prev.filter(id => id !== rowId);
      } else {
        return [rowId];
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBackToPODetails = () => {
    navigate(`/dashboard/purchase-order/detail/${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF for:', purchaseOrder.id);
  };

  const handleAddRow = () => {
    const newRowId = `new-${Date.now()}`;
    const newItem: WorkItem = {
      id: newRowId,
      type: 'new',
      serviceId: "",
      description: "",
      unit: "UNIT",
      rate: 0,
      quantityInPO: 0,
      poAmount: 0,
      actualQuantity: 0,
      actualAmount: 0,
      lkhSubmissions: [],
      insertionOrder: nextInsertionOrder
    };
    
    setWorkItems(prev => [...prev, newItem]);
    setNextInsertionOrder(prev => prev + 1);
    console.log('Adding new row with insertion order:', nextInsertionOrder);
  };

  const handleAdjustment = () => {
    const adjustmentId = `adjustment-${Date.now()}`;
    const adjustmentItem: WorkItem = {
      id: adjustmentId,
      type: 'adjustment',
      serviceId: "",
      description: "**ADJUSTMENT**",
      unit: "",
      rate: 0,
      quantityInPO: 0,
      poAmount: 0,
      actualQuantity: 0,
      actualAmount: 0,
      lkhSubmissions: [],
      insertionOrder: nextInsertionOrder
    };
    
    setWorkItems(prev => [...prev, adjustmentItem]);
    setNextInsertionOrder(prev => prev + 1);
    console.log('Adding adjustment row with insertion order:', nextInsertionOrder);
  };

  const handleDeleteRow = (rowId: string) => {
    setWorkItems(prev => prev.filter(item => item.id !== rowId));
    console.log('Deleting row:', rowId);
  };

  const handleNewLKH = (serviceId: string) => {
    navigate(`/dashboard/purchase-order/work-summary/${id}/new-lkh/${serviceId}`);
    console.log('Navigating to new LKH page for service:', serviceId);
  };

  const handleEditLKH = (lkhId: string) => {
    console.log('Editing LKH:', lkhId);
  };

  const handleViewLKH = (lkhId: string) => {
    navigate(`/dashboard/lkh-detail/${lkhId}`);
    console.log('Navigating to LKH detail page for:', lkhId);
  };

  const formatCurrency = (amount: number) => {
    return `RM${amount.toFixed(2)}`;
  };

  const calculateTotalPOAmount = () => {
    return originalWorkSummaryData.reduce((sum, item) => sum + item.poAmount, 0);
  };

  const calculateTotalActualAmount = () => {
    return originalWorkSummaryData.reduce((sum, item) => sum + item.actualAmount, 0);
  };

  const sortedWorkItems = getSortedWorkItems();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation & Title Bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="outline" onClick={handleBackToPODetails} className="flex items-center gap-2 mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to PO Details
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{purchaseOrder.title}</h1>
          <p className="text-lg text-gray-600">Work Summary – {purchaseOrder.id}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Purchase Order Work Summary Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Purchase Order Work Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Purchase Order No.</label>
                <p className="text-base font-semibold">{purchaseOrder.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Project No.</label>
                <p className="text-base">{purchaseOrder.projectNo}</p>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Contractor Name</label>
                  <p className="text-base">{purchaseOrder.contractor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Review Date</label>
                  <p className="text-base">{purchaseOrder.reviewDate}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">P.O. Amount</label>
                  <p className="text-base font-semibold text-green-600">{purchaseOrder.amount}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Work Description</label>
                  <p className="text-base leading-relaxed">{purchaseOrder.workDescription}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Job Scope</label>
                <p className="text-base">{purchaseOrder.jobScope}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Summary Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Work Summary Table</h2>
          <div className="flex gap-2">
            <Button onClick={handleAddRow} className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
              <Plus className="w-4 h-4" />
              Add Row
            </Button>
            <Button onClick={handleAdjustment} className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
              <Plus className="w-4 h-4" />
              Pelarasan
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-16">No.</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-20">Service ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 min-w-80">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-20">Unit</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-24">Rate (RM)</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 w-24">Quantity in PO</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-32">PO Amount (RM)</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 w-24">Actual Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-32">Actual Amount (RM)</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 w-24">Progress</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedWorkItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <tr className={`border-b border-gray-100 hover:bg-gray-50 ${
                    item.type === 'adjustment' ? 'bg-yellow-50' : 
                    item.type === 'new' ? 'bg-blue-50' : ''
                  }`}>
                    <td className="px-4 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {item.type === 'new' ? (
                        <input 
                          type="text" 
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          placeholder="Service ID"
                          defaultValue={item.serviceId}
                        />
                      ) : (
                        item.serviceId
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {item.type === 'new' ? (
                        <input 
                          type="text" 
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          placeholder="Description"
                          defaultValue={item.description}
                        />
                      ) : item.type === 'adjustment' ? (
                        <span className="font-bold text-gray-900">**ADJUSTMENT**</span>
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {item.type === 'new' ? (
                        <div className="flex items-center gap-1">
                          <select className="p-1 border border-gray-300 rounded text-sm">
                            <option value="UNIT">UNIT</option>
                            <option value="M">M</option>
                            <option value="KG">KG</option>
                          </select>
                        </div>
                      ) : item.type === 'adjustment' ? (
                        ""
                      ) : (
                        <div className="flex items-center gap-1">
                          {item.unit}
                          <ChevronDown className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {item.type === 'new' ? (
                        <input 
                          type="number" 
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          placeholder="0.00"
                          defaultValue={item.rate}
                          step="0.01"
                        />
                      ) : item.type === 'adjustment' ? (
                        ""
                      ) : (
                        item.rate
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-gray-900">
                      {item.type === 'new' ? (
                        <input 
                          type="number" 
                          className="w-full p-1 border border-gray-300 rounded text-sm text-center"
                          placeholder="0"
                          defaultValue={item.quantityInPO}
                        />
                      ) : item.type === 'adjustment' ? (
                        ""
                      ) : (
                        item.quantityInPO
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {item.type === 'adjustment' ? "" : formatCurrency(item.poAmount)}
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-gray-900">
                      {item.type === 'adjustment' ? "" : item.actualQuantity}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {item.type === 'adjustment' ? "" : formatCurrency(item.actualAmount)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {item.type !== 'adjustment' && (
                        <button 
                          onClick={() => toggleRowExpansion(item.id)}
                          className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        >
                          {expandedRows.includes(item.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            LKH ({item.lkhSubmissions.length})
                          </span>
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteRow(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  {expandedRows.includes(item.id) && item.type !== 'adjustment' && (
                    <tr>
                      <td colSpan={11} className="px-4 py-0">
                        <div className="bg-blue-50 p-4 border-l-4 border-blue-200 mx-4 mb-4 rounded">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800">LKH Submissions:</h4>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleNewLKH(item.serviceId)}
                                className="flex items-center gap-2"
                              >
                                <Plus className="w-3 h-3" />
                                New LKH
                              </Button>
                            </div>
                          </div>
                          {item.lkhSubmissions.length > 0 ? (
                            <div className="space-y-3">
                              {item.lkhSubmissions.map((lkh) => (
                                <div 
                                  key={lkh.id} 
                                  className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                                  onClick={() => handleViewLKH(lkh.id)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900">{lkh.refNumber}</span>
                                        <Badge className={getStatusColor(lkh.status)}>
                                          {lkh.status}
                                        </Badge>
                                      </div>
                                      <p className="text-gray-700 mb-2">{lkh.remarks}</p>
                                      <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{lkh.dateSubmitted}</span>
                                        <span className="font-semibold text-gray-900">{formatCurrency(lkh.value)}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      {lkh.canEdit && (
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditLKH(lkh.id);
                                          }}
                                          className="ml-1"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <p>No LKH submissions yet</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderWorkSummary;

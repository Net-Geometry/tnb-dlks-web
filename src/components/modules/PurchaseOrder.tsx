
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  ShoppingCart, 
  Calendar, 
  DollarSign,
  Building,
  FileCheck
} from 'lucide-react';

const PurchaseOrder = () => {
  const navigate = useNavigate();

  const purchaseOrders = [
    {
      id: "PO-2024-001",
      title: "High Voltage Transformers",
      vendor: "Siemens Malaysia",
      amount: "RM 450,000",
      status: "Approved",
      requestedBy: "Electrical Department",
      requestDate: "2024-01-10",
      deliveryDate: "2024-02-15"
    },
    {
      id: "PO-2024-002",
      title: "Underground Cables - 11kV",
      vendor: "Nexans Malaysia",
      amount: "RM 125,000",
      status: "Pending Approval",
      requestedBy: "Network Planning",
      requestDate: "2024-01-12",
      deliveryDate: "2024-01-25"
    },
    {
      id: "PO-2024-003",
      title: "Safety Equipment & Tools",
      vendor: "Safety First Sdn Bhd",
      amount: "RM 35,000",
      status: "In Transit",
      requestedBy: "Safety Department",
      requestDate: "2024-01-08",
      deliveryDate: "2024-01-20"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-purple-100 text-purple-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreatePO = () => {
    navigate('/dashboard/purchase-order/create');
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/dashboard/purchase-order/detail/${orderId}`);
  };

  const handleWorkSummary = (orderId: string) => {
    navigate(`/dashboard/purchase-order/work-summary/${orderId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Order Management</h1>
        <Button className="flex items-center gap-2" onClick={handleCreatePO}>
          <Plus className="w-4 h-4" />
          Create Purchase Order
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total POs</p>
                <p className="text-2xl font-bold">128</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <FileCheck className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">RM 2.1M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suppliers</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <Building className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search purchase orders by ID, vendor, or item..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders List */}
      <div className="grid gap-4">
        {purchaseOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-lg">{order.id}</span>
                  </div>
                  <CardTitle className="text-xl">{order.title}</CardTitle>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{order.vendor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">{order.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Requested: {order.requestDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Delivery: {order.deliveryDate}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Requested by: <span className="font-medium">{order.requestedBy}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(order.id)}>
                    View Details
                  </Button>
                  <Button size="sm" onClick={() => handleWorkSummary(order.id)}>
                    Work Summary
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PurchaseOrder;

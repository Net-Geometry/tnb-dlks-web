import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/ui/page-header";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Calendar,
  MapPin,
  User,
  Download,
  Eye,
  Edit,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LKSSubmission {
  id: string;
  title: string;
  poNumber: string;
  projectName: string;
  contractor: string;
  location: string;
  jobScope: string;
  preparedBy: string;
  status: "Draft" | "Submitted" | "Reviewed" | "Approved" | "Reupdate";
  submittedDate: string;
  totalAmount: string;
  workItems: number;
  comments: string;
  documents: {
    asBuiltDrawing?: string;
    hddProfile?: string;
    dataAsset?: string;
    testingReport?: string;
  };
  images: {
    before: string[];
    during: string[];
    after: string[];
  };
}

const LKSStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Mock data for demonstration
  const lksSubmissions: LKSSubmission[] = [
    {
      id: "LKS-2024-001",
      title: "Substation Maintenance - Shah Alam",
      poNumber: "PO-2024-001",
      projectName: "Shah Alam Electrical Upgrade",
      contractor: "KKB Contractor Sdn Bhd",
      location: "Shah Alam, Selangor",
      jobScope: "Electrical maintenance and testing",
      preparedBy: "Ahmad Rahman",
      status: "Approved",
      submittedDate: "2024-01-15",
      totalAmount: "RM 45,000",
      workItems: 5,
      comments: "All requirements met successfully",
      documents: {
        asBuiltDrawing: "drawing.pdf",
        hddProfile: "profile.pdf",
        dataAsset: "data.xlsx",
        testingReport: "test.pdf",
      },
      images: {
        before: ["before1.jpg", "before2.jpg"],
        during: ["during1.jpg"],
        after: ["after1.jpg", "after2.jpg"],
      },
    },
    {
      id: "LKS-2024-002",
      title: "Cable Installation - Petaling Jaya",
      poNumber: "PO-2024-002",
      projectName: "PJ Underground Cable Project",
      contractor: "KKB Contractor Sdn Bhd",
      location: "Petaling Jaya, Selangor",
      jobScope: "Underground cable installation",
      preparedBy: "John Smith",
      status: "Submitted",
      submittedDate: "2024-01-20",
      totalAmount: "RM 78,500",
      workItems: 8,
      comments: "Awaiting supervisor review",
      documents: {
        asBuiltDrawing: "drawing2.pdf",
        hddProfile: "profile2.pdf",
      },
      images: {
        before: ["before3.jpg"],
        during: ["during2.jpg", "during3.jpg"],
        after: ["after3.jpg"],
      },
    },
    {
      id: "LKS-2024-003",
      title: "Transformer Replacement - Klang",
      poNumber: "PO-2024-003",
      projectName: "Klang Industrial Zone Upgrade",
      contractor: "KKB Contractor Sdn Bhd",
      location: "Klang, Selangor",
      jobScope: "Transformer installation and testing",
      preparedBy: "Ahmad Rahman",
      status: "Draft",
      submittedDate: "",
      totalAmount: "RM 125,000",
      workItems: 12,
      comments: "Work in progress",
      documents: {},
      images: {
        before: [],
        during: [],
        after: [],
      },
    },
    {
      id: "LKS-2024-004",
      title: "Distribution Panel Upgrade - Kajang",
      poNumber: "PO-2024-004",
      projectName: "Kajang Commercial Area Enhancement",
      contractor: "KKB Contractor Sdn Bhd",
      location: "Kajang, Selangor",
      jobScope: "Distribution panel upgrade and testing",
      preparedBy: "Sarah Lee",
      status: "Reupdate",
      submittedDate: "2024-01-18",
      totalAmount: "RM 32,000",
      workItems: 4,
      comments:
        "Missing as-built drawings. Please resubmit with complete documentation.",
      documents: {
        testingReport: "test4.pdf",
      },
      images: {
        before: ["before4.jpg"],
        during: ["during4.jpg"],
        after: [],
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Reupdate":
        return "bg-orange-100 text-orange-800";
      case "Reviewed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Submitted":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "Draft":
        return <Edit className="w-4 h-4 text-gray-600" />;
      case "Reupdate":
        return <RefreshCw className="w-4 h-4 text-orange-600" />;
      case "Reviewed":
        return <Eye className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const canCreateLKS = () => {
    return (
      user?.user_metadata?.role === "KKB" ||
      user?.user_metadata?.role === "TNB Super Admin"
    );
  };

  const canViewAll = () => {
    return ["TNB Super Admin", "Senior Engineer", "Technician"].includes(
      user?.user_metadata?.role || ""
    );
  };

  const filteredSubmissions = lksSubmissions.filter((submission) => {
    const matchesSearch =
      submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.poNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || submission.status === statusFilter;
    const matchesRole = canViewAll() || submission.contractor === user?.company;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getSubmissionStats = () => {
    const userSubmissions = canViewAll()
      ? lksSubmissions
      : lksSubmissions.filter((s) => s.contractor === user?.company);

    return {
      total: userSubmissions.length,
      approved: userSubmissions.filter((s) => s.status === "Approved").length,
      submitted: userSubmissions.filter((s) => s.status === "Submitted").length,
      draft: userSubmissions.filter((s) => s.status === "Draft").length,
      reupdate: userSubmissions.filter((s) => s.status === "Reupdate").length,
    };
  };

  const stats = getSubmissionStats();

  const handleCreateNewLKS = () => {
    navigate("/lks-submission");
  };

  const handleViewDetails = (submissionId: string) => {
    navigate(`/lks-detail/${submissionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <PageHeader 
        title="LKS Submissions"
        subtitle="Manage and track Laporan Kerja Selesai submissions"
      >
        {canCreateLKS() && (
          <Button
            onClick={handleCreateNewLKS}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            Create New LKS
          </Button>
        )}
      </PageHeader>

      <div className="w-full px-6 py-8 space-y-6">

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.submitted}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.draft}
                </p>
              </div>
              <Edit className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reupdate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.reupdate}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by project title or PO number..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["All", "Draft", "Submitted", "Approved", "Reupdate"].map(
                (status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={
                      statusFilter === status
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }
                  >
                    {status}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LKS Submissions List */}
      <div className="grid gap-4">
        {filteredSubmissions.map((submission) => (
          <Card
            key={submission.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(submission.status)}
                    <span className="font-semibold text-lg">
                      {submission.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {submission.poNumber}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">
                    {submission.projectName}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{submission.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{submission.contractor}</span>
                    </div>
                    {submission.submittedDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{submission.submittedDate}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(submission.status)}>
                  {submission.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                {/* Project Details */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">
                    Project Details
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Total Amount:</span>
                      <span className="font-medium text-green-600">
                        {submission.totalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Work Items:</span>
                      <span className="font-medium">
                        {submission.workItems}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Prepared By:</span>
                      <span className="font-medium">
                        {submission.preparedBy}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Documents Status */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">
                    Documents
                  </h4>
                  <div className="space-y-1">
                    {Object.entries({
                      "As-built Drawing": submission.documents.asBuiltDrawing,
                      "HDD Profile": submission.documents.hddProfile,
                      "Data Asset": submission.documents.dataAsset,
                      "Testing Report": submission.documents.testingReport,
                    }).map(([doc, file]) => (
                      <div key={doc} className="flex justify-between text-sm">
                        <span>{doc}:</span>
                        <span
                          className={file ? "text-green-600" : "text-red-600"}
                        >
                          {file ? "✓" : "✗"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images Status */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Images</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Before:</span>
                      <span className="font-medium">
                        {submission.images.before.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>During:</span>
                      <span className="font-medium">
                        {submission.images.during.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>After:</span>
                      <span className="font-medium">
                        {submission.images.after.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              {submission.comments && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Comments:
                      </p>
                      <p className="text-sm text-gray-600">
                        {submission.comments}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">ID: {submission.id}</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(submission.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export PDF
                  </Button>
                  {(submission.status === "Draft" ||
                    submission.status === "Reupdate") &&
                    (user?.user_metadata?.role === "KKB" ||
                      user?.user_metadata?.company ===
                        submission.contractor) && (
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No LKS submissions found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "All"
                ? "Try adjusting your search or filter criteria"
                : "Create your first LKS submission to get started"}
            </p>
            {canCreateLKS() && (
              <Button
                onClick={handleCreateNewLKS}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create New LKS
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
};

export default LKSStatus;

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  ToggleLeft,
} from "lucide-react";
import type {
  Organization,
  UpdateOrganizationFormData,
} from "@/types/database";

// Organization types
const ORGANIZATION_TYPES = [
  { value: "government", label: "Government Agency" },
  { value: "contractor", label: "Contractor" },
  { value: "vendor", label: "Vendor/Supplier" },
  { value: "consultant", label: "Consultant" },
  { value: "maintenance", label: "Maintenance Provider" },
  { value: "utility", label: "Utility Company" },
  { value: "other", label: "Other" },
] as const;

interface EditOrganizationFormProps {
  organization: Organization;
  onSubmit: (data: UpdateOrganizationFormData) => Promise<void>;
  isLoading: boolean;
}

const EditOrganizationForm: React.FC<EditOrganizationFormProps> = ({
  organization,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<UpdateOrganizationFormData>({
    name: organization.name || "",
    type: organization.type || "",
    description: organization.description || "",
    location: organization.location || "",
    contact_phone: organization.contact_phone || "",
    contact_email: organization.contact_email || "",
    website: organization.website || "",
    is_active: organization.is_active !== false, // Default to true if undefined
  });

  const [errors, setErrors] = useState<Partial<UpdateOrganizationFormData>>({});

  // Update form when organization prop changes
  useEffect(() => {
    setFormData({
      name: organization.name || "",
      type: organization.type || "",
      description: organization.description || "",
      location: organization.location || "",
      contact_phone: organization.contact_phone || "",
      contact_email: organization.contact_email || "",
      website: organization.website || "",
      is_active: organization.is_active !== false,
    });
  }, [organization]);

  const handleInputChange = (
    field: keyof UpdateOrganizationFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateOrganizationFormData> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Organization type is required";
    }

    // Email validation
    if (
      formData.contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)
    ) {
      newErrors.contact_email = "Please enter a valid email address";
    }

    // Phone validation (Malaysian format)
    if (formData.contact_phone) {
      const phoneRegex = /^(\+?6?0)[0-9]{8,10}$/;
      if (!phoneRegex.test(formData.contact_phone.replace(/[\s-]/g, ""))) {
        newErrors.contact_phone = "Please enter a valid Malaysian phone number";
      }
    }

    // Website validation
    if (formData.website) {
      try {
        new URL(formData.website);
      } catch {
        newErrors.website = "Please enter a valid website URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Edit Organization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <ToggleLeft className="w-5 h-5 text-gray-600" />
              <div>
                <Label htmlFor="is_active" className="text-sm font-medium">
                  Organization Status
                </Label>
                <p className="text-sm text-gray-600">
                  {formData.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                handleInputChange("is_active", checked)
              }
              disabled={isLoading}
            />
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Organization Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter organization name"
                className={errors.name ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.name && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">
                Organization Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{errors.type}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Brief description of the organization"
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Office location or address"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="contact_phone"
                  className="flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Contact Phone
                </Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) =>
                    handleInputChange("contact_phone", e.target.value)
                  }
                  placeholder="e.g., +60123456789"
                  className={errors.contact_phone ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.contact_phone && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription>{errors.contact_phone}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="contact_email"
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Email
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) =>
                    handleInputChange("contact_email", e.target.value)
                  }
                  placeholder="contact@organization.com"
                  className={errors.contact_email ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.contact_email && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription>{errors.contact_email}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://www.organization.com"
                className={errors.website ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.website && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{errors.website}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Updating..." : "Update Organization"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditOrganizationForm;

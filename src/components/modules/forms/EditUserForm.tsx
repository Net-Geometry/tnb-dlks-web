import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  Save,
  X,
} from "lucide-react";
import { UserManagementService } from "@/services/userManagement";
import { PhoneNumberValidator } from "@/utils/phoneValidator";
import type {
  UpdateUserFormData,
  DlksUserRole,
  Profile,
} from "@/types/database";
import { MALAYSIAN_STATES } from "@/types/database";

// Validation schema for editing user (no password fields)
const editUserSchema = z.object({
  // Profile
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(255, "Full name is too long")
    .regex(
      /^[a-zA-Z\s.'/-]+$/,
      "Full name can only contain letters, spaces, and common punctuation"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const formatted = PhoneNumberValidator.validateAndFormat(val);
      return formatted && PhoneNumberValidator.isValidLength(formatted);
    }, "Please enter a valid Malaysian phone number (e.g., +60123456789, 0123456789)"),
  employee_id: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 50, "Employee ID is too long"),
  department: z.string().optional(),
  //   company: z.string().optional(), // This will be mapped to organization
  position: z.string().optional(),
  role_id: z
    .string()
    .min(1, "Please select a role")
    .uuid("Invalid role selection"),
  organization_id: z.string().optional(),

  // Address
  address_line_1: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address is too long"),
  address_line_2: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 500, "Address line 2 is too long"),
  city: z
    .string()
    .min(2, "City is required")
    .max(100, "City name is too long")
    .regex(/^[a-zA-Z\s.-]+$/, "City name contains invalid characters"),
  state: z
    .string()
    .min(2, "State is required")
    .refine(
      (val) => MALAYSIAN_STATES.includes(val as any),
      "Please select a valid Malaysian state"
    ),
  postal_code: z
    .string()
    .min(5, "Postal code is required")
    .max(10, "Postal code is too long")
    .regex(/^\d{5}$/, "Malaysian postal code must be 5 digits"),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
  user: Profile;
  onSuccess: (user: any) => void;
  onCancel: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const [roles, setRoles] = useState<DlksUserRole[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
  });

  // Load roles and organizations on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolesData, orgsData] = await Promise.all([
          UserManagementService.getRoles(),
          UserManagementService.getOrganizations(),
        ]);
        setRoles(rolesData);
        setOrganizations(orgsData);

        // Pre-populate form with user data
        const userAddress = user.dlks_profile_address?.[0];
        reset({
          full_name: user.name || "",
          email: user.email || "",
          phone: user.phone_number || "",
          employee_id: "", // This comes from auth metadata
          department: "", // This comes from auth metadata
          //   company: "", // This comes from auth metadata
          position: "", // This comes from auth metadata
          role_id: user.user_role || "",
          organization_id: user.organization_id || "",
          address_line_1: userAddress?.address?.split(",")[0] || "",
          address_line_2: userAddress?.address?.split(",")[1]?.trim() || "",
          city: userAddress?.city || "",
          state: userAddress?.state || "",
          postal_code: userAddress?.postal_code || "",
        });
      } catch (err) {
        setError("Failed to load form data");
      }
    };
    loadData();
  }, [user, reset]);

  const onSubmit = async (data: EditUserFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Format phone number if provided
      if (data.phone) {
        const formattedPhone = PhoneNumberValidator.validateAndFormat(
          data.phone
        );
        if (formattedPhone) {
          data.phone = formattedPhone;
        }
      }

      const updateData: UpdateUserFormData = {
        full_name: data.full_name,
        phone: data.phone,
        role_id: data.role_id,
        organization_id: data.organization_id,
      };

      const response = await UserManagementService.updateUser(
        user.id,
        updateData
      );

      if (response.success) {
        onSuccess(response.data);
      } else {
        setError(response.error || "Failed to update user");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update the user's basic personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Enter full name"
                {...register("full_name")}
                className={errors.full_name ? "border-red-500" : ""}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="user@tnb.com.my"
                  {...register("email")}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  placeholder="+60123456789 or 0123456789"
                  {...register("phone")}
                  className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Malaysian format only. Examples: +60123456789, 0123456789
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                placeholder="TNB001234"
                {...register("employee_id")}
                className={errors.employee_id ? "border-red-500" : ""}
              />
              {errors.employee_id && (
                <p className="text-sm text-red-500">
                  {errors.employee_id.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role & Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role & Organization
          </CardTitle>
          <CardDescription>
            Update the user's role and organization assignment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role_id">Role *</Label>
              <Controller
                name="role_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value || ""}
                  >
                    <SelectTrigger
                      className={errors.role_id ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role_id && (
                <p className="text-sm text-red-500">{errors.role_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization_id">Organization</Label>
              <Controller
                name="organization_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger
                      className={errors.organization_id ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.organization_id && (
                <p className="text-sm text-red-500">
                  {errors.organization_id.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address Information
          </CardTitle>
          <CardDescription>Update the user's address details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address_line_1">Address Line 1 *</Label>
              <Input
                id="address_line_1"
                placeholder="Street address, building name, etc."
                {...register("address_line_1")}
                className={errors.address_line_1 ? "border-red-500" : ""}
              />
              {errors.address_line_1 && (
                <p className="text-sm text-red-500">
                  {errors.address_line_1.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line_2">Address Line 2</Label>
              <Input
                id="address_line_2"
                placeholder="Apartment, suite, floor, etc."
                {...register("address_line_2")}
                className={errors.address_line_2 ? "border-red-500" : ""}
              />
              {errors.address_line_2 && (
                <p className="text-sm text-red-500">
                  {errors.address_line_2.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Kuala Lumpur"
                  {...register("city")}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={errors.state ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {MALAYSIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code *</Label>
                <Input
                  id="postal_code"
                  placeholder="50000"
                  {...register("postal_code")}
                  className={errors.postal_code ? "border-red-500" : ""}
                />
                {errors.postal_code && (
                  <p className="text-sm text-red-500">
                    {errors.postal_code.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Update Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditUserForm;

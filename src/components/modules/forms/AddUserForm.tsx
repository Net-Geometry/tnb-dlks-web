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
  Eye,
  EyeOff,
} from "lucide-react";
import { UserManagementService } from "@/services/userManagement";
import { PhoneNumberValidator } from "@/utils/phoneValidator";
import type { CreateUserFormData, DlksUserRole } from "@/types/database";
import { MALAYSIAN_STATES } from "@/types/database";

// Enhanced validation schema with Malaysian phone validation
const addUserSchema = z
  .object({
    // Authentication - Enhanced validation
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(255, "Email is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),

    // Profile - Enhanced validation
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(255, "Full name is too long")
      .regex(
        /^[a-zA-Z\s.'/-]+$/,
        "Full name can only contain letters, spaces, and common punctuation"
      ),
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
    // company: z.string().optional(), // This will be mapped to organization
    position: z.string().optional(),
    role_id: z
      .string()
      .min(1, "Please select a role")
      .uuid("Invalid role selection"),
    organization_id: z.string().optional(),

    // Address - Enhanced validation
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

    // Optional fields that are in the form but not required
    country: z.string().optional(),
    address_type: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type AddUserFormValues = z.infer<typeof addUserSchema>;

interface AddUserFormProps {
  onSuccess: (user: any) => void;
  onCancel: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess, onCancel }) => {
  const [roles, setRoles] = useState<DlksUserRole[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load roles and organizations on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolesData, orgsData, groupsData] = await Promise.all([
          UserManagementService.getRoles(),
          UserManagementService.getOrganizations(),
          UserManagementService.getUserGroups(),
        ]);

        console.log("Loaded roles:", rolesData);
        console.log("Loaded organizations:", orgsData);

        setRoles(rolesData);
        setOrganizations(orgsData);
        setUserGroups(groupsData);
      } catch (err) {
        console.error("Failed to load form data:", err);
        setError("Failed to load form data");
      }
    };
    loadData();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      organization_id: "",
      role_id: "", // Empty string instead of undefined
    },
  });

  const onSubmit = async (data: AddUserFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Debug: Log the form data to see what we're getting
      console.log("Form data before submission:", data);
      console.log("Role ID:", data.role_id, "Type:", typeof data.role_id);

      const response = await UserManagementService.createUser(
        data as CreateUserFormData
      );

      if (response.success) {
        onSuccess(response.data);
        reset();
      } else {
        setError(response.error || "Failed to create user");
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

      {/* Authentication Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Authentication Details
          </CardTitle>
          <CardDescription>
            Set up login credentials for the new user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@tnb.com.my"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_id">Role *</Label>
              <Controller
                name="role_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      console.log("Role selected:", value);
                      field.onChange(value); // Pass string value directly
                    }}
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
                  <Select onValueChange={(value) => field.onChange(value)}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter strong password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Personal and professional details of the user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Ahmad Rahman"
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+60 12-345-6789"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                placeholder="TNB-001234"
                {...register("employee_id")}
                className={errors.employee_id ? "border-red-500" : ""}
              />
              {errors.employee_id && (
                <p className="text-sm text-red-500">
                  {errors.employee_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="Senior Engineer"
                {...register("position")}
                className={errors.position ? "border-red-500" : ""}
              />
              {errors.position && (
                <p className="text-sm text-red-500">
                  {errors.position.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Electrical Operations"
                {...register("department")}
                className={errors.department ? "border-red-500" : ""}
              />
              {errors.department && (
                <p className="text-sm text-red-500">
                  {errors.department.message}
                </p>
              )}
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="TNB Distribution Sdn Bhd"
                {...register("company")}
                className={errors.company ? "border-red-500" : ""}
              />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              )}
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Address Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address Information
          </CardTitle>
          <CardDescription>
            Physical address details for the user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address_line_1">Address Line 1 *</Label>
            <Input
              id="address_line_1"
              placeholder="123, Jalan Merdeka"
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
              placeholder="Bandar Sri Damansara"
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
                  <Select onValueChange={field.onChange}>
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
                placeholder="52200"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register("country")}
                className={errors.country ? "border-red-500" : ""}
                defaultValue="Malaysia"
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_type">Address Type</Label>
              <Controller
                name="address_type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue="work">
                    <SelectTrigger>
                      <SelectValue placeholder="Select address type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create User
        </Button>
      </div>
    </form>
  );
};

export default AddUserForm;

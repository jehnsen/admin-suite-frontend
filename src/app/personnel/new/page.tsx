"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { personnelService, CreateEmployeeData } from "@/lib/api/services";

export default function NewPersonnelPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employee_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    position: "",
    department: "",
    employment_status: "",
    date_hired: "",
    email: "",
    contact_number: "",
    vacation_leave_credits: "15",
    sick_leave_credits: "15",
    special_leave_credits: "3",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.employee_number) newErrors.employee_number = "Employee number is required";
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.employment_status) newErrors.employment_status = "Employment status is required";
    if (!formData.date_hired) newErrors.date_hired = "Date hired is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.contact_number) newErrors.contact_number = "Phone is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);

      // Prepare data for API (with defaults for required fields not in form)
      const employeeData: CreateEmployeeData = {
        employee_number: formData.employee_number,
        first_name: formData.first_name,
        middle_name: formData.middle_name || undefined,
        last_name: formData.last_name,
        position: formData.position,
        department: formData.department,
        employment_status: formData.employment_status,
        date_hired: formData.date_hired,
        email: formData.email,
        contact_number: formData.contact_number,
        vacation_leave_credits: parseFloat(formData.vacation_leave_credits) || 15,
        sick_leave_credits: parseFloat(formData.sick_leave_credits) || 15,
        // Required fields with defaults (not in current form)
        birth_date: "1990-01-01", // Default placeholder
        sex: "Male", // Default placeholder
        civil_status: "Single", // Default placeholder
        address: "TBD", // To be determined
        salary_grade: 1, // Default
        step_increment: 1, // Default
        monthly_salary: 0, // Default
        status: "Active",
      };

      // Call API to create employee
      await personnelService.createEmployee(employeeData);

      // Success - redirect back to personnel list
      router.push("/personnel");
    } catch (err: any) {
      console.error("Failed to create employee:", err);
      setApiError(err.message || "Failed to create employee. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/personnel">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
          <p className="text-muted-foreground mt-1">
            Create a new employee record
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employee_number">
                      Employee Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="employee_number"
                      placeholder="EMP-2025-001"
                      value={formData.employee_number}
                      onChange={(e) =>
                        handleChange("employee_number", e.target.value)
                      }
                      className={errors.employee_number ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.employee_number && (
                      <p className="text-xs text-red-500">
                        {errors.employee_number}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_hired">
                      Date Hired <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date_hired"
                      type="date"
                      value={formData.date_hired}
                      onChange={(e) => handleChange("date_hired", e.target.value)}
                      className={errors.date_hired ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.date_hired && (
                      <p className="text-xs text-red-500">{errors.date_hired}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      placeholder="Juan"
                      value={formData.first_name}
                      onChange={(e) => handleChange("first_name", e.target.value)}
                      className={errors.first_name ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.first_name && (
                      <p className="text-xs text-red-500">{errors.first_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middle_name">Middle Name</Label>
                    <Input
                      id="middle_name"
                      placeholder="Garcia"
                      value={formData.middle_name}
                      onChange={(e) =>
                        handleChange("middle_name", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="last_name"
                      placeholder="Dela Cruz"
                      value={formData.last_name}
                      onChange={(e) => handleChange("last_name", e.target.value)}
                      className={errors.last_name ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.last_name && (
                      <p className="text-xs text-red-500">{errors.last_name}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="position">
                      Position <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => handleChange("position", value)}
                    >
                      <SelectTrigger
                        className={errors.position ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Teacher I">Teacher I</SelectItem>
                        <SelectItem value="Teacher II">Teacher II</SelectItem>
                        <SelectItem value="Teacher III">Teacher III</SelectItem>
                        <SelectItem value="Head Teacher VI">
                          Head Teacher VI
                        </SelectItem>
                        <SelectItem value="Master Teacher I">
                          Master Teacher I
                        </SelectItem>
                        <SelectItem value="Master Teacher II">
                          Master Teacher II
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.position && (
                      <p className="text-xs text-red-500">{errors.position}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleChange("department", value)}
                    >
                      <SelectTrigger
                        className={errors.department ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics Department">
                          Mathematics Department
                        </SelectItem>
                        <SelectItem value="Science Department">
                          Science Department
                        </SelectItem>
                        <SelectItem value="English Department">
                          English Department
                        </SelectItem>
                        <SelectItem value="Filipino Department">
                          Filipino Department
                        </SelectItem>
                        <SelectItem value="Social Studies Department">
                          Social Studies Department
                        </SelectItem>
                        <SelectItem value="Physical Education Department">
                          Physical Education Department
                        </SelectItem>
                        <SelectItem value="Arts Department">
                          Arts Department
                        </SelectItem>
                        <SelectItem value="ICT Department">
                          ICT Department
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && (
                      <p className="text-xs text-red-500">{errors.department}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employment_status">
                    Employment Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.employment_status}
                    onValueChange={(value) => handleChange("employment_status", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      className={errors.employment_status ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Substitute">Substitute</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.employment_status && (
                    <p className="text-xs text-red-500">{errors.employment_status}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan.delacruz@deped.gov.ph"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_number">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contact_number"
                    type="tel"
                    placeholder="+63 912 345 6789"
                    value={formData.contact_number}
                    onChange={(e) => handleChange("contact_number", e.target.value)}
                    className={errors.contact_number ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.contact_number && (
                    <p className="text-xs text-red-500">{errors.contact_number}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Initial Leave Credits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Initial Leave Credits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vacation_leave_credits">Vacation Leave</Label>
                  <Input
                    id="vacation_leave_credits"
                    type="number"
                    step="0.5"
                    value={formData.vacation_leave_credits}
                    onChange={(e) =>
                      handleChange("vacation_leave_credits", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sick_leave_credits">Sick Leave</Label>
                  <Input
                    id="sick_leave_credits"
                    type="number"
                    step="0.5"
                    value={formData.sick_leave_credits}
                    onChange={(e) => handleChange("sick_leave_credits", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="special_leave_credits">Special Leave</Label>
                  <Input
                    id="special_leave_credits"
                    type="number"
                    step="0.5"
                    value={formData.special_leave_credits}
                    onChange={(e) =>
                      handleChange("special_leave_credits", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                {apiError && (
                  <div className="p-3 mb-2 text-sm text-red-600 bg-red-50 rounded-md">
                    {apiError}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Employee
                    </>
                  )}
                </Button>
                <Link href="/personnel" className="block">
                  <Button type="button" variant="outline" className="w-full" disabled={isLoading}>
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

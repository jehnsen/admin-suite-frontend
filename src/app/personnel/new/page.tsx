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
    plantilla_item_no: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    date_of_birth: "",
    gender: "",
    civil_status: "",
    address: "",
    city: "",
    province: "",
    zip_code: "",
    mobile_number: "",
    email: "",
    position: "",
    position_title: "",
    department: "",
    employment_status: "",
    date_hired: "",
    date_separated: "",
    salary_grade: "",
    step_increment: "",
    monthly_salary: "",
    tin: "",
    gsis_number: "",
    philhealth_number: "",
    pagibig_number: "",
    sss_number: "",
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
    if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.civil_status) newErrors.civil_status = "Civil status is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.employment_status) newErrors.employment_status = "Employment status is required";
    if (!formData.date_hired) newErrors.date_hired = "Date hired is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobile_number) newErrors.mobile_number = "Mobile number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.province) newErrors.province = "Province is required";
    if (!formData.zip_code) newErrors.zip_code = "ZIP code is required";
    if (!formData.salary_grade) newErrors.salary_grade = "Salary grade is required";
    if (!formData.step_increment) newErrors.step_increment = "Step increment is required";
    if (!formData.monthly_salary) newErrors.monthly_salary = "Monthly salary is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);

      // Prepare data for API
      const employeeData: CreateEmployeeData = {
        employee_number: formData.employee_number,
        plantilla_item_no: formData.plantilla_item_no || undefined,
        first_name: formData.first_name,
        middle_name: formData.middle_name || undefined,
        last_name: formData.last_name,
        suffix: formData.suffix || undefined,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        civil_status: formData.civil_status,
        address: formData.address,
        city: formData.city || undefined,
        province: formData.province || undefined,
        zip_code: formData.zip_code || undefined,
        mobile_number: formData.mobile_number,
        email: formData.email,
        position: formData.position,
        position_title: formData.position_title || undefined,
        department: formData.department,
        employment_status: formData.employment_status,
        date_hired: formData.date_hired,
        date_separated: formData.date_separated || undefined,
        salary_grade: parseFloat(formData.salary_grade) || 1,
        step_increment: parseFloat(formData.step_increment) || 1,
        monthly_salary: parseFloat(formData.monthly_salary) || 0,
        // Filipino IDs (all optional)
        tin: formData.tin || undefined,
        gsis_number: formData.gsis_number || undefined,
        philhealth_number: formData.philhealth_number || undefined,
        pagibig_number: formData.pagibig_number || undefined,
        sss_number: formData.sss_number || undefined,
        // Leave credits
        vacation_leave_credits: parseFloat(formData.vacation_leave_credits) || 15,
        sick_leave_credits: parseFloat(formData.sick_leave_credits) || 15,
        // Status
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
                      placeholder="2025-042"
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
                    <Label htmlFor="plantilla_item_no">
                      Plantilla Item No.
                    </Label>
                    <Input
                      id="plantilla_item_no"
                      placeholder="TCH3-2025-042"
                      value={formData.plantilla_item_no}
                      onChange={(e) =>
                        handleChange("plantilla_item_no", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      placeholder="Maria"
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
                      placeholder="Taylor"
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
                      placeholder="Ozawa"
                      value={formData.last_name}
                      onChange={(e) => handleChange("last_name", e.target.value)}
                      className={errors.last_name ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.last_name && (
                      <p className="text-xs text-red-500">{errors.last_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suffix">Suffix</Label>
                    <Input
                      id="suffix"
                      placeholder="Jr."
                      value={formData.suffix}
                      onChange={(e) => handleChange("suffix", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleChange("date_of_birth", e.target.value)}
                      className={errors.date_of_birth ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.date_of_birth && (
                      <p className="text-xs text-red-500">{errors.date_of_birth}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleChange("gender", value)}
                    >
                      <SelectTrigger
                        className={errors.gender ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-xs text-red-500">{errors.gender}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="civil_status">
                      Civil Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.civil_status}
                      onValueChange={(value) => handleChange("civil_status", value)}
                    >
                      <SelectTrigger
                        className={errors.civil_status ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select civil status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.civil_status && (
                      <p className="text-xs text-red-500">{errors.civil_status}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Rizal Avenue, Barangay San Isidro"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className={errors.address ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500">{errors.address}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="Quezon City"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className={errors.city ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province">
                      Province <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="province"
                      placeholder="Metro Manila"
                      value={formData.province}
                      onChange={(e) => handleChange("province", e.target.value)}
                      className={errors.province ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.province && (
                      <p className="text-xs text-red-500">{errors.province}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip_code">
                      ZIP Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zip_code"
                      placeholder="1100"
                      value={formData.zip_code}
                      onChange={(e) => handleChange("zip_code", e.target.value)}
                      className={errors.zip_code ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.zip_code && (
                      <p className="text-xs text-red-500">{errors.zip_code}</p>
                    )}
                  </div>
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
                    placeholder="maria.ozawa@deped.gov.ph"
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
                  <Label htmlFor="mobile_number">
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mobile_number"
                    type="tel"
                    placeholder="09171234567"
                    value={formData.mobile_number}
                    onChange={(e) => handleChange("mobile_number", e.target.value)}
                    className={errors.mobile_number ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.mobile_number && (
                    <p className="text-xs text-red-500">{errors.mobile_number}</p>
                  )}
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
                    <Label htmlFor="position_title">Position Title</Label>
                    <Input
                      id="position_title"
                      placeholder="Master Teacher I"
                      value={formData.position_title}
                      onChange={(e) => handleChange("position_title", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="Substitute">Substitute</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.employment_status && (
                      <p className="text-xs text-red-500">{errors.employment_status}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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

                  <div className="space-y-2">
                    <Label htmlFor="date_separated">Date Separated</Label>
                    <Input
                      id="date_separated"
                      type="date"
                      value={formData.date_separated}
                      onChange={(e) => handleChange("date_separated", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="salary_grade">
                      Salary Grade <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="salary_grade"
                      type="number"
                      placeholder="13"
                      value={formData.salary_grade}
                      onChange={(e) => handleChange("salary_grade", e.target.value)}
                      className={errors.salary_grade ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.salary_grade && (
                      <p className="text-xs text-red-500">{errors.salary_grade}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="step_increment">
                      Step Increment <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="step_increment"
                      type="number"
                      placeholder="4"
                      value={formData.step_increment}
                      onChange={(e) => handleChange("step_increment", e.target.value)}
                      className={errors.step_increment ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.step_increment && (
                      <p className="text-xs text-red-500">{errors.step_increment}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthly_salary">
                      Monthly Salary <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="monthly_salary"
                      type="number"
                      step="0.01"
                      placeholder="37842.00"
                      value={formData.monthly_salary}
                      onChange={(e) => handleChange("monthly_salary", e.target.value)}
                      className={errors.monthly_salary ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.monthly_salary && (
                      <p className="text-xs text-red-500">{errors.monthly_salary}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Government IDs */}
            <Card>
              <CardHeader>
                <CardTitle>Government IDs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tin">TIN</Label>
                    <Input
                      id="tin"
                      placeholder="123-456-789-000"
                      value={formData.tin}
                      onChange={(e) => handleChange("tin", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gsis_number">GSIS Number</Label>
                    <Input
                      id="gsis_number"
                      placeholder="05-9876543-2"
                      value={formData.gsis_number}
                      onChange={(e) => handleChange("gsis_number", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="philhealth_number">PhilHealth Number</Label>
                    <Input
                      id="philhealth_number"
                      placeholder="01-123456789-0"
                      value={formData.philhealth_number}
                      onChange={(e) => handleChange("philhealth_number", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pagibig_number">Pag-IBIG Number</Label>
                    <Input
                      id="pagibig_number"
                      placeholder="1234-5678-9012"
                      value={formData.pagibig_number}
                      onChange={(e) => handleChange("pagibig_number", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sss_number">SSS Number</Label>
                  <Input
                    id="sss_number"
                    placeholder="34-9876543-2"
                    value={formData.sss_number}
                    onChange={(e) => handleChange("sss_number", e.target.value)}
                    disabled={isLoading}
                  />
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

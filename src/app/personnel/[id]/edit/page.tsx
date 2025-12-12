"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { personnelService, Employee } from "@/lib/api/services";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);

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
    vacation_leave_credits: "",
    sick_leave_credits: "",
    special_leave_credits: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsLoadingEmployee(true);
        const data = await personnelService.getEmployee(Number(params.id));
        setEmployee(data);

        // Populate form with existing data
        setFormData({
          employee_number: data.employee_number || "",
          plantilla_item_no: data.plantilla_item_no || "",
          first_name: data.first_name || "",
          middle_name: data.middle_name || "",
          last_name: data.last_name || "",
          suffix: data.suffix || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          civil_status: data.civil_status || "",
          address: data.address || "",
          city: data.city || "",
          province: data.province || "",
          zip_code: data.zip_code || "",
          mobile_number: data.mobile_number || "",
          email: data.email || "",
          position: data.position || "",
          position_title: data.position_title || "",
          department: data.department || "",
          employment_status: data.employment_status || "",
          date_hired: data.date_hired || "",
          date_separated: data.date_separated || "",
          salary_grade: data.salary_grade?.toString() || "",
          step_increment: data.step_increment?.toString() || "",
          monthly_salary: data.monthly_salary?.toString() || "",
          tin: data.tin || "",
          gsis_number: data.gsis_number || "",
          philhealth_number: data.philhealth_number || "",
          pagibig_number: data.pagibig_number || "",
          sss_number: data.sss_number || "",
          vacation_leave_credits: data.vacation_leave_credits?.toString() || "",
          sick_leave_credits: data.sick_leave_credits?.toString() || "",
          special_leave_credits: data.special_leave_credits?.toString() || "",
        });
      } catch (err: any) {
        console.error("Failed to fetch employee:", err);
        setApiError("Failed to load employee data");
      } finally {
        setIsLoadingEmployee(false);
      }
    };

    if (params.id) {
      fetchEmployee();
    }
  }, [params.id]);

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
    if (!formData.salary_grade) newErrors.salary_grade = "Salary grade is required";
    if (!formData.step_increment) newErrors.step_increment = "Step increment is required";
    if (!formData.monthly_salary) newErrors.monthly_salary = "Monthly salary is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);

      // Prepare data for API
      const updateData = {
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
        tin: formData.tin || undefined,
        gsis_number: formData.gsis_number || undefined,
        philhealth_number: formData.philhealth_number || undefined,
        pagibig_number: formData.pagibig_number || undefined,
        sss_number: formData.sss_number || undefined,
        vacation_leave_credits: parseFloat(formData.vacation_leave_credits) || undefined,
        sick_leave_credits: parseFloat(formData.sick_leave_credits) || undefined,
      };

      // Call API to update employee
      await personnelService.updateEmployee(Number(params.id), updateData);

      // Success - redirect back to employee detail page
      router.push(`/personnel/${params.id}`);
    } catch (err: any) {
      console.error("Failed to update employee:", err);
      setApiError(err.message || "Failed to update employee. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  if (isLoadingEmployee) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground mt-4">Loading employee data...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-lg text-muted-foreground">Employee not found</p>
        <Button onClick={() => router.push("/personnel")} className="mt-4">
          Back to Personnel List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/personnel/${params.id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
            <p className="text-muted-foreground mt-1">
              Update employee information for {employee.full_name}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {apiError && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-6">
            {apiError}
          </div>
        )}

        <div className="grid gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employee_number">Employee Number *</Label>
                <Input
                  id="employee_number"
                  value={formData.employee_number}
                  onChange={(e) => handleChange("employee_number", e.target.value)}
                  className={errors.employee_number ? "border-destructive" : ""}
                />
                {errors.employee_number && (
                  <p className="text-sm text-destructive">{errors.employee_number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="plantilla_item_no">Plantilla Item No.</Label>
                <Input
                  id="plantilla_item_no"
                  value={formData.plantilla_item_no}
                  onChange={(e) => handleChange("plantilla_item_no", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  className={errors.first_name ? "border-destructive" : ""}
                />
                {errors.first_name && (
                  <p className="text-sm text-destructive">{errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={(e) => handleChange("middle_name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  className={errors.last_name ? "border-destructive" : ""}
                />
                {errors.last_name && (
                  <p className="text-sm text-destructive">{errors.last_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="suffix">Suffix</Label>
                <Input
                  id="suffix"
                  placeholder="Jr., Sr., III, etc."
                  value={formData.suffix}
                  onChange={(e) => handleChange("suffix", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange("date_of_birth", e.target.value)}
                  className={errors.date_of_birth ? "border-destructive" : ""}
                />
                {errors.date_of_birth && (
                  <p className="text-sm text-destructive">{errors.date_of_birth}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange("gender", value)}
                >
                  <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="civil_status">Civil Status *</Label>
                <Select
                  value={formData.civil_status}
                  onValueChange={(value) => handleChange("civil_status", value)}
                >
                  <SelectTrigger className={errors.civil_status ? "border-destructive" : ""}>
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
                  <p className="text-sm text-destructive">{errors.civil_status}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mobile_number">Mobile Number *</Label>
                <Input
                  id="mobile_number"
                  placeholder="+63 XXX XXX XXXX"
                  value={formData.mobile_number}
                  onChange={(e) => handleChange("mobile_number", e.target.value)}
                  className={errors.mobile_number ? "border-destructive" : ""}
                />
                {errors.mobile_number && (
                  <p className="text-sm text-destructive">{errors.mobile_number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="House No., Street, Barangay"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => handleChange("province", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code}
                  onChange={(e) => handleChange("zip_code", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  className={errors.position ? "border-destructive" : ""}
                />
                {errors.position && (
                  <p className="text-sm text-destructive">{errors.position}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position_title">Position Title</Label>
                <Input
                  id="position_title"
                  value={formData.position_title}
                  onChange={(e) => handleChange("position_title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className={errors.department ? "border-destructive" : ""}
                />
                {errors.department && (
                  <p className="text-sm text-destructive">{errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_status">Employment Status *</Label>
                <Select
                  value={formData.employment_status}
                  onValueChange={(value) => handleChange("employment_status", value)}
                >
                  <SelectTrigger className={errors.employment_status ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Permanent">Permanent</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Substitute">Substitute</SelectItem>
                    <SelectItem value="Contractual">Contractual</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employment_status && (
                  <p className="text-sm text-destructive">{errors.employment_status}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_hired">Date Hired *</Label>
                <Input
                  id="date_hired"
                  type="date"
                  value={formData.date_hired}
                  onChange={(e) => handleChange("date_hired", e.target.value)}
                  className={errors.date_hired ? "border-destructive" : ""}
                />
                {errors.date_hired && (
                  <p className="text-sm text-destructive">{errors.date_hired}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_separated">Date Separated</Label>
                <Input
                  id="date_separated"
                  type="date"
                  value={formData.date_separated}
                  onChange={(e) => handleChange("date_separated", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader>
              <CardTitle>Compensation</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="salary_grade">Salary Grade *</Label>
                <Input
                  id="salary_grade"
                  type="number"
                  min="1"
                  value={formData.salary_grade}
                  onChange={(e) => handleChange("salary_grade", e.target.value)}
                  className={errors.salary_grade ? "border-destructive" : ""}
                />
                {errors.salary_grade && (
                  <p className="text-sm text-destructive">{errors.salary_grade}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="step_increment">Step Increment *</Label>
                <Input
                  id="step_increment"
                  type="number"
                  min="1"
                  value={formData.step_increment}
                  onChange={(e) => handleChange("step_increment", e.target.value)}
                  className={errors.step_increment ? "border-destructive" : ""}
                />
                {errors.step_increment && (
                  <p className="text-sm text-destructive">{errors.step_increment}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly_salary">Monthly Salary *</Label>
                <Input
                  id="monthly_salary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthly_salary}
                  onChange={(e) => handleChange("monthly_salary", e.target.value)}
                  className={errors.monthly_salary ? "border-destructive" : ""}
                />
                {errors.monthly_salary && (
                  <p className="text-sm text-destructive">{errors.monthly_salary}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Government IDs */}
          <Card>
            <CardHeader>
              <CardTitle>Government IDs</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tin">TIN</Label>
                <Input
                  id="tin"
                  placeholder="XXX-XXX-XXX"
                  value={formData.tin}
                  onChange={(e) => handleChange("tin", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gsis_number">GSIS Number</Label>
                <Input
                  id="gsis_number"
                  value={formData.gsis_number}
                  onChange={(e) => handleChange("gsis_number", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="philhealth_number">PhilHealth Number</Label>
                <Input
                  id="philhealth_number"
                  value={formData.philhealth_number}
                  onChange={(e) => handleChange("philhealth_number", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pagibig_number">Pag-IBIG Number</Label>
                <Input
                  id="pagibig_number"
                  value={formData.pagibig_number}
                  onChange={(e) => handleChange("pagibig_number", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sss_number">SSS Number</Label>
                <Input
                  id="sss_number"
                  value={formData.sss_number}
                  onChange={(e) => handleChange("sss_number", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Leave Credits */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Credits</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="vacation_leave_credits">Vacation Leave</Label>
                <Input
                  id="vacation_leave_credits"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.vacation_leave_credits}
                  onChange={(e) => handleChange("vacation_leave_credits", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sick_leave_credits">Sick Leave</Label>
                <Input
                  id="sick_leave_credits"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.sick_leave_credits}
                  onChange={(e) => handleChange("sick_leave_credits", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="special_leave_credits">Special Leave</Label>
                <Input
                  id="special_leave_credits"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.special_leave_credits}
                  onChange={(e) => handleChange("special_leave_credits", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/personnel/${params.id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Employee
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

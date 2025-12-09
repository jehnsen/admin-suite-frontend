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
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewPersonnelPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    position: "",
    department: "",
    status: "",
    dateHired: "",
    email: "",
    phone: "",
    vacationLeave: "15",
    sickLeave: "15",
    specialLeave: "3",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.employeeNumber) newErrors.employeeNumber = "Employee number is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.status) newErrors.status = "Employment status is required";
    if (!formData.dateHired) newErrors.dateHired = "Date hired is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // In a real app, this would save to the backend
    console.log("Form submitted:", formData);

    // Redirect back to personnel list
    router.push("/personnel");
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
                    <Label htmlFor="employeeNumber">
                      Employee Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="employeeNumber"
                      placeholder="EMP-2025-001"
                      value={formData.employeeNumber}
                      onChange={(e) =>
                        handleChange("employeeNumber", e.target.value)
                      }
                      className={errors.employeeNumber ? "border-red-500" : ""}
                    />
                    {errors.employeeNumber && (
                      <p className="text-xs text-red-500">
                        {errors.employeeNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateHired">
                      Date Hired <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateHired"
                      type="date"
                      value={formData.dateHired}
                      onChange={(e) => handleChange("dateHired", e.target.value)}
                      className={errors.dateHired ? "border-red-500" : ""}
                    />
                    {errors.dateHired && (
                      <p className="text-xs text-red-500">{errors.dateHired}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Juan"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      placeholder="Garcia"
                      value={formData.middleName}
                      onChange={(e) =>
                        handleChange("middleName", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Dela Cruz"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500">{errors.lastName}</p>
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
                  <Label htmlFor="status">
                    Employment Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger
                      className={errors.status ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Substitute">Substitute</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-xs text-red-500">{errors.status}</p>
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
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+63 912 345 6789"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
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
                  <Label htmlFor="vacationLeave">Vacation Leave</Label>
                  <Input
                    id="vacationLeave"
                    type="number"
                    step="0.5"
                    value={formData.vacationLeave}
                    onChange={(e) =>
                      handleChange("vacationLeave", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sickLeave">Sick Leave</Label>
                  <Input
                    id="sickLeave"
                    type="number"
                    step="0.5"
                    value={formData.sickLeave}
                    onChange={(e) => handleChange("sickLeave", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialLeave">Special Leave</Label>
                  <Input
                    id="specialLeave"
                    type="number"
                    step="0.5"
                    value={formData.specialLeave}
                    onChange={(e) =>
                      handleChange("specialLeave", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Employee
                </Button>
                <Link href="/personnel" className="block">
                  <Button type="button" variant="outline" className="w-full">
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

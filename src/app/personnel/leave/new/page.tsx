"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { employees } from "@/lib/data/personnel";

export default function NewLeaveRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) newErrors.employeeId = "Employee is required";
    if (!formData.leaveType) newErrors.leaveType = "Leave type is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.reason) newErrors.reason = "Reason is required";

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // In a real app, this would save to the backend
    console.log("Leave request submitted:", {
      ...formData,
      days: calculateDays(),
    });

    // Redirect back to leave management
    router.push("/personnel/leave");
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

  const selectedEmployee = employees.find((e) => e.id === formData.employeeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/personnel/leave">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            New Leave Request
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new leave application (Form 6)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">
                    Employee <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.employeeId}
                    onValueChange={(value) => handleChange("employeeId", value)}
                  >
                    <SelectTrigger
                      className={errors.employeeId ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName} - {emp.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employeeId && (
                    <p className="text-xs text-red-500">{errors.employeeId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leaveType">
                    Type of Leave <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.leaveType}
                    onValueChange={(value) => handleChange("leaveType", value)}
                  >
                    <SelectTrigger
                      className={errors.leaveType ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vacation">Vacation Leave</SelectItem>
                      <SelectItem value="Sick">Sick Leave</SelectItem>
                      <SelectItem value="Maternity">
                        Maternity Leave
                      </SelectItem>
                      <SelectItem value="Paternity">
                        Paternity Leave
                      </SelectItem>
                      <SelectItem value="Special">
                        Special Privilege Leave
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.leaveType && (
                    <p className="text-xs text-red-500">{errors.leaveType}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                      className={errors.startDate ? "border-red-500" : ""}
                    />
                    {errors.startDate && (
                      <p className="text-xs text-red-500">{errors.startDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">
                      End Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      className={errors.endDate ? "border-red-500" : ""}
                    />
                    {errors.endDate && (
                      <p className="text-xs text-red-500">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                {formData.startDate && formData.endDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-900">
                      Total Days: <strong>{calculateDays()}</strong>{" "}
                      {calculateDays() === 1 ? "day" : "days"}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reason">
                    Reason/Details <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Provide details for the leave request..."
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    className={errors.reason ? "border-red-500" : ""}
                  />
                  {errors.reason && (
                    <p className="text-xs text-red-500">{errors.reason}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedEmployee && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Leave Credits Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Vacation Leave
                    </span>
                    <span className="text-lg font-bold">
                      {selectedEmployee.leaveCredits.vacation}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Sick Leave
                    </span>
                    <span className="text-lg font-bold">
                      {selectedEmployee.leaveCredits.sick}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Special Leave
                    </span>
                    <span className="text-lg font-bold">
                      {selectedEmployee.leaveCredits.special}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Submit Leave Request
                </Button>
                <Link href="/personnel/leave" className="block">
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

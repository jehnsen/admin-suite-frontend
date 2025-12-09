"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  FileText,
  Award,
  Clock,
} from "lucide-react";
import { employees } from "@/lib/data/personnel";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data for service record and training
const serviceRecord = [
  {
    id: "1",
    position: "Teacher I",
    department: "Mathematics Department",
    dateFrom: "2020-06-15",
    dateTo: "2022-06-14",
    salary: "₱25,439",
  },
  {
    id: "2",
    position: "Teacher II",
    department: "Mathematics Department",
    dateFrom: "2022-06-15",
    dateTo: "2024-06-14",
    salary: "₱27,000",
  },
  {
    id: "3",
    position: "Teacher III",
    department: "Mathematics Department",
    dateFrom: "2024-06-15",
    dateTo: "Present",
    salary: "₱29,165",
  },
];

const trainingAttended = [
  {
    id: "1",
    title: "DepEd Computerization Program Training",
    organizer: "DepEd Division Office",
    dateFrom: "2023-01-15",
    dateTo: "2023-01-17",
    hours: 24,
  },
  {
    id: "2",
    title: "Outcomes-Based Education Workshop",
    organizer: "DepEd Regional Office",
    dateFrom: "2023-06-10",
    dateTo: "2023-06-12",
    hours: 18,
  },
  {
    id: "3",
    title: "Mathematics Curriculum Implementation Seminar",
    organizer: "Mathematics Teachers Association",
    dateFrom: "2024-03-20",
    dateTo: "2024-03-21",
    hours: 16,
  },
];

const leaveHistory = [
  {
    id: "1",
    type: "Vacation Leave",
    dateFrom: "2024-12-23",
    dateTo: "2024-12-27",
    days: 5,
    status: "Approved",
  },
  {
    id: "2",
    type: "Sick Leave",
    dateFrom: "2024-09-15",
    dateTo: "2024-09-16",
    days: 2,
    status: "Approved",
  },
  {
    id: "3",
    type: "Special Leave",
    dateFrom: "2024-06-12",
    dateTo: "2024-06-12",
    days: 1,
    status: "Approved",
  },
];

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");

  const employee = employees.find((e) => e.id === params.id);

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

  const fullName = `${employee.firstName} ${employee.middleName ? employee.middleName + " " : ""}${employee.lastName}`;

  const tabs = [
    { id: "personal", label: "Personal Info", icon: FileText },
    { id: "service", label: "Service Record", icon: Briefcase },
    { id: "leave", label: "Leave History", icon: Calendar },
    { id: "training", label: "Training Attended", icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/personnel")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
          <p className="text-muted-foreground mt-1">
            Digital 201 File - {employee.employeeNumber}
          </p>
        </div>
        <Badge
          variant={
            employee.status === "Regular"
              ? "success"
              : employee.status === "Substitute"
                ? "warning"
                : "default"
          }
        >
          {employee.status}
        </Badge>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === "personal" && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      First Name
                    </label>
                    <p className="mt-1 text-sm">{employee.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Name
                    </label>
                    <p className="mt-1 text-sm">{employee.lastName}</p>
                  </div>
                  {employee.middleName && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Middle Name
                      </label>
                      <p className="mt-1 text-sm">{employee.middleName}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Employee Number
                    </label>
                    <p className="mt-1 text-sm font-mono">
                      {employee.employeeNumber}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Position
                    </label>
                    <p className="mt-1 text-sm font-medium">
                      {employee.position}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Department
                    </label>
                    <p className="mt-1 text-sm">{employee.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Employment Status
                    </label>
                    <p className="mt-1">
                      <Badge
                        variant={
                          employee.status === "Regular"
                            ? "success"
                            : employee.status === "Substitute"
                              ? "warning"
                              : "default"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Date Hired
                    </label>
                    <p className="mt-1 text-sm">
                      {formatDate(employee.dateHired)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Email
                      </label>
                      <p className="text-sm">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Phone
                      </label>
                      <p className="text-sm">{employee.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "service" && (
            <Card>
              <CardHeader>
                <CardTitle>Service Record</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRecord.map((record, index) => (
                    <div
                      key={record.id}
                      className="border-l-2 border-primary pl-4 pb-4 last:pb-0"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{record.position}</h4>
                          <p className="text-sm text-muted-foreground">
                            {record.department}
                          </p>
                        </div>
                        <Badge variant="outline">{record.salary}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {formatDate(record.dateFrom)} - {record.dateTo}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "leave" && (
            <Card>
              <CardHeader>
                <CardTitle>Leave History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveHistory.map((leave) => (
                    <div
                      key={leave.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <h4 className="font-medium">{leave.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(leave.dateFrom)} -{" "}
                          {formatDate(leave.dateTo)} ({leave.days}{" "}
                          {leave.days === 1 ? "day" : "days"})
                        </p>
                      </div>
                      <Badge variant="success">{leave.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "training" && (
            <Card>
              <CardHeader>
                <CardTitle>Training & Seminars Attended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingAttended.map((training) => (
                    <div
                      key={training.id}
                      className="border-b pb-4 last:border-0 last:pb-0"
                    >
                      <h4 className="font-medium">{training.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {training.organizer}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(training.dateFrom)} -{" "}
                          {formatDate(training.dateTo)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {training.hours} hours
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Leave Credits Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Vacation Leave
                </span>
                <span className="text-lg font-bold">
                  {employee.leaveCredits.vacation}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Sick Leave
                </span>
                <span className="text-lg font-bold">
                  {employee.leaveCredits.sick}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Special Leave
                </span>
                <span className="text-lg font-bold">
                  {employee.leaveCredits.special}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Edit Information
              </Button>
              <Button className="w-full" variant="outline">
                Print 201 File
              </Button>
              <Button className="w-full" variant="outline">
                Update Leave Credits
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

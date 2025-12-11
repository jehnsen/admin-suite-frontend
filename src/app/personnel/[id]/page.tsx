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
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { personnelService, Employee, ServiceRecord, LeaveRequest } from "@/lib/api/services";

// Mock data for training (not yet implemented in API)
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

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingServiceRecords, setIsLoadingServiceRecords] = useState(false);
  const [isLoadingLeaveHistory, setIsLoadingLeaveHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await personnelService.getEmployee(Number(params.id));
        setEmployee(data);
      } catch (err: any) {
        console.error("Failed to fetch employee:", err);
        setError(err.message || "Failed to load employee data");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchEmployee();
    }
  }, [params.id]);

  useEffect(() => {
    const fetchServiceRecords = async () => {
      try {
        setIsLoadingServiceRecords(true);
        const data = await personnelService.getServiceRecordsByEmployee(Number(params.id));
        setServiceRecords(data);
      } catch (err: any) {
        console.error("Failed to fetch service records:", err);
      } finally {
        setIsLoadingServiceRecords(false);
      }
    };

    const fetchLeaveHistory = async () => {
      try {
        setIsLoadingLeaveHistory(true);
        const data = await personnelService.getLeaveRequestsByEmployee(Number(params.id));
        
        // FIX: Ensure data is an array before setting state
        setLeaveHistory(Array.isArray(data) ? data : []);
        
      } catch (err: any) {
        console.error("Failed to fetch leave history:", err);
        setLeaveHistory([]); // Fallback to empty array on error
      } finally {
        setIsLoadingLeaveHistory(false);
      }
    };

    if (params.id) {
      fetchServiceRecords();
      fetchLeaveHistory();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground mt-4">Loading employee data...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-lg text-muted-foreground">
          {error || "Employee not found"}
        </p>
        <Button onClick={() => router.push("/personnel")} className="mt-4">
          Back to Personnel List
        </Button>
      </div>
    );
  }

  const fullName = `${employee.first_name} ${employee.middle_name ? employee.middle_name + " " : ""}${employee.last_name}`;

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
            Digital 201 File - {employee.employee_number}
          </p>
        </div>
        <Badge
          variant={
            employee.employment_status === "Regular" || employee.employment_status === "Permanent"
              ? "success"
              : employee.employment_status === "Substitute"
                ? "warning"
                : "default"
          }
        >
          {employee.employment_status}
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
                    <p className="mt-1 text-sm">{employee.first_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Name
                    </label>
                    <p className="mt-1 text-sm">{employee.last_name}</p>
                  </div>
                  {employee.middle_name && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Middle Name
                      </label>
                      <p className="mt-1 text-sm">{employee.middle_name}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Employee Number
                    </label>
                    <p className="mt-1 text-sm font-mono">
                      {employee.employee_number}
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
                    <div className="mt-1">
                      <Badge
                        variant={
                          employee.employment_status === "Regular" || employee.employment_status === "Permanent"
                            ? "success"
                            : employee.employment_status === "Substitute"
                              ? "warning"
                              : "default"
                        }
                      >
                        {employee.employment_status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Date Hired
                    </label>
                    <p className="mt-1 text-sm">
                      {employee.date_hired ? formatDate(employee.date_hired) : "N/A"}
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
                        Mobile Number
                      </label>
                      <p className="text-sm">{employee.mobile_number}</p>
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
                {isLoadingServiceRecords ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : serviceRecords.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No service records found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {serviceRecords.map((record) => (
                      <div
                        key={record.id}
                        className="border-l-2 border-primary pl-4 pb-4 last:pb-0"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{record.designation}</h4>
                            <p className="text-sm text-muted-foreground">
                              {record.station_place_of_assignment}
                            </p>
                          </div>
                          <Badge variant="outline">₱{record.monthly_salary.toLocaleString()}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {formatDate(record.date_from)} - {record.to_date ? formatDate(record.to_date) : "Present"}
                        </p>
                        {record.remarks && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            {record.remarks}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "leave" && (
            <Card>
              <CardHeader>
                <CardTitle>Leave History</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingLeaveHistory ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : leaveHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No leave history found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(leaveHistory) && leaveHistory.map((leave) => (
                      <div
                        key={leave.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div>
                          <h4 className="font-medium">{leave.leave_type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(leave.start_date)} -{" "}
                            {formatDate(leave.end_date)} ({leave.working_days}{" "}
                            {leave.working_days === 1 ? "day" : "days"})
                          </p>
                          {leave.reason && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Reason: {leave.reason}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            leave.status === "Approved"
                              ? "success"
                              : leave.status === "Pending"
                                ? "warning"
                                : leave.status === "Disapproved"
                                  ? "destructive"
                                  : "default"
                          }
                        >
                          {leave.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
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
                  {employee.vacation_leave_credits}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Sick Leave
                </span>
                <span className="text-lg font-bold">
                  {employee.sick_leave_credits}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Special Leave
                </span>
                <span className="text-lg font-bold">
                  {employee.special_leave_credits || 0}
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

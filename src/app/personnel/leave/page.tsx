"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaveCalendar } from "@/components/leave/leave-calendar";
import { leaveRequests, LeaveRequest, employees } from "@/lib/data/personnel";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Plus, Check, X, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [requests, setRequests] = useState(leaveRequests);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Approved" as const } : req
      )
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Rejected" as const } : req
      )
    );
  };

  const columns: Column<LeaveRequest>[] = [
    {
      header: "Request ID",
      accessor: "id",
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Employee",
      accessor: "employeeName",
      cell: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">
            {employees.find((e) => e.id === row.employeeId)?.position || ""}
          </p>
        </div>
      ),
    },
    {
      header: "Leave Type",
      accessor: "leaveType",
      cell: (value) => {
        const variant =
          value === "Vacation"
            ? "default"
            : value === "Sick"
              ? "warning"
              : "secondary";
        return <Badge variant={variant as any}>{value}</Badge>;
      },
    },
    {
      header: "Period",
      accessor: (row) => row,
      cell: (_, row) => (
        <div className="text-sm">
          <p>{formatDate(row.startDate)}</p>
          <p className="text-muted-foreground">to {formatDate(row.endDate)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {row.days} {row.days === 1 ? "day" : "days"}
          </p>
        </div>
      ),
    },
    {
      header: "Reason",
      accessor: "reason",
      cell: (value) => (
        <p className="text-sm max-w-xs truncate" title={value}>
          {value}
        </p>
      ),
    },
    {
      header: "Submitted",
      accessor: "submittedDate",
      cell: (value) => <span className="text-sm">{formatDate(value)}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const variant =
          value === "Approved"
            ? "success"
            : value === "Pending"
              ? "warning"
              : "destructive";
        return <Badge variant={variant as any}>{value}</Badge>;
      },
    },
    {
      header: "Actions",
      accessor: (row) => row,
      cell: (_, row) => (
        <div className="flex gap-2">
          {row.status === "Pending" && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => handleApprove(row.id)}
              >
                <Check className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(row.id)}
              >
                <X className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </>
          )}
          {row.status !== "Pending" && (
            <span className="text-sm text-muted-foreground">
              {row.status === "Approved" ? "Approved" : "Rejected"}
            </span>
          )}
        </div>
      ),
    },
  ];

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "Pending").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    rejected: requests.filter((r) => r.status === "Rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/personnel">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Leave Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Process leave requests and view leave calendar
            </p>
          </div>
        </div>
        <Link href="/personnel/leave/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Leave Request
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("list")}
            className={cn(
              "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "list"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Leave Requests
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={cn(
              "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "calendar"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="h-4 w-4" />
            Calendar View
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={requests}
              columns={columns}
              searchPlaceholder="Search by employee name, type..."
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "calendar" && (
        <LeaveCalendar leaveRequests={requests.filter((r) => r.status === "Approved")} />
      )}
    </div>
  );
}

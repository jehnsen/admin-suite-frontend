"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, UserPlus, FileText, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { personnelService, Employee } from "@/lib/api/services";

export default function PersonnelPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    regular: 0,
    temporary: 0,
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all employees (you can add pagination later)
      const response = await personnelService.getEmployees({
        per_page: 100,
      });

      // Ensure response.data exists and is an array
      const employeeData = Array.isArray(response.data) ? response.data : [];
      setEmployees(employeeData);

      // Calculate stats
      const regularCount = employeeData.filter(
        (e) => e.employment_status === "Regular"
      ).length;
      const temporaryCount = employeeData.filter(
        (e) =>
          e.employment_status === "Substitute" ||
          e.employment_status === "Contract"
      ).length;

      setStats({
        total: employeeData.length,
        regular: regularCount,
        temporary: temporaryCount,
      });
    } catch (err: any) {
      console.error("Failed to load employees:", err);
      setError(err.message || "Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<Employee>[] = [
    {
      header: "Employee Number",
      accessor: "employee_number",
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Name",
      accessor: (row) => row.full_name,
      cell: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.position}</p>
        </div>
      ),
    },
    {
      header: "Position",
      accessor: "position",
    },
    {
      header: "Employment Status",
      accessor: "employment_status",
      cell: (value) => {
        const variant =
          value === "Regular"
            ? "success"
            : value === "Substitute"
              ? "warning"
              : "default";
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    {
      header: "Leave Credits",
      accessor: (row) => row.vacation_leave_credits + row.sick_leave_credits,
      cell: (_, row) => (
        <div className="text-sm">
          <div className="flex gap-2">
            <span className="text-muted-foreground">VL:</span>
            <span className="font-medium">{row.vacation_leave_credits}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground">SL:</span>
            <span className="font-medium">{row.sick_leave_credits}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: () => null,
      cell: (_, row) => (
        <Link href={`/personnel/${row.id}`}>
          <Button size="sm" variant="outline">
            <FileText className="h-3 w-3 mr-1" />
            View 201 File
          </Button>
        </Link>
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-8 w-8 text-destructive flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Failed to Load Employees</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={loadEmployees} className="mt-4">
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Personnel Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage employee records, leave requests, and service records
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/personnel/leave">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Leave Management
            </Button>
          </Link>
          <Link href="/personnel/new">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Active staff members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Regular Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.regular}</div>
            <p className="text-xs text-muted-foreground">
              Permanent employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Substitute/Contract
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.temporary}</div>
            <p className="text-xs text-muted-foreground">
              Temporary employees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={employees}
            columns={columns}
            searchPlaceholder="Search by name, position, department..."
            onRowClick={(row) => router.push(`/personnel/${row.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

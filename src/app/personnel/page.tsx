"use client";

import { DataTable, Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { employees, Employee } from "@/lib/data/personnel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, UserPlus, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PersonnelPage() {
  const router = useRouter();

  const columns: Column<Employee>[] = [
    {
      header: "Employee Number",
      accessor: "employeeNumber",
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Name",
      accessor: (row) =>
        `${row.firstName} ${row.middleName ? row.middleName + " " : ""}${
          row.lastName
        }`,
      cell: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.position}</p>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: "department",
    },
    {
      header: "Status",
      accessor: "status",
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
      accessor: (row) => row.leaveCredits,
      cell: (value) => (
        <div className="text-sm">
          <div className="flex gap-2">
            <span className="text-muted-foreground">VL:</span>
            <span className="font-medium">{value.vacation}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground">SL:</span>
            <span className="font-medium">{value.sick}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => row,
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
            <div className="text-2xl font-bold">{employees.length}</div>
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
            <div className="text-2xl font-bold">
              {employees.filter((e) => e.status === "Regular").length}
            </div>
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
            <div className="text-2xl font-bold">
              {
                employees.filter(
                  (e) => e.status === "Substitute" || e.status === "Contract"
                ).length
              }
            </div>
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

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Printer, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store/finance.store";
import { BudgetAllocation } from "@/lib/api/services/finance.service";
import { cn } from "@/lib/utils";

export default function BudgetAllocationReport() {
  const { budgetAllocations, isLoading, error, fetchBudgetAllocations } = useFinanceStore();
  const [fiscalYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    fetchBudgetAllocations();
  }, [fetchBudgetAllocations]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ["Fund Source", "Allocated Budget", "Amount Spent", "Remaining Balance", "Utilization Rate"];
    const rows = budgetAllocations.map(b => [
      b.source,
      b.allocated.toString(),
      b.spent.toString(),
      b.remaining.toString(),
      `${b.utilizationRate}%`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-allocation-report-${fiscalYear}.csv`;
    a.click();
  };

  const totals = budgetAllocations.reduce(
    (acc, b) => ({
      allocated: acc.allocated + b.allocated,
      spent: acc.spent + b.spent,
      remaining: acc.remaining + b.remaining,
    }),
    { allocated: 0, spent: 0, remaining: 0 }
  );

  const overallUtilization = totals.allocated > 0
    ? ((totals.spent / totals.allocated) * 100).toFixed(2)
    : "0.00";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 border border-red-200 rounded-lg p-8">
        <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
        <p className="text-red-900 font-semibold">{error}</p>
        <Link href="/reports">
          <Button className="mt-4" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Hidden when printing */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/reports">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Allocation Report</h1>
            <p className="text-muted-foreground mt-1">
              Fiscal Year {fiscalYear} - As of {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block text-center mb-8">
        <h2 className="text-xl font-bold">Department of Education</h2>
        <h3 className="text-lg font-semibold mt-2">Budget Allocation Report</h3>
        <p className="text-sm mt-1">Fiscal Year {fiscalYear}</p>
        <p className="text-sm">As of {new Date().toLocaleDateString()}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 print:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.allocated)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totals.spent)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totals.remaining)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                parseFloat(overallUtilization) >= 90
                  ? "text-red-600"
                  : parseFloat(overallUtilization) >= 70
                    ? "text-yellow-600"
                    : "text-green-600"
              )}
            >
              {overallUtilization}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Allocation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation by Fund Source</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund Source</TableHead>
                <TableHead className="text-right">Allocated Budget</TableHead>
                <TableHead className="text-right">Amount Spent</TableHead>
                <TableHead className="text-right">Remaining Balance</TableHead>
                <TableHead className="text-right">Utilization Rate</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetAllocations.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{budget.source}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(budget.allocated)}
                  </TableCell>
                  <TableCell className="text-right text-orange-600">
                    {formatCurrency(budget.spent)}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatCurrency(budget.remaining)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <span
                      className={cn(
                        (budget.utilizationRate || 0) >= 90
                          ? "text-red-600"
                          : (budget.utilizationRate || 0) >= 70
                            ? "text-yellow-600"
                            : "text-green-600"
                      )}
                    >
                      {budget.utilizationRate || 0}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {(budget.utilizationRate || 0) >= 90 ? (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Critical
                      </span>
                    ) : (budget.utilizationRate || 0) >= 70 ? (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Warning
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Good
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-50 font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.allocated)}</TableCell>
                <TableCell className="text-right text-orange-600">
                  {formatCurrency(totals.spent)}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {formatCurrency(totals.remaining)}
                </TableCell>
                <TableCell className="text-right">{overallUtilization}%</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Footer - Print only */}
      <div className="hidden print:block mt-12">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="mb-12">_____________________________</p>
            <p className="font-semibold">Prepared by:</p>
            <p className="text-sm mt-1">Administrative Officer</p>
          </div>
          <div>
            <p className="mb-12">_____________________________</p>
            <p className="font-semibold">Reviewed by:</p>
            <p className="text-sm mt-1">Chief, Accounting Section</p>
          </div>
          <div>
            <p className="mb-12">_____________________________</p>
            <p className="font-semibold">Approved by:</p>
            <p className="text-sm mt-1">School Principal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

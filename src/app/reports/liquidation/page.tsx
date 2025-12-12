"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Printer, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store/finance.store";

export default function LiquidationReport() {
  const { liquidations, isLoading, fetchLiquidations } = useFinanceStore();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchLiquidations();
  }, [fetchLiquidations]);

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const headers = ["Liquidation No.", "CA Number", "Employee", "CA Amount", "Total Expenses", "To Refund", "Additional Needed", "Date Submitted", "Status"];
    const rows = (liquidations || []).map(l => [
      l.liquidation_number,
      l.ca_number,
      l.employee_name,
      l.cash_advance_amount.toString(),
      l.total_expenses.toString(),
      l.amount_to_refund.toString(),
      l.additional_cash_needed.toString(),
      formatDate(l.date_submitted),
      l.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `liquidation-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalLiquidated = (liquidations || []).reduce((sum, l) => sum + l.total_expenses, 0);
  const totalRefunds = (liquidations || []).reduce((sum, l) => sum + l.amount_to_refund, 0);
  const approvedCount = (liquidations || []).filter(l => l.status === "Approved").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/reports">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Liquidation Report</h1>
            <p className="text-muted-foreground mt-1">
              Cash advance liquidations with expense breakdown
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
            Print
          </Button>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center mb-8">
        <h2 className="text-xl font-bold">Department of Education</h2>
        <h3 className="text-lg font-semibold mt-2">Liquidation Report</h3>
        <p className="text-sm mt-1">As of {new Date().toLocaleDateString()}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Liquidations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(liquidations || []).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalLiquidated)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRefunds)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{approvedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Liquidations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liquidation Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Liquidation No.</TableHead>
                <TableHead>CA Number</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">CA Amount</TableHead>
                <TableHead className="text-right">Total Expenses</TableHead>
                <TableHead className="text-right">To Refund</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(liquidations || []).map((liquidation) => (
                <>
                  <TableRow key={liquidation.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell onClick={() => toggleRow(liquidation.id)}>
                      {expandedRows.has(liquidation.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {liquidation.liquidation_number}
                    </TableCell>
                    <TableCell className="font-mono">{liquidation.ca_number}</TableCell>
                    <TableCell className="font-medium">{liquidation.employee_name}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(liquidation.cash_advance_amount)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-orange-600">
                      {formatCurrency(liquidation.total_expenses)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {formatCurrency(liquidation.amount_to_refund)}
                    </TableCell>
                    <TableCell>{formatDate(liquidation.date_submitted)}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          liquidation.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : liquidation.status === "Verified"
                              ? "bg-blue-100 text-blue-800"
                              : liquidation.status === "Disapproved"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {liquidation.status}
                      </span>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(liquidation.id) && liquidation.items && (
                    <TableRow>
                      <TableCell colSpan={9} className="bg-gray-50 p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Expense Breakdown:</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Particulars</TableHead>
                                <TableHead>Receipt No.</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {liquidation.items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{formatDate(item.date)}</TableCell>
                                  <TableCell>{item.particulars}</TableCell>
                                  <TableCell className="font-mono text-sm">
                                    {item.receipt_number || "—"}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatCurrency(item.amount)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
              {(liquidations || []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No liquidation records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Footer */}
      <div className="hidden print:block mt-12">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="mb-12">_____________________________</p>
            <p className="font-semibold">Prepared by:</p>
            <p className="text-sm mt-1">Administrative Officer</p>
          </div>
          <div>
            <p className="mb-12">_____________________________</p>
            <p className="font-semibold">Verified by:</p>
            <p className="text-sm mt-1">Chief Accountant</p>
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

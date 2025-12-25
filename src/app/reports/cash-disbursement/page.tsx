"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Printer, Loader2, AlertCircle, Filter } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store/finance.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CashDisbursementReport() {
  const { disbursements, isLoading, error, fetchDisbursements } = useFinanceStore();

  const [filters, setFilters] = useState({
    date_from: "",
    date_to: "",
    fund_source: "",
    status: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDisbursements(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    fetchDisbursements(filters);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const headers = ["DV Number", "Date", "Payee", "Purpose", "Fund Source", "Amount", "Check Number", "Status"];
    const rows = (disbursements || []).map(d => [
      d.dv_number,
      formatDate(d.created_date),
      d.payee,
      d.purpose,
      d.fund_source,
      d.amount.toString(),
      d.check_number || "",
      d.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cash-disbursement-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalDisbursed = (disbursements || []).reduce((sum, d) => sum + d.amount, 0);
  const paidCount = (disbursements || []).filter(d => d.status === "Paid").length;

  if (isLoading && (!disbursements || disbursements.length === 0)) {
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
            <h1 className="text-3xl font-bold text-gray-900">Cash Disbursement Report</h1>
            <p className="text-muted-foreground mt-1">
              Detailed record of all disbursement vouchers
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
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
        <h3 className="text-lg font-semibold mt-2">Cash Disbursement Report</h3>
        <p className="text-sm mt-1">As of {new Date().toLocaleDateString()}</p>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="text-base">Filter Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fund Source</Label>
                <Select value={filters.fund_source} onValueChange={(val) => setFilters({ ...filters, fund_source: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sources</SelectItem>
                    <SelectItem value="MOOE">MOOE</SelectItem>
                    <SelectItem value="SEF">SEF</SelectItem>
                    <SelectItem value="Canteen Fund">Canteen Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(val) => setFilters({ ...filters, status: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Certified">Certified</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setFilters({ date_from: "", date_to: "", fund_source: "", status: "" })}>
                Clear Filters
              </Button>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Disbursements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(disbursements || []).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount Disbursed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalDisbursed)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{paidCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Disbursements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Disbursement Vouchers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DV Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payee</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Fund Source</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Check No.</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(disbursements || []).map((disbursement) => (
                  <TableRow key={disbursement.id}>
                    <TableCell className="font-mono font-medium">
                      {disbursement.dv_number}
                    </TableCell>
                    <TableCell>{formatDate(disbursement.created_date)}</TableCell>
                    <TableCell className="font-medium">{disbursement.payee}</TableCell>
                    <TableCell className="max-w-xs truncate">{disbursement.purpose}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {disbursement.fund_source}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(disbursement.amount)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {disbursement.check_number || "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          disbursement.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : disbursement.status === "Approved"
                              ? "bg-blue-100 text-blue-800"
                              : disbursement.status === "Certified"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {disbursement.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {(disbursements || []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No disbursement records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
            <p className="font-semibold">Certified by:</p>
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

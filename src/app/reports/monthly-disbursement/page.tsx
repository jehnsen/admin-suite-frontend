"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Printer, Loader2 } from "lucide-react";
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

export default function MonthlyDisbursementReport() {
  const { disbursements, isLoading, fetchDisbursements } = useFinanceStore();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    // Fetch disbursements for selected month
    const startDate = new Date(Number(selectedYear), Number(selectedMonth) - 1, 1);
    const endDate = new Date(Number(selectedYear), Number(selectedMonth), 0);

    fetchDisbursements({
      date_from: startDate.toISOString().split('T')[0],
      date_to: endDate.toISOString().split('T')[0],
    });
  }, [selectedYear, selectedMonth, fetchDisbursements]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const monthLabel = months.find(m => m.value === selectedMonth)?.label;
    const headers = ["Date", "DV Number", "Payee", "Purpose", "Fund Source", "Amount", "Check Number"];
    const rows = (disbursements || []).map(d => [
      formatDate(d.created_date),
      d.dv_number,
      d.payee,
      d.purpose,
      d.fund_source,
      d.amount.toString(),
      d.check_number || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monthly-disbursement-report-${monthLabel}-${selectedYear}.csv`;
    a.click();
  };

  // Group disbursements by fund source
  const groupedByFund = (disbursements || []).reduce((acc, d) => {
    if (!acc[d.fund_source]) {
      acc[d.fund_source] = [];
    }
    acc[d.fund_source].push(d);
    return acc;
  }, {} as Record<string, typeof disbursements>);

  const totalAllFunds = (disbursements || []).reduce((sum, d) => sum + d.amount, 0);
  const monthLabel = months.find(m => m.value === selectedMonth)?.label;

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
            <h1 className="text-3xl font-bold text-gray-900">
              Monthly Report of Disbursements (MRD)
            </h1>
            <p className="text-muted-foreground mt-1">
              Standard DepED financial report for {monthLabel} {selectedYear}
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

      {/* Period Selector */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle className="text-base">Select Reporting Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Header */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4">
        <h2 className="text-xl font-bold">DEPARTMENT OF EDUCATION</h2>
        <h3 className="text-lg font-semibold mt-1">MONTHLY REPORT OF DISBURSEMENTS (MRD)</h3>
        <p className="text-base mt-2">For the Month of <span className="font-semibold">{monthLabel} {selectedYear}</span></p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Disbursements</p>
              <p className="text-2xl font-bold">{(disbursements || []).length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalAllFunds)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fund Sources</p>
              <p className="text-2xl font-bold">{Object.keys(groupedByFund).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disbursements by Fund Source */}
      {Object.entries(groupedByFund).map(([fundSource, fundDisbursements]) => {
        const fundTotal = fundDisbursements.reduce((sum, d) => sum + d.amount, 0);

        return (
          <Card key={fundSource} className="page-break-inside-avoid">
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Fund Source: {fundSource}</CardTitle>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(fundTotal)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead className="w-[120px]">DV Number</TableHead>
                    <TableHead>Payee</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="w-[140px] text-right">Amount</TableHead>
                    <TableHead className="w-[120px]">Check No.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fundDisbursements.map((disbursement) => (
                    <TableRow key={disbursement.id}>
                      <TableCell className="text-sm">
                        {formatDate(disbursement.created_date)}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {disbursement.dv_number}
                      </TableCell>
                      <TableCell className="font-medium">{disbursement.payee}</TableCell>
                      <TableCell className="text-sm">{disbursement.purpose}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(disbursement.amount)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {disbursement.check_number || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell colSpan={4} className="text-right">
                      Subtotal - {fundSource}:
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(fundTotal)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}

      {/* Grand Total */}
      <Card className="border-2 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">GRAND TOTAL</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalAllFunds)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Certification Section - Print only */}
      <div className="hidden print:block mt-12 border-t-2 border-black pt-8">
        <div className="space-y-8">
          <div>
            <h4 className="font-semibold mb-4">CERTIFICATION:</h4>
            <p className="text-sm text-justify">
              I hereby certify that the above Monthly Report of Disbursements for the month of{" "}
              <span className="font-semibold">{monthLabel} {selectedYear}</span> is correct and in
              accordance with the books of accounts and supporting documents on file in this office.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 mt-12">
            <div>
              <p className="mb-16">______________________________________</p>
              <p className="font-semibold">Prepared by:</p>
              <p className="text-sm">Administrative Officer II</p>
              <p className="text-sm mt-4">Date: _______________</p>
            </div>
            <div>
              <p className="mb-16">______________________________________</p>
              <p className="font-semibold">Certified Correct:</p>
              <p className="text-sm">Chief, Accounting Section</p>
              <p className="text-sm mt-4">Date: _______________</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="mb-16">______________________________________</p>
            <p className="font-semibold">Noted by:</p>
            <p className="text-sm">School Principal</p>
            <p className="text-sm mt-4">Date: _______________</p>
          </div>
        </div>
      </div>
    </div>
  );
}

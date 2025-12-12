"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Printer, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store/finance.store";

export default function SAAOReport() {
  const { budgetAllocations, disbursements, isLoading, fetchBudgetAllocations, fetchDisbursements } = useFinanceStore();
  const [fiscalYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    fetchBudgetAllocations();
    fetchDisbursements();
  }, [fetchBudgetAllocations, fetchDisbursements]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const headers = ["Fund Source", "Appropriations", "Allotments", "Obligations", "Unobligated Balance", "Utilization %"];
    const rows = budgetAllocations.map(b => [
      b.source,
      b.allocated.toString(),
      b.allocated.toString(), // In DepED, allotments often equal appropriations
      b.spent.toString(),
      b.remaining.toString(),
      `${b.utilizationRate}%`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saao-report-${fiscalYear}.csv`;
    a.click();
  };

  // Calculate obligations (disbursements) per fund source
  const obligationsByFund = (disbursements || []).reduce((acc, d) => {
    if (!acc[d.fund_source]) {
      acc[d.fund_source] = 0;
    }
    acc[d.fund_source] += d.amount;
    return acc;
  }, {} as Record<string, number>);

  // Combine budget allocations with obligations
  const saaData = budgetAllocations.map(budget => ({
    fundSource: budget.source,
    appropriation: budget.allocated,
    allotment: budget.allocated, // Typically same as appropriation
    obligations: obligationsByFund[budget.source] || 0,
    unobligated: budget.allocated - (obligationsByFund[budget.source] || 0),
    utilizationRate: budget.allocated > 0
      ? ((obligationsByFund[budget.source] || 0) / budget.allocated * 100).toFixed(2)
      : "0.00"
  }));

  const totals = saaData.reduce((acc, item) => ({
    appropriation: acc.appropriation + item.appropriation,
    allotment: acc.allotment + item.allotment,
    obligations: acc.obligations + item.obligations,
    unobligated: acc.unobligated + item.unobligated,
  }), { appropriation: 0, allotment: 0, obligations: 0, unobligated: 0 });

  const overallUtilization = totals.appropriation > 0
    ? ((totals.obligations / totals.appropriation) * 100).toFixed(2)
    : "0.00";

  if (isLoading && budgetAllocations.length === 0) {
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
              Statement of Appropriations, Allotments & Obligations (SAAO)
            </h1>
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

      {/* Print Header */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4">
        <h2 className="text-xl font-bold">DEPARTMENT OF EDUCATION</h2>
        <h3 className="text-lg font-semibold mt-1">
          STATEMENT OF APPROPRIATIONS, ALLOTMENTS, AND OBLIGATIONS (SAAO)
        </h3>
        <p className="text-base mt-2">Fiscal Year <span className="font-semibold">{fiscalYear}</span></p>
        <p className="text-sm">As of {new Date().toLocaleDateString()}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Appropriations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.appropriation)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Obligations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totals.obligations)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unobligated Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totals.unobligated)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overallUtilization}%</div>
          </CardContent>
        </Card>
      </div>

      {/* SAAO Table */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle>Statement of Appropriations, Allotments, and Obligations</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-bold">Fund Source</TableHead>
                <TableHead className="text-right font-bold">Appropriations</TableHead>
                <TableHead className="text-right font-bold">Allotments</TableHead>
                <TableHead className="text-right font-bold">Obligations</TableHead>
                <TableHead className="text-right font-bold">Unobligated Balance</TableHead>
                <TableHead className="text-right font-bold">Utilization %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saaData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-semibold">{item.fundSource}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.appropriation)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.allotment)}
                  </TableCell>
                  <TableCell className="text-right text-orange-600 font-semibold">
                    {formatCurrency(item.obligations)}
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-semibold">
                    {formatCurrency(item.unobligated)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {item.utilizationRate}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-800 text-white font-bold">
                <TableCell>GRAND TOTAL</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.appropriation)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.allotment)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.obligations)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.unobligated)}</TableCell>
                <TableCell className="text-right">{overallUtilization}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Appropriations:</strong> The total amount of funds authorized by law for specific purposes.
          </p>
          <p>
            <strong>Allotments:</strong> The portion of appropriations released and made available for obligation.
          </p>
          <p>
            <strong>Obligations:</strong> The actual commitments or liabilities incurred through contracts, purchase orders, or similar transactions.
          </p>
          <p>
            <strong>Unobligated Balance:</strong> The portion of allotments not yet committed or obligated.
          </p>
        </CardContent>
      </Card>

      {/* Certification Section - Print only */}
      <div className="hidden print:block mt-12 page-break-before">
        <div className="space-y-8 border-t-2 border-black pt-8">
          <div>
            <h4 className="font-semibold mb-4">CERTIFICATION:</h4>
            <p className="text-sm text-justify">
              I hereby certify that the above Statement of Appropriations, Allotments, and Obligations (SAAO)
              for Fiscal Year <span className="font-semibold">{fiscalYear}</span> is correct and in accordance
              with the books of accounts, budget documents, and supporting records on file in this office.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 mt-12">
            <div>
              <p className="mb-16">______________________________________</p>
              <p className="font-semibold">Prepared by:</p>
              <p className="text-sm">Budget Officer</p>
              <p className="text-sm">Accounting Section</p>
              <p className="text-sm mt-4">Date: _______________</p>
            </div>
            <div>
              <p className="mb-16">______________________________________</p>
              <p className="font-semibold">Reviewed and Certified Correct:</p>
              <p className="text-sm">Chief, Accounting Section</p>
              <p className="text-sm mt-4">Date: _______________</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="mb-16">______________________________________</p>
            <p className="font-semibold">Approved by:</p>
            <p className="text-sm">School Principal</p>
            <p className="text-sm mt-4">Date: _______________</p>
          </div>
        </div>
      </div>
    </div>
  );
}

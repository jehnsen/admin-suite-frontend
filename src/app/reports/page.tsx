"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  DollarSign,
  TrendingUp,
  FileBarChart,
  Receipt,
  Calendar,
  FileSpreadsheet,
  ClipboardList,
  PieChart,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface ReportCard {
  title: string;
  description: string;
  icon: any;
  href: string;
  category: "Financial" | "Procurement" | "Personnel" | "Inventory";
  color: string;
}

const reports: ReportCard[] = [
  // Financial Reports
  {
    title: "Budget Allocation Report",
    description: "Summary of budget allocations by fund source with utilization rates",
    icon: PieChart,
    href: "/reports/budget-allocation",
    category: "Financial",
    color: "text-blue-600 bg-blue-50"
  },
  {
    title: "Cash Disbursement Report",
    description: "Detailed list of all disbursement vouchers and payments",
    icon: DollarSign,
    href: "/reports/cash-disbursement",
    category: "Financial",
    color: "text-green-600 bg-green-50"
  },
  {
    title: "Liquidation Report",
    description: "Cash advance liquidations with supporting documents",
    icon: Receipt,
    href: "/reports/liquidation",
    category: "Financial",
    color: "text-purple-600 bg-purple-50"
  },
  {
    title: "Monthly Report of Disbursements (MRD)",
    description: "Monthly summary of all disbursements for submission to accounting",
    icon: Calendar,
    href: "/reports/monthly-disbursement",
    category: "Financial",
    color: "text-orange-600 bg-orange-50"
  },
  {
    title: "Statement of Appropriations, Allotments & Obligations (SAAO)",
    description: "Summary of budget appropriations, allotments, obligations, and balances",
    icon: FileSpreadsheet,
    href: "/reports/saao",
    category: "Financial",
    color: "text-indigo-600 bg-indigo-50"
  },

  // Procurement Reports
  {
    title: "Purchase Request Summary",
    description: "Summary of all purchase requests by status and fund source",
    icon: FileText,
    href: "/reports/purchase-request",
    category: "Procurement",
    color: "text-teal-600 bg-teal-50"
  },
  {
    title: "Purchase Order Report",
    description: "List of purchase orders with delivery and payment status",
    icon: ClipboardList,
    href: "/reports/purchase-order",
    category: "Procurement",
    color: "text-cyan-600 bg-cyan-50"
  },

  // Inventory Reports
  {
    title: "Inventory Status Report",
    description: "Current inventory levels, stock movements, and valuations",
    icon: FileBarChart,
    href: "/reports/inventory-status",
    category: "Inventory",
    color: "text-amber-600 bg-amber-50"
  },
];

export default function ReportsPage() {
  const categories = ["Financial", "Procurement", "Personnel", "Inventory"] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-muted-foreground mt-1">
          Generate and view various reports for DepED administrative requirements
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Reports</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.category === "Financial").length}
            </div>
            <p className="text-xs text-muted-foreground">Available reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procurement Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.category === "Procurement").length}
            </div>
            <p className="text-xs text-muted-foreground">Available reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personnel Reports</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.category === "Personnel").length}
            </div>
            <p className="text-xs text-muted-foreground">Available reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Reports</CardTitle>
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.category === "Inventory").length}
            </div>
            <p className="text-xs text-muted-foreground">Available reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports by Category */}
      {categories.map((category) => {
        const categoryReports = reports.filter((r) => r.category === category);
        if (categoryReports.length === 0) return null;

        return (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">{category} Reports</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryReports.map((report) => {
                const Icon = report.icon;
                return (
                  <Card key={report.href} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg ${report.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-4">{report.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {report.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={report.href}>
                        <Button className="w-full">
                          View Report
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

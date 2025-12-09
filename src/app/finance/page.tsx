"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  expenses,
  Expense,
  budgetAllocations,
  BudgetAllocation,
} from "@/lib/data/finance";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<"expenses" | "budget">("expenses");

  const expenseColumns: Column<Expense>[] = [
    {
      header: "Expense ID",
      accessor: "id",
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Date",
      accessor: "date",
      cell: (value) => <span className="text-sm">{formatDate(value)}</span>,
    },
    {
      header: "Payee",
      accessor: "payee",
      cell: (value) => <p className="font-medium">{value}</p>,
    },
    {
      header: "Particulars",
      accessor: "particulars",
      cell: (value, row) => (
        <div>
          <p className="text-sm">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{row.category}</p>
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (value) => (
        <span className="text-sm font-medium">{formatCurrency(value)}</span>
      ),
    },
    {
      header: "Source",
      accessor: "source",
      cell: (value) => {
        const variant =
          value === "MOOE"
            ? "default"
            : value === "Canteen Fund"
              ? "secondary"
              : "outline";
        return <Badge variant={variant as any}>{value}</Badge>;
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const variant =
          value === "Paid"
            ? "success"
            : value === "Pending"
              ? "warning"
              : "destructive";
        return <Badge variant={variant as any}>{value}</Badge>;
      },
    },
    {
      header: "Receipt No.",
      accessor: "receiptNumber",
      cell: (value) => (
        <span className="text-sm font-mono">{value || "—"}</span>
      ),
    },
  ];

  const stats = {
    totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    paidExpenses: expenses.filter((e) => e.status === "Paid").length,
    pendingExpenses: expenses.filter((e) => e.status === "Pending").length,
    mooeSpent: expenses
      .filter((e) => e.source === "MOOE" && e.status === "Paid")
      .reduce((sum, e) => sum + e.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Financial Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track expenses, manage budgets, and monitor financial utilization
          </p>
        </div>
        <Link href="/finance/expense/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Log Expense
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalExpenses)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.paidExpenses}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingExpenses}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MOOE Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.mooeSpent)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("expenses")}
            className={cn(
              "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "expenses"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <DollarSign className="h-4 w-4" />
            Cash Disbursement
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={cn(
              "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "budget"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <TrendingUp className="h-4 w-4" />
            Budget Utilization
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "expenses" && (
        <Card>
          <CardHeader>
            <CardTitle>Cash Disbursement Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={expenses}
              columns={expenseColumns}
              searchPlaceholder="Search by payee, particulars, receipt..."
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "budget" && (
        <div className="space-y-6">
          {/* Budget Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            {budgetAllocations.map((budget) => (
              <Card key={budget.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{budget.source}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Allocated</span>
                      <span className="font-medium">
                        {formatCurrency(budget.allocated)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-medium">
                        {formatCurrency(budget.spent)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(budget.remaining)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-bold">{budget.utilizationRate}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          budget.utilizationRate >= 90
                            ? "bg-red-600"
                            : budget.utilizationRate >= 70
                              ? "bg-yellow-600"
                              : "bg-green-600"
                        )}
                        style={{ width: `${budget.utilizationRate}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Budget Table */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Breakdown by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetAllocations.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{budget.source}</h4>
                      <div className="flex gap-6 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Allocated:{" "}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(budget.allocated)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Spent: </span>
                          <span className="font-medium">
                            {formatCurrency(budget.spent)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Remaining:{" "}
                          </span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(budget.remaining)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {budget.utilizationRate >= 70 ? (
                          <TrendingUp className="h-4 w-4 text-red-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-600" />
                        )}
                        <span
                          className={cn(
                            "text-lg font-bold",
                            budget.utilizationRate >= 90
                              ? "text-red-600"
                              : budget.utilizationRate >= 70
                                ? "text-yellow-600"
                                : "text-green-600"
                          )}
                        >
                          {budget.utilizationRate}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Utilized
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

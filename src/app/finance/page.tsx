"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, DollarSign, TrendingUp, TrendingDown, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store/finance.store";
import type { Disbursement, BudgetAllocation } from "@/lib/api/services/finance.service";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<"expenses" | "budget">("expenses");

  const {
    disbursements,
    budgetAllocations,
    isLoading,
    error,
    fetchDisbursements,
    fetchBudgets,
    clearError,
  } = useFinanceStore();

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchDisbursements();
      } catch (err) {
        console.error('Error loading disbursements:', err);
      }

      try {
        await fetchBudgets();
      } catch (err) {
        console.error('Error loading budgets:', err);
      }
    };

    loadData();
  }, [fetchDisbursements, fetchBudgets]);

  const expenseColumns: Column<Disbursement>[] = [
    {
      header: "DV Number",
      accessor: "dv_number" as any,
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Date",
      accessor: "created_date" as any,
      cell: (value) => <span className="text-sm">{formatDate(value)}</span>,
    },
    {
      header: "Payee",
      accessor: "payee",
      cell: (value) => <p className="font-medium">{value}</p>,
    },
    {
      header: "Purpose",
      accessor: "purpose" as any,
      cell: (value, row) => (
        <div>
          <p className="text-sm">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{row.fund_source}</p>
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
      header: "Fund Source",
      accessor: "fund_source" as any,
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
            : value === "Approved"
              ? "default"
              : value === "Certified"
                ? "secondary"
                : "outline";
        return <Badge variant={variant as any}>{value}</Badge>;
      },
    },
    {
      header: "Check No.",
      accessor: "check_number" as any,
      cell: (value) => (
        <span className="text-sm font-mono">{value || "—"}</span>
      ),
    },
  ];

  const stats = {
    totalExpenses: (disbursements || []).reduce((sum, exp) => sum + exp.amount, 0),
    paidExpenses: (disbursements || []).filter((e) => e.status === "Paid").length,
    pendingExpenses: (disbursements || []).filter((e) => e.status === "Draft" || e.status === "Certified").length,
    mooeSpent: (disbursements || [])
      .filter((e) => e.fund_source === "MOOE" && e.status === "Paid")
      .reduce((sum, e) => sum + e.amount, 0),
  };

  // Loading state
  if (isLoading && (!disbursements || disbursements.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-900">Error loading data</p>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={clearError}
            className="shrink-0"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Financial Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track disbursements, manage budgets, and monitor financial utilization
          </p>
        </div>
        <Link href="/finance/expense/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Disbursement
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
            <CardTitle>Disbursement Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={disbursements || []}
              columns={expenseColumns}
              searchPlaceholder="Search by payee, DV number, purpose..."
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "budget" && (
        <div className="space-y-6">
          {/* Budget Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            {(budgetAllocations || []).map((budget) => (
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
                      <span className="font-bold">{budget.utilizationRate || 0}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          (budget.utilizationRate || 0) >= 90
                            ? "bg-red-600"
                            : (budget.utilizationRate || 0) >= 70
                              ? "bg-yellow-600"
                              : "bg-green-600"
                        )}
                        style={{ width: `${budget.utilizationRate || 0}%` }}
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
                {(budgetAllocations || []).map((budget) => (
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
                        {(budget.utilizationRate || 0) >= 70 ? (
                          <TrendingUp className="h-4 w-4 text-red-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-600" />
                        )}
                        <span
                          className={cn(
                            "text-lg font-bold",
                            (budget.utilizationRate || 0) >= 90
                              ? "text-red-600"
                              : (budget.utilizationRate || 0) >= 70
                                ? "text-yellow-600"
                                : "text-green-600"
                          )}
                        >
                          {budget.utilizationRate || 0}%
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

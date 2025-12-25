"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  AlertTriangle,
  DollarSign,
  Plus,
  Package,
  Receipt,
  Clock,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { financeService, BudgetAllocation } from "@/lib/api/services/finance.service";
import { employees, leaveRequests } from "@/lib/data/personnel";
import { inventoryItems } from "@/lib/data/inventory";

export default function DashboardPage() {
  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[]>([]);
  const [budgetStats, setBudgetStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setIsLoading(true);
        const [budgets, stats] = await Promise.all([
          financeService.getBudgets(),
          financeService.getBudgetStatistics(),
        ]);
        setBudgetAllocations(budgets);
        setBudgetStats(stats);
      } catch (error) {
        console.error("Failed to fetch budget data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  // Calculate stats
  const totalPersonnel = employees.length;
  const activeLeaves = leaveRequests.filter((req) => req.status === "Pending")
    .length;
  const lowStockItems = inventoryItems.filter(
    (item) => item.quantity < item.threshold
  ).length;
  const mooeRemaining =
    budgetAllocations.find((b) => b.source === "MOOE")?.remaining || 0;

  const pendingApprovals = leaveRequests.filter(
    (req) => req.status === "Pending"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl font-bold text-primary">Sta. Maria Senior High</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s what&apos;s happening in your school today.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="slide-in-from-bottom-2" style={{ animationDelay: "0ms" }}>
          <StatsCard
            title="Total Personnel"
            value={totalPersonnel}
            description="Active staff members"
            icon={Users}
            variant="default"
          />
        </div>
        <div className="slide-in-from-bottom-2" style={{ animationDelay: "100ms" }}>
          <StatsCard
            title="Pending Leave Requests"
            value={activeLeaves}
            description="Requiring approval"
            icon={Calendar}
            variant="warning"
          />
        </div>
        <div className="slide-in-from-bottom-2" style={{ animationDelay: "200ms" }}>
          <StatsCard
            title="Inventory Alerts"
            value={lowStockItems}
            description="Items below threshold"
            icon={AlertTriangle}
            variant="destructive"
          />
        </div>
        <div className="slide-in-from-bottom-2" style={{ animationDelay: "300ms" }}>
          <StatsCard
            title="MOOE Budget Remaining"
            value={formatCurrency(mooeRemaining)}
            description="Available funds"
            icon={DollarSign}
            variant="success"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fade-in" style={{ animationDelay: "400ms" }}>
        <Card className="card-hover shadow-sm border-gray-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 md:grid-cols-3">
              <Link href="/personnel/leave/new">
                <Button className="w-full justify-start btn-hover h-11 font-medium" variant="outline">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 mr-3">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">New Leave Request</span>
                </Button>
              </Link>
              <Link href="/inventory/issue">
                <Button className="w-full justify-start btn-hover h-11 font-medium" variant="outline">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 mr-3">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm">Issue Item</span>
                </Button>
              </Link>
              <Link href="/finance/expense/new">
                <Button className="w-full justify-start btn-hover h-11 font-medium" variant="outline">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 mr-3">
                    <Receipt className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-sm">Log Expense</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Approvals */}
        <div className="slide-in-from-left-2" style={{ animationDelay: "500ms" }}>
          <Card className="card-hover h-full shadow-sm border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900">Pending Approvals</CardTitle>
              <Link href="/personnel/leave">
                <Button variant="ghost" size="sm" className="btn-hover text-primary hover:text-primary/80 hover:bg-primary/5">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {pendingApprovals.length > 0 ? (
                  pendingApprovals.map((request, index) => (
                    <div
                      key={request.id}
                      className="flex items-start justify-between p-4 fade-in transition-all hover:bg-gray-50/80 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                      <div className="space-y-2 flex-1 mr-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-gray-900">
                            {request.employeeName}
                          </p>
                          <Badge variant="warning" className="text-xs font-medium">
                            {request.leaveType}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">
                          {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          <span className="text-gray-400 ml-1">
                            ({request.days} {request.days === 1 ? "day" : "days"})
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {request.reason}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button size="sm" variant="default" className="btn-hover min-w-[80px] shadow-sm">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="btn-hover min-w-[80px]">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center fade-in">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Clock className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">No pending approvals</p>
                    <p className="text-xs text-gray-500">All caught up!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        <div className="slide-in-from-right-2" style={{ animationDelay: "500ms" }}>
          <Card className="card-hover h-full shadow-sm border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900">Low Stock Alerts</CardTitle>
              <Link href="/inventory">
                <Button variant="ghost" size="sm" className="btn-hover text-primary hover:text-primary/80 hover:bg-primary/5">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {inventoryItems
                  .filter((item) => item.quantity < item.threshold)
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 fade-in transition-all hover:bg-gray-50/80 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                      <div className="space-y-2 flex-1 mr-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                          <Badge variant="destructive" className="text-xs font-medium">
                            Low Stock
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">
                          Current: <span className="text-red-600 font-semibold">{item.quantity}</span> {item.unit}
                          <span className="text-gray-400 mx-1">|</span>
                          Threshold: <span className="text-gray-900">{item.threshold}</span> {item.unit}
                        </p>
                        <p className="text-xs text-gray-500">
                          📍 {item.location}
                        </p>
                      </div>
                      <Link href="/inventory">
                        <Button size="sm" variant="outline" className="btn-hover shrink-0 shadow-sm">
                          Restock
                        </Button>
                      </Link>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="slide-in-from-bottom-2" style={{ animationDelay: "600ms" }}>
        <Card className="card-hover shadow-sm border-gray-100">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="text-base font-semibold text-gray-900">Budget Utilization Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : budgetAllocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">No budget data</p>
                <p className="text-xs text-gray-500">Budget information will appear here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {budgetAllocations.map((budget, index) => (
                <div
                  key={budget.id}
                  className="space-y-3 fade-in p-4 rounded-xl bg-gradient-to-r from-gray-50 to-transparent border border-gray-100"
                  style={{ animationDelay: `${700 + index * 150}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">{budget.source}</p>
                      <p className="text-xs text-gray-600 font-medium">
                        <span className="text-primary font-semibold">{formatCurrency(budget.spent)}</span>
                        <span className="text-gray-400 mx-1">of</span>
                        <span className="text-gray-900">{formatCurrency(budget.allocated)}</span>
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-baseline gap-1">
                        <p className="text-2xl font-bold text-primary">
                          {budget.utilizationRate}
                        </p>
                        <p className="text-xs font-semibold text-gray-500">%</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(budget.remaining)} left
                      </p>
                    </div>
                  </div>
                  <div className="relative h-3 w-full rounded-full bg-gray-200 overflow-hidden shadow-inner">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-blue-600 shadow-sm transition-all duration-1000 ease-out"
                      style={{
                        width: `${budget.utilizationRate}%`,
                        animationDelay: `${700 + index * 150}ms`
                      }}
                    />
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

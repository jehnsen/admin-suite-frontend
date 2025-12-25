"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinanceStore } from "@/lib/store/finance.store";
import { formatCurrency } from "@/lib/utils";
import { Plus, Edit, Loader2, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { BudgetAllocation } from "@/lib/api/services/finance.service";
import { cn } from "@/lib/utils";

export default function BudgetManagementPage() {
  const {
    budgetAllocations,
    isLoading,
    error,
    fetchBudgets,
    createBudgetAllocation,
    updateBudgetAllocation,
    clearError,
  } = useFinanceStore();

  const [showDialog, setShowDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetAllocation | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fund_source: "",
    allocated_amount: 0,
    fiscal_year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleEdit = (budget: BudgetAllocation) => {
    setEditingBudget(budget);
    setFormData({
      fund_source: budget.source || budget.fund_source || "",
      allocated_amount: budget.allocated || budget.allocated_amount || 0,
      fiscal_year: budget.fiscal_year || parseInt(budget.fiscalYear) || new Date().getFullYear(),
    });
    setShowDialog(true);
  };

  const handleNewBudget = () => {
    setEditingBudget(null);
    setFormData({
      fund_source: "",
      allocated_amount: 0,
      fiscal_year: new Date().getFullYear(),
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (editingBudget) {
        // Update existing budget - only update allocated amount
        await updateBudgetAllocation(editingBudget.id, {
          allocated: formData.allocated_amount,
          allocated_amount: formData.allocated_amount,
        });
      } else {
        // Create new budget - use backend format
        await createBudgetAllocation({
          fund_source: formData.fund_source,
          allocated_amount: formData.allocated_amount,
          fiscal_year: formData.fiscal_year,
        });
      }

      setShowDialog(false);
      await fetchBudgets();
    } catch (err) {
      console.error("Failed to save budget:", err);
      alert("Failed to save budget allocation");
    } finally {
      setIsSaving(false);
    }
  };

  const totalAllocated = budgetAllocations.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgetAllocations.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = budgetAllocations.reduce((sum, b) => sum + b.remaining, 0);

  if (isLoading && budgetAllocations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading budget data...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-muted-foreground mt-1">
            Set and manage budget allocations for different fund sources
          </p>
        </div>
        <Button onClick={handleNewBudget}>
          <Plus className="mr-2 h-4 w-4" />
          New Budget Allocation
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAllocated)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {budgetAllocations.length} fund sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalAllocated > 0
                ? `${((totalSpent / totalAllocated) * 100).toFixed(1)}% utilized`
                : "0% utilized"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Remaining</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRemaining)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Allocations List */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Allocations by Fund Source</CardTitle>
          <CardDescription>
            Manage your MOOE, SEF, Canteen Fund, and other budget allocations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetAllocations.map((budget) => (
              <div
                key={budget.id}
                className="p-6 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{budget.source}</h3>
                      <span className="text-sm text-muted-foreground">
                        FY {budget.fiscalYear}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Allocated</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(budget.allocated)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Spent</p>
                        <p className="text-lg font-semibold text-red-600">
                          {formatCurrency(budget.spent)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(budget.remaining)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(budget)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="font-semibold">{budget.utilizationRate || 0}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        (budget.utilizationRate || 0) >= 90
                          ? "bg-red-600"
                          : (budget.utilizationRate || 0) >= 70
                            ? "bg-yellow-600"
                            : "bg-green-600"
                      )}
                      style={{ width: `${Math.min(budget.utilizationRate || 0, 100)}%` }}
                    />
                  </div>
                  {(budget.utilizationRate || 0) >= 90 && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Warning: Budget almost depleted
                    </p>
                  )}
                </div>
              </div>
            ))}

            {budgetAllocations.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No budget allocations
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started by creating your first budget allocation
                </p>
                <Button onClick={handleNewBudget}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Budget Allocation
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? "Edit Budget Allocation" : "New Budget Allocation"}
            </DialogTitle>
            <DialogDescription>
              {editingBudget
                ? "Update the allocated amount for this fund source"
                : "Create a new budget allocation for a fund source"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!editingBudget && (
              <div className="space-y-2">
                <Label htmlFor="source">Fund Source</Label>
                <Select
                  value={formData.fund_source}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fund_source: value })
                  }
                >
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select fund source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MOOE">
                      MOOE (Maintenance and Other Operating Expenses)
                    </SelectItem>
                    <SelectItem value="SEF">SEF (Special Education Fund)</SelectItem>
                    <SelectItem value="Canteen Fund">Canteen Fund</SelectItem>
                    <SelectItem value="SBM">SBM (School-Based Management)</SelectItem>
                    <SelectItem value="PTA Fund">PTA Fund</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="allocated">Allocated Amount (₱)</Label>
              <Input
                id="allocated"
                type="number"
                step="0.01"
                min="0"
                value={formData.allocated_amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allocated_amount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiscalYear">Fiscal Year</Label>
              <Select
                value={formData.fiscal_year.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, fiscal_year: parseInt(value) })
                }
              >
                <SelectTrigger id="fiscalYear">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {editingBudget && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Current spent:</strong> {formatCurrency(editingBudget.spent)}
                  <br />
                  <strong>Current remaining:</strong>{" "}
                  {formatCurrency(formData.allocated_amount - editingBudget.spent)}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

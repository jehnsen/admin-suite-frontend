"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { budgetAllocations } from "@/lib/data/finance";
import { formatCurrency } from "@/lib/utils";

export default function NewExpensePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    payee: "",
    particulars: "",
    amount: "",
    source: "",
    category: "",
    receiptNumber: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.payee) newErrors.payee = "Payee is required";
    if (!formData.particulars) newErrors.particulars = "Particulars are required";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Valid amount is required";
    if (!formData.source) newErrors.source = "Source is required";
    if (!formData.category) newErrors.category = "Category is required";

    // Check if budget available
    const budget = budgetAllocations.find((b) => b.source === formData.source);
    if (budget && parseFloat(formData.amount) > budget.remaining) {
      newErrors.amount = `Insufficient budget. Only ${formatCurrency(budget.remaining)} remaining`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // In a real app, this would save to the backend
    console.log("Expense logged:", formData);

    // Redirect back to finance
    router.push("/finance");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const selectedBudget = budgetAllocations.find(
    (b) => b.source === formData.source
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/finance">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Log New Expense</h1>
          <p className="text-muted-foreground mt-1">
            Record a cash disbursement transaction
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      className={errors.date ? "border-red-500" : ""}
                    />
                    {errors.date && (
                      <p className="text-xs text-red-500">{errors.date}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receiptNumber">Receipt/OR Number</Label>
                    <Input
                      id="receiptNumber"
                      placeholder="OR-2025-XXXX"
                      value={formData.receiptNumber}
                      onChange={(e) =>
                        handleChange("receiptNumber", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payee">
                    Payee <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="payee"
                    placeholder="Company or individual name"
                    value={formData.payee}
                    onChange={(e) => handleChange("payee", e.target.value)}
                    className={errors.payee ? "border-red-500" : ""}
                  />
                  {errors.payee && (
                    <p className="text-xs text-red-500">{errors.payee}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="particulars">
                    Particulars <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="particulars"
                    placeholder="Describe the expense purpose..."
                    rows={3}
                    value={formData.particulars}
                    onChange={(e) =>
                      handleChange("particulars", e.target.value)
                    }
                    className={errors.particulars ? "border-red-500" : ""}
                  />
                  {errors.particulars && (
                    <p className="text-xs text-red-500">{errors.particulars}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">
                      Amount <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleChange("amount", e.target.value)}
                      className={errors.amount ? "border-red-500" : ""}
                    />
                    {errors.amount && (
                      <p className="text-xs text-red-500">{errors.amount}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger
                        className={errors.category ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Office Supplies">
                          Office Supplies
                        </SelectItem>
                        <SelectItem value="Instructional Materials">
                          Instructional Materials
                        </SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Food Supplies">
                          Food Supplies
                        </SelectItem>
                        <SelectItem value="Transportation">
                          Transportation
                        </SelectItem>
                        <SelectItem value="Professional Services">
                          Professional Services
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-red-500">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">
                    Chargeable Source <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => handleChange("source", value)}
                  >
                    <SelectTrigger
                      className={errors.source ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select budget source" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetAllocations.map((budget) => (
                        <SelectItem key={budget.id} value={budget.source}>
                          {budget.source} ({formatCurrency(budget.remaining)}{" "}
                          available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.source && (
                    <p className="text-xs text-red-500">{errors.source}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedBudget && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Budget Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <p className="font-medium">{selectedBudget.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Allocated</p>
                    <p className="font-medium">
                      {formatCurrency(selectedBudget.allocated)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Spent</p>
                    <p className="font-medium">
                      {formatCurrency(selectedBudget.spent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(selectedBudget.remaining)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Utilization
                    </p>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${selectedBudget.utilizationRate}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedBudget.utilizationRate}% utilized
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Log Expense
                </Button>
                <Link href="/finance" className="block">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

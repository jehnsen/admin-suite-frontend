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
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { employees } from "@/lib/data/personnel";
import { formatCurrency } from "@/lib/utils";

interface PRItem {
  id: string;
  itemName: string;
  description: string;
  quantity: string;
  unit: string;
  estimatedUnitCost: string;
}

export default function NewPurchaseRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    requestedBy: "",
    department: "",
    purpose: "",
  });

  const [items, setItems] = useState<PRItem[]>([
    {
      id: "1",
      itemName: "",
      description: "",
      quantity: "1",
      unit: "",
      estimatedUnitCost: "",
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        itemName: "",
        description: "",
        quantity: "1",
        unit: "",
        estimatedUnitCost: "",
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: string, value: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const cost = parseFloat(item.estimatedUnitCost) || 0;
      return sum + qty * cost;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.requestedBy) newErrors.requestedBy = "Requester is required";
    if (!formData.purpose) newErrors.purpose = "Purpose is required";

    // Validate items
    items.forEach((item, index) => {
      if (!item.itemName) newErrors[`item_${index}_name`] = "Item name required";
      if (!item.quantity || parseFloat(item.quantity) <= 0)
        newErrors[`item_${index}_qty`] = "Valid quantity required";
      if (!item.unit) newErrors[`item_${index}_unit`] = "Unit required";
      if (!item.estimatedUnitCost || parseFloat(item.estimatedUnitCost) <= 0)
        newErrors[`item_${index}_cost`] = "Valid cost required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // In a real app, this would save to the backend
    console.log("Purchase request submitted:", {
      ...formData,
      items,
      totalAmount: calculateTotal(),
    });

    // Redirect back to procurement
    router.push("/procurement");
  };

  const selectedEmployee = employees.find((e) => e.id === formData.requestedBy);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/procurement">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            New Purchase Request
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new purchase request for school supplies and equipment
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="requestedBy">
                    Requested By <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.requestedBy}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, requestedBy: value }));
                      const emp = employees.find((e) => e.id === value);
                      if (emp) {
                        setFormData((prev) => ({
                          ...prev,
                          department: emp.department,
                        }));
                      }
                    }}
                  >
                    <SelectTrigger
                      className={errors.requestedBy ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName} - {emp.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.requestedBy && (
                    <p className="text-xs text-red-500">{errors.requestedBy}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">
                    Purpose/Justification <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe the purpose and justification for this purchase..."
                    rows={3}
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, purpose: e.target.value }))
                    }
                    className={errors.purpose ? "border-red-500" : ""}
                  />
                  {errors.purpose && (
                    <p className="text-xs text-red-500">{errors.purpose}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Items to Purchase</CardTitle>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 space-y-3 relative"
                  >
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}

                    <h4 className="font-medium text-sm text-muted-foreground">
                      Item #{index + 1}
                    </h4>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Item Name *</Label>
                        <Input
                          value={item.itemName}
                          onChange={(e) =>
                            updateItem(item.id, "itemName", e.target.value)
                          }
                          className={
                            errors[`item_${index}_name`] ? "border-red-500" : ""
                          }
                        />
                        {errors[`item_${index}_name`] && (
                          <p className="text-xs text-red-500">
                            {errors[`item_${index}_name`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Quantity *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, "quantity", e.target.value)
                          }
                          className={
                            errors[`item_${index}_qty`] ? "border-red-500" : ""
                          }
                        />
                        {errors[`item_${index}_qty`] && (
                          <p className="text-xs text-red-500">
                            {errors[`item_${index}_qty`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Unit *</Label>
                        <Input
                          value={item.unit}
                          onChange={(e) =>
                            updateItem(item.id, "unit", e.target.value)
                          }
                          placeholder="pcs, box, ream"
                          className={
                            errors[`item_${index}_unit`] ? "border-red-500" : ""
                          }
                        />
                        {errors[`item_${index}_unit`] && (
                          <p className="text-xs text-red-500">
                            {errors[`item_${index}_unit`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Est. Unit Cost *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.estimatedUnitCost}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "estimatedUnitCost",
                              e.target.value
                            )
                          }
                          className={
                            errors[`item_${index}_cost`] ? "border-red-500" : ""
                          }
                        />
                        {errors[`item_${index}_cost`] && (
                          <p className="text-xs text-red-500">
                            {errors[`item_${index}_cost`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-sm text-muted-foreground">
                        Item Total:{" "}
                        <span className="font-medium text-foreground">
                          {formatCurrency(
                            (parseFloat(item.quantity) || 0) *
                              (parseFloat(item.estimatedUnitCost) || 0)
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedEmployee && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Requester Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{selectedEmployee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{selectedEmployee.department}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Request Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-lg font-bold">{items.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Total
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(calculateTotal())}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Submit Purchase Request
                </Button>
                <Link href="/procurement" className="block">
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

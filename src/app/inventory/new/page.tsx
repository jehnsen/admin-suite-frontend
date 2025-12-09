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
import { formatCurrency } from "@/lib/utils";

export default function NewInventoryItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    itemCode: "",
    name: "",
    category: "",
    unit: "",
    quantity: "",
    threshold: "",
    unitCost: "",
    location: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateTotalValue = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const cost = parseFloat(formData.unitCost) || 0;
    return qty * cost;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.itemCode) newErrors.itemCode = "Item code is required";
    if (!formData.name) newErrors.name = "Item name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.quantity || parseFloat(formData.quantity) < 0)
      newErrors.quantity = "Valid quantity is required";
    if (!formData.threshold || parseFloat(formData.threshold) < 0)
      newErrors.threshold = "Valid threshold is required";
    if (!formData.unitCost || parseFloat(formData.unitCost) <= 0)
      newErrors.unitCost = "Valid unit cost is required";
    if (!formData.location) newErrors.location = "Location is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // In a real app, this would save to the backend
    console.log("Inventory item created:", {
      ...formData,
      totalValue: calculateTotalValue(),
    });

    // Redirect back to inventory
    router.push("/inventory");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/inventory">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add Inventory Item
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Add a new item to the school inventory
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Basic Information */}
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="itemCode">
                      Item Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="itemCode"
                      placeholder="CONS-001 or EQUIP-001"
                      value={formData.itemCode}
                      onChange={(e) => handleChange("itemCode", e.target.value)}
                      className={`h-9 ${errors.itemCode ? "border-red-500" : ""}`}
                    />
                    {errors.itemCode && (
                      <p className="text-xs text-red-500">{errors.itemCode}</p>
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
                        className={`h-9 ${errors.category ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Consumable">Consumable</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-red-500">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Item Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Bond Paper (A4)"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`h-9 ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional details about the item..."
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quantity & Pricing */}
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quantity & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Initial Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={(e) => handleChange("quantity", e.target.value)}
                      className={`h-9 ${errors.quantity ? "border-red-500" : ""}`}
                    />
                    {errors.quantity && (
                      <p className="text-xs text-red-500">{errors.quantity}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">
                      Unit <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="unit"
                      placeholder="Ream, Box, Unit"
                      value={formData.unit}
                      onChange={(e) => handleChange("unit", e.target.value)}
                      className={`h-9 ${errors.unit ? "border-red-500" : ""}`}
                    />
                    {errors.unit && (
                      <p className="text-xs text-red-500">{errors.unit}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="threshold">
                      Min. Threshold <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="threshold"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="10"
                      value={formData.threshold}
                      onChange={(e) => handleChange("threshold", e.target.value)}
                      className={`h-9 ${errors.threshold ? "border-red-500" : ""}`}
                    />
                    {errors.threshold && (
                      <p className="text-xs text-red-500">{errors.threshold}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitCost">
                    Unit Cost <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="unitCost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.unitCost}
                    onChange={(e) => handleChange("unitCost", e.target.value)}
                    className={`h-9 ${errors.unitCost ? "border-red-500" : ""}`}
                  />
                  {errors.unitCost && (
                    <p className="text-xs text-red-500">{errors.unitCost}</p>
                  )}
                </div>

                {formData.quantity && formData.unitCost && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-sm text-blue-900">
                      <strong>Total Value:</strong>{" "}
                      {formatCurrency(calculateTotalValue())}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Storage Information */}
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Storage Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Storage Location <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleChange("location", value)}
                  >
                    <SelectTrigger
                      className={`h-9 ${errors.location ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Supply Room">Supply Room</SelectItem>
                      <SelectItem value="ICT Office">ICT Office</SelectItem>
                      <SelectItem value="AV Room">AV Room</SelectItem>
                      <SelectItem value="Principal's Office">
                        Principal's Office
                      </SelectItem>
                      <SelectItem value="Various Classrooms">
                        Various Classrooms
                      </SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.location && (
                    <p className="text-xs text-red-500">{errors.location}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Item Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">
                    {formData.category || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="text-base font-bold">
                    {formData.quantity || "0"} {formData.unit || "units"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Alert Threshold</p>
                  <p className="text-sm font-medium">
                    {formData.threshold || "0"} {formData.unit || "units"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(calculateTotalValue())}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-4 space-y-2">
                <Button type="submit" className="w-full h-9 text-sm">
                  <Save className="mr-2 h-4 w-4" />
                  Add to Inventory
                </Button>
                <Link href="/inventory" className="block">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-9 text-sm"
                  >
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

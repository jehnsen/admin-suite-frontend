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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { inventoryService } from "@/lib/api/services";

export default function NewInventoryItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    item_code: "",
    item_name: "",
    description: "",
    category: "",
    unit_of_measure: "",
    serial_number: "",
    property_number: "",
    model: "",
    brand: "",
    unit_cost: "",
    quantity: "",
    fund_source: "",
    supplier: "",
    date_acquired: "",
    po_number: "",
    invoice_number: "",
    condition: "Serviceable",
    status: "In Stock",
    location: "",
    estimated_useful_life: "",
    depreciation_rate: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const calculateTotalValue = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const cost = parseFloat(formData.unit_cost) || 0;
    return qty * cost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.item_code) newErrors.item_code = "Item code is required";
    if (!formData.item_name) newErrors.item_name = "Item name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.unit_of_measure) newErrors.unit_of_measure = "Unit is required";
    if (!formData.quantity || parseFloat(formData.quantity) < 0)
      newErrors.quantity = "Valid quantity is required";
    if (!formData.unit_cost || parseFloat(formData.unit_cost) <= 0)
      newErrors.unit_cost = "Valid unit cost is required";
    if (!formData.location) newErrors.location = "Location is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);

      const totalCost = calculateTotalValue();
      const depreciationRate = parseFloat(formData.depreciation_rate) || 0;
      const accumulatedDepreciation = 0; // Always 0 for new items
      const bookValue = totalCost - accumulatedDepreciation;

      // Prepare data for API matching the POST payload
      const inventoryData = {
        item_code: formData.item_code,
        item_name: formData.item_name,
        description: formData.description || undefined,
        category: formData.category,
        unit_of_measure: formData.unit_of_measure,
        serial_number: formData.serial_number || undefined,
        property_number: formData.property_number || undefined,
        model: formData.model || undefined,
        brand: formData.brand || undefined,
        unit_cost: parseFloat(formData.unit_cost),
        quantity: parseInt(formData.quantity),
        total_cost: totalCost,
        fund_source: formData.fund_source || undefined,
        supplier: formData.supplier || undefined,
        date_acquired: formData.date_acquired || undefined,
        po_number: formData.po_number || undefined,
        invoice_number: formData.invoice_number || undefined,
        condition: formData.condition,
        status: formData.status,
        location: formData.location || undefined,
        estimated_useful_life: formData.estimated_useful_life ? parseInt(formData.estimated_useful_life) : undefined,
        depreciation_rate: depreciationRate ? String(depreciationRate) : undefined,
        accumulated_depreciation: String(accumulatedDepreciation),
        book_value: String(bookValue),
        remarks: formData.remarks || undefined,
      };

      // Call API to create inventory item
      await inventoryService.createInventoryItem(inventoryData);

      // Success - redirect back to inventory list
      router.push("/inventory");
    } catch (err: any) {
      console.error("Failed to create inventory item:", err);
      setApiError(err.message || "Failed to create inventory item. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/inventory">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Add Inventory Item
          </h1>
          <p className="text-muted-foreground mt-1">
            Add a new item to the school inventory
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="item_code">
                      Item Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="item_code"
                      placeholder="ICT-2025-001"
                      value={formData.item_code}
                      onChange={(e) => handleChange("item_code", e.target.value)}
                      className={`h-9 ${errors.item_code ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.item_code && (
                      <p className="text-xs text-red-500">{errors.item_code}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        className={`h-9 ${errors.category ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ICT Equipment">ICT Equipment</SelectItem>
                        <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Laboratory Equipment">Laboratory Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-red-500">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item_name">
                    Item Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="item_name"
                    placeholder="e.g., Laptop Computer"
                    value={formData.item_name}
                    onChange={(e) => handleChange("item_name", e.target.value)}
                    className={`h-9 ${errors.item_name ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.item_name && (
                    <p className="text-xs text-red-500">{errors.item_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., Dell Latitude 5440, i7, 16GB RAM"
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="text-sm"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="e.g., Dell"
                      value={formData.brand}
                      onChange={(e) => handleChange("brand", e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="e.g., Latitude 5440"
                      value={formData.model}
                      onChange={(e) => handleChange("model", e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serial_number">Serial Number</Label>
                    <Input
                      id="serial_number"
                      placeholder="e.g., SN123456789"
                      value={formData.serial_number}
                      onChange={(e) => handleChange("serial_number", e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_number">Property Number</Label>
                  <Input
                    id="property_number"
                    placeholder="e.g., PROP-2025-0001"
                    value={formData.property_number}
                    onChange={(e) => handleChange("property_number", e.target.value)}
                    className="h-9"
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quantity & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Quantity & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="1"
                      value={formData.quantity}
                      onChange={(e) => handleChange("quantity", e.target.value)}
                      className={`h-9 ${errors.quantity ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.quantity && (
                      <p className="text-xs text-red-500">{errors.quantity}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit_of_measure">
                      Unit of Measure <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="unit_of_measure"
                      placeholder="e.g., unit, ream, box"
                      value={formData.unit_of_measure}
                      onChange={(e) => handleChange("unit_of_measure", e.target.value)}
                      className={`h-9 ${errors.unit_of_measure ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.unit_of_measure && (
                      <p className="text-xs text-red-500">{errors.unit_of_measure}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_cost">
                    Unit Cost <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="unit_cost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="55000.00"
                    value={formData.unit_cost}
                    onChange={(e) => handleChange("unit_cost", e.target.value)}
                    className={`h-9 ${errors.unit_cost ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.unit_cost && (
                    <p className="text-xs text-red-500">{errors.unit_cost}</p>
                  )}
                </div>

                {formData.quantity && formData.unit_cost && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-sm text-blue-900">
                      <strong>Total Cost:</strong>{" "}
                      {formatCurrency(calculateTotalValue())}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acquisition Details */}
            <Card>
              <CardHeader>
                <CardTitle>Acquisition Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      placeholder="e.g., TechMart Inc."
                      value={formData.supplier}
                      onChange={(e) => handleChange("supplier", e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_acquired">Date Acquired</Label>
                    <Input
                      id="date_acquired"
                      type="date"
                      value={formData.date_acquired}
                      onChange={(e) => handleChange("date_acquired", e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="po_number">PO Number</Label>
                    <Input
                      id="po_number"
                      placeholder="e.g., PO-2025-0321"
                      value={formData.po_number}
                      onChange={(e) => handleChange("po_number", e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoice_number">Invoice Number</Label>
                    <Input
                      id="invoice_number"
                      placeholder="e.g., INV-2025-0876"
                      value={formData.invoice_number}
                      onChange={(e) => handleChange("invoice_number", e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fund_source">Fund Source</Label>
                    <Input
                      id="fund_source"
                      placeholder="e.g., MOOE"
                      value={formData.fund_source}
                      onChange={(e) => handleChange("fund_source", e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Storage & Status */}
            <Card>
              <CardHeader>
                <CardTitle>Storage & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., ICT Office - Room 205"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className={`h-9 ${errors.location ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.location && (
                      <p className="text-xs text-red-500">{errors.location}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => handleChange("condition", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Serviceable">Serviceable</SelectItem>
                        <SelectItem value="Unserviceable">Unserviceable</SelectItem>
                        <SelectItem value="For Repair">For Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Stock">In Stock</SelectItem>
                        <SelectItem value="Issued">Issued</SelectItem>
                        <SelectItem value="For Disposal">For Disposal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimated_useful_life">Useful Life (Years)</Label>
                    <Input
                      id="estimated_useful_life"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={formData.estimated_useful_life}
                      onChange={(e) => handleChange("estimated_useful_life", e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="depreciation_rate">Depreciation Rate (%)</Label>
                    <Input
                      id="depreciation_rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="20.00"
                      value={formData.depreciation_rate}
                      onChange={(e) => handleChange("depreciation_rate", e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks</Label>
                    <Input
                      id="remarks"
                      placeholder="e.g., Issued to Mr. Juan Dela Cruz"
                      value={formData.remarks}
                      onChange={(e) => handleChange("remarks", e.target.value)}
                      className="h-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Item Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">
                    {formData.category || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="text-base font-bold">
                    {formData.quantity || "0"} {formData.unit_of_measure || "units"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Unit Cost</p>
                  <p className="text-sm font-medium">
                    {formatCurrency(parseFloat(formData.unit_cost) || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(calculateTotalValue())}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium">
                    {formData.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Condition</p>
                  <p className="text-sm font-medium">
                    {formData.condition}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                {apiError && (
                  <div className="p-3 mb-2 text-sm text-red-600 bg-red-50 rounded-md">
                    {apiError}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Add to Inventory
                    </>
                  )}
                </Button>
                <Link href="/inventory" className="block">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
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

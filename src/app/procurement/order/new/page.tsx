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
import { ArrowLeft, Save, CheckCircle } from "lucide-react";
import Link from "next/link";
import { purchaseRequests } from "@/lib/data/procurement";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [selectedPRId, setSelectedPRId] = useState("");
  const [formData, setFormData] = useState({
    supplier: "",
    supplierContact: "",
    deliveryDate: "",
    paymentTerms: "",
    deliveryAddress: "Sample Elementary School, Main Campus",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const approvedPRs = purchaseRequests.filter((pr) => pr.status === "Approved");
  const selectedPR = purchaseRequests.find((pr) => pr.id === selectedPRId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!selectedPRId) newErrors.pr = "Purchase Request is required";
    if (!formData.supplier) newErrors.supplier = "Supplier is required";
    if (!formData.supplierContact)
      newErrors.supplierContact = "Supplier contact is required";
    if (!formData.deliveryDate)
      newErrors.deliveryDate = "Delivery date is required";
    if (!formData.paymentTerms)
      newErrors.paymentTerms = "Payment terms are required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // In a real app, this would save to the backend
    console.log("Purchase order created:", {
      prId: selectedPRId,
      ...formData,
      items: selectedPR?.items,
      totalAmount: selectedPR?.totalAmount,
    });

    // Redirect back to procurement
    router.push("/procurement");
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
        <Link href="/procurement">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Purchase Order
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Generate a purchase order from an approved purchase request
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select Purchase Request */}
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Select Purchase Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="pr">
                    Approved Purchase Request{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedPRId}
                    onValueChange={(value) => {
                      setSelectedPRId(value);
                      if (errors.pr) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.pr;
                          return newErrors;
                        });
                      }
                    }}
                  >
                    <SelectTrigger className={errors.pr ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select purchase request" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvedPRs.length > 0 ? (
                        approvedPRs.map((pr) => (
                          <SelectItem key={pr.id} value={pr.id}>
                            {pr.prNumber} - {pr.purpose} (
                            {formatCurrency(pr.totalAmount)})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No approved PRs available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.pr && (
                    <p className="text-xs text-red-500">{errors.pr}</p>
                  )}
                </div>

                {selectedPR && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-900">
                        PR Selected
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-blue-700">Requested by:</span>{" "}
                        <span className="font-medium text-blue-900">
                          {selectedPR.requestedBy}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Department:</span>{" "}
                        <span className="font-medium text-blue-900">
                          {selectedPR.department}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Items:</span>{" "}
                        <span className="font-medium text-blue-900">
                          {selectedPR.items.length} items
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Total:</span>{" "}
                        <span className="font-medium text-blue-900">
                          {formatCurrency(selectedPR.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supplier Information */}
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Supplier Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="supplier">
                    Supplier Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="supplier"
                    placeholder="ABC Office Supplies"
                    value={formData.supplier}
                    onChange={(e) => handleChange("supplier", e.target.value)}
                    className={`h-9 ${errors.supplier ? "border-red-500" : ""}`}
                  />
                  {errors.supplier && (
                    <p className="text-xs text-red-500">{errors.supplier}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplierContact">
                    Supplier Contact <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="supplierContact"
                    placeholder="+63 912 345 6789"
                    value={formData.supplierContact}
                    onChange={(e) =>
                      handleChange("supplierContact", e.target.value)
                    }
                    className={`h-9 ${errors.supplierContact ? "border-red-500" : ""}`}
                  />
                  {errors.supplierContact && (
                    <p className="text-xs text-red-500">
                      {errors.supplierContact}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Details */}
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">
                      Expected Delivery Date{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) =>
                        handleChange("deliveryDate", e.target.value)
                      }
                      className={`h-9 ${errors.deliveryDate ? "border-red-500" : ""}`}
                    />
                    {errors.deliveryDate && (
                      <p className="text-xs text-red-500">
                        {errors.deliveryDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">
                      Payment Terms <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.paymentTerms}
                      onValueChange={(value) =>
                        handleChange("paymentTerms", value)
                      }
                    >
                      <SelectTrigger
                        className={`h-9 ${errors.paymentTerms ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash on Delivery">
                          Cash on Delivery
                        </SelectItem>
                        <SelectItem value="Net 30 days">Net 30 days</SelectItem>
                        <SelectItem value="Net 60 days">Net 60 days</SelectItem>
                        <SelectItem value="50% Down, 50% on Delivery">
                          50% Down, 50% on Delivery
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.paymentTerms && (
                      <p className="text-xs text-red-500">
                        {errors.paymentTerms}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Textarea
                    id="deliveryAddress"
                    rows={2}
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                      handleChange("deliveryAddress", e.target.value)
                    }
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Items Preview */}
            {selectedPR && (
              <Card className="transition-all duration-200 hover:shadow-md animate-in slide-in-from-bottom-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Items to Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedPR.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-2 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.itemName}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {item.quantity} {item.unit}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.estimatedTotalCost)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {selectedPR && (
              <Card className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">PR Number</p>
                    <p className="text-sm font-medium font-mono">
                      {selectedPR.prNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Items</p>
                    <p className="text-base font-bold">
                      {selectedPR.items.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(selectedPR.totalAmount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardContent className="pt-4 space-y-2">
                <Button type="submit" className="w-full h-9 text-sm" disabled={!selectedPRId}>
                  <Save className="mr-2 h-4 w-4" />
                  Create Purchase Order
                </Button>
                <Link href="/procurement" className="block">
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

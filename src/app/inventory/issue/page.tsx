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
import { inventoryItems } from "@/lib/data/inventory";
import { employees } from "@/lib/data/personnel";

export default function IssueItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    itemId: "",
    custodianId: "",
    quantity: "1",
    dateIssued: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.itemId) newErrors.itemId = "Item is required";
    if (!formData.custodianId) newErrors.custodianId = "Custodian is required";
    if (!formData.quantity || parseInt(formData.quantity) <= 0)
      newErrors.quantity = "Valid quantity is required";
    if (!formData.dateIssued) newErrors.dateIssued = "Date issued is required";

    // Check if quantity available
    const item = inventoryItems.find((i) => i.id === formData.itemId);
    if (item && parseInt(formData.quantity) > item.quantity) {
      newErrors.quantity = `Only ${item.quantity} ${item.unit} available`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // In a real app, this would save to the backend
    console.log("Item issued:", formData);

    // Redirect back to inventory
    router.push("/inventory");
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

  const selectedItem = inventoryItems.find((i) => i.id === formData.itemId);
  const selectedCustodian = employees.find((e) => e.id === formData.custodianId);

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
          <h1 className="text-3xl font-bold text-gray-900">Issue Item</h1>
          <p className="text-muted-foreground mt-1">
            Issue inventory item to a custodian
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Issuance Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemId">
                    Item <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.itemId}
                    onValueChange={(value) => handleChange("itemId", value)}
                  >
                    <SelectTrigger
                      className={errors.itemId ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} ({item.quantity} {item.unit} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.itemId && (
                    <p className="text-xs text-red-500">{errors.itemId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custodianId">
                    Custodian/Recipient <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.custodianId}
                    onValueChange={(value) =>
                      handleChange("custodianId", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.custodianId ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select custodian" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName} - {emp.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.custodianId && (
                    <p className="text-xs text-red-500">{errors.custodianId}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => handleChange("quantity", e.target.value)}
                      className={errors.quantity ? "border-red-500" : ""}
                    />
                    {errors.quantity && (
                      <p className="text-xs text-red-500">{errors.quantity}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateIssued">
                      Date Issued <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateIssued"
                      type="date"
                      value={formData.dateIssued}
                      onChange={(e) =>
                        handleChange("dateIssued", e.target.value)
                      }
                      className={errors.dateIssued ? "border-red-500" : ""}
                    />
                    {errors.dateIssued && (
                      <p className="text-xs text-red-500">{errors.dateIssued}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks/Notes</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Add any remarks or notes..."
                    rows={3}
                    value={formData.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedItem && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Item Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Item Code</p>
                    <p className="font-mono font-medium">
                      {selectedItem.itemCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedItem.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Available Stock
                    </p>
                    <p className="font-medium">
                      {selectedItem.quantity} {selectedItem.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedItem.location}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedCustodian && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Custodian Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{selectedCustodian.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{selectedCustodian.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm">{selectedCustodian.email}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Issue Item
                </Button>
                <Link href="/inventory" className="block">
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

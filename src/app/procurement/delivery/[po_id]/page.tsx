"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Package, Save } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { procurementService, PurchaseOrder, Delivery, DeliveryItem } from "@/lib/api/services/procurement.service";

interface DeliveryItemForm extends DeliveryItem {
  tempId: string;
}

export default function DeliveryReceivingPage() {
  const params = useParams();
  const router = useRouter();
  const poId = Number(params.po_id);

  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state for new delivery
  const [deliveryForm, setDeliveryForm] = useState({
    delivery_receipt_number: "",
    notes: "",
  });
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItemForm[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [po, dels] = await Promise.all([
          procurementService.getPurchaseOrder(poId),
          procurementService.getDeliveriesForPO(poId),
        ]);
        setPurchaseOrder(po);
        setDeliveries(dels);

        // Initialize delivery items from PO
        if (po.items) {
          const initItems: DeliveryItemForm[] = po.items.map((item, idx) => ({
            tempId: `item-${idx}`,
            po_item_id: idx + 1,
            item_description: item.itemName,
            quantity_ordered: item.quantity,
            quantity_delivered: item.quantity,
            quantity_accepted: item.quantity,
            unit_of_measure: item.unit,
            condition: 'Good' as const,
            remarks: "",
          }));
          setDeliveryItems(initItems);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load purchase order");
      } finally {
        setLoading(false);
      }
    };

    if (poId) {
      fetchData();
    }
  }, [poId]);

  const updateDeliveryItem = (tempId: string, field: keyof DeliveryItemForm, value: any) => {
    setDeliveryItems((items) =>
      items.map((item) => (item.tempId === tempId ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmitDelivery = async () => {
    if (!deliveryForm.delivery_receipt_number.trim()) {
      alert("Delivery receipt number is required");
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        purchase_order_id: poId,
        delivery_date: new Date().toISOString().split('T')[0],
        delivery_receipt_number: deliveryForm.delivery_receipt_number,
        notes: deliveryForm.notes,
        status: 'Completed' as const,
        items: deliveryItems.map(({ tempId, ...item }) => item),
      };

      await procurementService.createDelivery(payload);
      alert("Delivery recorded successfully!");
      router.push(`/procurement/order/${poId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to record delivery");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !purchaseOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 border border-red-200 rounded-lg p-8">
        <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
        <p className="text-red-900 font-semibold">{error || "Purchase Order not found"}</p>
        <Link href="/procurement">
          <Button className="mt-4" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Procurement
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/procurement/order/${poId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Receive Delivery
            </h1>
            <p className="text-muted-foreground mt-1">
              PO #{purchaseOrder.po_number} • {purchaseOrder.supplier?.business_name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Delivery Receipt Number *</Label>
                  <Input
                    value={deliveryForm.delivery_receipt_number}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, delivery_receipt_number: e.target.value })
                    }
                    placeholder="DR-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Date</Label>
                  <Input
                    type="date"
                    value={new Date().toISOString().split('T')[0]}
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  rows={3}
                  value={deliveryForm.notes}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, notes: e.target.value })}
                  placeholder="Additional notes about the delivery..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Items to Receive */}
          <Card>
            <CardHeader>
              <CardTitle>Items to Receive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryItems.map((item) => (
                  <div key={item.tempId} className="border rounded-lg p-4 space-y-4">
                    <div>
                      <p className="font-semibold">{item.item_description}</p>
                      <p className="text-sm text-muted-foreground">
                        Ordered: {item.quantity_ordered} {item.unit_of_measure}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Qty Delivered</Label>
                        <Input
                          type="number"
                          value={item.quantity_delivered}
                          onChange={(e) =>
                            updateDeliveryItem(item.tempId, "quantity_delivered", Number(e.target.value))
                          }
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Qty Accepted</Label>
                        <Input
                          type="number"
                          value={item.quantity_accepted}
                          onChange={(e) =>
                            updateDeliveryItem(item.tempId, "quantity_accepted", Number(e.target.value))
                          }
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Condition</Label>
                        <Select
                          value={item.condition}
                          onValueChange={(val) => updateDeliveryItem(item.tempId, "condition", val)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Damaged">Damaged</SelectItem>
                            <SelectItem value="Incomplete">Incomplete</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Remarks</Label>
                      <Textarea
                        rows={2}
                        value={item.remarks || ""}
                        onChange={(e) => updateDeliveryItem(item.tempId, "remarks", e.target.value)}
                        placeholder="Any issues or notes..."
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* PO Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Purchase Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">PO Number</p>
                <p className="font-mono font-medium">{purchaseOrder.po_number}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Supplier</p>
                <p className="font-medium">{purchaseOrder.supplier?.business_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Items</p>
                <p className="text-lg font-bold">{deliveryItems.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(purchaseOrder.totalAmount)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Previous Deliveries */}
          {deliveries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Previous Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {deliveries.map((del) => (
                    <div key={del.id} className="text-sm border-b pb-2 last:border-0">
                      <div className="flex justify-between">
                        <span className="font-medium">{del.delivery_receipt_number}</span>
                        <Badge variant={del.status === 'Completed' ? 'success' : 'secondary'}>
                          {del.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(del.delivery_date)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmitDelivery}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Delivery
                  </>
                )}
              </Button>
              <Link href={`/procurement/order/${poId}`} className="block">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

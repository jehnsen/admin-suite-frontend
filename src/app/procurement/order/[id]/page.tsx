"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { procurementService, PurchaseOrder, Supplier } from "@/lib/api/services/procurement.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Loader2, AlertTriangle, User, Calendar, Tag, FileText, DollarSign, List, CheckCircle, XCircle, Truck, Building } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function ViewPurchaseOrderPage() {
  const params = useParams();
  const id = Number(params.id);

  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPurchaseOrder = async () => {
        try {
          setLoading(true);
          const data = await procurementService.getPurchaseOrder(id);
          setPurchaseOrder(data);
        } catch (err) {
          setError("Failed to fetch purchase order. It may not exist.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPurchaseOrder();
    }
  }, [id]);
  
  const DetailItem = ({ icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="bg-gray-100 rounded-md p-2 flex items-center justify-center">
           {React.createElement(icon, { className: "h-5 w-5 text-gray-600" })}
        </div>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-md font-semibold text-gray-900">{value || "N/A"}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-red-700">An Error Occurred</p>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/procurement">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Procurement
          </Button>
        </Link>
      </div>
    );
  }

  if (!purchaseOrder) {
    return null;
  }

  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered') return 'success';
    if (s === 'sent') return 'outline';
    if (s === 'approved') return 'default';
    if (s === 'cancelled') return 'destructive';
    return 'secondary';
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/procurement">
            <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            </Link>
            <div>
            <h1 className="text-3xl font-bold text-gray-900">
                Purchase Order
            </h1>
            <p className="text-muted-foreground mt-1">
                Viewing details for PO #{purchaseOrder.po_number}
            </p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Print</Button>
            <Button>Mark as Delivered</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ordered Items</CardTitle>
                    <CardDescription>A total of {purchaseOrder.items?.length || 0} items.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead className="text-right">Unit Cost</TableHead>
                            <TableHead className="text-right">Total Cost</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {purchaseOrder.items?.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.description}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell className="text-right">{formatCurrency(Number(item.unitCost))}</TableCell>
                                <TableCell className="text-right">{formatCurrency(Number(item.totalCost))}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <DetailItem icon={Tag} label="PO Number" value={purchaseOrder.po_number} />
                    <DetailItem icon={FileText} label="Related PR" value={ <Link href={`/procurement/request/${purchaseOrder.pr_id}`} className="text-blue-600 hover:underline">{`PR-${purchaseOrder.pr_id}`}</Link>} />
                    <DetailItem icon={Calendar} label="Date Issued" value={formatDate(purchaseOrder.createdDate)} />
                    <DetailItem icon={Truck} label="Expected Delivery" value={formatDate(purchaseOrder.deliveryDate)} />
                    <DetailItem icon={List} label="Status" value={<Badge variant={getStatusVariant(purchaseOrder.status)}>{purchaseOrder.status}</Badge>} />
                    <DetailItem icon={DollarSign} label="Total Amount" value={<span className="font-bold text-lg text-primary">{formatCurrency(Number(purchaseOrder.totalAmount))}</span>} />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Supplier Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <DetailItem icon={Building} label="Supplier Name" value={purchaseOrder.supplier?.business_name} />
                   <DetailItem icon={User} label="Contact Person" value={purchaseOrder.supplier?.contactPerson} />
                   <DetailItem icon={FileText} label="Address" value={purchaseOrder.supplier?.address} />
                   <DetailItem icon={FileText} label="Email" value={purchaseOrder.supplier?.email} />
                   <DetailItem icon={FileText} label="Phone" value={purchaseOrder.supplier?.phone} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

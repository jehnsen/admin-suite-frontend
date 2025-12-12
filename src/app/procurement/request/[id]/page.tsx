"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { procurementService, PurchaseRequest, PRItem } from "@/lib/api/services/procurement.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Loader2, AlertTriangle, User, Calendar, Tag, FileText, DollarSign, List, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function ViewPurchaseRequestPage() {
  const params = useParams();
  const id = Number(params.id);

  const [purchaseRequest, setPurchaseRequest] = useState<PurchaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPurchaseRequest = async () => {
        try {
          setLoading(true);
          const data = await procurementService.getPurchaseRequest(id);
          setPurchaseRequest(data);
        } catch (err) {
          setError("Failed to fetch purchase request. It may not exist.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPurchaseRequest();
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
        <Link href="/procurement/request">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Purchase Requests
          </Button>
        </Link>
      </div>
    );
  }

  if (!purchaseRequest) {
    return null;
  }

  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'approved') return 'success';
    if (s === 'pending') return 'warning';
    if (s === 'for quotation') return 'secondary';
    if (s === 'rejected' || s === 'disapproved') return 'destructive';
    return 'default';
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
                Purchase Request
            </h1>
            <p className="text-muted-foreground mt-1">
                Viewing details for PR #{purchaseRequest.pr_number}
            </p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Print</Button>
            <Button>Create Purchase Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {/* Items Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Requested Items</CardTitle>
                    <CardDescription>A total of {purchaseRequest.items?.length || 0} items.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead className="text-right">Unit Cost</TableHead>
                            <TableHead className="text-right">Total Cost</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {purchaseRequest.items?.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.item_description}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell>{item.unit_of_measure}</TableCell>
                                <TableCell className="text-right">{formatCurrency(Number(item.unit_cost))}</TableCell>
                                <TableCell className="text-right">{formatCurrency(Number(item.total_cost))}</TableCell>
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
                    <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <DetailItem icon={Tag} label="PR Number" value={purchaseRequest.pr_number} />
                    <DetailItem icon={Calendar} label="Date Requested" value={formatDate(purchaseRequest.pr_date)} />
                    <DetailItem icon={User} label="Requested By" value={purchaseRequest.requested_by.name} />
                    <DetailItem icon={FileText} label="Department" value={purchaseRequest.department} />
                    <DetailItem icon={FileText} label="Purpose" value={purchaseRequest.purpose}/>
                    <DetailItem icon={DollarSign} label="Fund Source" value={<Badge variant="outline">{purchaseRequest.fund_source}</Badge>} />
                     <DetailItem icon={List} label="Status" value={<Badge variant={getStatusVariant(purchaseRequest.status)}>{purchaseRequest.status}</Badge>} />
                    <DetailItem icon={DollarSign} label="Total Amount" value={<span className="font-bold text-lg text-primary">{formatCurrency(Number(purchaseRequest.total_amount))}</span>} />
                </CardContent>
            </Card>

            {purchaseRequest.approved_by && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-2" /> Approved
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <DetailItem icon={User} label="Approved By" value={"Approver Name"} />
                       <DetailItem icon={Calendar} label="Date Approved" value={formatDate(purchaseRequest.approved_at!)} />
                       <DetailItem icon={FileText} label="Remarks" value={purchaseRequest.approval_remarks} />
                    </CardContent>
                </Card>
            )}

             {purchaseRequest.disapproved_by && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-red-600">
                            <XCircle className="h-5 w-5 mr-2" /> Disapproved
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <DetailItem icon={User} label="Disapproved By" value={"Disapprover Name"} />
                       <DetailItem icon={Calendar} label="Date Disapproved" value={formatDate(purchaseRequest.disapproved_at!)} />
                       <DetailItem icon={FileText} label="Reason" value={purchaseRequest.disapproval_reason} />
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Plus, Trophy } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { procurementService, PurchaseRequest, Quotation } from "@/lib/api/services/procurement.service";
import { cn } from "@/lib/utils";

export default function QuotationComparisonPage() {
  const params = useParams();
  const router = useRouter();
  const prId = Number(params.pr_id);

  const [purchaseRequest, setPurchaseRequest] = useState<PurchaseRequest | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pr, quotes] = await Promise.all([
          procurementService.getPurchaseRequest(prId),
          procurementService.getQuotationsForPR(prId),
        ]);
        setPurchaseRequest(pr);
        setQuotations(quotes);
      } catch (err) {
        console.error(err);
        setError("Failed to load quotations");
      } finally {
        setLoading(false);
      }
    };

    if (prId) {
      fetchData();
    }
  }, [prId]);

  const handleSelectWinner = async (quotationId: number) => {
    if (!confirm("Are you sure you want to select this as the winning quotation?")) {
      return;
    }

    try {
      setActionLoading(true);
      await procurementService.selectWinningQuotation(quotationId);
      const updatedQuotes = await procurementService.getQuotationsForPR(prId);
      setQuotations(updatedQuotes);
      alert("Winning quotation selected successfully! You can now create a Purchase Order.");
    } catch (err) {
      console.error(err);
      alert("Failed to select winning quotation");
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

  if (error || !purchaseRequest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 border border-red-200 rounded-lg p-8">
        <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
        <p className="text-red-900 font-semibold">{error || "Purchase Request not found"}</p>
        <Link href="/procurement">
          <Button className="mt-4" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Procurement
          </Button>
        </Link>
      </div>
    );
  }

  const winningQuote = quotations.find((q) => q.is_winning_quote);
  const lowestQuote = quotations.length > 0
    ? quotations.reduce((min, q) => (q.total_amount < min.total_amount ? q : min))
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/procurement/request/${prId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quotation Comparison
            </h1>
            <p className="text-muted-foreground mt-1">
              PR #{purchaseRequest.pr_number} - {purchaseRequest.purpose}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/procurement/quotation/new?pr_id=${prId}`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Quotation
            </Button>
          </Link>
          {winningQuote && (
            <Link href={`/procurement/order/new?pr_id=${prId}`}>
              <Button variant="default">
                Create Purchase Order
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lowest Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {lowestQuote ? formatCurrency(lowestQuote.total_amount) : "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">PR Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(purchaseRequest.estimated_budget)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Winner Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {winningQuote ? (
                <Badge variant="success" className="text-lg">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-lg">Pending</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotations List */}
      {quotations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-muted-foreground mb-2">
              No Quotations Yet
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Add quotations from suppliers to compare prices
            </p>
            <Link href={`/procurement/quotation/new?pr_id=${prId}`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Quotation
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quotations.map((quote) => (
            <Card
              key={quote.id}
              className={cn(
                "transition-all duration-200",
                quote.is_winning_quote && "border-2 border-green-500 shadow-md",
                quote.id === lowestQuote?.id && !quote.is_winning_quote && "border-blue-300"
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {quote.is_winning_quote && (
                      <Trophy className="h-6 w-6 text-yellow-500" />
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        {quote.supplier?.business_name || "Supplier"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Quotation #{quote.quotation_number} • {formatDate(quote.quotation_date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(quote.total_amount)}
                    </div>
                    {quote.id === lowestQuote?.id && !quote.is_winning_quote && (
                      <Badge variant="default" className="mt-1">Lowest</Badge>
                    )}
                    {quote.is_winning_quote && (
                      <Badge variant="success" className="mt-1">
                        <Trophy className="mr-1 h-3 w-3" />
                        Winner
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Quote Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{quote.supplier?.contactPerson || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{quote.supplier?.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Terms</p>
                      <p className="font-medium">{quote.payment_terms || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Delivery Terms</p>
                      <p className="font-medium">{quote.delivery_terms || "N/A"}</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  {quote.items && quote.items.length > 0 && (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quote.items.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{item.item_description}</p>
                                  {item.brand_model && (
                                    <p className="text-xs text-muted-foreground">{item.brand_model}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell>{item.unit_of_measure}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.unit_price)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(item.total_price)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Actions */}
                  {!winningQuote && (
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleSelectWinner(quote.id)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trophy className="mr-2 h-4 w-4" />
                        )}
                        Select as Winner
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

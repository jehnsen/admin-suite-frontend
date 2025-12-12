"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { inventoryService, StockCard } from "@/lib/api/services/inventory.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, AlertTriangle, Package, Calendar, Hash, User, FileText, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function ViewIssuanceRecordPage() {
  const params = useParams();
  const id = Number(params.id);

  const [stockCard, setStockCard] = useState<StockCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchIssuanceRecord = async () => {
        try {
          setLoading(true);
          const data = await inventoryService.getStockCard(id);
          if (data.transaction_type !== 'Stock Out') {
            setError("This record is not a stock issuance.");
          } else {
            setStockCard(data);
          }
        } catch (err) {
          setError("Failed to fetch issuance record. It may not exist.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchIssuanceRecord();
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-red-700">An Error Occurred</p>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/inventory/issue">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Issuance List
          </Button>
        </Link>
      </div>
    );
  }

  if (!stockCard) {
    return null; // Should be handled by error state
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory/issue">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Issuance Record Details
          </h1>
          <p className="text-muted-foreground mt-1">
            Viewing details for stock issuance record #{stockCard.id}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>{stockCard.item_name}</span>
                <Badge variant="secondary" className="text-sm">
                  {stockCard.transaction_type}
                </Badge>
            </CardTitle>
            <CardDescription>
                Transaction recorded on {formatDate(stockCard.transaction_date, true)}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DetailItem icon={Package} label="Item Name" value={stockCard.item_name} />
                <DetailItem icon={Hash} label="Quantity Issued" value={`${stockCard.quantity_out} units`} />
                <DetailItem icon={Calendar} label="Transaction Date" value={formatDate(stockCard.transaction_date, true)} />
                
                <DetailItem icon={User} label="Issued To / Recipient" value={stockCard.remarks} />
                <DetailItem icon={FileText} label="Reference Document" value={stockCard.reference_number} />
                <DetailItem icon={ShoppingCart} label="Related PO Number" value={"PO-12345"} />
                
                <div className="lg:col-span-3">
                    <DetailItem icon={FileText} label="Purpose / Remarks" value={stockCard.remarks} />
                </div>
            </div>

            <div className="border-t mt-8 pt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <DetailItem icon={Hash} label="Unit Cost" value={formatCurrency(stockCard.unit_cost)} />
                <DetailItem icon={Hash} label="Total Value Issued" value={formatCurrency(stockCard.total_value)} />
                <DetailItem icon={Hash} label="Stock Balance After" value={`${stockCard.balance} units`} />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}


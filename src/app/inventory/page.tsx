"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inventoryService, InventoryItem, StockCard } from "@/lib/api/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Package, AlertTriangle, FileText, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<"items" | "stock">("items");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stockCards, setStockCards] = useState<StockCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "items") {
      loadInventoryItems();
    } else {
      loadStockCards();
    }
  }, [activeTab]);

  const loadInventoryItems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await inventoryService.getInventoryItems({
        per_page: 100,
      });

      // Ensure response.data exists and is an array
      const itemData = Array.isArray(response.data) ? response.data : [];
      setItems(itemData);
    } catch (err: any) {
      console.error("Failed to load inventory items:", err);
      setError(err.message || "Failed to load inventory items");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStockCards = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await inventoryService.getStockCards({
        per_page: 100,
      });

      // Ensure response.data exists and is an array
      const stockData = Array.isArray(response.data) ? response.data : [];
      setStockCards(stockData);
    } catch (err: any) {
      console.error("Failed to load stock cards:", err);
      setError(err.message || "Failed to load stock cards");
    } finally {
      setIsLoading(false);
    }
  };

  const itemColumns: Column<InventoryItem>[] = [
    {
      header: "Item Code",
      accessor: "item_code",
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Item Name",
      accessor: "item_name",
      cell: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.category}</p>
        </div>
      ),
    },
    {
      header: "Quantity",
      accessor: "quantity",
      cell: (value, row) => (
        <div>
          <p className="font-medium">
            {row.quantity} {row.unit}
          </p>
          {row.quantity < 10 && (
            <div className="flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3 text-red-600" />
              <span className="text-xs text-red-600">Low stock</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Book Value",
      accessor: "book_value",
      cell: (value) => <span className="text-sm font-medium">{formatCurrency(parseFloat(value) || 0)}</span>,
    },
    {
      header: "Location",
      accessor: "location",
      cell: (value) => <span className="text-sm">{value || "—"}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const variant =
          value === "Low Stock" ? "destructive" :
          value === "Out of Stock" ? "destructive" : "default";
        return (
          <Badge variant={variant as any}>
            {value}
          </Badge>
        );
      },
    },
    {
      header: "Last Updated",
      accessor: "updated_at",
      cell: (value) => value ? <span className="text-sm">{formatDate(value)}</span> : "—",
    },
  ];

  const stockColumns: Column<StockCard>[] = [
    {
      header: "Transaction Date",
      accessor: "transaction_date",
      cell: (value) => (
        <span className="text-sm">{formatDate(value)}</span>
      ),
    },
    {
      header: "Item Name",
      accessor: "item_name",
    },
    {
      header: "Type",
      accessor: "transaction_type",
      cell: (value) => {
        const variant =
          value === "Stock In" ? "success" :
          value === "Stock Out" ? "destructive" : "default";
        return <Badge variant={variant as any}>{value}</Badge>;
      },
    },
    {
      header: "Reference",
      accessor: "reference_number",
      cell: (value) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      header: "Quantity In",
      accessor: "quantity_in",
      cell: (value) => value > 0 ? (
        <span className="text-green-600 font-medium">+{value}</span>
      ) : "—",
    },
    {
      header: "Quantity Out",
      accessor: "quantity_out",
      cell: (value) => value > 0 ? (
        <span className="text-red-600 font-medium">-{value}</span>
      ) : "—",
    },
    {
      header: "Balance",
      accessor: "balance",
      cell: (value) => (
        <span className="font-medium">{value}</span>
      ),
    },
    {
      header: "Remarks",
      accessor: "remarks",
      cell: (value) => (
        <span className="text-sm text-muted-foreground">
          {value || "—"}
        </span>
      ),
    },
  ];

  const stats = {
    totalItems: items.length,
    // If InventoryItem does not have a threshold property, set a default threshold value (e.g., 10)
    lowStock: items.filter((item) => item.quantity < 10).length,
     totalValue: items.reduce((sum, item) => sum + ((parseFloat(item.book_value) || 0) * (item.quantity || 0)), 0),
    // totalValue: items.reduce((sum, item) => sum + item.totalValue, 0),
    equipment: items.filter((item) => item.category === "Equipment").length,
    consumables: items.filter((item) => item.category === "Consumable").length,
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            Loading {activeTab === "items" ? "inventory items" : "stock cards"}...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-8 w-8 text-destructive flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Failed to Load Data</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={() => activeTab === "items" ? loadInventoryItems() : loadStockCards()} className="mt-4">
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Property & Inventory
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage school property, equipment, and supplies
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/inventory/issue">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Stock Transaction
            </Button>
          </Link>
          <Link href="/inventory/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.lowStock}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.equipment}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consumables}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("items")}
            className={cn(
              "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "items"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Package className="h-4 w-4" />
            Inventory Items
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={cn(
              "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "stock"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            Stock Cards
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "items" && (
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={items}
              columns={itemColumns}
              searchPlaceholder="Search by item name, code, location..."
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "stock" && (
        <Card>
          <CardHeader>
            <CardTitle>Stock Cards (Transaction Ledger)</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={stockCards}
              columns={stockColumns}
              searchPlaceholder="Search by item name, reference number..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

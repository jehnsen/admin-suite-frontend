"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  inventoryItems,
  InventoryItem,
  issuanceRecords,
} from "@/lib/data/inventory";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Package, AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<"items" | "issuance">("items");

  const itemColumns: Column<InventoryItem>[] = [
    {
      header: "Item Code",
      accessor: "itemCode",
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Item Name",
      accessor: "name",
      cell: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.category}</p>
        </div>
      ),
    },
    {
      header: "Quantity",
      accessor: (row) => row,
      cell: (_, row) => (
        <div>
          <p className="font-medium">
            {row.quantity} {row.unit}
          </p>
          {row.quantity < row.threshold && (
            <div className="flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3 text-red-600" />
              <span className="text-xs text-red-600">Below threshold</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Unit Cost",
      accessor: "unitCost",
      cell: (value) => <span className="text-sm">{formatCurrency(value)}</span>,
    },
    {
      header: "Total Value",
      accessor: "totalValue",
      cell: (value) => (
        <span className="text-sm font-medium">{formatCurrency(value)}</span>
      ),
    },
    {
      header: "Location",
      accessor: "location",
    },
    {
      header: "Status",
      accessor: (row) => row,
      cell: (_, row) => {
        const isLow = row.quantity < row.threshold;
        return (
          <Badge variant={isLow ? "destructive" : "success"}>
            {isLow ? "Low Stock" : "In Stock"}
          </Badge>
        );
      },
    },
    {
      header: "Last Updated",
      accessor: "lastUpdated",
      cell: (value) => <span className="text-sm">{formatDate(value)}</span>,
    },
  ];

  const issuanceColumns: Column<typeof issuanceRecords[0]>[] = [
    {
      header: "Issuance ID",
      accessor: "id",
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Item Name",
      accessor: "itemName",
    },
    {
      header: "Custodian",
      accessor: "custodian",
      cell: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.department}</p>
        </div>
      ),
    },
    {
      header: "Quantity",
      accessor: "quantityIssued",
    },
    {
      header: "Date Issued",
      accessor: "dateIssued",
      cell: (value) => <span className="text-sm">{formatDate(value)}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const variant =
          value === "Working"
            ? "success"
            : value === "Defective"
              ? "destructive"
              : "default";
        return <Badge variant={variant as any}>{value}</Badge>;
      },
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
    totalItems: inventoryItems.length,
    lowStock: inventoryItems.filter((item) => item.quantity < item.threshold)
      .length,
    totalValue: inventoryItems.reduce((sum, item) => sum + item.totalValue, 0),
    equipment: inventoryItems.filter((item) => item.category === "Equipment")
      .length,
    consumables: inventoryItems.filter(
      (item) => item.category === "Consumable"
    ).length,
  };

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
              Issue Item
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
            onClick={() => setActiveTab("issuance")}
            className={cn(
              "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "issuance"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            Issuance Log
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
              data={inventoryItems}
              columns={itemColumns}
              searchPlaceholder="Search by item name, code, location..."
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "issuance" && (
        <Card>
          <CardHeader>
            <CardTitle>Issuance Log</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={issuanceRecords}
              columns={issuanceColumns}
              searchPlaceholder="Search by custodian, item name..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

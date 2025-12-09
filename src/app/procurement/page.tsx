"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  purchaseRequests,
  purchaseOrders,
  PurchaseRequest,
  PurchaseOrder,
} from "@/lib/data/procurement";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, FileText, ShoppingCart, PackageCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProcurementPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "orders">("requests");

  const prColumns: Column<PurchaseRequest>[] = [
    {
      header: "PR Number",
      accessor: "prNumber",
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Requested By",
      accessor: "requestedBy",
      cell: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.department}</p>
        </div>
      ),
    },
    {
      header: "Purpose",
      accessor: "purpose",
      cell: (value) => (
        <p className="text-sm max-w-xs truncate" title={value}>
          {value}
        </p>
      ),
    },
    {
      header: "Items",
      accessor: (row) => row.items.length,
      cell: (value) => <span className="text-sm">{value} items</span>,
    },
    {
      header: "Total Amount",
      accessor: "totalAmount",
      cell: (value) => (
        <span className="text-sm font-medium">{formatCurrency(value)}</span>
      ),
    },
    {
      header: "Date Requested",
      accessor: "dateRequested",
      cell: (value) => <span className="text-sm">{formatDate(value)}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const variant =
          value === "Approved"
            ? "success"
            : value === "Pending"
              ? "warning"
              : value === "Rejected"
                ? "destructive"
                : "default";
        return <Badge variant={variant as any}>{value}</Badge>;
      },
    },
    {
      header: "Actions",
      accessor: (row) => row,
      cell: (_, row) => (
        <Link href={`/procurement/request/${row.id}`}>
          <Button size="sm" variant="outline">
            View
          </Button>
        </Link>
      ),
    },
  ];

  const poColumns: Column<PurchaseOrder>[] = [
    {
      header: "PO Number",
      accessor: "poNumber",
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Supplier",
      accessor: "supplier",
      cell: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.supplierContact}</p>
        </div>
      ),
    },
    {
      header: "Items",
      accessor: (row) => row.items.length,
      cell: (value) => <span className="text-sm">{value} items</span>,
    },
    {
      header: "Total Amount",
      accessor: "totalAmount",
      cell: (value) => (
        <span className="text-sm font-medium">{formatCurrency(value)}</span>
      ),
    },
    {
      header: "Date Issued",
      accessor: "dateIssued",
      cell: (value) => <span className="text-sm">{formatDate(value)}</span>,
    },
    {
      header: "Delivery Date",
      accessor: "deliveryDate",
      cell: (value) => <span className="text-sm">{formatDate(value)}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const variant =
          value === "Delivered"
            ? "success"
            : value === "Confirmed"
              ? "default"
              : value === "Pending"
                ? "warning"
                : value === "Cancelled"
                  ? "destructive"
                  : "secondary";
        return <Badge variant={variant as any}>{value}</Badge>;
      },
    },
    {
      header: "Actions",
      accessor: (row) => row,
      cell: (_, row) => (
        <Link href={`/procurement/order/${row.id}`}>
          <Button size="sm" variant="outline">
            View
          </Button>
        </Link>
      ),
    },
  ];

  const stats = {
    totalPRs: purchaseRequests.length,
    pendingPRs: purchaseRequests.filter((pr) => pr.status === "Pending").length,
    approvedPRs: purchaseRequests.filter((pr) => pr.status === "Approved")
      .length,
    totalPOs: purchaseOrders.length,
    pendingPOs: purchaseOrders.filter((po) => po.status === "Pending").length,
    totalProcurement: purchaseRequests.reduce(
      (sum, pr) => sum + pr.totalAmount,
      0
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Procurement Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage purchase requests and purchase orders
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/procurement/order/new">
            <Button variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Create PO
            </Button>
          </Link>
          <Link href="/procurement/request/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Purchase Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPRs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending PRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingPRs}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved PRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approvedPRs}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total POs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPOs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending POs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingPOs}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatCurrency(stats.totalProcurement)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "requests"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            Purchase Requests
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={cn(
              "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "orders"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <PackageCheck className="h-4 w-4" />
            Purchase Orders
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "requests" && (
        <Card>
          <CardHeader>
            <CardTitle>Purchase Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={purchaseRequests}
              columns={prColumns}
              searchPlaceholder="Search by PR number, requester, purpose..."
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "orders" && (
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={purchaseOrders}
              columns={poColumns}
              searchPlaceholder="Search by PO number, supplier..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

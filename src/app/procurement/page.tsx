"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  procurementService,
  PurchaseRequest,
  PurchaseOrder,
} from "@/lib/api/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, FileText, ShoppingCart, PackageCheck, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProcurementPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "orders">("requests");
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prRes, poRes, prStatsRes, poStatsRes] = await Promise.all([
          procurementService.getPurchaseRequests({ per_page: 25 }),
          procurementService.getPurchaseOrders({ per_page: 25 }),
          procurementService.getPurchaseRequestStatistics(),
          procurementService.getPurchaseOrderStatistics(),
        ]);
        setPurchaseRequests(prRes?.data || []);
        setPurchaseOrders(poRes?.data || []);

        setStats({
          totalPRs: prStatsRes.total,
          pendingPRs: prStatsRes.pending,
          approvedPRs: prStatsRes.approved,
          totalPOs: poStatsRes.total,
          pendingPOs: poStatsRes.pending,
          totalProcurement: prStatsRes.total_value,
        });

        setError(null);
      } catch (err) {
        console.error("Failed to fetch procurement data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const prColumns: Column<PurchaseRequest>[] = [
    {
      header: "PR Number",
      accessor: "pr_number",
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Requested By",
      accessor: (row) => row.requested_by.name,
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
        <p className="text-sm max-w-xs truncate" title={value as string}>
          {value}
        </p>
      ),
    },
    {
      header: "Items",
      accessor: (row) => row.items?.length || 0,
      cell: (value) => <span className="text-sm">{value} items</span>,
    },
    {
      header: "Total Amount",
      accessor: "total_amount",
      cell: (value) => (
        <span className="text-sm font-medium">{formatCurrency(value as number)}</span>
      ),
    },
    {
      header: "Date Requested",
      accessor: "pr_date",
      cell: (value) => <span className="text-sm">{formatDate(value as string)}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const status = value as string;
        const variant =
          status.toLowerCase() === "approved"
            ? "success"
            : status.toLowerCase() === "pending"
              ? "warning"
              : status.toLowerCase() === "disapproved" || status.toLowerCase() === "rejected"
                ? "destructive"
                : "default";
        return <Badge variant={variant as any}>{status}</Badge>;
      },
    },
    {
      header: "Actions",
      accessor: "id",
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
      accessor: "po_number",
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      header: "Supplier",
      accessor: (row) => row.supplier?.business_name,
      cell: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.supplier?.contactPerson}</p>
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
        <span className="text-sm font-medium">{formatCurrency(value as number)}</span>
      ),
    },
    {
      header: "Date Issued",
      accessor: "createdDate",
      cell: (value) => <span className="text-sm">{formatDate(value as string)}</span>,
    },
    {
      header: "Delivery Date",
      accessor: "deliveryDate",
      cell: (value) => <span className="text-sm">{formatDate(value as string)}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const status = value as string;
        const variant =
          status.toLowerCase() === "delivered"
            ? "success"
            : status.toLowerCase() === "confirmed"
              ? "default"
              : status.toLowerCase() === "sent"
                ? "info"
                : status.toLowerCase() === "pending"
                  ? "warning"
                  : status.toLowerCase() === "cancelled"
                    ? "destructive"
                    : "secondary";
        return <Badge variant={variant as any}>{status}</Badge>;
      },
    },
    {
      header: "Actions",
      accessor: () => null,
      cell: (_, row) => (
        <Link href={`/procurement/order/${row.id}`}>
          <Button size="sm" variant="outline">
            View
          </Button>
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-red-700">An Error Occurred</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

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
            <div className="text-2xl font-bold">{stats.totalPRs ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending PRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingPRs ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved PRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approvedPRs ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total POs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPOs ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending POs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingPOs ?? 0}
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
              {formatCurrency(stats.totalProcurement ?? 0)}
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

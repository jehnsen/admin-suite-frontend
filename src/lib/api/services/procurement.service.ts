import apiClient, { PaginatedResponse } from '../client';

// Types (based on your existing dummy data structures)
export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  philgepsRegistration?: string;
  tin: string;
  status: 'Active' | 'Inactive';
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PurchaseRequest {
  id: number;
  pr_number: string;
  requestedBy: string;
  department: string;
  purpose: string;
  items: PRItem[];
  totalAmount: number;
  fundSource: string;
  status: 'Draft' | 'Pending' | 'Recommended' | 'Approved' | 'Disapproved';
  createdDate: string;
  recommendedBy?: string;
  recommendedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface PRItem {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitCost: number;
  estimatedTotalCost: number;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  pr_id: number;
  supplier_id: number;
  supplier?: Supplier;
  items: POItem[];
  totalAmount: number;
  deliveryDate: string;
  deliveryAddress: string;
  terms: string;
  status: 'Draft' | 'Approved' | 'Sent' | 'Delivered' | 'Cancelled';
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface POItem {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

// API Filters
export interface SupplierFilters {
  status?: string;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface PurchaseRequestFilters {
  status?: string;
  fund_source?: string;
  per_page?: number;
  page?: number;
}

export interface PurchaseOrderFilters {
  status?: string;
  supplier_id?: number;
  per_page?: number;
  page?: number;
}

class ProcurementService {
  // ========== SUPPLIERS ==========

  async getSuppliers(filters?: SupplierFilters): Promise<PaginatedResponse<Supplier>> {
    return await apiClient.get<PaginatedResponse<Supplier>>('/suppliers', {
      params: filters,
    });
  }

  async getSupplier(id: number): Promise<Supplier> {
    return await apiClient.get<Supplier>(`/suppliers/${id}`);
  }

  async createSupplier(data: Partial<Supplier>): Promise<Supplier> {
    return await apiClient.post<Supplier>('/suppliers', data);
  }

  async updateSupplier(id: number, data: Partial<Supplier>): Promise<Supplier> {
    return await apiClient.put<Supplier>(`/suppliers/${id}`, data);
  }

  async deleteSupplier(id: number): Promise<void> {
    await apiClient.delete(`/suppliers/${id}`);
  }

  async getSupplierStatistics(): Promise<any> {
    return await apiClient.get('/suppliers/statistics');
  }

  // ========== PURCHASE REQUESTS ==========

  async getPurchaseRequests(filters?: PurchaseRequestFilters): Promise<PaginatedResponse<PurchaseRequest>> {
    return await apiClient.get<PaginatedResponse<PurchaseRequest>>('/purchase-requests', {
      params: filters,
    });
  }

  async getPurchaseRequest(id: number): Promise<PurchaseRequest> {
    return await apiClient.get<PurchaseRequest>(`/purchase-requests/${id}`);
  }

  async createPurchaseRequest(data: Partial<PurchaseRequest>): Promise<PurchaseRequest> {
    return await apiClient.post<PurchaseRequest>('/purchase-requests', data);
  }

  async updatePurchaseRequest(id: number, data: Partial<PurchaseRequest>): Promise<PurchaseRequest> {
    return await apiClient.put<PurchaseRequest>(`/purchase-requests/${id}`, data);
  }

  async deletePurchaseRequest(id: number): Promise<void> {
    await apiClient.delete(`/purchase-requests/${id}`);
  }

  async recommendPurchaseRequest(id: number, recommendedBy: number, remarks?: string): Promise<PurchaseRequest> {
    return await apiClient.post<PurchaseRequest>(`/purchase-requests/${id}/recommend`, {
      recommended_by: recommendedBy,
      remarks,
    });
  }

  async approvePurchaseRequest(id: number, approvedBy: number, remarks?: string): Promise<PurchaseRequest> {
    return await apiClient.post<PurchaseRequest>(`/purchase-requests/${id}/approve`, {
      approved_by: approvedBy,
      remarks,
    });
  }

  async disapprovePurchaseRequest(id: number, disapprovedBy: number, reason: string): Promise<PurchaseRequest> {
    return await apiClient.post<PurchaseRequest>(`/purchase-requests/${id}/disapprove`, {
      disapproved_by: disapprovedBy,
      reason,
    });
  }

  async getPurchaseRequestStatistics(): Promise<any> {
    return await apiClient.get('/purchase-requests/statistics');
  }

  // ========== PURCHASE ORDERS ==========

  async getPurchaseOrders(filters?: PurchaseOrderFilters): Promise<PaginatedResponse<PurchaseOrder>> {
    return await apiClient.get<PaginatedResponse<PurchaseOrder>>('/purchase-orders', {
      params: filters,
    });
  }

  async getPurchaseOrder(id: number): Promise<PurchaseOrder> {
    return await apiClient.get<PurchaseOrder>(`/purchase-orders/${id}`);
  }

  async createPurchaseOrder(data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    return await apiClient.post<PurchaseOrder>('/purchase-orders', data);
  }

  async updatePurchaseOrder(id: number, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    return await apiClient.put<PurchaseOrder>(`/purchase-orders/${id}`, data);
  }

  async deletePurchaseOrder(id: number): Promise<void> {
    await apiClient.delete(`/purchase-orders/${id}`);
  }

  async approvePurchaseOrder(id: number, approvedBy: number): Promise<PurchaseOrder> {
    return await apiClient.post<PurchaseOrder>(`/purchase-orders/${id}/approve`, {
      approved_by: approvedBy,
    });
  }

  async sendPurchaseOrder(id: number): Promise<PurchaseOrder> {
    return await apiClient.post<PurchaseOrder>(`/purchase-orders/${id}/send`);
  }

  async getPurchaseOrderStatistics(): Promise<any> {
    return await apiClient.get('/purchase-orders/statistics');
  }
}

// Export singleton instance
export const procurementService = new ProcurementService();
export default procurementService;

import apiClient, { PaginatedResponse } from '../client';

// ========== INTERFACES (Mapped to DB Schema) ==========

export type ProcurementMode = 'Small Value Procurement' | 'Shopping' | 'Public Bidding' | 'Direct Contracting' | 'Negotiated Procurement';
export type FundSource = 'MOOE' | 'SEF' | 'Special Education Fund' | 'Maintenance and Other Operating Expenses' | 'Canteen Fund' | 'PTA' | 'Donation';
export type PRStatus = 'Draft' | 'Pending' | 'Recommended' | 'Approved' | 'For Quotation';
export type POStatus = 'Draft' | 'Approved' | 'Sent' | 'Delivered' | 'Cancelled';

export interface Requester {
  id: number;
  name: string;
}

export interface PurchaseRequest {
  id: number;
  pr_number: string;
  pr_date: string; // Date string
  requested_by: Requester; // bigint unsigned
  department: string;
  section?: string; // New field
  purpose: string;
  fund_source: FundSource;
  fund_cluster?: string; // New field
  ppmp_reference?: string; // New field
  procurement_mode: ProcurementMode;
  estimated_budget: number; // decimal(15,2)
  total_amount: number; // decimal(15,2)
  date_needed?: string; // New field
  delivery_date?: string; // New field
  delivery_location?: string; // New field
  status: PRStatus;
  
  // Approval Workflow
  recommended_by?: number;
  recommended_at?: string;
  recommendation_remarks?: string;
  approved_by?: number;
  approved_at?: string;
  approval_remarks?: string;
  disapproved_by?: number;
  disapproved_at?: string;
  disapproval_reason?: string;
  
  remarks?: string;
  terms_and_conditions?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  items?: PRItem[];
}

export interface PRItem {
  id?: number;
  purchase_request_id?: number;
  item_number: number;
  item_code?: string; // New field
  item_description: string;
  unit_of_measure: string;
  quantity: number;
  unit_cost: number; // decimal(12,2)
  total_cost: number; // decimal(15,2)
  specifications?: string; // New field
  category?: string; // New field
  stock_on_hand: number; // Default 0
  monthly_consumption: number; // Default 0
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
    id: number;
    business_name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
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
    status: POStatus;
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
  

// ========== FILTERS ==========

export interface PurchaseRequestFilters {
  status?: string;
  fund_source?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
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
  // ========== PURCHASE REQUESTS ==========

  async getPurchaseRequests(filters?: PurchaseRequestFilters): Promise<PaginatedResponse<PurchaseRequest>> {
    return await apiClient.getPaginated<PurchaseRequest>('/purchase-requests', {
      params: filters,
    });
  }

  async getPurchaseRequest(id: number): Promise<PurchaseRequest> {
    return await apiClient.get<PurchaseRequest>(`/purchase-requests/${id}`);
  }

  // Payload is Partial but typically excludes ID and timestamps for creation
  async createPurchaseRequest(data: Partial<PurchaseRequest>): Promise<PurchaseRequest> {
    return await apiClient.post<PurchaseRequest>('/purchase-requests', data);
  }

  async updatePurchaseRequest(id: number, data: Partial<PurchaseRequest>): Promise<PurchaseRequest> {
    return await apiClient.put<PurchaseRequest>(`/purchase-requests/${id}`, data);
  }

  async deletePurchaseRequest(id: number): Promise<void> {
    await apiClient.delete(`/purchase-requests/${id}`);
  }

  async getPurchaseRequestStatistics(): Promise<any> {
    return await apiClient.get('/purchase-requests/statistics');
  }

  // ========== PURCHASE ORDERS ==========

  async getPurchaseOrders(filters?: PurchaseOrderFilters): Promise<PaginatedResponse<PurchaseOrder>> {
    return await apiClient.getPaginated<PurchaseOrder>('/purchase-orders', {
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
  
  async getPurchaseOrderStatistics(): Promise<any> {
    return await apiClient.get('/purchase-orders/statistics');
  }
}

export const procurementService = new ProcurementService();
export default procurementService;
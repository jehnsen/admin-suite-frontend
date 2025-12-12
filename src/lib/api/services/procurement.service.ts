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

// ========== QUOTATIONS ==========

export interface Quotation {
  id: number;
  quotation_number: string;
  purchase_request_id: number;
  supplier_id: number;
  supplier?: Supplier;
  quotation_date: string;
  validity_date?: string;
  total_amount: number;
  payment_terms?: string;
  delivery_terms?: string;
  status: 'Draft' | 'Submitted' | 'Selected' | 'Rejected';
  remarks?: string;
  is_winning_quote?: boolean;
  items: QuotationItem[];
  created_at?: string;
  updated_at?: string;
}

export interface QuotationItem {
  id?: number;
  quotation_id?: number;
  pr_item_id: number;
  item_description: string;
  quantity: number;
  unit_of_measure: string;
  unit_price: number;
  total_price: number;
  brand_model?: string;
  specifications?: string;
}

export interface QuotationFilters {
  purchase_request_id?: number;
  supplier_id?: number;
  status?: string;
  per_page?: number;
  page?: number;
}

// ========== DELIVERIES ==========

export interface Delivery {
  id: number;
  delivery_number: string;
  purchase_order_id: number;
  purchase_order?: PurchaseOrder;
  delivery_date: string;
  received_date?: string;
  received_by?: number;
  received_by_name?: string;
  delivery_receipt_number?: string;
  notes?: string;
  status: 'Pending' | 'Partial' | 'Completed' | 'Rejected';
  items: DeliveryItem[];
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryItem {
  id?: number;
  delivery_id?: number;
  po_item_id: number;
  item_description: string;
  quantity_ordered: number;
  quantity_delivered: number;
  quantity_accepted: number;
  unit_of_measure: string;
  condition: 'Good' | 'Damaged' | 'Incomplete';
  remarks?: string;
}

export interface DeliveryFilters {
  purchase_order_id?: number;
  status?: string;
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

  // Submit PR for approval
  async submitPurchaseRequest(id: number): Promise<PurchaseRequest> {
    return await apiClient.post<PurchaseRequest>(`/purchase-requests/${id}/submit`, {});
  }

  // Recommend PR (first level approval)
  async recommendPurchaseRequest(id: number, remarks?: string): Promise<PurchaseRequest> {
    return await apiClient.post<PurchaseRequest>(`/purchase-requests/${id}/recommend`, {
      recommendation_remarks: remarks,
    });
  }

  // Approve PR (final approval)
  async approvePurchaseRequest(id: number, remarks?: string): Promise<PurchaseRequest> {
    return await apiClient.post<PurchaseRequest>(`/purchase-requests/${id}/approve`, {
      approval_remarks: remarks,
    });
  }

  // Disapprove/Reject PR
  async disapprovePurchaseRequest(id: number, reason: string): Promise<PurchaseRequest> {
    return await apiClient.post<PurchaseRequest>(`/purchase-requests/${id}/disapprove`, {
      disapproval_reason: reason,
    });
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

  // Approve Purchase Order
  async approvePurchaseOrder(id: number): Promise<PurchaseOrder> {
    return await apiClient.post<PurchaseOrder>(`/purchase-orders/${id}/approve`, {});
  }

  // Send Purchase Order to Supplier
  async sendPurchaseOrder(id: number): Promise<PurchaseOrder> {
    return await apiClient.post<PurchaseOrder>(`/purchase-orders/${id}/send`, {});
  }

  // ========== QUOTATIONS ==========

  async getQuotations(filters?: QuotationFilters): Promise<PaginatedResponse<Quotation>> {
    return await apiClient.getPaginated<Quotation>('/quotations', {
      params: filters,
    });
  }

  async getQuotation(id: number): Promise<Quotation> {
    return await apiClient.get<Quotation>(`/quotations/${id}`);
  }

  async getQuotationsForPR(prId: number): Promise<Quotation[]> {
    return await apiClient.get<Quotation[]>(`/purchase-requests/${prId}/quotations`);
  }

  async createQuotation(data: Partial<Quotation>): Promise<Quotation> {
    return await apiClient.post<Quotation>('/quotations', data);
  }

  async updateQuotation(id: number, data: Partial<Quotation>): Promise<Quotation> {
    return await apiClient.put<Quotation>(`/quotations/${id}`, data);
  }

  async deleteQuotation(id: number): Promise<void> {
    await apiClient.delete(`/quotations/${id}`);
  }

  // Select winning quotation
  async selectWinningQuotation(id: number): Promise<Quotation> {
    return await apiClient.post<Quotation>(`/quotations/${id}/select`, {});
  }

  // ========== DELIVERIES ==========

  async getDeliveries(filters?: DeliveryFilters): Promise<PaginatedResponse<Delivery>> {
    return await apiClient.getPaginated<Delivery>('/deliveries', {
      params: filters,
    });
  }

  async getDelivery(id: number): Promise<Delivery> {
    return await apiClient.get<Delivery>(`/deliveries/${id}`);
  }

  async getDeliveriesForPO(poId: number): Promise<Delivery[]> {
    return await apiClient.get<Delivery[]>(`/purchase-orders/${poId}/deliveries`);
  }

  async createDelivery(data: Partial<Delivery>): Promise<Delivery> {
    return await apiClient.post<Delivery>('/deliveries', data);
  }

  async updateDelivery(id: number, data: Partial<Delivery>): Promise<Delivery> {
    return await apiClient.put<Delivery>(`/deliveries/${id}`, data);
  }

  async deleteDelivery(id: number): Promise<void> {
    await apiClient.delete(`/deliveries/${id}`);
  }

  // Accept/Receive Delivery
  async acceptDelivery(id: number, receivedBy: number, items: DeliveryItem[]): Promise<Delivery> {
    return await apiClient.post<Delivery>(`/deliveries/${id}/accept`, {
      received_by: receivedBy,
      items,
    });
  }

  // Reject Delivery
  async rejectDelivery(id: number, reason: string): Promise<Delivery> {
    return await apiClient.post<Delivery>(`/deliveries/${id}/reject`, {
      reason,
    });
  }
}

export const procurementService = new ProcurementService();
export default procurementService;
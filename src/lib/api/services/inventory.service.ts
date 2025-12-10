import apiClient, { PaginatedResponse } from '../client';

// Types - Matching Laravel API response
export interface InventoryItem {
  id: number;
  item_code: string;
  item_name: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  book_value: string; // Laravel returns as string
  accumulated_depreciation: string;
  depreciation_rate: string | null;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  property_number: string | null;
  condition: string;
  location: string | null;
  status: string;
  fund_source: string | null;
  date_acquired: string | null;
  estimated_useful_life_years: number | null;
  po_number: string | null;
  invoice_number: string | null;
  supplier: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface StockCard {
  id: number;
  inventory_item_id: number;
  item_name: string;
  transaction_date: string;
  transaction_type: 'Stock In' | 'Stock Out' | 'Adjustment' | 'Transfer' | 'Donation';
  reference_number: string;
  quantity_in: number;
  quantity_out: number;
  balance: number;
  unit_cost: number;
  total_value: number;
  remarks?: string;
  created_by?: string;
}

export interface InventoryAdjustment {
  id: number;
  adjustment_number: string;
  inventory_item_id: number;
  item_name: string;
  adjustment_type: 'Increase' | 'Decrease' | 'Donation Received' | 'Disposal' | 'Transfer';
  quantity: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requested_by: string;
  requested_date: string;
  approved_by?: string;
  approved_date?: string;
}

export interface PhysicalCount {
  id: number;
  count_number: string;
  count_date: string;
  inventory_item_id: number;
  item_name: string;
  system_quantity: number;
  actual_quantity: number;
  variance: number;
  remarks?: string;
  counted_by: string;
  verified_by?: string;
  status: 'In Progress' | 'Completed' | 'Verified';
}

// Filters
export interface InventoryFilters {
  category?: string;
  status?: string;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface StockCardFilters {
  inventory_item_id?: number;
  transaction_type?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

class InventoryService {
  // ========== INVENTORY ITEMS ==========

  async getInventoryItems(filters?: InventoryFilters): Promise<PaginatedResponse<InventoryItem>> {
    // Laravel pagination returns the paginated response directly
    const response = await apiClient.getRaw('/inventory-items', {
      params: filters,
    });
    return response as unknown as PaginatedResponse<InventoryItem>;
  }

  async getInventoryItem(id: number): Promise<InventoryItem> {
    return await apiClient.get<InventoryItem>(`/inventory-items/${id}`);
  }

  async createInventoryItem(data: Partial<InventoryItem>): Promise<InventoryItem> {
    return await apiClient.post<InventoryItem>('/inventory-items', data);
  }

  async updateInventoryItem(id: number, data: Partial<InventoryItem>): Promise<InventoryItem> {
    return await apiClient.put<InventoryItem>(`/inventory-items/${id}`, data);
  }

  async deleteInventoryItem(id: number): Promise<void> {
    await apiClient.delete(`/inventory-items/${id}`);
  }

  // ========== STOCK CARDS ==========

  async getStockCards(filters?: StockCardFilters): Promise<PaginatedResponse<StockCard>> {
    // Laravel pagination returns the paginated response directly
    const response = await apiClient.getRaw('/stock-cards', {
      params: filters,
    });
    return response as unknown as PaginatedResponse<StockCard>;
  }

  async getStockCard(id: number): Promise<StockCard> {
    return await apiClient.get<StockCard>(`/stock-cards/${id}`);
  }

  async createStockTransaction(data: Partial<StockCard>): Promise<StockCard> {
    return await apiClient.post<StockCard>('/stock-cards', data);
  }

  async getStockCardStatistics(): Promise<any> {
    return await apiClient.get('/stock-cards/statistics');
  }

  // ========== INVENTORY ADJUSTMENTS ==========

  async getInventoryAdjustments(filters?: any): Promise<PaginatedResponse<InventoryAdjustment>> {
    // Laravel pagination returns the paginated response directly
    const response = await apiClient.getRaw('/inventory-adjustments', {
      params: filters,
    });
    return response as unknown as PaginatedResponse<InventoryAdjustment>;
  }

  async getInventoryAdjustment(id: number): Promise<InventoryAdjustment> {
    return await apiClient.get<InventoryAdjustment>(`/inventory-adjustments/${id}`);
  }

  async createInventoryAdjustment(data: Partial<InventoryAdjustment>): Promise<InventoryAdjustment> {
    return await apiClient.post<InventoryAdjustment>('/inventory-adjustments', data);
  }

  async approveInventoryAdjustment(id: number, approvedBy: number): Promise<InventoryAdjustment> {
    return await apiClient.post<InventoryAdjustment>(`/inventory-adjustments/${id}/approve`, {
      approved_by: approvedBy,
    });
  }

  async rejectInventoryAdjustment(id: number, rejectedBy: number, reason: string): Promise<InventoryAdjustment> {
    return await apiClient.post<InventoryAdjustment>(`/inventory-adjustments/${id}/reject`, {
      rejected_by: rejectedBy,
      reason,
    });
  }

  // ========== PHYSICAL COUNTS ==========

  async getPhysicalCounts(filters?: any): Promise<PaginatedResponse<PhysicalCount>> {
    // Laravel pagination returns the paginated response directly
    const response = await apiClient.getRaw('/physical-counts', {
      params: filters,
    });
    return response as unknown as PaginatedResponse<PhysicalCount>;
  }

  async getPhysicalCount(id: number): Promise<PhysicalCount> {
    return await apiClient.get<PhysicalCount>(`/physical-counts/${id}`);
  }

  async createPhysicalCount(data: Partial<PhysicalCount>): Promise<PhysicalCount> {
    return await apiClient.post<PhysicalCount>('/physical-counts', data);
  }

  async verifyPhysicalCount(id: number, verifiedBy: number): Promise<PhysicalCount> {
    return await apiClient.post<PhysicalCount>(`/physical-counts/${id}/verify`, {
      verified_by: verifiedBy,
    });
  }

  async getPhysicalCountStatistics(): Promise<any> {
    return await apiClient.get('/physical-counts/statistics');
  }
}

// Export singleton instance
export const inventoryService = new InventoryService();
export default inventoryService;

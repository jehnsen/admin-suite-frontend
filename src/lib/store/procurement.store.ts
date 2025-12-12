import { create } from 'zustand';
import procurementService, {
  PurchaseRequest,
  PurchaseOrder,
  PurchaseRequestFilters,
  PurchaseOrderFilters,
} from '../api/services/procurement.service';
import { PaginatedResponse } from '../api/client';

interface ProcurementState {
  // Data
  purchaseRequests: PurchaseRequest[];
  purchaseOrders: PurchaseOrder[];

  // Pagination
  prPagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;

  poPagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;

  // UI State
  isLoading: boolean;
  error: string | null;

  // ============== Purchase Requests ==============
  fetchPurchaseRequests: (filters?: PurchaseRequestFilters) => Promise<void>;
  fetchPurchaseRequest: (id: number) => Promise<PurchaseRequest>;
  createPurchaseRequest: (data: Partial<PurchaseRequest>) => Promise<PurchaseRequest>;
  updatePurchaseRequest: (id: number, data: Partial<PurchaseRequest>) => Promise<PurchaseRequest>;
  deletePurchaseRequest: (id: number) => Promise<void>;

  // ============== Purchase Orders ==============
  fetchPurchaseOrders: (filters?: PurchaseOrderFilters) => Promise<void>;
  fetchPurchaseOrder: (id: number) => Promise<PurchaseOrder>;
  createPurchaseOrder: (data: Partial<PurchaseOrder>) => Promise<PurchaseOrder>;
  updatePurchaseOrder: (id: number, data: Partial<PurchaseOrder>) => Promise<PurchaseOrder>;
  deletePurchaseOrder: (id: number) => Promise<void>;

  // Utility
  clearError: () => void;
}

export const useProcurementStore = create<ProcurementState>((set, get) => ({
  // Initial State
  purchaseRequests: [],
  purchaseOrders: [],
  prPagination: null,
  poPagination: null,
  isLoading: false,
  error: null,

  // ============== Purchase Requests ==============

  fetchPurchaseRequests: async (filters?: PurchaseRequestFilters) => {
    try {
      set({ isLoading: true, error: null });

      const response: PaginatedResponse<PurchaseRequest> = await procurementService.getPurchaseRequests(filters);

      set({
        purchaseRequests: response.data,
        prPagination: {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
        },
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Purchase requests fetch error:', error);
      set({
        error: error.message || error.toString() || 'Failed to fetch purchase requests',
        isLoading: false,
        purchaseRequests: [],
      });
    }
  },

  fetchPurchaseRequest: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const purchaseRequest = await procurementService.getPurchaseRequest(id);
      set({ isLoading: false });
      return purchaseRequest;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch purchase request',
        isLoading: false,
      });
      throw error;
    }
  },

  createPurchaseRequest: async (data: Partial<PurchaseRequest>) => {
    try {
      set({ isLoading: true, error: null });
      const purchaseRequest = await procurementService.createPurchaseRequest(data);
      set((state) => ({
        purchaseRequests: [purchaseRequest, ...state.purchaseRequests],
        isLoading: false,
      }));
      return purchaseRequest;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create purchase request',
        isLoading: false,
      });
      throw error;
    }
  },

  updatePurchaseRequest: async (id: number, data: Partial<PurchaseRequest>) => {
    try {
      set({ isLoading: true, error: null });
      const purchaseRequest = await procurementService.updatePurchaseRequest(id, data);
      set((state) => ({
        purchaseRequests: state.purchaseRequests.map((pr) => (pr.id === id ? purchaseRequest : pr)),
        isLoading: false,
      }));
      return purchaseRequest;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update purchase request',
        isLoading: false,
      });
      throw error;
    }
  },

  deletePurchaseRequest: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await procurementService.deletePurchaseRequest(id);
      set((state) => ({
        purchaseRequests: state.purchaseRequests.filter((pr) => pr.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete purchase request',
        isLoading: false,
      });
      throw error;
    }
  },

  // ============== Purchase Orders ==============

  fetchPurchaseOrders: async (filters?: PurchaseOrderFilters) => {
    try {
      set({ isLoading: true, error: null });

      const response: PaginatedResponse<PurchaseOrder> = await procurementService.getPurchaseOrders(filters);

      set({
        purchaseOrders: response.data,
        poPagination: {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
        },
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Purchase orders fetch error:', error);
      set({
        error: error.message || error.toString() || 'Failed to fetch purchase orders',
        isLoading: false,
        purchaseOrders: [],
      });
    }
  },

  fetchPurchaseOrder: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const purchaseOrder = await procurementService.getPurchaseOrder(id);
      set({ isLoading: false });
      return purchaseOrder;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch purchase order',
        isLoading: false,
      });
      throw error;
    }
  },

  createPurchaseOrder: async (data: Partial<PurchaseOrder>) => {
    try {
      set({ isLoading: true, error: null });
      const purchaseOrder = await procurementService.createPurchaseOrder(data);
      set((state) => ({
        purchaseOrders: [purchaseOrder, ...state.purchaseOrders],
        isLoading: false,
      }));
      return purchaseOrder;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create purchase order',
        isLoading: false,
      });
      throw error;
    }
  },

  updatePurchaseOrder: async (id: number, data: Partial<PurchaseOrder>) => {
    try {
      set({ isLoading: true, error: null });
      const purchaseOrder = await procurementService.updatePurchaseOrder(id, data);
      set((state) => ({
        purchaseOrders: state.purchaseOrders.map((po) => (po.id === id ? purchaseOrder : po)),
        isLoading: false,
      }));
      return purchaseOrder;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update purchase order',
        isLoading: false,
      });
      throw error;
    }
  },

  deletePurchaseOrder: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await procurementService.deletePurchaseOrder(id);
      set((state) => ({
        purchaseOrders: state.purchaseOrders.filter((po) => po.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete purchase order',
        isLoading: false,
      });
      throw error;
    }
  },

  // Utility
  clearError: () => set({ error: null }),
}));

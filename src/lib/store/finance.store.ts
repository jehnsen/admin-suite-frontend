import { create } from 'zustand';
import financeService, {
  Disbursement,
  Liquidation,
  BudgetAllocation,
  CashAdvance,
  DisbursementFilters,
  LiquidationFilters,
  CashAdvanceFilters,
} from '../api/services/finance.service';
import { PaginatedResponse } from '../api/client';

interface FinanceState {
  // Data
  disbursements: Disbursement[];
  liquidations: Liquidation[];
  budgetAllocations: BudgetAllocation[];
  cashAdvances: CashAdvance[];

  // Pagination
  disbursementPagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;

  liquidationPagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;

  cashAdvancePagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;

  // UI State
  isLoading: boolean;
  error: string | null;

  // ============== Disbursements ==============
  fetchDisbursements: (filters?: DisbursementFilters) => Promise<void>;
  fetchDisbursement: (id: number) => Promise<Disbursement>;
  createDisbursement: (data: Partial<Disbursement>) => Promise<Disbursement>;
  updateDisbursement: (id: number, data: Partial<Disbursement>) => Promise<Disbursement>;
  certifyDisbursement: (id: number, certifiedBy: number) => Promise<void>;
  approveDisbursement: (id: number, approvedBy: number) => Promise<void>;
  payDisbursement: (id: number, checkNumber: string, checkDate: string) => Promise<void>;

  // ============== Liquidations ==============
  fetchLiquidations: (filters?: LiquidationFilters) => Promise<void>;
  fetchLiquidation: (id: number) => Promise<Liquidation>;
  createLiquidation: (data: Partial<Liquidation>) => Promise<Liquidation>;
  verifyLiquidation: (id: number, verifiedBy: number) => Promise<void>;
  approveLiquidation: (id: number, approvedBy: number) => Promise<void>;
  disapproveLiquidation: (id: number, disapprovedBy: number, reason: string) => Promise<void>;

  // ============== Budget Allocations ==============
  fetchBudgetAllocations: () => Promise<void>;
  updateBudgetAllocation: (id: number, data: Partial<BudgetAllocation>) => Promise<void>;

  // ============== Cash Advances ==============
  fetchCashAdvances: (filters?: CashAdvanceFilters) => Promise<void>;
  fetchCashAdvance: (id: number) => Promise<CashAdvance>;
  createCashAdvance: (data: Partial<CashAdvance>) => Promise<CashAdvance>;
  updateCashAdvance: (id: number, data: Partial<CashAdvance>) => Promise<CashAdvance>;
  approveCashAdvance: (id: number, approvedBy: number) => Promise<void>;
  releaseCashAdvance: (id: number, releasedBy: number) => Promise<void>;

  // Utility
  clearError: () => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  // Initial State
  disbursements: [],
  liquidations: [],
  budgetAllocations: [],
  cashAdvances: [],
  disbursementPagination: null,
  liquidationPagination: null,
  cashAdvancePagination: null,
  isLoading: false,
  error: null,

  // ============== Disbursements ==============

  fetchDisbursements: async (filters?: DisbursementFilters) => {
    try {
      set({ isLoading: true, error: null });

      const response: PaginatedResponse<Disbursement> = await financeService.getDisbursements(filters);

      set({
        disbursements: response.data,
        disbursementPagination: {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
        },
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Disbursements fetch error:', error);
      set({
        error: error.message || error.toString() || 'Failed to fetch disbursements',
        isLoading: false,
        disbursements: [],
      });
    }
  },

  fetchDisbursement: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const disbursement = await financeService.getDisbursement(id);
      set({ isLoading: false });
      return disbursement;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch disbursement',
        isLoading: false,
      });
      throw error;
    }
  },

  createDisbursement: async (data: Partial<Disbursement>) => {
    try {
      set({ isLoading: true, error: null });
      const disbursement = await financeService.createDisbursement(data);
      set((state) => ({
        disbursements: [disbursement, ...state.disbursements],
        isLoading: false,
      }));
      return disbursement;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create disbursement',
        isLoading: false,
      });
      throw error;
    }
  },

  updateDisbursement: async (id: number, data: Partial<Disbursement>) => {
    try {
      set({ isLoading: true, error: null });
      const disbursement = await financeService.updateDisbursement(id, data);
      set((state) => ({
        disbursements: state.disbursements.map((d) => (d.id === id ? disbursement : d)),
        isLoading: false,
      }));
      return disbursement;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update disbursement',
        isLoading: false,
      });
      throw error;
    }
  },

  certifyDisbursement: async (id: number, certifiedBy: number) => {
    try {
      set({ isLoading: true, error: null });
      const disbursement = await financeService.certifyDisbursement(id, certifiedBy);
      set((state) => ({
        disbursements: state.disbursements.map((d) => (d.id === id ? disbursement : d)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to certify disbursement',
        isLoading: false,
      });
      throw error;
    }
  },

  approveDisbursement: async (id: number, approvedBy: number) => {
    try {
      set({ isLoading: true, error: null });
      const disbursement = await financeService.approveDisbursement(id, approvedBy);
      set((state) => ({
        disbursements: state.disbursements.map((d) => (d.id === id ? disbursement : d)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to approve disbursement',
        isLoading: false,
      });
      throw error;
    }
  },

  payDisbursement: async (id: number, checkNumber: string, checkDate: string) => {
    try {
      set({ isLoading: true, error: null });
      const disbursement = await financeService.payDisbursement(id, checkNumber, checkDate);
      set((state) => ({
        disbursements: state.disbursements.map((d) => (d.id === id ? disbursement : d)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to mark disbursement as paid',
        isLoading: false,
      });
      throw error;
    }
  },

  // ============== Liquidations ==============

  fetchLiquidations: async (filters?: LiquidationFilters) => {
    try {
      set({ isLoading: true, error: null });

      const response: PaginatedResponse<Liquidation> = await financeService.getLiquidations(filters);

      set({
        liquidations: response.data,
        liquidationPagination: {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch liquidations',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchLiquidation: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const liquidation = await financeService.getLiquidation(id);
      set({ isLoading: false });
      return liquidation;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch liquidation',
        isLoading: false,
      });
      throw error;
    }
  },

  createLiquidation: async (data: Partial<Liquidation>) => {
    try {
      set({ isLoading: true, error: null });
      const liquidation = await financeService.createLiquidation(data);
      set((state) => ({
        liquidations: [liquidation, ...state.liquidations],
        isLoading: false,
      }));
      return liquidation;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create liquidation',
        isLoading: false,
      });
      throw error;
    }
  },

  verifyLiquidation: async (id: number, verifiedBy: number) => {
    try {
      set({ isLoading: true, error: null });
      const liquidation = await financeService.verifyLiquidation(id, verifiedBy);
      set((state) => ({
        liquidations: state.liquidations.map((l) => (l.id === id ? liquidation : l)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to verify liquidation',
        isLoading: false,
      });
      throw error;
    }
  },

  approveLiquidation: async (id: number, approvedBy: number) => {
    try {
      set({ isLoading: true, error: null });
      const liquidation = await financeService.approveLiquidation(id, approvedBy);
      set((state) => ({
        liquidations: state.liquidations.map((l) => (l.id === id ? liquidation : l)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to approve liquidation',
        isLoading: false,
      });
      throw error;
    }
  },

  disapproveLiquidation: async (id: number, disapprovedBy: number, reason: string) => {
    try {
      set({ isLoading: true, error: null });
      const liquidation = await financeService.disapproveLiquidation(id, disapprovedBy, reason);
      set((state) => ({
        liquidations: state.liquidations.map((l) => (l.id === id ? liquidation : l)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to disapprove liquidation',
        isLoading: false,
      });
      throw error;
    }
  },

  // ============== Budget Allocations ==============

  fetchBudgetAllocations: async () => {
    try {
      set({ isLoading: true, error: null });
      const budgetAllocations = await financeService.getBudgetAllocations();
      set({ budgetAllocations, isLoading: false });
    } catch (error: any) {
      console.error('Budget allocations fetch error:', error);
      set({
        error: error.message || error.toString() || 'Failed to fetch budget allocations',
        isLoading: false,
        budgetAllocations: [],
      });
    }
  },

  updateBudgetAllocation: async (id: number, data: Partial<BudgetAllocation>) => {
    try {
      set({ isLoading: true, error: null });
      const allocation = await financeService.updateBudgetAllocation(id, data);
      set((state) => ({
        budgetAllocations: state.budgetAllocations.map((a) => (a.id === id ? allocation : a)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update budget allocation',
        isLoading: false,
      });
      throw error;
    }
  },

  // ============== Cash Advances ==============

  fetchCashAdvances: async (filters?: CashAdvanceFilters) => {
    try {
      set({ isLoading: true, error: null });

      const response: PaginatedResponse<CashAdvance> = await financeService.getCashAdvances(filters);

      set({
        cashAdvances: response.data,
        cashAdvancePagination: {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch cash advances',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchCashAdvance: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const cashAdvance = await financeService.getCashAdvance(id);
      set({ isLoading: false });
      return cashAdvance;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch cash advance',
        isLoading: false,
      });
      throw error;
    }
  },

  createCashAdvance: async (data: Partial<CashAdvance>) => {
    try {
      set({ isLoading: true, error: null });
      const cashAdvance = await financeService.createCashAdvance(data);
      set((state) => ({
        cashAdvances: [cashAdvance, ...state.cashAdvances],
        isLoading: false,
      }));
      return cashAdvance;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create cash advance',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCashAdvance: async (id: number, data: Partial<CashAdvance>) => {
    try {
      set({ isLoading: true, error: null });
      const cashAdvance = await financeService.updateCashAdvance(id, data);
      set((state) => ({
        cashAdvances: state.cashAdvances.map((ca) => (ca.id === id ? cashAdvance : ca)),
        isLoading: false,
      }));
      return cashAdvance;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update cash advance',
        isLoading: false,
      });
      throw error;
    }
  },

  approveCashAdvance: async (id: number, approvedBy: number) => {
    try {
      set({ isLoading: true, error: null });
      const cashAdvance = await financeService.approveCashAdvance(id, approvedBy);
      set((state) => ({
        cashAdvances: state.cashAdvances.map((ca) => (ca.id === id ? cashAdvance : ca)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to approve cash advance',
        isLoading: false,
      });
      throw error;
    }
  },

  releaseCashAdvance: async (id: number, releasedBy: number) => {
    try {
      set({ isLoading: true, error: null });
      const cashAdvance = await financeService.releaseCashAdvance(id, releasedBy);
      set((state) => ({
        cashAdvances: state.cashAdvances.map((ca) => (ca.id === id ? cashAdvance : ca)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to release cash advance',
        isLoading: false,
      });
      throw error;
    }
  },

  // Utility
  clearError: () => set({ error: null }),
}));

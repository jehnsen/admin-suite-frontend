import apiClient, { PaginatedResponse } from '../client';

// Types
export interface BudgetAllocation {
  id: number;
  source: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilizationRate: number;
  fiscalYear: string;
  created_at?: string;
  updated_at?: string;
}

export interface CashAdvance {
  id: number;
  ca_number: string;
  employee_id: number;
  employee_name: string;
  amount: number;
  purpose: string;
  date_requested: string;
  date_approved?: string;
  date_released?: string;
  due_date: string;
  status: 'Pending' | 'Approved' | 'Released' | 'Partially Liquidated' | 'Fully Liquidated' | 'Overdue';
  approved_by?: string;
  released_by?: string;
  balance: number;
  is_overdue?: boolean;
}

export interface Disbursement {
  id: number;
  dv_number: string;
  payee: string;
  purpose: string;
  amount: number;
  fund_source: string;
  check_number?: string;
  check_date?: string;
  status: 'Draft' | 'Certified' | 'Approved' | 'Paid';
  certified_by?: string;
  certified_date?: string;
  approved_by?: string;
  approved_date?: string;
  date_paid?: string;
  created_date: string;
}

export interface Liquidation {
  id: number;
  liquidation_number: string;
  cash_advance_id: number;
  ca_number: string;
  employee_name: string;
  cash_advance_amount: number;
  total_expenses: number;
  amount_to_refund: number;
  additional_cash_needed: number;
  date_submitted: string;
  status: 'Pending' | 'Verified' | 'Approved' | 'Disapproved';
  verified_by?: string;
  verified_date?: string;
  approved_by?: string;
  approved_date?: string;
  items: LiquidationItem[];
}

export interface LiquidationItem {
  id: number;
  date: string;
  particulars: string;
  amount: number;
  receipt_number?: string;
}

// Filters
export interface CashAdvanceFilters {
  status?: string;
  employee_id?: number;
  is_overdue?: boolean;
  per_page?: number;
  page?: number;
}

export interface DisbursementFilters {
  status?: string;
  fund_source?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export interface LiquidationFilters {
  status?: string;
  employee_id?: number;
  per_page?: number;
  page?: number;
}

class FinanceService {
  // ========== BUDGET ALLOCATIONS ==========

  async getBudgetAllocations(): Promise<BudgetAllocation[]> {
    return await apiClient.get<BudgetAllocation[]>('/budget-allocations');
  }

  async getBudgetAllocation(id: number): Promise<BudgetAllocation> {
    return await apiClient.get<BudgetAllocation>(`/budget-allocations/${id}`);
  }

  async createBudgetAllocation(data: Partial<BudgetAllocation>): Promise<BudgetAllocation> {
    return await apiClient.post<BudgetAllocation>('/budget-allocations', data);
  }

  async updateBudgetAllocation(id: number, data: Partial<BudgetAllocation>): Promise<BudgetAllocation> {
    return await apiClient.put<BudgetAllocation>(`/budget-allocations/${id}`, data);
  }

  // ========== CASH ADVANCES ==========

  async getCashAdvances(filters?: CashAdvanceFilters): Promise<PaginatedResponse<CashAdvance>> {
    return await apiClient.getPaginated<CashAdvance>('/cash-advances', {
      params: filters,
    });
  }

  async getCashAdvance(id: number): Promise<CashAdvance> {
    return await apiClient.get<CashAdvance>(`/cash-advances/${id}`);
  }

  async createCashAdvance(data: Partial<CashAdvance>): Promise<CashAdvance> {
    return await apiClient.post<CashAdvance>('/cash-advances', data);
  }

  async updateCashAdvance(id: number, data: Partial<CashAdvance>): Promise<CashAdvance> {
    return await apiClient.put<CashAdvance>(`/cash-advances/${id}`, data);
  }

  async approveCashAdvance(id: number, approvedBy: number): Promise<CashAdvance> {
    return await apiClient.post<CashAdvance>(`/cash-advances/${id}/approve`, {
      approved_by: approvedBy,
    });
  }

  async releaseCashAdvance(id: number, releasedBy: number): Promise<CashAdvance> {
    return await apiClient.post<CashAdvance>(`/cash-advances/${id}/release`, {
      released_by: releasedBy,
    });
  }

  async getCashAdvanceStatistics(): Promise<any> {
    return await apiClient.get('/cash-advances/statistics');
  }

  // ========== DISBURSEMENTS ==========

  async getDisbursements(filters?: DisbursementFilters): Promise<PaginatedResponse<Disbursement>> {
    return await apiClient.getPaginated<Disbursement>('/disbursements', {
      params: filters,
    });
  }

  async getDisbursement(id: number): Promise<Disbursement> {
    return await apiClient.get<Disbursement>(`/disbursements/${id}`);
  }

  async createDisbursement(data: Partial<Disbursement>): Promise<Disbursement> {
    return await apiClient.post<Disbursement>('/disbursements', data);
  }

  async updateDisbursement(id: number, data: Partial<Disbursement>): Promise<Disbursement> {
    return await apiClient.put<Disbursement>(`/disbursements/${id}`, data);
  }

  async certifyDisbursement(id: number, certifiedBy: number): Promise<Disbursement> {
    return await apiClient.post<Disbursement>(`/disbursements/${id}/certify`, {
      certified_by: certifiedBy,
    });
  }

  async approveDisbursement(id: number, approvedBy: number): Promise<Disbursement> {
    return await apiClient.post<Disbursement>(`/disbursements/${id}/approve`, {
      approved_by: approvedBy,
    });
  }

  async payDisbursement(id: number, checkNumber: string, checkDate: string): Promise<Disbursement> {
    return await apiClient.post<Disbursement>(`/disbursements/${id}/pay`, {
      check_number: checkNumber,
      check_date: checkDate,
    });
  }

  async getDisbursementStatistics(): Promise<any> {
    return await apiClient.get('/disbursements/statistics');
  }

  // ========== LIQUIDATIONS ==========

  async getLiquidations(filters?: LiquidationFilters): Promise<PaginatedResponse<Liquidation>> {
    return await apiClient.getPaginated<Liquidation>('/liquidations', {
      params: filters,
    });
  }

  async getLiquidation(id: number): Promise<Liquidation> {
    return await apiClient.get<Liquidation>(`/liquidations/${id}`);
  }

  async createLiquidation(data: Partial<Liquidation>): Promise<Liquidation> {
    return await apiClient.post<Liquidation>('/liquidations', data);
  }

  async verifyLiquidation(id: number, verifiedBy: number): Promise<Liquidation> {
    return await apiClient.post<Liquidation>(`/liquidations/${id}/verify`, {
      verified_by: verifiedBy,
    });
  }

  async approveLiquidation(id: number, approvedBy: number): Promise<Liquidation> {
    return await apiClient.post<Liquidation>(`/liquidations/${id}/approve`, {
      approved_by: approvedBy,
    });
  }

  async disapproveLiquidation(id: number, disapprovedBy: number, reason: string): Promise<Liquidation> {
    return await apiClient.post<Liquidation>(`/liquidations/${id}/disapprove`, {
      disapproved_by: disapprovedBy,
      reason,
    });
  }

  async getLiquidationStatistics(): Promise<any> {
    return await apiClient.get('/liquidations/statistics');
  }
}

// Export singleton instance
export const financeService = new FinanceService();
export default financeService;

import apiClient, { PaginatedResponse } from '../client';

// Types
export interface BudgetAllocation {
  id: number;
  budget_code?: string;
  budget_name?: string;
  fund_source?: string;
  source: string; // Alias for fund_source for backward compatibility
  fiscal_year?: number;
  fiscalYear: string; // Alias for fiscal_year for backward compatibility
  allocated_amount?: number;
  allocated: number; // Alias for allocated_amount
  utilized_amount?: number;
  spent: number; // Alias for utilized_amount
  remaining_balance?: number;
  remaining: number; // Alias for remaining_balance
  utilizationRate: number; // Calculated field
  status?: 'Active' | 'Inactive' | 'Closed';
  classification?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBudgetAllocationData {
  fund_source: string;
  allocated_amount: number;
  fiscal_year: number;
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
  // ========== BUDGETS ==========

  async getBudgets(): Promise<BudgetAllocation[]> {
    return await apiClient.get<BudgetAllocation[]>('/budgets');
  }

  async getBudgetUtilization(): Promise<any> {
    return await apiClient.get('/budgets/utilization');
  }

  async getBudgetStatistics(): Promise<any> {
    return await apiClient.get('/budgets/statistics');
  }

  async getBudgetByFiscalYear(year: string): Promise<BudgetAllocation[]> {
    return await apiClient.get<BudgetAllocation[]>(`/budgets/fiscal-year/${year}`);
  }

  // ========== BUDGET ALLOCATIONS ==========

  async getBudgetAllocations(): Promise<BudgetAllocation[]> {
    return await apiClient.get<BudgetAllocation[]>('/budget-allocations');
  }

  async getBudgetAllocation(id: number): Promise<BudgetAllocation> {
    return await apiClient.get<BudgetAllocation>(`/budget-allocations/${id}`);
  }

  async createBudgetAllocation(data: CreateBudgetAllocationData): Promise<BudgetAllocation> {
    const response = await apiClient.post<BudgetAllocation>('/budget-allocations', data);
    // Transform backend response to match our interface
    return this.transformBudgetAllocation(response);
  }

  // Helper method to transform backend response to frontend format
  private transformBudgetAllocation(budget: any): BudgetAllocation {
    return {
      id: budget.id,
      budget_code: budget.budget_code,
      budget_name: budget.budget_name,
      fund_source: budget.fund_source,
      source: budget.fund_source || budget.source,
      fiscal_year: budget.fiscal_year,
      fiscalYear: budget.fiscal_year?.toString() || budget.fiscalYear,
      allocated_amount: parseFloat(budget.allocated_amount || budget.allocated || 0),
      allocated: parseFloat(budget.allocated_amount || budget.allocated || 0),
      utilized_amount: parseFloat(budget.utilized_amount || budget.spent || 0),
      spent: parseFloat(budget.utilized_amount || budget.spent || 0),
      remaining_balance: parseFloat(budget.remaining_balance || budget.remaining || 0),
      remaining: parseFloat(budget.remaining_balance || budget.remaining || 0),
      utilizationRate: budget.allocated_amount > 0
        ? Math.round((parseFloat(budget.utilized_amount || 0) / parseFloat(budget.allocated_amount)) * 100)
        : 0,
      status: budget.status,
      classification: budget.classification,
      start_date: budget.start_date,
      end_date: budget.end_date,
      created_at: budget.created_at,
      updated_at: budget.updated_at,
    };
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

import { create } from "zustand";
import { Employee, LeaveRequest } from "@/lib/data/personnel";
import { InventoryItem, IssuanceRecord } from "@/lib/data/inventory";
import { Expense, BudgetAllocation } from "@/lib/data/finance";

interface AppState {
  // Personnel State
  employees: Employee[];
  leaveRequests: LeaveRequest[];

  // Inventory State
  inventoryItems: InventoryItem[];
  issuanceRecords: IssuanceRecord[];

  // Finance State
  expenses: Expense[];
  budgetAllocations: BudgetAllocation[];

  // Actions - Personnel
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveRequest: (id: string, request: Partial<LeaveRequest>) => void;
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;

  // Actions - Inventory
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  addIssuanceRecord: (record: IssuanceRecord) => void;
  updateIssuanceRecord: (id: string, record: Partial<IssuanceRecord>) => void;

  // Actions - Finance
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  updateBudgetAllocation: (id: string, allocation: Partial<BudgetAllocation>) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial State
  employees: [],
  leaveRequests: [],
  inventoryItems: [],
  issuanceRecords: [],
  expenses: [],
  budgetAllocations: [],

  // Personnel Actions
  addEmployee: (employee) =>
    set((state) => ({ employees: [...state.employees, employee] })),

  updateEmployee: (id, updatedEmployee) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, ...updatedEmployee } : emp
      ),
    })),

  deleteEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
    })),

  addLeaveRequest: (request) =>
    set((state) => ({ leaveRequests: [...state.leaveRequests, request] })),

  updateLeaveRequest: (id, updatedRequest) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((req) =>
        req.id === id ? { ...req, ...updatedRequest } : req
      ),
    })),

  approveLeaveRequest: (id) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((req) =>
        req.id === id ? { ...req, status: "Approved" } : req
      ),
    })),

  rejectLeaveRequest: (id) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((req) =>
        req.id === id ? { ...req, status: "Rejected" } : req
      ),
    })),

  // Inventory Actions
  addInventoryItem: (item) =>
    set((state) => ({ inventoryItems: [...state.inventoryItems, item] })),

  updateInventoryItem: (id, updatedItem) =>
    set((state) => ({
      inventoryItems: state.inventoryItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    })),

  deleteInventoryItem: (id) =>
    set((state) => ({
      inventoryItems: state.inventoryItems.filter((item) => item.id !== id),
    })),

  addIssuanceRecord: (record) =>
    set((state) => ({
      issuanceRecords: [...state.issuanceRecords, record],
    })),

  updateIssuanceRecord: (id, updatedRecord) =>
    set((state) => ({
      issuanceRecords: state.issuanceRecords.map((rec) =>
        rec.id === id ? { ...rec, ...updatedRecord } : rec
      ),
    })),

  // Finance Actions
  addExpense: (expense) =>
    set((state) => ({ expenses: [...state.expenses, expense] })),

  updateExpense: (id, updatedExpense) =>
    set((state) => ({
      expenses: state.expenses.map((exp) =>
        exp.id === id ? { ...exp, ...updatedExpense } : exp
      ),
    })),

  deleteExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((exp) => exp.id !== id),
    })),

  updateBudgetAllocation: (id, updatedAllocation) =>
    set((state) => ({
      budgetAllocations: state.budgetAllocations.map((alloc) =>
        alloc.id === id ? { ...alloc, ...updatedAllocation } : alloc
      ),
    })),
}));

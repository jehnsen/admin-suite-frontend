export interface Expense {
  id: string;
  date: string;
  payee: string;
  particulars: string;
  amount: number;
  source: "MOOE" | "Canteen Fund" | "SEF" | "Other";
  category: string;
  status: "Paid" | "Pending" | "Cancelled";
  receiptNumber?: string;
}

export interface BudgetAllocation {
  id: string;
  source: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilizationRate: number;
}

export const expenses: Expense[] = [
  {
    id: "EXP-2025-001",
    date: "2025-12-05",
    payee: "ABC Office Supplies",
    particulars: "Purchase of bond paper and office supplies",
    amount: 8500,
    source: "MOOE",
    category: "Office Supplies",
    status: "Paid",
    receiptNumber: "OR-2025-1234",
  },
  {
    id: "EXP-2025-002",
    date: "2025-12-03",
    payee: "XYZ Printing Services",
    particulars: "Printing of learning modules and worksheets",
    amount: 15000,
    source: "MOOE",
    category: "Instructional Materials",
    status: "Paid",
    receiptNumber: "OR-2025-1567",
  },
  {
    id: "EXP-2025-003",
    date: "2025-12-01",
    payee: "Tech Solutions Inc.",
    particulars: "Computer repair and maintenance services",
    amount: 12000,
    source: "MOOE",
    category: "Maintenance",
    status: "Paid",
    receiptNumber: "OR-2025-1890",
  },
  {
    id: "EXP-2025-004",
    date: "2025-11-28",
    payee: "Manila Water Company",
    particulars: "Water bill for November 2025",
    amount: 3500,
    source: "MOOE",
    category: "Utilities",
    status: "Paid",
    receiptNumber: "OR-2025-2001",
  },
  {
    id: "EXP-2025-005",
    date: "2025-11-28",
    payee: "Meralco",
    particulars: "Electricity bill for November 2025",
    amount: 18500,
    source: "MOOE",
    category: "Utilities",
    status: "Paid",
    receiptNumber: "OR-2025-2002",
  },
  {
    id: "EXP-2025-006",
    date: "2025-11-25",
    payee: "School Canteen Operator",
    particulars: "Food supplies for canteen operations",
    amount: 25000,
    source: "Canteen Fund",
    category: "Food Supplies",
    status: "Paid",
    receiptNumber: "OR-2025-2100",
  },
  {
    id: "EXP-2025-007",
    date: "2025-12-08",
    payee: "Green Janitorial Services",
    particulars: "Cleaning supplies and materials",
    amount: 5000,
    source: "MOOE",
    category: "Maintenance",
    status: "Pending",
  },
];

export const budgetAllocations: BudgetAllocation[] = [
  {
    id: "1",
    source: "MOOE",
    allocated: 500000,
    spent: 425000,
    remaining: 75000,
    utilizationRate: 85,
  },
  {
    id: "2",
    source: "Canteen Fund",
    allocated: 150000,
    spent: 98000,
    remaining: 52000,
    utilizationRate: 65.3,
  },
  {
    id: "3",
    source: "SEF",
    allocated: 300000,
    spent: 185000,
    remaining: 115000,
    utilizationRate: 61.7,
  },
];

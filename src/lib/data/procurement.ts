export interface PurchaseRequest {
  id: string;
  prNumber: string;
  requestedBy: string;
  department: string;
  purpose: string;
  dateRequested: string;
  status: "Draft" | "Pending" | "Approved" | "Rejected";
  items: PurchaseRequestItem[];
  totalAmount: number;
  approvedBy?: string;
  approvedDate?: string;
}

export interface PurchaseRequestItem {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitCost: number;
  estimatedTotalCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  prId: string;
  supplier: string;
  supplierContact: string;
  dateIssued: string;
  deliveryDate: string;
  status: "Pending" | "Confirmed" | "Partially Delivered" | "Delivered" | "Cancelled";
  items: PurchaseOrderItem[];
  totalAmount: number;
  paymentTerms: string;
  deliveryAddress: string;
}

export interface PurchaseOrderItem {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  deliveredQuantity: number;
}

export const purchaseRequests: PurchaseRequest[] = [
  {
    id: "1",
    prNumber: "PR-2025-001",
    requestedBy: "Maria Santos",
    department: "Mathematics Department",
    purpose: "Instructional materials for Q2 lessons",
    dateRequested: "2025-12-01",
    status: "Approved",
    totalAmount: 15000,
    approvedBy: "Juan Dela Cruz",
    approvedDate: "2025-12-02",
    items: [
      {
        id: "1",
        itemName: "Graphing Paper",
        description: "A4 size, 100 sheets per pack",
        quantity: 50,
        unit: "Pack",
        estimatedUnitCost: 150,
        estimatedTotalCost: 7500,
      },
      {
        id: "2",
        itemName: "Scientific Calculator",
        description: "Casio FX-991ES Plus",
        quantity: 10,
        unit: "Unit",
        estimatedUnitCost: 750,
        estimatedTotalCost: 7500,
      },
    ],
  },
  {
    id: "2",
    prNumber: "PR-2025-002",
    requestedBy: "Juan Reyes",
    department: "Science Department",
    purpose: "Laboratory supplies and consumables",
    dateRequested: "2025-12-03",
    status: "Pending",
    totalAmount: 22000,
    items: [
      {
        id: "3",
        itemName: "Test Tubes",
        description: "Glass test tubes, 15ml capacity",
        quantity: 100,
        unit: "Piece",
        estimatedUnitCost: 20,
        estimatedTotalCost: 2000,
      },
      {
        id: "4",
        itemName: "Laboratory Goggles",
        description: "Safety goggles with adjustable strap",
        quantity: 40,
        unit: "Piece",
        estimatedUnitCost: 250,
        estimatedTotalCost: 10000,
      },
      {
        id: "5",
        itemName: "Microscope Slides",
        description: "Glass slides, 75x25mm",
        quantity: 200,
        unit: "Piece",
        estimatedUnitCost: 50,
        estimatedTotalCost: 10000,
      },
    ],
  },
  {
    id: "3",
    prNumber: "PR-2025-003",
    requestedBy: "Roberto Villanueva",
    department: "Administrative Office",
    purpose: "Office supplies replenishment",
    dateRequested: "2025-12-05",
    status: "Approved",
    totalAmount: 8500,
    approvedBy: "Juan Dela Cruz",
    approvedDate: "2025-12-06",
    items: [
      {
        id: "6",
        itemName: "Bond Paper",
        description: "A4 size, 80gsm, 500 sheets per ream",
        quantity: 20,
        unit: "Ream",
        estimatedUnitCost: 185,
        estimatedTotalCost: 3700,
      },
      {
        id: "7",
        itemName: "Ballpoint Pens",
        description: "Blue ink, box of 50",
        quantity: 10,
        unit: "Box",
        estimatedUnitCost: 250,
        estimatedTotalCost: 2500,
      },
      {
        id: "8",
        itemName: "Stapler",
        description: "Heavy duty stapler",
        quantity: 5,
        unit: "Unit",
        estimatedUnitCost: 460,
        estimatedTotalCost: 2300,
      },
    ],
  },
  {
    id: "4",
    prNumber: "PR-2025-004",
    requestedBy: "Elena Torres",
    department: "ICT Department",
    purpose: "Computer equipment upgrade",
    dateRequested: "2025-12-07",
    status: "Draft",
    totalAmount: 45000,
    items: [
      {
        id: "9",
        itemName: "Wireless Mouse",
        description: "Logitech wireless mouse",
        quantity: 15,
        unit: "Unit",
        estimatedUnitCost: 500,
        estimatedTotalCost: 7500,
      },
      {
        id: "10",
        itemName: "USB Flash Drive",
        description: "64GB USB 3.0",
        quantity: 25,
        unit: "Unit",
        estimatedUnitCost: 400,
        estimatedTotalCost: 10000,
      },
      {
        id: "11",
        itemName: "HDMI Cable",
        description: "2-meter HDMI cable",
        quantity: 10,
        unit: "Unit",
        estimatedUnitCost: 250,
        estimatedTotalCost: 2500,
      },
      {
        id: "12",
        itemName: "Laptop Cooling Pad",
        description: "Adjustable cooling pad with fan",
        quantity: 10,
        unit: "Unit",
        estimatedUnitCost: 2500,
        estimatedTotalCost: 25000,
      },
    ],
  },
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-2025-001",
    prId: "1",
    supplier: "ABC Office Supplies",
    supplierContact: "+63 912 345 6789",
    dateIssued: "2025-12-03",
    deliveryDate: "2025-12-10",
    status: "Confirmed",
    totalAmount: 15000,
    paymentTerms: "Cash on Delivery",
    deliveryAddress: "Sample Elementary School, Main Campus",
    items: [
      {
        id: "1",
        itemName: "Graphing Paper",
        description: "A4 size, 100 sheets per pack",
        quantity: 50,
        unit: "Pack",
        unitCost: 150,
        totalCost: 7500,
        deliveredQuantity: 0,
      },
      {
        id: "2",
        itemName: "Scientific Calculator",
        description: "Casio FX-991ES Plus",
        quantity: 10,
        unit: "Unit",
        unitCost: 750,
        totalCost: 7500,
        deliveredQuantity: 0,
      },
    ],
  },
  {
    id: "2",
    poNumber: "PO-2025-002",
    prId: "3",
    supplier: "XYZ Trading Company",
    supplierContact: "+63 917 234 5678",
    dateIssued: "2025-12-07",
    deliveryDate: "2025-12-14",
    status: "Pending",
    totalAmount: 8500,
    paymentTerms: "Net 30 days",
    deliveryAddress: "Sample Elementary School, Main Campus",
    items: [
      {
        id: "6",
        itemName: "Bond Paper",
        description: "A4 size, 80gsm, 500 sheets per ream",
        quantity: 20,
        unit: "Ream",
        unitCost: 185,
        totalCost: 3700,
        deliveredQuantity: 0,
      },
      {
        id: "7",
        itemName: "Ballpoint Pens",
        description: "Blue ink, box of 50",
        quantity: 10,
        unit: "Box",
        unitCost: 250,
        totalCost: 2500,
        deliveredQuantity: 0,
      },
      {
        id: "8",
        itemName: "Stapler",
        description: "Heavy duty stapler",
        quantity: 5,
        unit: "Unit",
        unitCost: 460,
        totalCost: 2300,
        deliveredQuantity: 0,
      },
    ],
  },
];

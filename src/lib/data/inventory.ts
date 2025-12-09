export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: "Equipment" | "Consumable";
  unit: string;
  quantity: number;
  threshold: number;
  unitCost: number;
  totalValue: number;
  location: string;
  lastUpdated: string;
}

export interface IssuanceRecord {
  id: string;
  itemId: string;
  itemName: string;
  custodian: string;
  department: string;
  quantityIssued: number;
  dateIssued: string;
  status: "Working" | "Defective" | "Returned";
  remarks?: string;
}

export const inventoryItems: InventoryItem[] = [
  {
    id: "1",
    itemCode: "CONS-001",
    name: "Bond Paper (A4)",
    category: "Consumable",
    unit: "Ream",
    quantity: 2,
    threshold: 10,
    unitCost: 185,
    totalValue: 370,
    location: "Supply Room",
    lastUpdated: "2025-12-08",
  },
  {
    id: "2",
    itemCode: "EQUIP-012",
    name: "Laptop Computer",
    category: "Equipment",
    unit: "Unit",
    quantity: 15,
    threshold: 5,
    unitCost: 35000,
    totalValue: 525000,
    location: "ICT Office",
    lastUpdated: "2025-12-05",
  },
  {
    id: "3",
    itemCode: "CONS-023",
    name: "Whiteboard Markers",
    category: "Consumable",
    unit: "Box",
    quantity: 25,
    threshold: 15,
    unitCost: 120,
    totalValue: 3000,
    location: "Supply Room",
    lastUpdated: "2025-12-07",
  },
  {
    id: "4",
    itemCode: "EQUIP-034",
    name: "Projector",
    category: "Equipment",
    unit: "Unit",
    quantity: 8,
    threshold: 3,
    unitCost: 18000,
    totalValue: 144000,
    location: "AV Room",
    lastUpdated: "2025-12-01",
  },
  {
    id: "5",
    itemCode: "CONS-045",
    name: "Chalk (White)",
    category: "Consumable",
    unit: "Box",
    quantity: 3,
    threshold: 20,
    unitCost: 45,
    totalValue: 135,
    location: "Supply Room",
    lastUpdated: "2025-12-09",
  },
  {
    id: "6",
    itemCode: "EQUIP-056",
    name: "Teacher's Table",
    category: "Equipment",
    unit: "Unit",
    quantity: 35,
    threshold: 5,
    unitCost: 3500,
    totalValue: 122500,
    location: "Various Classrooms",
    lastUpdated: "2025-11-28",
  },
  {
    id: "7",
    itemCode: "CONS-067",
    name: "Ballpen (Blue)",
    category: "Consumable",
    unit: "Box",
    quantity: 18,
    threshold: 10,
    unitCost: 65,
    totalValue: 1170,
    location: "Supply Room",
    lastUpdated: "2025-12-06",
  },
];

export const issuanceRecords: IssuanceRecord[] = [
  {
    id: "ISS-2025-001",
    itemId: "2",
    itemName: "Laptop Computer",
    custodian: "Maria Santos",
    department: "Mathematics Department",
    quantityIssued: 1,
    dateIssued: "2025-09-01",
    status: "Working",
    remarks: "For classroom instruction",
  },
  {
    id: "ISS-2025-002",
    itemId: "4",
    itemName: "Projector",
    custodian: "Juan Reyes",
    department: "Science Department",
    quantityIssued: 1,
    dateIssued: "2025-09-05",
    status: "Working",
  },
  {
    id: "ISS-2025-003",
    itemId: "2",
    itemName: "Laptop Computer",
    custodian: "Roberto Villanueva",
    department: "Filipino Department",
    quantityIssued: 1,
    dateIssued: "2025-08-25",
    status: "Defective",
    remarks: "Screen malfunction reported",
  },
  {
    id: "ISS-2025-004",
    itemId: "4",
    itemName: "Projector",
    custodian: "Carlos Ramos",
    department: "Physical Education Department",
    quantityIssued: 1,
    dateIssued: "2025-10-12",
    status: "Working",
  },
];

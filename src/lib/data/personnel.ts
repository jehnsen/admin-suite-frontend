export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  position: string;
  department: string;
  status: "Regular" | "Substitute" | "Contract";
  dateHired: string;
  email: string;
  phone: string;
  leaveCredits: {
    vacation: number;
    sick: number;
    special: number;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: "Vacation" | "Sick" | "Maternity" | "Paternity" | "Special";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedDate: string;
}

export const employees: Employee[] = [
  {
    id: "1",
    employeeNumber: "EMP-2020-001",
    firstName: "Maria",
    lastName: "Santos",
    middleName: "Cruz",
    position: "Teacher III",
    department: "Mathematics Department",
    status: "Regular",
    dateHired: "2020-06-15",
    email: "maria.santos@deped.gov.ph",
    phone: "+63 912 345 6789",
    leaveCredits: {
      vacation: 12.5,
      sick: 10,
      special: 3,
    },
  },
  {
    id: "2",
    employeeNumber: "EMP-2019-045",
    firstName: "Juan",
    lastName: "Reyes",
    middleName: "Garcia",
    position: "Teacher II",
    department: "Science Department",
    status: "Regular",
    dateHired: "2019-08-20",
    email: "juan.reyes@deped.gov.ph",
    phone: "+63 917 234 5678",
    leaveCredits: {
      vacation: 15,
      sick: 12,
      special: 5,
    },
  },
  {
    id: "3",
    employeeNumber: "EMP-2021-023",
    firstName: "Ana",
    lastName: "Mendoza",
    position: "Teacher I",
    department: "English Department",
    status: "Substitute",
    dateHired: "2021-09-01",
    email: "ana.mendoza@deped.gov.ph",
    phone: "+63 918 345 6789",
    leaveCredits: {
      vacation: 8,
      sick: 7,
      special: 2,
    },
  },
  {
    id: "4",
    employeeNumber: "EMP-2018-012",
    firstName: "Roberto",
    lastName: "Villanueva",
    middleName: "Lopez",
    position: "Head Teacher VI",
    department: "Filipino Department",
    status: "Regular",
    dateHired: "2018-06-11",
    email: "roberto.villanueva@deped.gov.ph",
    phone: "+63 919 456 7890",
    leaveCredits: {
      vacation: 18,
      sick: 15,
      special: 7,
    },
  },
  {
    id: "5",
    employeeNumber: "EMP-2022-034",
    firstName: "Elena",
    lastName: "Torres",
    position: "Teacher I",
    department: "Social Studies Department",
    status: "Contract",
    dateHired: "2022-08-15",
    email: "elena.torres@deped.gov.ph",
    phone: "+63 920 567 8901",
    leaveCredits: {
      vacation: 5,
      sick: 5,
      special: 0,
    },
  },
  {
    id: "6",
    employeeNumber: "EMP-2017-008",
    firstName: "Carlos",
    lastName: "Ramos",
    middleName: "Santos",
    position: "Master Teacher I",
    department: "Physical Education Department",
    status: "Regular",
    dateHired: "2017-06-05",
    email: "carlos.ramos@deped.gov.ph",
    phone: "+63 921 678 9012",
    leaveCredits: {
      vacation: 20,
      sick: 18,
      special: 8,
    },
  },
  {
    id: "7",
    employeeNumber: "EMP-2021-056",
    firstName: "Isabel",
    lastName: "Cruz",
    position: "Teacher II",
    department: "Arts Department",
    status: "Regular",
    dateHired: "2021-06-14",
    email: "isabel.cruz@deped.gov.ph",
    phone: "+63 922 789 0123",
    leaveCredits: {
      vacation: 10,
      sick: 9,
      special: 3,
    },
  },
  {
    id: "8",
    employeeNumber: "EMP-2020-067",
    firstName: "Miguel",
    lastName: "Bautista",
    middleName: "Rivera",
    position: "Teacher III",
    department: "ICT Department",
    status: "Regular",
    dateHired: "2020-08-17",
    email: "miguel.bautista@deped.gov.ph",
    phone: "+63 923 890 1234",
    leaveCredits: {
      vacation: 13,
      sick: 11,
      special: 4,
    },
  },
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: "LR-2025-001",
    employeeId: "1",
    employeeName: "Maria Santos",
    leaveType: "Vacation",
    startDate: "2025-12-20",
    endDate: "2025-12-27",
    days: 5,
    reason: "Family vacation during Christmas break",
    status: "Pending",
    submittedDate: "2025-12-01",
  },
  {
    id: "LR-2025-002",
    employeeId: "3",
    employeeName: "Ana Mendoza",
    leaveType: "Sick",
    startDate: "2025-12-10",
    endDate: "2025-12-11",
    days: 2,
    reason: "Medical consultation and recovery",
    status: "Pending",
    submittedDate: "2025-12-08",
  },
  {
    id: "LR-2025-003",
    employeeId: "2",
    employeeName: "Juan Reyes",
    leaveType: "Special",
    startDate: "2025-11-15",
    endDate: "2025-11-15",
    days: 1,
    reason: "Personal matter requiring immediate attention",
    status: "Approved",
    submittedDate: "2025-11-10",
  },
];

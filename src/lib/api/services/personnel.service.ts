import apiClient, { PaginatedResponse } from '../client';

// API Types (matching backend response)
export interface Employee {
  id: number;
  employee_number: string;
  plantilla_item_no?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  suffix?: string;
  full_name: string; // Computed by backend
  date_of_birth: string;
  gender: string;
  civil_status: string;
  address: string;
  city?: string;
  province?: string;
  zip_code?: string;
  mobile_number: string;
  email: string;
  position: string;
  position_title?: string;
  employment_status: string;
  date_hired: string;
  date_separated?: string | null;
  department: string;
  salary_grade: number;
  step_increment: number;
  monthly_salary: number;
  // Filipino IDs
  tin?: string;
  gsis_number?: string;
  philhealth_number?: string;
  pagibig_number?: string;
  sss_number?: string;
  // Leave credits
  vacation_leave_credits: number;
  sick_leave_credits: number;
  special_leave_credits?: number;
  // Status
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  working_days: number;
  reason: string;
  status: string;
  recommended_by?: number;
  recommended_by_name?: string;
  recommended_date?: string;
  approved_by?: number;
  approved_by_name?: string;
  approved_date?: string;
  disapproved_by?: number;
  disapproved_by_name?: string;
  disapproved_date?: string;
  disapproval_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceRecord {
  id: number;
  employee_id: number;
  position: string;
  department: string;
  salary_grade: number;
  step_increment: number;
  monthly_salary: number;
  from_date: string;
  to_date?: string;
  record_type: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  designation: string;
  station_place_of_assignment: string;
  date_from: string;
  date_to?: string;
}

// API Query Parameters
export interface EmployeeFilters {
  status?: string;
  position?: string;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface LeaveRequestFilters {
  status?: string;
  leave_type?: string;
  employee_id?: number;
  per_page?: number;
  page?: number;
}

// Statistics Types
export interface EmployeeStatistics {
  total_employees: number;
  active_employees: number;
  inactive_employees: number;
  by_position: Record<string, number>;
  by_employment_status: Record<string, number>;
}

export interface LeaveStatistics {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  disapproved_requests: number;
  by_leave_type: Record<string, number>;
}

// Create/Update Data
export interface CreateEmployeeData {
  employee_number: string;
  plantilla_item_no?: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  suffix?: string;
  date_of_birth: string;
  gender: string;
  civil_status: string;
  address: string;
  city?: string;
  province?: string;
  zip_code?: string;
  mobile_number: string;
  email: string;
  position: string;
  position_title?: string;
  employment_status: string;
  date_hired: string;
  date_separated?: string | null;
  department: string;
  salary_grade: number;
  step_increment: number;
  monthly_salary: number;
  // Filipino IDs
  tin?: string;
  gsis_number?: string;
  philhealth_number?: string;
  pagibig_number?: string;
  sss_number?: string;
  // Leave credits
  vacation_leave_credits?: number;
  sick_leave_credits?: number;
  // Status
  status?: string;
}

export interface CreateLeaveRequestData {
  employee_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  // For sick leave
  illness?: string;
  hospital_name?: string;
}

export interface PromoteEmployeeData {
  new_position: string;
  new_salary_grade: number;
  new_step_increment: number;
  new_monthly_salary: number;
  effective_date: string;
  remarks?: string;
}

class PersonnelService {
  // ========== EMPLOYEES ==========

  /**
   * Get all employees with filters
   */
  async getEmployees(filters?: EmployeeFilters): Promise<PaginatedResponse<Employee>> {
    // Laravel pagination returns the paginated response directly, not wrapped in ApiResponse
    // So we use getRaw() which returns response.data (the Laravel pagination object)
    const response = await apiClient.getRaw('/employees', {
      params: filters,
    });
    // Cast to PaginatedResponse since Laravel doesn't wrap in {message, data}
    return response as unknown as PaginatedResponse<Employee>;
  }

  /**
   * Get employee by ID
   */
  async getEmployee(id: number): Promise<Employee> {
    return await apiClient.get<Employee>(`/employees/${id}`);
  }

  /**
   * Create new employee
   */
  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    return await apiClient.post<Employee>('/employees', data);
  }

  /**
   * Update employee
   */
  async updateEmployee(id: number, data: Partial<CreateEmployeeData>): Promise<Employee> {
    return await apiClient.put<Employee>(`/employees/${id}`, data);
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: number): Promise<void> {
    await apiClient.delete(`/employees/${id}`);
  }

  /**
   * Promote employee (creates new service record)
   */
  async promoteEmployee(id: number, data: PromoteEmployeeData): Promise<Employee> {
    return await apiClient.post<Employee>(`/employees/${id}/promote`, data);
  }

  /**
   * Search employees
   */
  async searchEmployees(query: string): Promise<Employee[]> {
    return await apiClient.get<Employee[]>('/employees/search', {
      params: { query },
    });
  }

  /**
   * Get employee statistics
   */
  async getEmployeeStatistics(): Promise<EmployeeStatistics> {
    return await apiClient.get<EmployeeStatistics>('/employees/statistics');
  }

  // ========== LEAVE REQUESTS ==========

  /**
   * Get all leave requests with filters
   */
  async getLeaveRequests(filters?: LeaveRequestFilters): Promise<PaginatedResponse<LeaveRequest>> {
    // Laravel pagination returns the paginated response directly, not wrapped in ApiResponse
    const response = await apiClient.getRaw('/leave-requests', {
      params: filters,
    });
    return response as unknown as PaginatedResponse<LeaveRequest>;
  }

  /**
   * Get leave request by ID
   */
  async getLeaveRequest(id: number): Promise<LeaveRequest> {
    return await apiClient.get<LeaveRequest>(`/leave-requests/${id}`);
  }

  /**
   * Get leave requests by employee ID
   */
  async getLeaveRequestsByEmployee(employeeId: number): Promise<LeaveRequest[]> {
    return await apiClient.get<LeaveRequest[]>(`/leave-requests/${employeeId}`);
  }

  /**
   * Create new leave request
   */
  async createLeaveRequest(data: CreateLeaveRequestData): Promise<LeaveRequest> {
    return await apiClient.post<LeaveRequest>('/leave-requests', data);
  }

  /**
   * Recommend leave request
   */
  async recommendLeaveRequest(id: number, recommendedBy: number, remarks?: string): Promise<LeaveRequest> {
    return await apiClient.post<LeaveRequest>(`/leave-requests/${id}/recommend`, {
      recommended_by: recommendedBy,
      remarks,
    });
  }

  /**
   * Approve leave request (auto-deducts leave credits)
   */
  async approveLeaveRequest(id: number, approvedBy: number, remarks?: string): Promise<LeaveRequest> {
    return await apiClient.post<LeaveRequest>(`/leave-requests/${id}/approve`, {
      approved_by: approvedBy,
      remarks,
    });
  }

  /**
   * Disapprove leave request
   */
  async disapproveLeaveRequest(id: number, disapprovedBy: number, reason: string): Promise<LeaveRequest> {
    return await apiClient.post<LeaveRequest>(`/leave-requests/${id}/disapprove`, {
      disapproved_by: disapprovedBy,
      reason,
    });
  }

  /**
   * Cancel leave request (auto-restores leave credits if already approved)
   */
  async cancelLeaveRequest(id: number, reason: string): Promise<LeaveRequest> {
    return await apiClient.post<LeaveRequest>(`/leave-requests/${id}/cancel`, {
      reason,
    });
  }

  /**
   * Get pending leave requests
   */
  async getPendingLeaveRequests(): Promise<LeaveRequest[]> {
    return await apiClient.get<LeaveRequest[]>('/leave-requests/pending');
  }

  /**
   * Get leave request statistics
   */
  async getLeaveStatistics(): Promise<LeaveStatistics> {
    return await apiClient.get<LeaveStatistics>('/leave-requests/statistics');
  }

  // ========== SERVICE RECORDS ==========

  /**
   * Get service records by employee ID (201 File)
   */
  async getServiceRecordsByEmployee(employeeId: number): Promise<ServiceRecord[]> {
    return await apiClient.get<ServiceRecord[]>(`/service-records/employee/${employeeId}`);
  }

  /**
   * Get service record by ID
   */
  async getServiceRecord(id: number): Promise<ServiceRecord> {
    return await apiClient.get<ServiceRecord>(`/service-records/${id}`);
  }

  /**
   * Create new service record
   */
  async createServiceRecord(data: Partial<ServiceRecord>): Promise<ServiceRecord> {
    return await apiClient.post<ServiceRecord>('/service-records', data);
  }

  /**
   * Update service record
   */
  async updateServiceRecord(id: number, data: Partial<ServiceRecord>): Promise<ServiceRecord> {
    return await apiClient.put<ServiceRecord>(`/service-records/${id}`, data);
  }

  /**
   * Delete service record
   */
  async deleteServiceRecord(id: number): Promise<void> {
    await apiClient.delete(`/service-records/${id}`);
  }
}

// Export singleton instance
export const personnelService = new PersonnelService();
export default personnelService;

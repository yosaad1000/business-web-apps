export enum HRMSEmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TERMINATED = 'TERMINATED',
  ON_LEAVE = 'ON_LEAVE'
}

export interface HRMSEmployee {
  id?: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  departmentId: number;
  departmentName?: string;
  position: string;
  startDate: string;
  endDate?: string;
  status: HRMSEmployeeStatus;
  salary?: number;
  managerId?: number;
  managerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HRMSDepartment {
  id?: number;
  name: string;
  description?: string;
  managerId?: number;
  managerName?: string;
  budget?: number;
  employeeCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeSearchParams {
  searchTerm?: string;
  departmentId?: number;
  status?: HRMSEmployeeStatus;
  managerId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface HRMSPaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// Aliases for backward compatibility
export type Employee = HRMSEmployee;
export type Department = HRMSDepartment;
export type EmployeeStatus = HRMSEmployeeStatus;
export type PaginatedResponse<T> = HRMSPaginatedResponse<T>;
export const EmployeeStatus = HRMSEmployeeStatus;
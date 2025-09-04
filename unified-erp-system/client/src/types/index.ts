// Core types for the unified ERP system

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  department?: Department;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
}

export interface Employee extends User {
  employeeId: string;
  position: string;
  department: Department;
  manager?: Employee;
  startDate: string;
  status: EmployeeStatus;
  phone?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TERMINATED = 'TERMINATED',
  ON_LEAVE = 'ON_LEAVE'
}

export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  HRMS = 'HRMS',
  INVOICE = 'INVOICE',
  QUIZ = 'QUIZ',
  JOBS = 'JOBS',
  CRUD = 'CRUD'
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  module: ModuleType;
  requiredPermissions: string[];
  children?: NavigationItem[];
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface DashboardPreferences {
  layout: 'grid' | 'list';
  widgets: string[];
  refreshInterval: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  module: ModuleType;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TableColumn {
  id: string;
  label: string;
  sortable: boolean;
  filterable: boolean;
  width?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
}

export interface FilterOption {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}
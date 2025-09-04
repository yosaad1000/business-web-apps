import axios from 'axios';
import { Employee, Department, EmployeeStatus, EmployeeSearchParams, PaginatedResponse } from '../types/employee';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee API calls
export const employeeService = {
  // Get all employees
  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await api.get('/api/employees');
    return response.data;
  },

  // Get employees with pagination
  getEmployeesWithPagination: async (params: EmployeeSearchParams): Promise<PaginatedResponse<Employee>> => {
    const response = await api.get('/api/employees/paginated', { params });
    return response.data;
  },

  // Get employee by ID
  getEmployeeById: async (id: number): Promise<Employee> => {
    const response = await api.get(`/api/employees/${id}`);
    return response.data;
  },

  // Get employee by employee ID
  getEmployeeByEmployeeId: async (employeeId: string): Promise<Employee> => {
    const response = await api.get(`/api/employees/employee-id/${employeeId}`);
    return response.data;
  },

  // Create new employee
  createEmployee: async (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    const response = await api.post('/api/employees', employee);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id: number, employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    const response = await api.put(`/api/employees/${id}`, employee);
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id: number): Promise<void> => {
    await api.delete(`/api/employees/${id}`);
  },

  // Get employees by department
  getEmployeesByDepartment: async (departmentId: number): Promise<Employee[]> => {
    const response = await api.get(`/api/employees/department/${departmentId}`);
    return response.data;
  },

  // Get employees by status
  getEmployeesByStatus: async (status: EmployeeStatus): Promise<Employee[]> => {
    const response = await api.get(`/api/employees/status/${status}`);
    return response.data;
  },

  // Get employees by manager
  getEmployeesByManager: async (managerId: number): Promise<Employee[]> => {
    const response = await api.get(`/api/employees/manager/${managerId}`);
    return response.data;
  },

  // Search employees
  searchEmployees: async (params: EmployeeSearchParams): Promise<PaginatedResponse<Employee>> => {
    const response = await api.get('/api/employees/search', { params });
    return response.data;
  },

  // Update employee status
  updateEmployeeStatus: async (id: number, status: EmployeeStatus): Promise<Employee> => {
    const response = await api.patch(`/api/employees/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  // Get active employee count by department
  getActiveEmployeeCountByDepartment: async (departmentId: number): Promise<number> => {
    const response = await api.get(`/api/employees/department/${departmentId}/count`);
    return response.data;
  },
};

// Department API calls
export const departmentService = {
  // Get all departments
  getAllDepartments: async (): Promise<Department[]> => {
    const response = await api.get('/api/departments');
    return response.data;
  },

  // Get department by ID
  getDepartmentById: async (id: number): Promise<Department> => {
    const response = await api.get(`/api/departments/${id}`);
    return response.data;
  },

  // Get department by name
  getDepartmentByName: async (name: string): Promise<Department> => {
    const response = await api.get(`/api/departments/name/${name}`);
    return response.data;
  },

  // Create new department
  createDepartment: async (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'employeeCount'>): Promise<Department> => {
    const response = await api.post('/api/departments', department);
    return response.data;
  },

  // Update department
  updateDepartment: async (id: number, department: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'employeeCount'>): Promise<Department> => {
    const response = await api.put(`/api/departments/${id}`, department);
    return response.data;
  },

  // Delete department
  deleteDepartment: async (id: number): Promise<void> => {
    await api.delete(`/api/departments/${id}`);
  },

  // Get departments by manager
  getDepartmentsByManager: async (managerId: number): Promise<Department[]> => {
    const response = await api.get(`/api/departments/manager/${managerId}`);
    return response.data;
  },

  // Search departments
  searchDepartments: async (searchTerm: string): Promise<Department[]> => {
    const response = await api.get('/api/departments/search', {
      params: { searchTerm }
    });
    return response.data;
  },

  // Update department manager
  updateDepartmentManager: async (id: number, managerId?: number): Promise<Department> => {
    const response = await api.patch(`/api/departments/${id}/manager`, null, {
      params: { managerId }
    });
    return response.data;
  },
};

export default { employeeService, departmentService };
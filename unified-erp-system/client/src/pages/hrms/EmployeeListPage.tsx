import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Employee, EmployeeStatus, Department, PaginatedResponse } from '../../types/employee';
import { employeeService, departmentService } from '../../services/employeeService';
import EmployeeForm from '../../components/hrms/EmployeeForm';

const EmployeeListPage: React.FC = () => {
  const [employees, setEmployees] = useState<PaginatedResponse<Employee>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 0,
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | ''>('');
  const [departmentFilter, setDepartmentFilter] = useState<number | ''>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('lastName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Dialog states
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, [page, rowsPerPage, sortBy, sortDir, searchTerm, statusFilter, departmentFilter]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size: rowsPerPage,
        sortBy,
        sortDir,
        ...(searchTerm && { searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(departmentFilter && { departmentId: departmentFilter }),
      };

      const data = searchTerm 
        ? await employeeService.searchEmployees(params)
        : await employeeService.getEmployeesWithPagination(params);

      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error loading departments:', err);
    }
  };

  const handleSearch = () => {
    setPage(0);
    loadEmployees();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDepartmentFilter('');
    setPage(0);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setOpenForm(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    setOpenForm(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedEmployee?.id) return;

    try {
      await employeeService.deleteEmployee(selectedEmployee.id);
      setOpenDeleteDialog(false);
      setSelectedEmployee(null);
      loadEmployees();
    } catch (err) {
      setError('Failed to delete employee');
      console.error('Error deleting employee:', err);
    }
  };

  const handleFormSubmit = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (isEditing && selectedEmployee?.id) {
        await employeeService.updateEmployee(selectedEmployee.id, employeeData);
      } else {
        await employeeService.createEmployee(employeeData);
      }
      setOpenForm(false);
      setSelectedEmployee(null);
      loadEmployees();
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} employee`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} employee:`, err);
    }
  };

  const getStatusColor = (status: EmployeeStatus) => {
    switch (status) {
      case EmployeeStatus.ACTIVE:
        return 'success';
      case EmployeeStatus.INACTIVE:
        return 'warning';
      case EmployeeStatus.TERMINATED:
        return 'error';
      case EmployeeStatus.ON_LEAVE:
        return 'info';
      default:
        return 'default';
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Search and Filter Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            label="Search employees"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as EmployeeStatus | '')}
            >
              <MenuItem value="">All</MenuItem>
              {Object.values(EmployeeStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentFilter}
              label="Department"
              onChange={(e) => setDepartmentFilter(e.target.value as number | '')}
            >
              <MenuItem value="">All</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>

          <Button
            variant="outlined"
            onClick={handleClearFilters}
          >
            Clear
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadEmployees}
          >
            Refresh
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEmployee}
          >
            Add Employee
          </Button>
        </Box>
      </Paper>

      {/* Employee Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : employees.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              employees.content.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.departmentName}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.status.replace('_', ' ')}
                      color={getStatusColor(employee.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(employee.startDate).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditEmployee(employee)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteEmployee(employee)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={employees.totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Employee Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <DialogContent>
          <EmployeeForm
            employee={selectedEmployee}
            departments={departments}
            onSubmit={handleFormSubmit}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete employee "{selectedEmployee?.firstName} {selectedEmployee?.lastName}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeListPage;
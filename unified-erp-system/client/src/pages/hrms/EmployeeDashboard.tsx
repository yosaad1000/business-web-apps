import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Employee, Department, EmployeeStatus } from '../../types/employee';
import { employeeService, departmentService } from '../../services/employeeService';

interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  activeEmployees: number;
  newEmployeesThisMonth: number;
}

const EmployeeDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalDepartments: 0,
    activeEmployees: 0,
    newEmployeesThisMonth: 0,
  });
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [employeesData, departmentsData, activeEmployeesData] = await Promise.all([
        employeeService.getAllEmployees(),
        departmentService.getAllDepartments(),
        employeeService.getEmployeesByStatus(EmployeeStatus.ACTIVE),
      ]);

      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const newEmployeesThisMonth = employeesData.filter(emp => {
        const startDate = new Date(emp.startDate);
        return startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
      }).length;

      setStats({
        totalEmployees: employeesData.length,
        totalDepartments: departmentsData.length,
        activeEmployees: activeEmployeesData.length,
        newEmployeesThisMonth,
      });

      // Get recent employees (last 10)
      const sortedEmployees = employeesData
        .sort((a, b) => new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime())
        .slice(0, 10);
      
      setRecentEmployees(sortedEmployees);
      setDepartments(departmentsData);

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Employees
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalEmployees}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Departments
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalDepartments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Employees
                  </Typography>
                  <Typography variant="h4">
                    {stats.activeEmployees}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonAddIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    New This Month
                  </Typography>
                  <Typography variant="h4">
                    {stats.newEmployeesThisMonth}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Employees */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Employees
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Start Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
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
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Department Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Department Summary
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {departments.map((department) => (
                <Box
                  key={department.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {department.name}
                    </Typography>
                    {department.managerName && (
                      <Typography variant="caption" color="textSecondary">
                        Manager: {department.managerName}
                      </Typography>
                    )}
                  </Box>
                  <Chip
                    label={`${department.employeeCount || 0} employees`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;
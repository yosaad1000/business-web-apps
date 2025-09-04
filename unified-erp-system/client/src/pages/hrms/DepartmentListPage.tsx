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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { Department } from '../../types/employee';
import { departmentService } from '../../services/employeeService';
import DepartmentForm from '../../components/hrms/DepartmentForm';

const DepartmentListPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (err) {
      setError('Failed to load departments');
      console.error('Error loading departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadDepartments();
      return;
    }

    try {
      setLoading(true);
      const data = await departmentService.searchDepartments
(searchTerm);
      setDepartments(data);
    } catch (err) {
      setError('Failed to search departments');
      console.error('Error searching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    loadDepartments();
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setIsEditing(false);
    setOpenForm(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditing(true);
    setOpenForm(true);
  };

  const handleDeleteDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedDepartment?.id) return;

    try {
      await departmentService.deleteDepartment(selectedDepartment.id);
      setOpenDeleteDialog(false);
      setSelectedDepartment(null);
      loadDepartments();
    } catch (err) {
      setError('Failed to delete department. Make sure there are no employees assigned to this department.');
      console.error('Error deleting department:', err);
    }
  };

  const handleFormSubmit = async (departmentData: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'employeeCount'>) => {
    try {
      if (isEditing && selectedDepartment?.id) {
        await departmentService.updateDepartment(selectedDepartment.id, departmentData);
      } else {
        await departmentService.createDepartment(departmentData);
      }
      setOpenForm(false);
      setSelectedDepartment(null);
      loadDepartments();
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} department`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} department:`, err);
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Department Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Search and Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            label="Search departments"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ minWidth: 200 }}
          />

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>

          <Button
            variant="outlined"
            onClick={handleClearSearch}
          >
            Clear
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadDepartments}
          >
            Refresh
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDepartment}
          >
            Add Department
          </Button>
        </Box>
      </Paper>

      {/* Department Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredDepartments.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No departments found
                </Typography>
              </Paper>
            </Grid>
          ) : (
            filteredDepartments.map((department) => (
              <Grid item xs={12} sm={6} md={4} key={department.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2">
                        {department.name}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleEditDepartment(department)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteDepartment(department)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    {department.description && (
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        {department.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <PeopleIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {department.employeeCount || 0} employees
                      </Typography>
                    </Box>

                    {department.managerName && (
                      <Typography variant="body2" color="textSecondary">
                        Manager: {department.managerName}
                      </Typography>
                    )}

                    {department.budget && (
                      <Typography variant="body2" color="textSecondary">
                        Budget: ${department.budget.toLocaleString()}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Department Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Department' : 'Add New Department'}
        </DialogTitle>
        <DialogContent>
          <DepartmentForm
            department={selectedDepartment}
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
            Are you sure you want to delete department "{selectedDepartment?.name}"?
            This action cannot be undone and will fail if there are employees assigned to this department.
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

export default DepartmentListPage;
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { Department } from '../../types/employee';

interface DepartmentFormProps {
  department?: Department | null;
  onSubmit: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'employeeCount'>) => void;
  onCancel: () => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'employeeCount'>>({
    name: '',
    description: '',
    managerId: undefined,
    budget: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description || '',
        managerId: department.managerId,
        budget: department.budget,
      });
    }
  }, [department]);

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'managerId' || field === 'budget' 
        ? (value === '' ? undefined : Number(value))
        : value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }

    if (formData.budget !== undefined && formData.budget < 0) {
      newErrors.budget = 'Budget cannot be negative';
    }

    if (formData.managerId !== undefined && formData.managerId <= 0) {
      newErrors.managerId = 'Manager ID must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Department Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Manager ID"
            type="number"
            value={formData.managerId || ''}
            onChange={handleChange('managerId')}
            error={!!errors.managerId}
            helperText={errors.managerId || 'Optional: Employee ID of the department manager'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Budget"
            type="number"
            value={formData.budget || ''}
            onChange={handleChange('budget')}
            error={!!errors.budget}
            helperText={errors.budget}
            InputProps={{
              startAdornment: '$',
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onCancel} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {department ? 'Update' : 'Create'} Department
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepartmentForm;
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Switch,
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  FormHelperText,
  Autocomplete,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'switch' | 'date' | 'textarea' | 'autocomplete';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
  options?: { label: string; value: any }[];
  defaultValue?: any;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  rows?: number; // for textarea
  multiple?: boolean; // for select
  freeSolo?: boolean; // for autocomplete
  grid?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  dependsOn?: string; // field id that this field depends on
  showWhen?: (values: Record<string, any>) => boolean;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface FormBuilderProps {
  sections: FormSection[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  readOnly?: boolean;
  showSubmitButton?: boolean;
  showCancelButton?: boolean;
  onChange?: (values: Record<string, any>) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  sections,
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  loading = false,
  readOnly = false,
  showSubmitButton = true,
  showCancelButton = false,
  onChange,
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    onChange?.(values);
  }, [values, onChange]);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { min, max, minLength, maxLength, pattern, custom } = field.validation;

      if (typeof value === 'string') {
        if (minLength && value.length < minLength) {
          return `${field.label} must be at least ${minLength} characters`;
        }
        if (maxLength && value.length > maxLength) {
          return `${field.label} must be no more than ${maxLength} characters`;
        }
        if (pattern && !new RegExp(pattern).test(value)) {
          return `${field.label} format is invalid`;
        }
      }

      if (typeof value === 'number') {
        if (min !== undefined && value < min) {
          return `${field.label} must be at least ${min}`;
        }
        if (max !== undefined && value > max) {
          return `${field.label} must be no more than ${max}`;
        }
      }

      if (custom) {
        const customError = custom(value);
        if (customError) return customError;
      }
    }

    return null;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    const newValues = { ...values, [fieldId]: value };
    setValues(newValues);

    // Validate field
    const field = sections.flatMap(s => s.fields).find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [fieldId]: error || '',
      }));
    }

    setTouched(prev => ({ ...prev, [fieldId]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    const allFields = sections.flatMap(s => s.fields);

    allFields.forEach(field => {
      if (field.showWhen && !field.showWhen(values)) return;
      
      const error = validateField(field, values[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);
    setTouched(
      allFields.reduce((acc, field) => ({ ...acc, [field.id]: true }), {})
    );

    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  const renderField = (field: FormField) => {
    const value = values[field.id] ?? field.defaultValue ?? '';
    const error = touched[field.id] && errors[field.id];
    const isDisabled = readOnly || field.disabled || loading;

    // Check if field should be shown
    if (field.showWhen && !field.showWhen(values)) {
      return null;
    }

    const commonProps = {
      fullWidth: field.fullWidth !== false,
      size: field.size || 'medium' as const,
      disabled: isDisabled,
      error: Boolean(error),
      helperText: error || field.helperText,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <TextField
            key={field.id}
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            {...commonProps}
          />
        );

      case 'textarea':
        return (
          <TextField
            key={field.id}
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            multiline
            rows={field.rows || 4}
            {...commonProps}
          />
        );

      case 'select':
        return (
          <FormControl key={field.id} {...commonProps}>
            <InputLabel required={field.required}>{field.label}</InputLabel>
            <Select
              value={field.multiple ? (value || []) : value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              multiple={field.multiple}
              renderValue={field.multiple ? (selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as any[]).map((val) => (
                    <Chip key={val} label={field.options?.find(opt => opt.value === val)?.label || val} size="small" />
                  ))}
                </Box>
              ) : undefined}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(error || field.helperText) && (
              <FormHelperText error={Boolean(error)}>
                {error || field.helperText}
              </FormHelperText>
            )}
          </FormControl>
        );

      case 'autocomplete':
        return (
          <Autocomplete
            key={field.id}
            options={field.options || []}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
            value={field.options?.find(opt => opt.value === value) || null}
            onChange={(_, newValue) => handleFieldChange(field.id, typeof newValue === 'string' ? newValue : newValue?.value)}
            freeSolo={field.freeSolo}
            renderInput={(params) => (
              <TextField
                {...params}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                {...commonProps}
              />
            )}
          />
        );

      case 'checkbox':
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                disabled={isDisabled}
              />
            }
            label={field.label}
          />
        );

      case 'switch':
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Switch
                checked={Boolean(value)}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                disabled={isDisabled}
              />
            }
            label={field.label}
          />
        );

      case 'radio':
        return (
          <FormControl key={field.id} component="fieldset" {...commonProps}>
            <Typography variant="subtitle2" gutterBottom>
              {field.label} {field.required && '*'}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled={isDisabled} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {(error || field.helperText) && (
              <FormHelperText error={Boolean(error)}>
                {error || field.helperText}
              </FormHelperText>
            )}
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider key={field.id} dateAdapter={AdapterDateFns}>
            <DatePicker
              label={field.label}
              value={value ? new Date(value) : null}
              onChange={(newValue) => handleFieldChange(field.id, newValue?.toISOString())}
              disabled={isDisabled}
              slotProps={{
                textField: {
                  ...commonProps,
                  required: field.required,
                },
              }}
            />
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {sections.map((section, sectionIndex) => (
        <Paper key={section.id} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {section.title}
          </Typography>
          {section.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {section.description}
            </Typography>
          )}
          
          <Grid container spacing={2}>
            {section.fields.map((field) => (
              <Grid
                key={field.id}
                item
                xs={field.grid?.xs || 12}
                sm={field.grid?.sm || 6}
                md={field.grid?.md || 6}
                lg={field.grid?.lg || 4}
                xl={field.grid?.xl || 4}
              >
                {renderField(field)}
              </Grid>
            ))}
          </Grid>
          
          {sectionIndex < sections.length - 1 && <Divider sx={{ mt: 2 }} />}
        </Paper>
      ))}

      {(showSubmitButton || showCancelButton) && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          {showCancelButton && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
          )}
          {showSubmitButton && (
            <Button
              type="submit"
              variant="contained"
              disabled={loading || readOnly}
            >
              {loading ? 'Submitting...' : submitLabel}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FormBuilder;
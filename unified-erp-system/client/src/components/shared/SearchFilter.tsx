import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Button,
  Paper,
  Collapse,
  Typography,
  Grid,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { FilterOption } from '../../types';

export interface FilterField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: { label: string; value: any }[];
  operators?: FilterOperator[];
}

export interface FilterOperator {
  value: string;
  label: string;
  valueRequired?: boolean;
}

const DEFAULT_OPERATORS: Record<string, FilterOperator[]> = {
  text: [
    { value: 'contains', label: 'Contains', valueRequired: true },
    { value: 'equals', label: 'Equals', valueRequired: true },
    { value: 'startsWith', label: 'Starts with', valueRequired: true },
    { value: 'endsWith', label: 'Ends with', valueRequired: true },
    { value: 'isEmpty', label: 'Is empty', valueRequired: false },
    { value: 'isNotEmpty', label: 'Is not empty', valueRequired: false },
  ],
  number: [
    { value: 'equals', label: 'Equals', valueRequired: true },
    { value: 'greaterThan', label: 'Greater than', valueRequired: true },
    { value: 'lessThan', label: 'Less than', valueRequired: true },
    { value: 'greaterThanOrEqual', label: 'Greater than or equal', valueRequired: true },
    { value: 'lessThanOrEqual', label: 'Less than or equal', valueRequired: true },
    { value: 'between', label: 'Between', valueRequired: true },
  ],
  date: [
    { value: 'equals', label: 'On', valueRequired: true },
    { value: 'greaterThan', label: 'After', valueRequired: true },
    { value: 'lessThan', label: 'Before', valueRequired: true },
    { value: 'between', label: 'Between', valueRequired: true },
    { value: 'today', label: 'Today', valueRequired: false },
    { value: 'thisWeek', label: 'This week', valueRequired: false },
    { value: 'thisMonth', label: 'This month', valueRequired: false },
  ],
  select: [
    { value: 'equals', label: 'Is', valueRequired: true },
    { value: 'notEquals', label: 'Is not', valueRequired: true },
    { value: 'in', label: 'Is one of', valueRequired: true },
    { value: 'notIn', label: 'Is not one of', valueRequired: true },
  ],
  boolean: [
    { value: 'equals', label: 'Is', valueRequired: true },
  ],
};

interface SearchFilterProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterFields?: FilterField[];
  filters?: FilterOption[];
  onFiltersChange?: (filters: FilterOption[]) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  expandedByDefault?: boolean;
  maxWidth?: number;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  filterFields = [],
  filters = [],
  onFiltersChange,
  showSearch = true,
  showFilters = true,
  expandedByDefault = false,
  maxWidth,
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [localFilters, setLocalFilters] = useState<FilterOption[]>(filters);
  const [expanded, setExpanded] = useState(expandedByDefault);
  const [newFilter, setNewFilter] = useState<Partial<FilterOption>>({});

  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    onSearchChange?.(value);
  };

  const handleAddFilter = () => {
    if (newFilter.field && newFilter.operator) {
      const filter: FilterOption = {
        field: newFilter.field,
        operator: newFilter.operator as any,
        value: newFilter.value,
      };

      const updatedFilters = [...localFilters, filter];
      setLocalFilters(updatedFilters);
      onFiltersChange?.(updatedFilters);
      setNewFilter({});
    }
  };

  const handleRemoveFilter = (index: number) => {
    const updatedFilters = localFilters.filter((_, i) => i !== index);
    setLocalFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleClearAll = () => {
    setLocalSearchValue('');
    setLocalFilters([]);
    onSearchChange?.('');
    onFiltersChange?.([]);
  };

  const getFieldOperators = (fieldId: string): FilterOperator[] => {
    const field = filterFields.find(f => f.id === fieldId);
    if (!field) return [];
    
    return field.operators || DEFAULT_OPERATORS[field.type] || [];
  };

  const getFilterLabel = (filter: FilterOption): string => {
    const field = filterFields.find(f => f.id === filter.field);
    const operators = getFieldOperators(filter.field);
    const operator = operators.find(op => op.value === filter.operator);
    
    let valueLabel = filter.value;
    if (field?.type === 'select' && field.options) {
      const option = field.options.find(opt => opt.value === filter.value);
      valueLabel = option?.label || filter.value;
    }

    return `${field?.label || filter.field} ${operator?.label || filter.operator} ${valueLabel || ''}`.trim();
  };

  const renderValueInput = () => {
    const field = filterFields.find(f => f.id === newFilter.field);
    const operators = getFieldOperators(newFilter.field || '');
    const operator = operators.find(op => op.value === newFilter.operator);

    if (!operator?.valueRequired) return null;

    switch (field?.type) {
      case 'select':
        return (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Value</InputLabel>
            <Select
              value={newFilter.value || ''}
              onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
              label="Value"
            >
              {field.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'boolean':
        return (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Value</InputLabel>
            <Select
              value={newFilter.value || ''}
              onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
              label="Value"
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>
        );

      case 'number':
        return (
          <TextField
            size="small"
            type="number"
            label="Value"
            value={newFilter.value || ''}
            onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
            sx={{ minWidth: 120 }}
          />
        );

      case 'date':
        return (
          <TextField
            size="small"
            type="date"
            label="Value"
            value={newFilter.value || ''}
            onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 120 }}
          />
        );

      default:
        return (
          <TextField
            size="small"
            label="Value"
            value={newFilter.value || ''}
            onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
            sx={{ minWidth: 120 }}
          />
        );
    }
  };

  const hasActiveFilters = localFilters.length > 0 || localSearchValue.length > 0;

  return (
    <Paper sx={{ p: 2, maxWidth }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: expanded ? 2 : 0 }}>
        {/* Search Input */}
        {showSearch && (
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={localSearchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: localSearchValue && (
                <IconButton size="small" onClick={() => handleSearchChange('')}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
            sx={{ flexGrow: 1, maxWidth: 300 }}
          />
        )}

        {/* Filter Toggle */}
        {showFilters && filterFields.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            Filters
            {localFilters.length > 0 && (
              <Chip
                label={localFilters.length}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Button>
        )}

        {/* Clear All */}
        {hasActiveFilters && (
          <Button
            variant="text"
            startIcon={<ClearIcon />}
            onClick={handleClearAll}
            size="small"
            color="error"
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Active Filters */}
      {localFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {localFilters.map((filter, index) => (
              <Chip
                key={index}
                label={getFilterLabel(filter)}
                onDelete={() => handleRemoveFilter(index)}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Filter Builder */}
      <Collapse in={expanded}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle2" gutterBottom>
          Add Filter
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          {/* Field Selection */}
          <Grid item xs={12} sm={3}>
            <Autocomplete
              size="small"
              options={filterFields}
              getOptionLabel={(option) => option.label}
              value={filterFields.find(f => f.id === newFilter.field) || null}
              onChange={(_, value) => setNewFilter({ field: value?.id })}
              renderInput={(params) => (
                <TextField {...params} label="Field" />
              )}
            />
          </Grid>

          {/* Operator Selection */}
          <Grid item xs={12} sm={3}>
            <FormControl size="small" fullWidth disabled={!newFilter.field}>
              <InputLabel>Operator</InputLabel>
              <Select
                value={newFilter.operator || ''}
                onChange={(e) => setNewFilter(prev => ({ ...prev, operator: e.target.value as any }))}
                label="Operator"
              >
                {getFieldOperators(newFilter.field || '').map(operator => (
                  <MenuItem key={operator.value} value={operator.value}>
                    {operator.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Value Input */}
          <Grid item xs={12} sm={4}>
            {renderValueInput()}
          </Grid>

          {/* Add Button */}
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddFilter}
              disabled={!newFilter.field || !newFilter.operator}
              size="small"
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default SearchFilter;
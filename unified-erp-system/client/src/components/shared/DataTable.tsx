import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { TableColumn, FilterOption, SortOption } from '../../types';

interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn[];
  title?: string;
  loading?: boolean;
  selectable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  refreshable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onSort?: (sortOption: SortOption) => void;
  onFilter?: (filters: FilterOption[]) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  emptyMessage?: string;
  actions?: React.ReactNode;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  title,
  loading = false,
  selectable = false,
  searchable = true,
  filterable = true,
  exportable = false,
  refreshable = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onSelectionChange,
  onSort,
  onFilter,
  onExport,
  onRefresh,
  emptyMessage = 'No data available',
  actions,
}: DataTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm && searchable) {
      result = result.filter(row =>
        columns.some(column => {
          const value = row[column.id];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    activeFilters.forEach(filter => {
      result = result.filter(row => {
        const value = row[filter.field];
        switch (filter.operator) {
          case 'equals':
            return value === filter.value;
          case 'contains':
            return value?.toString().toLowerCase().includes(filter.value.toLowerCase());
          case 'startsWith':
            return value?.toString().toLowerCase().startsWith(filter.value.toLowerCase());
          case 'endsWith':
            return value?.toString().toLowerCase().endsWith(filter.value.toLowerCase());
          case 'greaterThan':
            return Number(value) > Number(filter.value);
          case 'lessThan':
            return Number(value) < Number(filter.value);
          default:
            return true;
        }
      });
    });

    return result;
  }, [data, searchTerm, activeFilters, columns, searchable]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortBy, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage, pagination]);

  const handleSort = (columnId: string) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    setSortBy(columnId);
    setSortDirection(newDirection);
    
    if (onSort) {
      onSort({ field: columnId, direction: newDirection });
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(paginatedData);
      onSelectionChange?.(paginatedData);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (row: T) => {
    const isSelected = selectedRows.some(selected => selected === row);
    let newSelection: T[];

    if (isSelected) {
      newSelection = selectedRows.filter(selected => selected !== row);
    } else {
      newSelection = [...selectedRows, row];
    }

    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
    if (onFilter) {
      onFilter([]);
    }
  };

  const isSelected = (row: T) => selectedRows.some(selected => selected === row);
  const isAllSelected = paginatedData.length > 0 && selectedRows.length === paginatedData.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < paginatedData.length;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          {title && (
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          )}
          {activeFilters.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {activeFilters.map((filter, index) => (
                <Chip
                  key={index}
                  label={`${filter.field} ${filter.operator} ${filter.value}`}
                  size="small"
                  onDelete={() => {
                    const newFilters = activeFilters.filter((_, i) => i !== index);
                    setActiveFilters(newFilters);
                    if (onFilter) onFilter(newFilters);
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search */}
          {searchable && (
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
          )}

          {/* Filter */}
          {filterable && (
            <Tooltip title="Filter">
              <IconButton onClick={handleFilterClick}>
                <FilterIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Export */}
          {exportable && (
            <Tooltip title="Export">
              <IconButton onClick={onExport}>
                <ExportIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Refresh */}
          {refreshable && (
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Custom Actions */}
          {actions}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.width }}
                  sortDirection={sortBy === column.id ? sortDirection : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  selected={isSelected(row)}
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(row)}
                        onChange={() => handleSelectRow(row)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.format ? column.format(row[column.id]) : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={clearFilters}>
          <ListItemIcon>
            <ClearIcon />
          </ListItemIcon>
          <ListItemText>Clear All Filters</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default DataTable;
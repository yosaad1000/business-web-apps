import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Fullscreen as FullscreenIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  TableChart as TableIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface ReportData {
  id: string;
  title: string;
  description?: string;
  type: 'table' | 'bar' | 'line' | 'pie' | 'metric';
  data: any[];
  columns?: string[];
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  aggregation?: 'sum' | 'count' | 'average' | 'min' | 'max';
  filters?: Record<string, any>;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ReportMetric {
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  format?: 'number' | 'currency' | 'percentage';
}

interface ReportViewerProps {
  report: ReportData;
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
  onShare?: () => void;
  onPrint?: () => void;
  showActions?: boolean;
  height?: number;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  loading = false,
  onRefresh,
  onExport,
  onShare,
  onPrint,
  showActions = true,
  height = 400,
  fullscreen = false,
  onFullscreenToggle,
}) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');

  const formatValue = (value: number | string, format?: string): string => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  const renderChart = () => {
    if (!report.data || report.data.length === 0) {
      return (
        <Box
          sx={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography>No data available</Typography>
        </Box>
      );
    }

    switch (report.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={report.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={report.xAxis || 'name'} />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey={report.yAxis || 'value'} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={report.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={report.xAxis || 'name'} />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={report.yAxis || 'value'}
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={report.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={report.yAxis || 'value'}
              >
                {report.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'table':
        return (
          <Box sx={{ height, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {(report.columns || Object.keys(report.data[0] || {})).map((column) => (
                    <th
                      key={column}
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        borderBottom: '2px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                        fontWeight: 600,
                      }}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.data.map((row, index) => (
                  <tr key={index}>
                    {(report.columns || Object.keys(row)).map((column) => (
                      <td
                        key={column}
                        style={{
                          padding: '12px',
                          borderBottom: '1px solid #e0e0e0',
                        }}
                      >
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        );

      case 'metric':
        const metrics = report.data as ReportMetric[];
        return (
          <Grid container spacing={2} sx={{ height }}>
            {metrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h4" component="div" gutterBottom>
                      {formatValue(metric.value, metric.format)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.label}
                    </Typography>
                    {metric.change !== undefined && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography
                          variant="body2"
                          color={metric.changeType === 'increase' ? 'success.main' : 'error.main'}
                        >
                          {metric.changeType === 'increase' ? '+' : ''}
                          {formatValue(metric.change, 'percentage')}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      default:
        return (
          <Box
            sx={{
              height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography>Unsupported report type</Typography>
          </Box>
        );
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar':
        return <BarChartIcon />;
      case 'line':
        return <LineChartIcon />;
      case 'pie':
        return <PieChartIcon />;
      case 'table':
        return <TableIcon />;
      default:
        return <BarChartIcon />;
    }
  };

  return (
    <Paper sx={{ p: 2, height: fullscreen ? '100vh' : 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getChartIcon(report.type)}
          <Box>
            <Typography variant="h6" component="div">
              {report.title}
            </Typography>
            {report.description && (
              <Typography variant="body2" color="text.secondary">
                {report.description}
              </Typography>
            )}
          </Box>
        </Box>

        {showActions && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Export Format Selection */}
            {onExport && (
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <InputLabel>Format</InputLabel>
                <Select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  label="Format"
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Action Buttons */}
            {onRefresh && (
              <Tooltip title="Refresh">
                <IconButton onClick={onRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}

            {onExport && (
              <Tooltip title="Export">
                <IconButton onClick={() => onExport(exportFormat)} disabled={loading}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            )}

            {onPrint && (
              <Tooltip title="Print">
                <IconButton onClick={onPrint} disabled={loading}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            )}

            {onShare && (
              <Tooltip title="Share">
                <IconButton onClick={onShare} disabled={loading}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            )}

            {onFullscreenToggle && (
              <Tooltip title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                <IconButton onClick={onFullscreenToggle}>
                  <FullscreenIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>

      {/* Loading Indicator */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Report Filters Info */}
      {report.filters && Object.keys(report.filters).length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Filters: {Object.entries(report.filters).map(([key, value]) => `${key}: ${value}`).join(', ')}
          </Typography>
        </Box>
      )}

      {/* Date Range Info */}
      {report.dateRange && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Date Range: {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

      {/* Chart/Report Content */}
      <Box sx={{ position: 'relative' }}>
        {renderChart()}
      </Box>

      {/* Footer Info */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {report.data?.length || 0} records
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Generated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ReportViewer;
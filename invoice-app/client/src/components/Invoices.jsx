
import { 
    TableCell, Table, TableHead, TableRow, TableBody, Button, Typography, 
    Paper, Chip, IconButton, Box, Card, CardContent, Grid, Avatar
} from '@mui/material';
import { Delete, Edit, Visibility, Business, ShoppingCart, AttachMoney, CalendarToday, Receipt } from '@mui/icons-material';
import { format } from 'date-fns';

const Invoices = ({ invoices, removeInvoice }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'success';
            case 'pending': return 'warning';
            case 'overdue': return 'error';
            default: return 'default';
        }
    };

    if (!invoices || !Array.isArray(invoices) || invoices.length === 0) {
        return (
            <Card sx={{ mt: 3, textAlign: 'center', py: 4 }}>
                <CardContent>
                    <Receipt sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No invoices found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Create your first invoice to get started
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Box sx={{ mt: 3 }}>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {invoices.length}
                                    </Typography>
                                    <Typography variant="body2">Total Invoices</Typography>
                                </Box>
                                <Receipt sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {formatCurrency(invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0))}
                                    </Typography>
                                    <Typography variant="body2">Total Amount</Typography>
                                </Box>
                                <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Invoices Table */}
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Business sx={{ fontSize: 20 }} />
                                    Vendor
                                </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ShoppingCart sx={{ fontSize: 20 }} />
                                    Product
                                </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachMoney sx={{ fontSize: 20 }} />
                                    Amount
                                </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarToday sx={{ fontSize: 20 }} />
                                    Date
                                </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((invoice, index) => (
                            <TableRow 
                                key={invoice.id} 
                                sx={{ 
                                    '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.04)' },
                                    backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'white'
                                }}
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                            {invoice.vendor?.charAt(0)?.toUpperCase() || 'V'}
                                        </Avatar>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {invoice.vendor}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1">{invoice.product}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                        {formatCurrency(invoice.amount)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(invoice.date)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={invoice.action || 'Pending'} 
                                        color={getStatusColor(invoice.action)}
                                        size="small"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton size="small" color="primary">
                                            <Visibility />
                                        </IconButton>
                                        <IconButton size="small" color="info">
                                            <Edit />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="success"
                                            onClick={() => removeInvoice(invoice.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    )
}

export default Invoices;
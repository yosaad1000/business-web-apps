
import { AppBar, Toolbar, Typography, Box, IconButton, Badge } from '@mui/material';
import { Receipt, Notifications, Dashboard } from '@mui/icons-material';

const Header = ({ invoiceCount = 0 }) => {
    return (
        <AppBar 
            position="static" 
            sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Receipt sx={{ fontSize: 32, color: 'white' }} />
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        Invoice Manager Pro
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton color="inherit">
                        <Dashboard />
                    </IconButton>
                    <IconButton color="inherit">
                        <Badge badgeContent={invoiceCount} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header;
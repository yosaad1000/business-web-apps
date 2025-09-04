import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Button, 
  Alert,
  Paper,
  Container 
} from '@mui/material';
import { 
  Lock as LockIcon, 
  Warning as WarningIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon 
} from '@mui/icons-material';
import { useUser } from '../../contexts/UserContext';
import { ModuleType } from '../../types';
import authService from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: keyof typeof ModuleType;
  requiredPermission?: string;
  requiredPermissions?: string[]; // Multiple permissions (any one required)
  requireAllPermissions?: boolean; // If true, all permissions in requiredPermissions are required
  fallbackPath?: string; // Custom redirect path for unauthorized users
  showRetry?: boolean; // Show retry button on error
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredModule,
  requiredPermission,
  requiredPermissions = [],
  requireAllPermissions = false,
  fallbackPath = '/dashboard',
  showRetry = true,
}) => {
  const { 
    isAuthenticated, 
    isLoading, 
    hasModuleAccess, 
    hasPermission, 
    user,
    error: userError 
  } = useUser();
  const location = useLocation();
  const [retrying, setRetrying] = useState(false);

  // Handle retry logic
  const handleRetry = async () => {
    setRetrying(true);
    try {
      await authService.refreshToken();
      // The user context will automatically update
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setRetrying(false);
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading || retrying) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
          gap={2}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary">
            {retrying ? 'Retrying...' : 'Loading...'}
          </Typography>
        </Box>
      </Container>
    );
  }

  // Show error state if there's an authentication error
  if (userError && !isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
          gap={2}
        >
          <Paper sx={{ p: 4, textAlign: 'center', width: '100%' }}>
            <WarningIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Authentication Error
            </Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              {userError}
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {showRetry && (
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRetry}
                  disabled={retrying}
                >
                  Retry
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => window.location.href = '/login'}
              >
                Go to Login
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user account is active
  if (user && !user.isActive) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
          gap={2}
        >
          <Paper sx={{ p: 4, textAlign: 'center', width: '100%' }}>
            <LockIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Account Suspended
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Your account has been suspended. Please contact your administrator for assistance.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.href = '/login'}
            >
              Back to Login
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Check module access if required
  if (requiredModule) {
    const moduleType = ModuleType[requiredModule];
    if (!hasModuleAccess(moduleType)) {
      return (
        <Container maxWidth="sm">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
            gap={2}
          >
            <Paper sx={{ p: 4, textAlign: 'center', width: '100%' }}>
              <LockIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Access Denied
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                You don't have permission to access the <strong>{requiredModule.toLowerCase()}</strong> module.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please contact your administrator if you believe this is an error.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => window.location.href = fallbackPath}
                >
                  Go to Dashboard
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      );
    }
  }

  // Check specific permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
          gap={2}
        >
          <Paper sx={{ p: 4, textAlign: 'center', width: '100%' }}>
            <LockIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Insufficient Permissions
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              You don't have the required permission: <strong>{requiredPermission}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please contact your administrator if you believe this is an error.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                onClick={() => window.location.href = fallbackPath}
              >
                Go to Dashboard
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Check multiple permissions if required
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAllPermissions
      ? requiredPermissions.every(permission => hasPermission(permission))
      : requiredPermissions.some(permission => hasPermission(permission));

    if (!hasRequiredPermissions) {
      return (
        <Container maxWidth="sm">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
            gap={2}
          >
            <Paper sx={{ p: 4, textAlign: 'center', width: '100%' }}>
              <LockIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Insufficient Permissions
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                You don't have the required permissions to access this resource.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Required permissions: {requiredPermissions.join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please contact your administrator if you believe this is an error.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => window.location.href = fallbackPath}
                >
                  Go to Dashboard
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      );
    }
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
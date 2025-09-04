import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { UserProvider, useUser } from './contexts/UserContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Create theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: lightTheme.typography,
  components: lightTheme.components,
});

const AppContent: React.FC = () => {
  const { preferences } = useUser();
  const theme = preferences?.theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppLayout>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            {/* HRMS Module Routes */}
            <Route
              path="/hrms/*"
              element={
                <ProtectedRoute requiredModule="HRMS">
                  <div>HRMS Module - Coming Soon</div>
                </ProtectedRoute>
              }
            />
            
            {/* Invoice Module Routes */}
            <Route
              path="/invoice/*"
              element={
                <ProtectedRoute requiredModule="INVOICE">
                  <div>Invoice Module - Coming Soon</div>
                </ProtectedRoute>
              }
            />
            
            {/* Training Module Routes */}
            <Route
              path="/training/*"
              element={
                <ProtectedRoute requiredModule="QUIZ">
                  <div>Training Module - Coming Soon</div>
                </ProtectedRoute>
              }
            />
            
            {/* Recruitment Module Routes */}
            <Route
              path="/recruitment/*"
              element={
                <ProtectedRoute requiredModule="JOBS">
                  <div>Recruitment Module - Coming Soon</div>
                </ProtectedRoute>
              }
            />
            
            {/* Admin Module Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredModule="CRUD">
                  <div>Admin Module - Coming Soon</div>
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 fallback */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </AppLayout>
      </Router>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
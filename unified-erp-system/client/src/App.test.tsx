import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the UserContext to avoid Supabase dependency in tests
jest.mock('./contexts/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useUser: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    activeModule: 'DASHBOARD',
    preferences: { theme: 'light' },
    notifications: [],
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    setActiveModule: jest.fn(),
    updatePreferences: jest.fn(),
    addNotification: jest.fn(),
    markNotificationRead: jest.fn(),
    clearError: jest.fn(),
    hasPermission: jest.fn(() => false),
    hasModuleAccess: jest.fn(() => false),
  }),
}));

test('renders login page when not authenticated', () => {
  render(<App />);
  const loginElement = screen.getByText(/Unified ERP/i);
  expect(loginElement).toBeInTheDocument();
});
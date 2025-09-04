import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, ModuleType, UserPreferences, Notification } from '../types';
import { supabase } from '../services/supabase';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeModule: ModuleType;
  preferences: UserPreferences | null;
  notifications: Notification[];
  error: string | null;
}

type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_ACTIVE_MODULE'; payload: ModuleType }
  | { type: 'SET_PREFERENCES'; payload: UserPreferences | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  activeModule: ModuleType.DASHBOARD,
  preferences: null,
  notifications: [],
  error: null,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_ACTIVE_MODULE':
      return { ...state, activeModule: action.payload };
    case 'SET_PREFERENCES':
      return { ...state, preferences: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface UserContextType extends UserState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setActiveModule: (module: ModuleType) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasModuleAccess: (module: ModuleType) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch user profile and permissions
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Session check error:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to check session' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
          dispatch({ type: 'SET_PREFERENCES', payload: null });
          dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // This would be replaced with actual API call to fetch user profile
      // For now, creating a mock user
      const mockUser: User = {
        id: userId,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: {
          id: '1',
          name: 'Admin',
          description: 'System Administrator',
          permissions: [
            { id: '1', name: 'read_all', resource: '*', action: 'read' },
            { id: '2', name: 'write_all', resource: '*', action: 'write' },
          ],
        },
        permissions: [
          { id: '1', name: 'read_all', resource: '*', action: 'read' },
          { id: '2', name: 'write_all', resource: '*', action: 'write' },
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockPreferences: UserPreferences = {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          inApp: true,
          frequency: 'immediate',
        },
        dashboard: {
          layout: 'grid',
          widgets: ['overview', 'recent-activity', 'notifications'],
          refreshInterval: 30000,
        },
      };

      dispatch({ type: 'SET_USER', payload: mockUser });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      dispatch({ type: 'SET_PREFERENCES', payload: mockPreferences });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user profile' });
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Login failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Logout failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setActiveModule = (module: ModuleType): void => {
    dispatch({ type: 'SET_ACTIVE_MODULE', payload: module });
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<void> => {
    try {
      const updatedPreferences = { ...state.preferences, ...preferences } as UserPreferences;
      // Here you would make an API call to save preferences
      dispatch({ type: 'SET_PREFERENCES', payload: updatedPreferences });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update preferences' });
      throw error;
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): void => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  };

  const markNotificationRead = (notificationId: string): void => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;
    return state.user.permissions.some(p => 
      p.name === permission || p.name === 'admin' || p.resource === '*'
    );
  };

  const hasModuleAccess = (module: ModuleType): boolean => {
    if (!state.user) return false;
    
    // Admin users have access to all modules
    if (hasPermission('admin')) return true;
    
    // Check module-specific permissions
    const modulePermissions: Record<ModuleType, string[]> = {
      [ModuleType.DASHBOARD]: ['dashboard_read'],
      [ModuleType.HRMS]: ['hrms_read', 'employee_read'],
      [ModuleType.INVOICE]: ['invoice_read'],
      [ModuleType.QUIZ]: ['quiz_read', 'training_read'],
      [ModuleType.JOBS]: ['jobs_read', 'recruitment_read'],
      [ModuleType.CRUD]: ['crud_read', 'admin'],
    };

    const requiredPermissions = modulePermissions[module] || [];
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  const contextValue: UserContextType = {
    ...state,
    login,
    logout,
    setActiveModule,
    updatePreferences,
    addNotification,
    markNotificationRead,
    clearError,
    hasPermission,
    hasModuleAccess,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
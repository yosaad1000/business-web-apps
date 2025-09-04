import { supabase } from './supabase';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  password: string;
  confirmPassword: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Sign in with email and password
   */
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const userProfile = await this.fetchUserProfile(data.user.id);
        return { user: userProfile, error: null };
      }

      return { user: null, error: 'Authentication failed' };
    } catch (error: any) {
      return { user: null, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Sign up new user
   */
  async signUp(signupData: SignupData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            first_name: signupData.firstName,
            last_name: signupData.lastName,
            role: signupData.role || 'user',
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Create user profile in our database
        await this.createUserProfile(data.user.id, signupData);
        const userProfile = await this.fetchUserProfile(data.user.id);
        return { user: userProfile, error: null };
      }

      return { user: null, error: 'Registration failed' };
    } catch (error: any) {
      return { user: null, error: error.message || 'An unexpected error occurred' };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error: any) {
      return { error: error.message || 'Sign out failed' };
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error: any) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        return await this.fetchUserProfile(user.id);
      }
      
      return null;
    } catch (error: any) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(request: PasswordResetRequest): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(request.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error: error?.message || null };
    } catch (error: any) {
      return { error: error.message || 'Password reset request failed' };
    }
  }

  /**
   * Update password
   */
  async updatePassword(request: PasswordUpdateRequest): Promise<{ error: string | null }> {
    try {
      if (request.password !== request.confirmPassword) {
        return { error: 'Passwords do not match' };
      }

      const { error } = await supabase.auth.updateUser({
        password: request.password,
      });

      return { error: error?.message || null };
    } catch (error: any) {
      return { error: error.message || 'Password update failed' };
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.refreshSession();
      return { error: error?.message || null };
    } catch (error: any) {
      return { error: error.message || 'Token refresh failed' };
    }
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false;
    
    // Admin users have all permissions
    if (user.role.name.toLowerCase() === 'admin') return true;
    
    // Check specific permissions
    return user.permissions.some(p => 
      p.name === permission || 
      p.name === 'admin' || 
      p.resource === '*'
    );
  }

  /**
   * Check if user has access to module
   */
  hasModuleAccess(user: User | null, module: string): boolean {
    if (!user) return false;
    
    // Admin users have access to all modules
    if (user.role.name.toLowerCase() === 'admin') return true;
    
    // Check module-specific permissions
    const modulePermissions: Record<string, string[]> = {
      'DASHBOARD': ['dashboard_read'],
      'HRMS': ['hrms_read', 'employee_read'],
      'INVOICE': ['invoice_read'],
      'QUIZ': ['quiz_read', 'training_read'],
      'JOBS': ['jobs_read', 'recruitment_read'],
      'CRUD': ['crud_read', 'admin'],
    };

    const requiredPermissions = modulePermissions[module] || [];
    return requiredPermissions.some(permission => this.hasPermission(user, permission));
  }

  /**
   * Fetch user profile from database
   */
  private async fetchUserProfile(userId: string): Promise<User> {
    try {
      // This would be replaced with actual database queries
      // For now, creating a mock user profile
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
            { id: '1', name: 'admin', resource: '*', action: '*' },
            { id: '2', name: 'read_all', resource: '*', action: 'read' },
            { id: '3', name: 'write_all', resource: '*', action: 'write' },
          ],
        },
        permissions: [
          { id: '1', name: 'admin', resource: '*', action: '*' },
          { id: '2', name: 'read_all', resource: '*', action: 'read' },
          { id: '3', name: 'write_all', resource: '*', action: 'write' },
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return mockUser;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Create user profile in database
   */
  private async createUserProfile(userId: string, signupData: SignupData): Promise<void> {
    try {
      // This would be replaced with actual database operations
      // For now, just logging the operation
      console.log('Creating user profile for:', userId, signupData);
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  /**
   * Listen for auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = AuthService.getInstance();
export default authService;
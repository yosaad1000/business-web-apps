import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
  Typography,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useUser } from '../../contexts/UserContext';
import { UserPreferences } from '../../types';

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ open, onClose }) => {
  const { user, preferences, updatePreferences } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  const [preferencesData, setPreferencesData] = useState<UserPreferences>(
    preferences || {
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
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Here you would make an API call to update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updatePreferences(preferencesData);
      setSuccess('Preferences updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const renderProfileTab = () => (
    <Box>
      {/* Avatar and Basic Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}
        >
          {user ? getInitials(user.firstName, user.lastName) : <PersonIcon />}
        </Avatar>
        <Box>
          <Typography variant="h6">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
          <Chip
            label={user?.role.name}
            size="small"
            color="primary"
            sx={{ mt: 1 }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Profile Form */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={profileData.firstName}
            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
            InputProps={{
              startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={profileData.lastName}
            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
            InputProps={{
              startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            disabled // Email usually can't be changed
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            InputProps={{
              startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Address"
            value={profileData.address}
            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
            InputProps={{
              startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
      </Grid>

      {/* Role and Permissions */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Role & Permissions
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body1">
            Role: <strong>{user?.role.name}</strong>
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {user?.role.description}
        </Typography>
        
        <List dense>
          {user?.permissions.slice(0, 5).map((permission) => (
            <ListItem key={permission.id}>
              <ListItemIcon>
                <SecurityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={permission.name}
                secondary={`${permission.resource} - ${permission.action}`}
              />
            </ListItem>
          ))}
          {user && user.permissions.length > 5 && (
            <ListItem>
              <ListItemText
                primary={`+${user.permissions.length - 5} more permissions`}
                sx={{ fontStyle: 'italic', color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Box>
  );

  const renderPreferencesTab = () => (
    <Box>
      {/* Theme Settings */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PaletteIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6">Appearance</Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={preferencesData.theme === 'dark'}
              onChange={(e) => setPreferencesData(prev => ({
                ...prev,
                theme: e.target.checked ? 'dark' : 'light'
              }))}
            />
          }
          label="Dark Mode"
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Language Settings */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6">Language</Typography>
        </Box>
        <TextField
          select
          fullWidth
          label="Language"
          value={preferencesData.language}
          onChange={(e) => setPreferencesData(prev => ({ ...prev, language: e.target.value }))}
          SelectProps={{ native: true }}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </TextField>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Notification Settings */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <NotificationsIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={preferencesData.notifications.email}
                onChange={(e) => setPreferencesData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: e.target.checked }
                }))}
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferencesData.notifications.push}
                onChange={(e) => setPreferencesData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, push: e.target.checked }
                }))}
              />
            }
            label="Push Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferencesData.notifications.inApp}
                onChange={(e) => setPreferencesData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, inApp: e.target.checked }
                }))}
              />
            }
            label="In-App Notifications"
          />
        </Box>
        
        <TextField
          select
          fullWidth
          label="Notification Frequency"
          value={preferencesData.notifications.frequency}
          onChange={(e) => setPreferencesData(prev => ({
            ...prev,
            notifications: { ...prev.notifications, frequency: e.target.value as any }
          }))}
          SelectProps={{ native: true }}
          sx={{ mt: 2 }}
        >
          <option value="immediate">Immediate</option>
          <option value="daily">Daily Digest</option>
          <option value="weekly">Weekly Summary</option>
        </TextField>
      </Box>
    </Box>
  );

  const renderSecurityTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account security and password settings.
      </Typography>
      
      <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
        Change Password
      </Button>
      
      <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
        Enable Two-Factor Authentication
      </Button>
      
      <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
        View Login History
      </Button>
      
      <Button variant="outlined" color="error" fullWidth>
        Delete Account
      </Button>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon />
          User Profile
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'preferences', label: 'Preferences' },
              { id: 'security', label: 'Security' },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'contained' : 'text'}
                onClick={() => setActiveTab(tab.id as any)}
                size="small"
              >
                {tab.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Tab Content */}
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
        {activeTab === 'security' && renderSecurityTab()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          <CancelIcon sx={{ mr: 1 }} />
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={activeTab === 'profile' ? handleSaveProfile : handleSavePreferences}
          disabled={saving || activeTab === 'security'}
        >
          {saving ? (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          ) : (
            <SaveIcon sx={{ mr: 1 }} />
          )}
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfile;
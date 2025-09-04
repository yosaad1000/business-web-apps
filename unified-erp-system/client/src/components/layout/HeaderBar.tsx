import React, { useState } from 'react';
import {
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useUser } from '../../contexts/UserContext';
import { ModuleType } from '../../types';
import UserProfile from '../auth/UserProfile';

interface HeaderBarProps {
  onMenuClick: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onMenuClick }) => {
  const { user, activeModule, notifications, logout, preferences, updatePreferences } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const getModuleTitle = (module: ModuleType): string => {
    const titles: Record<ModuleType, string> = {
      [ModuleType.DASHBOARD]: 'Dashboard',
      [ModuleType.HRMS]: 'Human Resources',
      [ModuleType.INVOICE]: 'Invoice Management',
      [ModuleType.QUIZ]: 'Training & Quizzes',
      [ModuleType.JOBS]: 'Recruitment',
      [ModuleType.CRUD]: 'Administration',
    };
    return titles[module] || 'Unified ERP';
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleProfileMenuClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleThemeToggle = async () => {
    if (preferences) {
      const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
      await updatePreferences({ theme: newTheme });
    }
  };

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatNotificationTime = (createdAt: string): string => {
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <>
      <Toolbar>
        {/* Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Module Title */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap component="div">
            {getModuleTitle(activeModule)}
          </Typography>
          {activeModule !== ModuleType.DASHBOARD && (
            <Typography variant="caption" color="inherit" sx={{ opacity: 0.7 }}>
              Unified ERP System
            </Typography>
          )}
        </Box>

        {/* Module Indicator */}
        <Chip
          label={getModuleTitle(activeModule)}
          size="small"
          variant="outlined"
          sx={{
            color: 'inherit',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            mr: 2,
            display: { xs: 'none', sm: 'flex' },
          }}
        />

        {/* Theme Toggle */}
        <Tooltip title="Toggle theme">
          <IconButton color="inherit" onClick={handleThemeToggle}>
            {preferences?.theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            color="inherit"
            onClick={handleNotificationMenuOpen}
            aria-label={`${unreadNotifications.length} unread notifications`}
          >
            <Badge badgeContent={unreadNotifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Profile */}
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleProfileMenuOpen}
            size="small"
            sx={{ ml: 1 }}
            aria-controls={anchorEl ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user ? getInitials(user.firstName, user.lastName) : <AccountCircleIcon />}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 200,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user && (
          <>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip label={user.role.name} size="small" color="primary" />
              </Box>
            </Box>
            <Divider />
          </>
        )}
        
        <MenuItem onClick={() => {
          setProfileDialogOpen(true);
          handleProfileMenuClose();
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 320,
            maxWidth: 400,
            maxHeight: 400,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Notifications
            {unreadNotifications.length > 0 && (
              <Chip
                label={unreadNotifications.length}
                size="small"
                color="error"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {notifications.slice(0, 10).map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={handleNotificationMenuClose}
                sx={{
                  whiteSpace: 'normal',
                  alignItems: 'flex-start',
                  py: 1.5,
                  borderLeft: notification.read ? 'none' : '3px solid',
                  borderLeftColor: 'primary.main',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {notification.message}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Chip
                      label={notification.module}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatNotificationTime(notification.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}

        {notifications.length > 10 && (
          <Box sx={{ p: 1, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="primary">
              View all notifications
            </Typography>
          </Box>
        )}
      </Menu>

      {/* User Profile Dialog */}
      <UserProfile
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
      />
    </>
  );
};

export default HeaderBar;
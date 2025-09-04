import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  IconButton,
  Chip,
  Button,
  Divider,
  Badge,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Collapse,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { Notification, ModuleType } from '../../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (notificationId: string) => void;
  onDeleteAll?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  showSettings?: boolean;
  maxHeight?: number;
  showInline?: boolean;
  autoHide?: boolean;
  autoHideDuration?: number;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll,
  onNotificationClick,
  showSettings = true,
  maxHeight = 400,
  showInline = false,
  autoHide = false,
  autoHideDuration = 6000,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [filterModule, setFilterModule] = useState<ModuleType | 'all'>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarNotification, setSnackbarNotification] = useState<Notification | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Auto-hide notifications
  useEffect(() => {
    if (autoHide && notifications.length > 0) {
      const latestNotification = notifications[0];
      if (!latestNotification.read) {
        setSnackbarNotification(latestNotification);
        setSnackbarOpen(true);
      }
    }
  }, [notifications, autoHide]);

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'read' && !notification.read) return false;
    if (filterType === 'unread' && notification.read) return false;
    if (filterModule !== 'all' && notification.module !== filterModule) return false;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <SuccessIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'success.light';
      case 'warning':
        return 'warning.light';
      case 'error':
        return 'error.light';
      default:
        return 'info.light';
    }
  };

  const formatTime = (timestamp: string): string => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick?.(notification);
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarNotification(null);
  };

  const renderNotificationList = () => (
    <List sx={{ maxHeight, overflow: 'auto', p: 0 }}>
      {filteredNotifications.length === 0 ? (
        <ListItem>
          <ListItemText
            primary="No notifications"
            secondary="You're all caught up!"
            sx={{ textAlign: 'center' }}
          />
        </ListItem>
      ) : (
        filteredNotifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem
              disablePadding
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                borderLeft: notification.read ? 'none' : '4px solid',
                borderLeftColor: getNotificationColor(notification.type),
              }}
            >
              <ListItemButton
                onClick={() => handleNotificationClick(notification)}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: notification.read ? 'normal' : 'bold',
                          flexGrow: 1,
                        }}
                      >
                        {notification.title}
                      </Typography>
                      <Chip
                        label={notification.module}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(notification.createdAt)}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {onMarkAsRead && !notification.read && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                      title="Mark as read"
                    >
                      <MarkReadIcon fontSize="small" />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                      }}
                      title="Delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))
      )}
    </List>
  );

  if (showInline) {
    return (
      <Paper sx={{ width: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Filters */}
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                label="Type"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="read">Read</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Module</InputLabel>
              <Select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value as any)}
                label="Module"
              >
                <MenuItem value="all">All</MenuItem>
                {Object.values(ModuleType).map(module => (
                  <MenuItem key={module} value={module}>{module}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Actions */}
            {onMarkAllAsRead && unreadCount > 0 && (
              <Button
                size="small"
                onClick={onMarkAllAsRead}
                startIcon={<MarkReadIcon />}
              >
                Mark All Read
              </Button>
            )}

            {onDeleteAll && notifications.length > 0 && (
              <Button
                size="small"
                color="error"
                onClick={onDeleteAll}
                startIcon={<DeleteIcon />}
              >
                Clear All
              </Button>
            )}

            {showSettings && (
              <IconButton onClick={handleSettingsClick}>
                <SettingsIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Notification List */}
        {renderNotificationList()}
      </Paper>
    );
  }

  return (
    <>
      {/* Notification List for Dropdown/Modal */}
      <Box sx={{ width: 350 }}>
        {renderNotificationList()}
      </Box>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        onClose={handleSettingsClose}
      >
        <MenuItem>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Email notifications"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Push notifications"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Sound alerts"
          />
        </MenuItem>
      </Menu>

      {/* Auto-hide Snackbar */}
      {autoHide && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={autoHideDuration}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarNotification?.type as any || 'info'}
            variant="filled"
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => {
                  if (snackbarNotification && onNotificationClick) {
                    onNotificationClick(snackbarNotification);
                  }
                  handleSnackbarClose();
                }}
              >
                <NotificationsActiveIcon fontSize="small" />
              </IconButton>
            }
          >
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {snackbarNotification?.title}
              </Typography>
              <Typography variant="body2">
                {snackbarNotification?.message}
              </Typography>
            </Box>
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default NotificationCenter;
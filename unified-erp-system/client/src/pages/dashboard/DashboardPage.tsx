import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Quiz as QuizIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useUser } from '../../contexts/UserContext';

const DashboardPage: React.FC = () => {
  const { user, notifications } = useUser();

  const stats = [
    {
      title: 'Total Employees',
      value: '156',
      change: '+12%',
      icon: <PeopleIcon />,
      color: '#1976d2',
    },
    {
      title: 'Active Invoices',
      value: '23',
      change: '+5%',
      icon: <ReceiptIcon />,
      color: '#388e3c',
    },
    {
      title: 'Training Modules',
      value: '8',
      change: '+2',
      icon: <QuizIcon />,
      color: '#f57c00',
    },
    {
      title: 'Open Positions',
      value: '4',
      change: '-1',
      icon: <WorkIcon />,
      color: '#7b1fa2',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'New employee onboarded',
      description: 'John Smith joined the Development team',
      time: '2 hours ago',
      type: 'employee',
    },
    {
      id: 2,
      title: 'Invoice approved',
      description: 'Invoice #INV-2024-001 approved by Finance',
      time: '4 hours ago',
      type: 'invoice',
    },
    {
      id: 3,
      title: 'Training completed',
      description: 'Safety Training completed by 15 employees',
      time: '6 hours ago',
      type: 'training',
    },
    {
      id: 4,
      title: 'Job application received',
      description: 'New application for Senior Developer position',
      time: '1 day ago',
      type: 'recruitment',
    },
  ];

  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      employee: <PeopleIcon />,
      invoice: <ReceiptIcon />,
      training: <QuizIcon />,
      recruitment: <WorkIcon />,
    };
    return iconMap[type] || <TrendingUpIcon />;
  };

  const getActivityColor = (type: string) => {
    const colorMap: Record<string, string> = {
      employee: '#1976d2',
      invoice: '#388e3c',
      training: '#f57c00',
      recruitment: '#7b1fa2',
    };
    return colorMap[type] || '#666';
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening in your organization today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={stat.change}
                  size="small"
                  color={stat.change.startsWith('+') ? 'success' : 'default'}
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activities
              </Typography>
              <Box>
                {recentActivities.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      py: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: getActivityColor(activity.type),
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {activity.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Notifications
                </Typography>
                {notifications.length > 0 && (
                  <Chip
                    label={notifications.filter(n => !n.read).length}
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              
              {notifications.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No new notifications
                </Typography>
              ) : (
                <Box>
                  {notifications.slice(0, 5).map((notification) => (
                    <Paper
                      key={notification.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        bgcolor: notification.read ? 'background.paper' : 'primary.50',
                        border: notification.read ? '1px solid' : '1px solid',
                        borderColor: notification.read ? 'divider' : 'primary.main',
                      }}
                    >
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
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                  
                  {notifications.length > 5 && (
                    <Typography variant="caption" color="primary" textAlign="center" display="block" sx={{ mt: 2 }}>
                      View all notifications
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
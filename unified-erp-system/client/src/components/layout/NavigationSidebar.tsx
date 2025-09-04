import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Quiz as QuizIcon,
  Work as WorkIcon,
  Storage as StorageIcon,
  ExpandLess,
  ExpandMore,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { ModuleType, NavigationItem } from '../../types';

interface NavigationSidebarProps {
  onMobileClose?: () => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasModuleAccess, setActiveModule } = useUser();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      path: '/dashboard',
      module: ModuleType.DASHBOARD,
      requiredPermissions: ['dashboard_read'],
    },
    {
      id: 'hrms',
      label: 'Human Resources',
      icon: 'people',
      path: '/hrms',
      module: ModuleType.HRMS,
      requiredPermissions: ['hrms_read'],
      children: [
        {
          id: 'employees',
          label: 'Employees',
          icon: 'people',
          path: '/hrms/employees',
          module: ModuleType.HRMS,
          requiredPermissions: ['employee_read'],
        },
        {
          id: 'departments',
          label: 'Departments',
          icon: 'business',
          path: '/hrms/departments',
          module: ModuleType.HRMS,
          requiredPermissions: ['department_read'],
        },
        {
          id: 'roles',
          label: 'Roles & Permissions',
          icon: 'security',
          path: '/hrms/roles',
          module: ModuleType.HRMS,
          requiredPermissions: ['role_read'],
        },
      ],
    },
    {
      id: 'invoice',
      label: 'Invoice Management',
      icon: 'receipt',
      path: '/invoice',
      module: ModuleType.INVOICE,
      requiredPermissions: ['invoice_read'],
      children: [
        {
          id: 'invoices',
          label: 'All Invoices',
          icon: 'receipt',
          path: '/invoice/list',
          module: ModuleType.INVOICE,
          requiredPermissions: ['invoice_read'],
        },
        {
          id: 'create-invoice',
          label: 'Create Invoice',
          icon: 'add',
          path: '/invoice/create',
          module: ModuleType.INVOICE,
          requiredPermissions: ['invoice_write'],
        },
        {
          id: 'invoice-reports',
          label: 'Reports',
          icon: 'analytics',
          path: '/invoice/reports',
          module: ModuleType.INVOICE,
          requiredPermissions: ['invoice_read'],
        },
      ],
    },
    {
      id: 'training',
      label: 'Training & Quizzes',
      icon: 'quiz',
      path: '/training',
      module: ModuleType.QUIZ,
      requiredPermissions: ['training_read'],
      children: [
        {
          id: 'quizzes',
          label: 'All Quizzes',
          icon: 'quiz',
          path: '/training/quizzes',
          module: ModuleType.QUIZ,
          requiredPermissions: ['quiz_read'],
        },
        {
          id: 'training-assignments',
          label: 'Assignments',
          icon: 'assignment',
          path: '/training/assignments',
          module: ModuleType.QUIZ,
          requiredPermissions: ['training_read'],
        },
        {
          id: 'training-progress',
          label: 'Progress Tracking',
          icon: 'trending_up',
          path: '/training/progress',
          module: ModuleType.QUIZ,
          requiredPermissions: ['training_read'],
        },
      ],
    },
    {
      id: 'recruitment',
      label: 'Recruitment',
      icon: 'work',
      path: '/recruitment',
      module: ModuleType.JOBS,
      requiredPermissions: ['recruitment_read'],
      children: [
        {
          id: 'job-board',
          label: 'Job Board',
          icon: 'work',
          path: '/recruitment/jobs',
          module: ModuleType.JOBS,
          requiredPermissions: ['jobs_read'],
        },
        {
          id: 'applications',
          label: 'Applications',
          icon: 'person_add',
          path: '/recruitment/applications',
          module: ModuleType.JOBS,
          requiredPermissions: ['application_read'],
        },
        {
          id: 'candidates',
          label: 'Candidates',
          icon: 'people_outline',
          path: '/recruitment/candidates',
          module: ModuleType.JOBS,
          requiredPermissions: ['candidate_read'],
        },
      ],
    },
    {
      id: 'admin',
      label: 'Administration',
      icon: 'storage',
      path: '/admin',
      module: ModuleType.CRUD,
      requiredPermissions: ['admin'],
      children: [
        {
          id: 'system-config',
          label: 'System Configuration',
          icon: 'settings',
          path: '/admin/config',
          module: ModuleType.CRUD,
          requiredPermissions: ['admin'],
        },
        {
          id: 'data-management',
          label: 'Data Management',
          icon: 'storage',
          path: '/admin/data',
          module: ModuleType.CRUD,
          requiredPermissions: ['admin'],
        },
        {
          id: 'audit-logs',
          label: 'Audit Logs',
          icon: 'history',
          path: '/admin/logs',
          module: ModuleType.CRUD,
          requiredPermissions: ['admin'],
        },
      ],
    },
  ];

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      dashboard: <DashboardIcon />,
      people: <PeopleIcon />,
      receipt: <ReceiptIcon />,
      quiz: <QuizIcon />,
      work: <WorkIcon />,
      storage: <StorageIcon />,
      business: <BusinessIcon />,
    };
    return iconMap[iconName] || <DashboardIcon />;
  };

  const handleItemClick = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      // Toggle expansion for parent items
      setExpandedItems(prev =>
        prev.includes(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      // Navigate to the item
      navigate(item.path);
      setActiveModule(item.module);
      onMobileClose?.();
    }
  };

  const isItemActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isItemExpanded = (itemId: string) => {
    return expandedItems.includes(itemId);
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    if (!hasModuleAccess(item.module)) {
      return null;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isActive = isItemActive(item.path);
    const isExpanded = isItemExpanded(item.id);

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ pl: level * 2 }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            selected={isActive && !hasChildren}
            sx={{
              minHeight: 48,
              borderRadius: 1,
              mx: 1,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {getIcon(item.icon)}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: level > 0 ? '0.875rem' : '1rem',
                fontWeight: isActive ? 600 : 400,
              }}
            />
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderNavigationItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo and Title */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" component="div" fontWeight="bold">
          Unified ERP
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Enterprise Resource Planning
        </Typography>
      </Box>

      <Divider />

      {/* User Info */}
      {user && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              label={user.role.name}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      <Divider />

      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ pt: 1 }}>
          {navigationItems.map(item => renderNavigationItem(item))}
        </List>
      </Box>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
};

export default NavigationSidebar;
# Unified ERP System - Frontend

A comprehensive React-based frontend for the Unified ERP System, built with TypeScript, Material-UI, and modern web technologies.

## Features Implemented

### 🏗️ Core Architecture
- **React 18.2+** with TypeScript for type safety
- **Material-UI v5** for consistent design system
- **React Router v6** for client-side routing
- **Context API** for state management
- **Supabase** integration for authentication and data

### 🔐 Authentication & Authorization
- **Supabase Auth** integration with JWT tokens
- **Role-based access control** (RBAC)
- **Protected routes** with comprehensive error handling
- **User profile management** with preferences
- **Session management** with automatic refresh

### 🎨 Shared UI Components
- **DataTable**: Advanced table with sorting, filtering, pagination, and export
- **FormBuilder**: Dynamic form generation with validation
- **SearchFilter**: Universal search and filtering component
- **ReportViewer**: Integrated analytics with multiple chart types
- **NotificationCenter**: Real-time notifications with preferences

### 🧭 Navigation & Layout
- **AppLayout**: Responsive layout with sidebar and header
- **NavigationSidebar**: Module-based navigation with permissions
- **HeaderBar**: User profile, notifications, and theme toggle
- **Responsive design** for desktop, tablet, and mobile

### 🎯 Module Structure
- **Dashboard**: Overview with metrics and recent activities
- **HRMS**: Human Resources management (placeholder)
- **Invoice**: Invoice management (placeholder)
- **Training**: Quiz and training platform (placeholder)
- **Recruitment**: Job board and candidate management (placeholder)
- **Admin**: System administration (placeholder)

## Technology Stack

### Frontend Dependencies
```json
{
  "@emotion/react": "^11.11.1",
  "@emotion/styled": "^11.11.0",
  "@mui/icons-material": "^5.15.1",
  "@mui/material": "^5.15.1",
  "@mui/x-data-grid": "^6.18.2",
  "@mui/x-date-pickers": "^6.18.2",
  "@supabase/supabase-js": "^2.57.0",
  "axios": "^1.6.2",
  "date-fns": "^2.30.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "recharts": "^2.8.0",
  "typescript": "^4.9.5"
}
```

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx
│   │   └── UserProfile.tsx
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── HeaderBar.tsx
│   │   └── NavigationSidebar.tsx
│   └── shared/
│       ├── DataTable.tsx
│       ├── FormBuilder.tsx
│       ├── NotificationCenter.tsx
│       ├── ReportViewer.tsx
│       └── SearchFilter.tsx
├── contexts/
│   └── UserContext.tsx
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx
│   └── dashboard/
│       └── DashboardPage.tsx
├── services/
│   ├── authService.ts
│   └── supabase.ts
├── types/
│   └── index.ts
├── App.tsx
└── index.tsx
```

## Key Features

### 🔒 Security
- JWT-based authentication
- Role-based access control
- Protected routes with fallbacks
- Session management
- CSRF protection

### 📱 Responsive Design
- Mobile-first approach
- Adaptive navigation
- Touch-friendly interfaces
- Progressive web app ready

### 🎨 UI/UX
- Material Design principles
- Dark/light theme support
- Consistent component library
- Accessibility compliant
- Loading states and error handling

### 🚀 Performance
- Code splitting and lazy loading
- Optimized bundle size
- Efficient re-rendering
- Caching strategies

## Getting Started

### Prerequisites
- Node.js 18+
- npm 8+

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

### Build
```bash
npm run build
```

### Testing
```bash
npm test
```

## Environment Variables

Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_ENV=development
```

## Demo Credentials

For testing purposes, use these demo credentials:
- **Email**: admin@example.com
- **Password**: demo123

## Next Steps

The frontend foundation is complete and ready for module-specific implementations:

1. **HRMS Module**: Employee management, departments, roles
2. **Invoice Module**: Invoice processing, approvals, reporting
3. **Training Module**: Quiz management, progress tracking
4. **Recruitment Module**: Job postings, applications, candidates
5. **Admin Module**: System configuration, data management

Each module will leverage the shared components and authentication system established in this foundation.

## Contributing

1. Follow TypeScript best practices
2. Use Material-UI components consistently
3. Implement proper error handling
4. Add unit tests for new components
5. Follow the established project structure

## License

MIT License - see LICENSE file for details.
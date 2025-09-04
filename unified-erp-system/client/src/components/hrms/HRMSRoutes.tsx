import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeDashboard from '../../pages/hrms/EmployeeDashboard';
import EmployeeListPage from '../../pages/hrms/EmployeeListPage';
import DepartmentListPage from '../../pages/hrms/DepartmentListPage';

const HRMSRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/hrms/dashboard" replace />} />
      <Route path="/dashboard" element={<EmployeeDashboard />} />
      <Route path="/employees" element={<EmployeeListPage />} />
      <Route path="/departments" element={<DepartmentListPage />} />
      <Route path="*" element={<Navigate to="/hrms/dashboard" replace />} />
    </Routes>
  );
};

export default HRMSRoutes;
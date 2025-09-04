package com.unifiederp.employee.service;

import com.unifiederp.employee.dto.EmployeeDTO;
import com.unifiederp.employee.model.Employee;
import com.unifiederp.employee.model.Department;
import com.unifiederp.employee.repository.DepartmentRepository;
import com.unifiederp.employee.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public EmployeeDTO toDTO(Employee employee) {
        if (employee == null) {
            return null;
        }

        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setEmployeeId(employee.getEmployeeId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setAddress(employee.getAddress());
        dto.setPosition(employee.getPosition());
        dto.setStartDate(employee.getStartDate());
        dto.setEndDate(employee.getEndDate());
        dto.setStatus(employee.getStatus());
        dto.setSalary(employee.getSalary());
        dto.setManagerId(employee.getManagerId());
        dto.setCreatedAt(employee.getCreatedAt());
        dto.setUpdatedAt(employee.getUpdatedAt());

        // Set department information
        if (employee.getDepartment() != null) {
            dto.setDepartmentId(employee.getDepartment().getId());
            dto.setDepartmentName(employee.getDepartment().getName());
        }

        // Set manager name if manager exists
        if (employee.getManagerId() != null) {
            employeeRepository.findById(employee.getManagerId())
                    .ifPresent(manager -> dto.setManagerName(manager.getFullName()));
        }

        return dto;
    }

    public Employee toEntity(EmployeeDTO dto) {
        if (dto == null) {
            return null;
        }

        Employee employee = new Employee();
        employee.setId(dto.getId());
        employee.setEmployeeId(dto.getEmployeeId());
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setAddress(dto.getAddress());
        employee.setPosition(dto.getPosition());
        employee.setStartDate(dto.getStartDate());
        employee.setEndDate(dto.getEndDate());
        employee.setStatus(dto.getStatus());
        employee.setSalary(dto.getSalary());
        employee.setManagerId(dto.getManagerId());

        // Set department
        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElse(null);
            employee.setDepartment(department);
        }

        return employee;
    }

    public void updateEntityFromDTO(EmployeeDTO dto, Employee employee) {
        if (dto == null || employee == null) {
            return;
        }

        employee.setEmployeeId(dto.getEmployeeId());
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setAddress(dto.getAddress());
        employee.setPosition(dto.getPosition());
        employee.setStartDate(dto.getStartDate());
        employee.setEndDate(dto.getEndDate());
        employee.setStatus(dto.getStatus());
        employee.setSalary(dto.getSalary());
        employee.setManagerId(dto.getManagerId());

        // Update department
        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElse(null);
            employee.setDepartment(department);
        }
    }
}
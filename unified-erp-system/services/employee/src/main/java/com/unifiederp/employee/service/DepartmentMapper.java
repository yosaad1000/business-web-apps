package com.unifiederp.employee.service;

import com.unifiederp.employee.dto.DepartmentDTO;
import com.unifiederp.employee.model.Department;
import com.unifiederp.employee.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

    @Autowired
    private EmployeeRepository employeeRepository;

    public DepartmentDTO toDTO(Department department) {
        if (department == null) {
            return null;
        }

        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setManagerId(department.getManagerId());
        dto.setBudget(department.getBudget());
        dto.setCreatedAt(department.getCreatedAt());
        dto.setUpdatedAt(department.getUpdatedAt());

        // Set employee count
        dto.setEmployeeCount(department.getEmployeeCount());

        // Set manager name if manager exists
        if (department.getManagerId() != null) {
            employeeRepository.findById(department.getManagerId())
                    .ifPresent(manager -> dto.setManagerName(manager.getFullName()));
        }

        return dto;
    }

    public Department toEntity(DepartmentDTO dto) {
        if (dto == null) {
            return null;
        }

        Department department = new Department();
        department.setId(dto.getId());
        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        department.setManagerId(dto.getManagerId());
        department.setBudget(dto.getBudget());

        return department;
    }

    public void updateEntityFromDTO(DepartmentDTO dto, Department department) {
        if (dto == null || department == null) {
            return;
        }

        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        department.setManagerId(dto.getManagerId());
        department.setBudget(dto.getBudget());
    }
}
package com.unifiederp.employee.service;

import com.unifiederp.employee.dto.DepartmentDTO;
import com.unifiederp.employee.model.Department;
import com.unifiederp.employee.repository.DepartmentRepository;
import com.unifiederp.employee.repository.EmployeeRepository;
import com.unifiederp.employee.exception.ResourceNotFoundException;
import com.unifiederp.employee.exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentMapper departmentMapper;

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(departmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return departmentMapper.toDTO(department);
    }

    public DepartmentDTO getDepartmentByName(String name) {
        Department department = departmentRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with name: " + name));
        return departmentMapper.toDTO(department);
    }

    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        // Check for duplicate department name
        if (departmentRepository.existsByName(departmentDTO.getName())) {
            throw new DuplicateResourceException("Department name already exists: " + departmentDTO.getName());
        }

        Department department = departmentMapper.toEntity(departmentDTO);
        Department savedDepartment = departmentRepository.save(department);
        return departmentMapper.toDTO(savedDepartment);
    }

    public DepartmentDTO updateDepartment(Long id, DepartmentDTO departmentDTO) {
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        // Check for duplicate department name (excluding current department)
        if (!existingDepartment.getName().equals(departmentDTO.getName()) &&
            departmentRepository.existsByName(departmentDTO.getName())) {
            throw new DuplicateResourceException("Department name already exists: " + departmentDTO.getName());
        }

        departmentMapper.updateEntityFromDTO(departmentDTO, existingDepartment);
        Department updatedDepartment = departmentRepository.save(existingDepartment);
        return departmentMapper.toDTO(updatedDepartment);
    }

    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        // Check if department has employees
        Long employeeCount = employeeRepository.countActiveEmployeesByDepartment(id);
        if (employeeCount > 0) {
            throw new IllegalStateException("Cannot delete department with active employees. Please reassign employees first.");
        }

        departmentRepository.deleteById(id);
    }

    public List<DepartmentDTO> getDepartmentsByManager(Long managerId) {
        return departmentRepository.findByManagerId(managerId).stream()
                .map(departmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<DepartmentDTO> searchDepartments(String searchTerm) {
        return departmentRepository.findBySearchTerm(searchTerm).stream()
                .map(departmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public DepartmentDTO updateDepartmentManager(Long id, Long managerId) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        // Verify manager exists if managerId is provided
        if (managerId != null && !employeeRepository.existsById(managerId)) {
            throw new ResourceNotFoundException("Manager not found with id: " + managerId);
        }

        department.setManagerId(managerId);
        Department updatedDepartment = departmentRepository.save(department);
        return departmentMapper.toDTO(updatedDepartment);
    }
}
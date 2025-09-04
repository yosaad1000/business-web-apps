package com.unifiederp.employee.service;

import com.unifiederp.employee.dto.EmployeeDTO;
import com.unifiederp.employee.model.Employee;
import com.unifiederp.employee.model.EmployeeStatus;
import com.unifiederp.employee.repository.EmployeeRepository;
import com.unifiederp.employee.repository.DepartmentRepository;
import com.unifiederp.employee.exception.ResourceNotFoundException;
import com.unifiederp.employee.exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeMapper employeeMapper;

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(employeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Page<EmployeeDTO> getEmployeesWithPagination(Pageable pageable) {
        return employeeRepository.findAll(pageable)
                .map(employeeMapper::toDTO);
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return employeeMapper.toDTO(employee);
    }

    public EmployeeDTO getEmployeeByEmployeeId(String employeeId) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with employee ID: " + employeeId));
        return employeeMapper.toDTO(employee);
    }

    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        // Check for duplicate employee ID
        if (employeeRepository.existsByEmployeeId(employeeDTO.getEmployeeId())) {
            throw new DuplicateResourceException("Employee ID already exists: " + employeeDTO.getEmployeeId());
        }

        // Check for duplicate email
        if (employeeRepository.existsByEmail(employeeDTO.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + employeeDTO.getEmail());
        }

        // Verify department exists
        if (!departmentRepository.existsById(employeeDTO.getDepartmentId())) {
            throw new ResourceNotFoundException("Department not found with id: " + employeeDTO.getDepartmentId());
        }

        Employee employee = employeeMapper.toEntity(employeeDTO);
        Employee savedEmployee = employeeRepository.save(employee);
        return employeeMapper.toDTO(savedEmployee);
    }

    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        // Check for duplicate employee ID (excluding current employee)
        if (!existingEmployee.getEmployeeId().equals(employeeDTO.getEmployeeId()) &&
            employeeRepository.existsByEmployeeId(employeeDTO.getEmployeeId())) {
            throw new DuplicateResourceException("Employee ID already exists: " + employeeDTO.getEmployeeId());
        }

        // Check for duplicate email (excluding current employee)
        if (!existingEmployee.getEmail().equals(employeeDTO.getEmail()) &&
            employeeRepository.existsByEmail(employeeDTO.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + employeeDTO.getEmail());
        }

        // Verify department exists
        if (!departmentRepository.existsById(employeeDTO.getDepartmentId())) {
            throw new ResourceNotFoundException("Department not found with id: " + employeeDTO.getDepartmentId());
        }

        employeeMapper.updateEntityFromDTO(employeeDTO, existingEmployee);
        Employee updatedEmployee = employeeRepository.save(existingEmployee);
        return employeeMapper.toDTO(updatedEmployee);
    }

    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    public List<EmployeeDTO> getEmployeesByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId).stream()
                .map(employeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<EmployeeDTO> getEmployeesByStatus(EmployeeStatus status) {
        return employeeRepository.findByStatus(status).stream()
                .map(employeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<EmployeeDTO> getEmployeesByManager(Long managerId) {
        return employeeRepository.findByManagerId(managerId).stream()
                .map(employeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Page<EmployeeDTO> searchEmployees(String searchTerm, Pageable pageable) {
        return employeeRepository.findBySearchTerm(searchTerm, pageable)
                .map(employeeMapper::toDTO);
    }

    public EmployeeDTO updateEmployeeStatus(Long id, EmployeeStatus status) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        
        employee.setStatus(status);
        Employee updatedEmployee = employeeRepository.save(employee);
        return employeeMapper.toDTO(updatedEmployee);
    }

    public Long getActiveEmployeeCountByDepartment(Long departmentId) {
        return employeeRepository.countActiveEmployeesByDepartment(departmentId);
    }
}
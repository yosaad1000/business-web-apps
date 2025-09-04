package com.unifiederp.employee.service;

import com.unifiederp.employee.dto.EmployeeDTO;
import com.unifiederp.employee.model.Employee;
import com.unifiederp.employee.model.Department;
import com.unifiederp.employee.model.EmployeeStatus;
import com.unifiederp.employee.repository.EmployeeRepository;
import com.unifiederp.employee.repository.DepartmentRepository;
import com.unifiederp.employee.exception.ResourceNotFoundException;
import com.unifiederp.employee.exception.DuplicateResourceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private EmployeeMapper employeeMapper;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee testEmployee;
    private EmployeeDTO testEmployeeDTO;
    private Department testDepartment;

    @BeforeEach
    void setUp() {
        testDepartment = new Department("IT", "Information Technology");
        testDepartment.setId(1L);

        testEmployee = new Employee("EMP001", "John", "Doe", "john.doe@company.com",
                testDepartment, "Software Developer", LocalDate.now());
        testEmployee.setId(1L);

        testEmployeeDTO = new EmployeeDTO("EMP001", "John", "Doe", "john.doe@company.com",
                1L, "Software Developer", LocalDate.now());
        testEmployeeDTO.setId(1L);
    }

    @Test
    void getAllEmployees_ShouldReturnEmployeeList() {
        // Given
        List<Employee> employees = Arrays.asList(testEmployee);
        when(employeeRepository.findAll()).thenReturn(employees);
        when(employeeMapper.toDTO(testEmployee)).thenReturn(testEmployeeDTO);

        // When
        List<EmployeeDTO> result = employeeService.getAllEmployees();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testEmployeeDTO.getEmployeeId(), result.get(0).getEmployeeId());
        verify(employeeRepository).findAll();
        verify(employeeMapper).toDTO(testEmployee);
    }

    @Test
    void getEmployeeById_WhenEmployeeExists_ShouldReturnEmployee() {
        // Given
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(employeeMapper.toDTO(testEmployee)).thenReturn(testEmployeeDTO);

        // When
        EmployeeDTO result = employeeService.getEmployeeById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testEmployeeDTO.getEmployeeId(), result.getEmployeeId());
        verify(employeeRepository).findById(1L);
        verify(employeeMapper).toDTO(testEmployee);
    }

    @Test
    void getEmployeeById_WhenEmployeeNotExists_ShouldThrowException() {
        // Given
        when(employeeRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            employeeService.getEmployeeById(1L);
        });
        verify(employeeRepository).findById(1L);
        verify(employeeMapper, never()).toDTO(any());
    }

    @Test
    void createEmployee_WhenValidData_ShouldCreateEmployee() {
        // Given
        when(employeeRepository.existsByEmployeeId(testEmployeeDTO.getEmployeeId())).thenReturn(false);
        when(employeeRepository.existsByEmail(testEmployeeDTO.getEmail())).thenReturn(false);
        when(departmentRepository.existsById(testEmployeeDTO.getDepartmentId())).thenReturn(true);
        when(employeeMapper.toEntity(testEmployeeDTO)).thenReturn(testEmployee);
        when(employeeRepository.save(testEmployee)).thenReturn(testEmployee);
        when(employeeMapper.toDTO(testEmployee)).thenReturn(testEmployeeDTO);

        // When
        EmployeeDTO result = employeeService.createEmployee(testEmployeeDTO);

        // Then
        assertNotNull(result);
        assertEquals(testEmployeeDTO.getEmployeeId(), result.getEmployeeId());
        verify(employeeRepository).existsByEmployeeId(testEmployeeDTO.getEmployeeId());
        verify(employeeRepository).existsByEmail(testEmployeeDTO.getEmail());
        verify(departmentRepository).existsById(testEmployeeDTO.getDepartmentId());
        verify(employeeRepository).save(testEmployee);
    }

    @Test
    void createEmployee_WhenDuplicateEmployeeId_ShouldThrowException() {
        // Given
        when(employeeRepository.existsByEmployeeId(testEmployeeDTO.getEmployeeId())).thenReturn(true);

        // When & Then
        assertThrows(DuplicateResourceException.class, () -> {
            employeeService.createEmployee(testEmployeeDTO);
        });
        verify(employeeRepository).existsByEmployeeId(testEmployeeDTO.getEmployeeId());
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void createEmployee_WhenDuplicateEmail_ShouldThrowException() {
        // Given
        when(employeeRepository.existsByEmployeeId(testEmployeeDTO.getEmployeeId())).thenReturn(false);
        when(employeeRepository.existsByEmail(testEmployeeDTO.getEmail())).thenReturn(true);

        // When & Then
        assertThrows(DuplicateResourceException.class, () -> {
            employeeService.createEmployee(testEmployeeDTO);
        });
        verify(employeeRepository).existsByEmployeeId(testEmployeeDTO.getEmployeeId());
        verify(employeeRepository).existsByEmail(testEmployeeDTO.getEmail());
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void createEmployee_WhenDepartmentNotExists_ShouldThrowException() {
        // Given
        when(employeeRepository.existsByEmployeeId(testEmployeeDTO.getEmployeeId())).thenReturn(false);
        when(employeeRepository.existsByEmail(testEmployeeDTO.getEmail())).thenReturn(false);
        when(departmentRepository.existsById(testEmployeeDTO.getDepartmentId())).thenReturn(false);

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            employeeService.createEmployee(testEmployeeDTO);
        });
        verify(departmentRepository).existsById(testEmployeeDTO.getDepartmentId());
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void deleteEmployee_WhenEmployeeExists_ShouldDeleteEmployee() {
        // Given
        when(employeeRepository.existsById(1L)).thenReturn(true);

        // When
        employeeService.deleteEmployee(1L);

        // Then
        verify(employeeRepository).existsById(1L);
        verify(employeeRepository).deleteById(1L);
    }

    @Test
    void deleteEmployee_WhenEmployeeNotExists_ShouldThrowException() {
        // Given
        when(employeeRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            employeeService.deleteEmployee(1L);
        });
        verify(employeeRepository).existsById(1L);
        verify(employeeRepository, never()).deleteById(any());
    }

    @Test
    void updateEmployeeStatus_WhenEmployeeExists_ShouldUpdateStatus() {
        // Given
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(employeeRepository.save(testEmployee)).thenReturn(testEmployee);
        when(employeeMapper.toDTO(testEmployee)).thenReturn(testEmployeeDTO);

        // When
        EmployeeDTO result = employeeService.updateEmployeeStatus(1L, EmployeeStatus.INACTIVE);

        // Then
        assertNotNull(result);
        assertEquals(EmployeeStatus.INACTIVE, testEmployee.getStatus());
        verify(employeeRepository).findById(1L);
        verify(employeeRepository).save(testEmployee);
        verify(employeeMapper).toDTO(testEmployee);
    }
}
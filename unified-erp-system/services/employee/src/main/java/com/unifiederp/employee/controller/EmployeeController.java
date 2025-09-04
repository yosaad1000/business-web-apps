package com.unifiederp.employee.controller;

import com.unifiederp.employee.dto.EmployeeDTO;
import com.unifiederp.employee.model.EmployeeStatus;
import com.unifiederp.employee.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        List<EmployeeDTO> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<EmployeeDTO>> getEmployeesWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<EmployeeDTO> employees = employeeService.getEmployeesWithPagination(pageable);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        EmployeeDTO employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/employee-id/{employeeId}")
    public ResponseEntity<EmployeeDTO> getEmployeeByEmployeeId(@PathVariable String employeeId) {
        EmployeeDTO employee = employeeService.getEmployeeByEmployeeId(employeeId);
        return ResponseEntity.ok(employee);
    }

    @PostMapping
    public ResponseEntity<EmployeeDTO> createEmployee(@Valid @RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO createdEmployee = employeeService.createEmployee(employeeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long id, 
                                                     @Valid @RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO updatedEmployee = employeeService.updateEmployee(id, employeeDTO);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByDepartment(@PathVariable Long departmentId) {
        List<EmployeeDTO> employees = employeeService.getEmployeesByDepartment(departmentId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByStatus(@PathVariable EmployeeStatus status) {
        List<EmployeeDTO> employees = employeeService.getEmployeesByStatus(status);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByManager(@PathVariable Long managerId) {
        List<EmployeeDTO> employees = employeeService.getEmployeesByManager(managerId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<EmployeeDTO>> searchEmployees(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<EmployeeDTO> employees = employeeService.searchEmployees(searchTerm, pageable);
        return ResponseEntity.ok(employees);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EmployeeDTO> updateEmployeeStatus(@PathVariable Long id, 
                                                           @RequestParam EmployeeStatus status) {
        EmployeeDTO updatedEmployee = employeeService.updateEmployeeStatus(id, status);
        return ResponseEntity.ok(updatedEmployee);
    }

    @GetMapping("/department/{departmentId}/count")
    public ResponseEntity<Long> getActiveEmployeeCountByDepartment(@PathVariable Long departmentId) {
        Long count = employeeService.getActiveEmployeeCountByDepartment(departmentId);
        return ResponseEntity.ok(count);
    }
}
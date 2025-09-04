package com.unifiederp.employee.controller;

import com.unifiederp.employee.dto.DepartmentDTO;
import com.unifiederp.employee.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentDTO>> getAllDepartments() {
        List<DepartmentDTO> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDTO> getDepartmentById(@PathVariable Long id) {
        DepartmentDTO department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(department);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<DepartmentDTO> getDepartmentByName(@PathVariable String name) {
        DepartmentDTO department = departmentService.getDepartmentByName(name);
        return ResponseEntity.ok(department);
    }

    @PostMapping
    public ResponseEntity<DepartmentDTO> createDepartment(@Valid @RequestBody DepartmentDTO departmentDTO) {
        DepartmentDTO createdDepartment = departmentService.createDepartment(departmentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDepartment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDTO> updateDepartment(@PathVariable Long id, 
                                                         @Valid @RequestBody DepartmentDTO departmentDTO) {
        DepartmentDTO updatedDepartment = departmentService.updateDepartment(id, departmentDTO);
        return ResponseEntity.ok(updatedDepartment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<DepartmentDTO>> getDepartmentsByManager(@PathVariable Long managerId) {
        List<DepartmentDTO> departments = departmentService.getDepartmentsByManager(managerId);
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/search")
    public ResponseEntity<List<DepartmentDTO>> searchDepartments(@RequestParam String searchTerm) {
        List<DepartmentDTO> departments = departmentService.searchDepartments(searchTerm);
        return ResponseEntity.ok(departments);
    }

    @PatchMapping("/{id}/manager")
    public ResponseEntity<DepartmentDTO> updateDepartmentManager(@PathVariable Long id, 
                                                                @RequestParam(required = false) Long managerId) {
        DepartmentDTO updatedDepartment = departmentService.updateDepartmentManager(id, managerId);
        return ResponseEntity.ok(updatedDepartment);
    }
}
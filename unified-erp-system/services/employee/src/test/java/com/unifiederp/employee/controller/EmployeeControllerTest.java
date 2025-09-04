package com.unifiederp.employee.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unifiederp.employee.dto.EmployeeDTO;
import com.unifiederp.employee.model.EmployeeStatus;
import com.unifiederp.employee.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeService employeeService;

    @Autowired
    private ObjectMapper objectMapper;

    private EmployeeDTO testEmployeeDTO;

    @BeforeEach
    void setUp() {
        testEmployeeDTO = new EmployeeDTO("EMP001", "John", "Doe", "john.doe@company.com",
                1L, "Software Developer", LocalDate.now());
        testEmployeeDTO.setId(1L);
        testEmployeeDTO.setStatus(EmployeeStatus.ACTIVE);
    }

    @Test
    void getAllEmployees_ShouldReturnEmployeeList() throws Exception {
        // Given
        List<EmployeeDTO> employees = Arrays.asList(testEmployeeDTO);
        when(employeeService.getAllEmployees()).thenReturn(employees);

        // When & Then
        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].employeeId").value("EMP001"))
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[0].lastName").value("Doe"));

        verify(employeeService).getAllEmployees();
    }

    @Test
    void getEmployeeById_WhenEmployeeExists_ShouldReturnEmployee() throws Exception {
        // Given
        when(employeeService.getEmployeeById(1L)).thenReturn(testEmployeeDTO);

        // When & Then
        mockMvc.perform(get("/api/employees/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.employeeId").value("EMP001"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));

        verify(employeeService).getEmployeeById(1L);
    }

    @Test
    void createEmployee_WhenValidData_ShouldCreateEmployee() throws Exception {
        // Given
        EmployeeDTO newEmployee = new EmployeeDTO("EMP002", "Jane", "Smith", "jane.smith@company.com",
                1L, "Product Manager", LocalDate.now());
        newEmployee.setStatus(EmployeeStatus.ACTIVE);

        EmployeeDTO createdEmployee = new EmployeeDTO("EMP002", "Jane", "Smith", "jane.smith@company.com",
                1L, "Product Manager", LocalDate.now());
        createdEmployee.setId(2L);
        createdEmployee.setStatus(EmployeeStatus.ACTIVE);

        when(employeeService.createEmployee(any(EmployeeDTO.class))).thenReturn(createdEmployee);

        // When & Then
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newEmployee)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.employeeId").value("EMP002"))
                .andExpect(jsonPath("$.firstName").value("Jane"))
                .andExpect(jsonPath("$.lastName").value("Smith"))
                .andExpect(jsonPath("$.id").value(2));

        verify(employeeService).createEmployee(any(EmployeeDTO.class));
    }

    @Test
    void updateEmployee_WhenValidData_ShouldUpdateEmployee() throws Exception {
        // Given
        EmployeeDTO updatedEmployee = new EmployeeDTO("EMP001", "John", "Doe", "john.doe@company.com",
                1L, "Senior Software Developer", LocalDate.now());
        updatedEmployee.setId(1L);
        updatedEmployee.setStatus(EmployeeStatus.ACTIVE);

        when(employeeService.updateEmployee(eq(1L), any(EmployeeDTO.class))).thenReturn(updatedEmployee);

        // When & Then
        mockMvc.perform(put("/api/employees/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedEmployee)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.position").value("Senior Software Developer"));

        verify(employeeService).updateEmployee(eq(1L), any(EmployeeDTO.class));
    }

    @Test
    void deleteEmployee_WhenEmployeeExists_ShouldDeleteEmployee() throws Exception {
        // Given
        doNothing().when(employeeService).deleteEmployee(1L);

        // When & Then
        mockMvc.perform(delete("/api/employees/1"))
                .andExpect(status().isNoContent());

        verify(employeeService).deleteEmployee(1L);
    }

    @Test
    void updateEmployeeStatus_WhenValidStatus_ShouldUpdateStatus() throws Exception {
        // Given
        EmployeeDTO updatedEmployee = new EmployeeDTO("EMP001", "John", "Doe", "john.doe@company.com",
                1L, "Software Developer", LocalDate.now());
        updatedEmployee.setId(1L);
        updatedEmployee.setStatus(EmployeeStatus.INACTIVE);

        when(employeeService.updateEmployeeStatus(1L, EmployeeStatus.INACTIVE)).thenReturn(updatedEmployee);

        // When & Then
        mockMvc.perform(patch("/api/employees/1/status")
                        .param("status", "INACTIVE"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("INACTIVE"));

        verify(employeeService).updateEmployeeStatus(1L, EmployeeStatus.INACTIVE);
    }
}
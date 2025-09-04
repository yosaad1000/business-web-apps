package com.unifiederp.employee.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class DepartmentDTO {
    private Long id;
    
    @NotBlank(message = "Department name is required")
    private String name;
    
    private String description;
    private Long managerId;
    private String managerName;
    private Double budget;
    private int employeeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public DepartmentDTO() {}

    public DepartmentDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public int getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(int employeeCount) { this.employeeCount = employeeCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
package com.unifiederp.shared.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "permissions")
public class Permission extends BaseEntity {

    @NotBlank(message = "Permission name is required")
    @Size(max = 100, message = "Permission name must not exceed 100 characters")
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;

    @NotBlank(message = "Module is required")
    @Size(max = 50, message = "Module must not exceed 50 characters")
    @Column(name = "module", nullable = false, length = 50)
    private String module;

    @NotBlank(message = "Action is required")
    @Size(max = 50, message = "Action must not exceed 50 characters")
    @Column(name = "action", nullable = false, length = 50)
    private String action;

    @ManyToMany(mappedBy = "permissions", fetch = FetchType.LAZY)
    private Set<Role> roles = new HashSet<>();

    @Column(name = "is_active")
    private Boolean isActive = true;

    // Constructors
    public Permission() {}

    public Permission(String name, String module, String action) {
        this.name = name;
        this.module = module;
        this.action = action;
    }

    public Permission(String name, String description, String module, String action) {
        this.name = name;
        this.description = description;
        this.module = module;
        this.action = action;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    // Utility methods
    public String getFullPermissionName() {
        return module + ":" + action;
    }

    // Common permission constants
    public static class Modules {
        public static final String HRMS = "HRMS";
        public static final String INVOICE = "INVOICE";
        public static final String QUIZ = "QUIZ";
        public static final String JOBS = "JOBS";
        public static final String CRUD = "CRUD";
        public static final String ADMIN = "ADMIN";
    }

    public static class Actions {
        public static final String CREATE = "CREATE";
        public static final String READ = "READ";
        public static final String UPDATE = "UPDATE";
        public static final String DELETE = "DELETE";
        public static final String APPROVE = "APPROVE";
        public static final String ASSIGN = "ASSIGN";
        public static final String REPORT = "REPORT";
    }
}
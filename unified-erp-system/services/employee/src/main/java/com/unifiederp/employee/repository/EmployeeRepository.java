package com.unifiederp.employee.repository;

import com.unifiederp.employee.model.Employee;
import com.unifiederp.employee.model.EmployeeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmployeeId(String employeeId);
    
    Optional<Employee> findByEmail(String email);
    
    List<Employee> findByDepartmentId(Long departmentId);
    
    List<Employee> findByStatus(EmployeeStatus status);
    
    List<Employee> findByManagerId(Long managerId);
    
    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.employeeId) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Employee> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT e FROM Employee e WHERE e.department.id = :departmentId AND e.status = :status")
    List<Employee> findByDepartmentIdAndStatus(@Param("departmentId") Long departmentId, 
                                              @Param("status") EmployeeStatus status);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department.id = :departmentId AND e.status = 'ACTIVE'")
    Long countActiveEmployeesByDepartment(@Param("departmentId") Long departmentId);
    
    boolean existsByEmployeeId(String employeeId);
    
    boolean existsByEmail(String email);
}
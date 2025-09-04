package com.unifiederp.shared.repository;

import com.unifiederp.shared.entity.AuditLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserIdOrderByTimestampDesc(String userId, Pageable pageable);

    List<AuditLog> findByModuleOrderByTimestampDesc(String module, Pageable pageable);

    List<AuditLog> findByResourceTypeAndResourceIdOrderByTimestampDesc(
            String resourceType, String resourceId, Pageable pageable);

    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.userId = :userId AND a.module = :module ORDER BY a.timestamp DESC")
    List<AuditLog> findByUserIdAndModuleOrderByTimestampDesc(
            @Param("userId") String userId, @Param("module") String module, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.action = :action AND a.timestamp >= :since ORDER BY a.timestamp DESC")
    List<AuditLog> findByActionSince(
            @Param("action") String action, @Param("since") LocalDateTime since, Pageable pageable);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.userId = :userId AND a.timestamp >= :since")
    long countUserActionsSince(@Param("userId") String userId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.module = :module AND a.timestamp >= :since")
    long countModuleActionsSince(@Param("module") String module, @Param("since") LocalDateTime since);

    @Query("SELECT a.action, COUNT(a) FROM AuditLog a WHERE a.timestamp >= :since GROUP BY a.action")
    List<Object[]> getActionStatisticsSince(@Param("since") LocalDateTime since);

    @Query("SELECT a.module, COUNT(a) FROM AuditLog a WHERE a.timestamp >= :since GROUP BY a.module")
    List<Object[]> getModuleStatisticsSince(@Param("since") LocalDateTime since);
}
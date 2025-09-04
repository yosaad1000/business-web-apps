package com.unifiederp.shared.service;

import com.unifiederp.shared.entity.AuditLog;
import com.unifiederp.shared.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class AuditLogService {

    private static final Logger logger = LoggerFactory.getLogger(AuditLogService.class);

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Async
    public void logUserAction(String userId, String action, String module, 
                             String resourceType, String resourceId, 
                             Map<String, Object> details) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setUserId(userId);
            auditLog.setAction(action);
            auditLog.setModule(module);
            auditLog.setResourceType(resourceType);
            auditLog.setResourceId(resourceId);
            auditLog.setDetails(details);
            auditLog.setTimestamp(LocalDateTime.now());
            auditLog.setIpAddress(getCurrentUserIpAddress());
            auditLog.setUserAgent(getCurrentUserAgent());

            auditLogRepository.save(auditLog);
            
            logger.info("Audit log created: User {} performed {} on {} {} in module {}", 
                       userId, action, resourceType, resourceId, module);
                       
        } catch (Exception e) {
            logger.error("Failed to create audit log: ", e);
        }
    }

    @Async
    public void logSystemEvent(String event, String module, String description, 
                              Map<String, Object> details) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setUserId("SYSTEM");
            auditLog.setAction(event);
            auditLog.setModule(module);
            auditLog.setResourceType("SYSTEM_EVENT");
            auditLog.setResourceId(null);
            auditLog.setDetails(details);
            auditLog.setTimestamp(LocalDateTime.now());
            auditLog.setDescription(description);

            auditLogRepository.save(auditLog);
            
            logger.info("System event logged: {} in module {} - {}", event, module, description);
            
        } catch (Exception e) {
            logger.error("Failed to log system event: ", e);
        }
    }

    public List<AuditLog> getUserAuditLogs(String userId, int limit) {
        return auditLogRepository.findByUserIdOrderByTimestampDesc(userId, 
                org.springframework.data.domain.PageRequest.of(0, limit));
    }

    public List<AuditLog> getModuleAuditLogs(String module, int limit) {
        return auditLogRepository.findByModuleOrderByTimestampDesc(module, 
                org.springframework.data.domain.PageRequest.of(0, limit));
    }

    public List<AuditLog> getResourceAuditLogs(String resourceType, String resourceId, int limit) {
        return auditLogRepository.findByResourceTypeAndResourceIdOrderByTimestampDesc(
                resourceType, resourceId, 
                org.springframework.data.domain.PageRequest.of(0, limit));
    }

    public List<AuditLog> getAuditLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate, int limit) {
        return auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(
                startDate, endDate, 
                org.springframework.data.domain.PageRequest.of(0, limit));
    }

    // Helper methods to get current request context
    private String getCurrentUserIpAddress() {
        // This would typically get the IP from the current HTTP request
        // For now, return a placeholder
        return "127.0.0.1";
    }

    private String getCurrentUserAgent() {
        // This would typically get the User-Agent from the current HTTP request
        // For now, return a placeholder
        return "ERP-System";
    }

    // Audit action constants
    public static class Actions {
        public static final String CREATE = "CREATE";
        public static final String READ = "READ";
        public static final String UPDATE = "UPDATE";
        public static final String DELETE = "DELETE";
        public static final String LOGIN = "LOGIN";
        public static final String LOGOUT = "LOGOUT";
        public static final String APPROVE = "APPROVE";
        public static final String REJECT = "REJECT";
        public static final String ASSIGN = "ASSIGN";
        public static final String EXPORT = "EXPORT";
        public static final String IMPORT = "IMPORT";
    }

    // Module constants
    public static class Modules {
        public static final String HRMS = "HRMS";
        public static final String INVOICE = "INVOICE";
        public static final String QUIZ = "QUIZ";
        public static final String JOBS = "JOBS";
        public static final String CRUD = "CRUD";
        public static final String AUTH = "AUTH";
        public static final String SYSTEM = "SYSTEM";
    }
}
package com.unifiederp.gateway.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${server.port}")
    private String serverPort;

    @GetMapping
    public Mono<ResponseEntity<Map<String, Object>>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", applicationName);
        health.put("port", serverPort);
        health.put("timestamp", Instant.now().toString());
        health.put("version", "1.0.0");
        
        return Mono.just(ResponseEntity.ok(health));
    }

    @GetMapping("/ready")
    public Mono<ResponseEntity<Map<String, Object>>> ready() {
        Map<String, Object> readiness = new HashMap<>();
        readiness.put("status", "READY");
        readiness.put("service", applicationName);
        readiness.put("timestamp", Instant.now().toString());
        
        return Mono.just(ResponseEntity.ok(readiness));
    }

    @GetMapping("/live")
    public Mono<ResponseEntity<Map<String, Object>>> live() {
        Map<String, Object> liveness = new HashMap<>();
        liveness.put("status", "ALIVE");
        liveness.put("service", applicationName);
        liveness.put("timestamp", Instant.now().toString());
        
        return Mono.just(ResponseEntity.ok(liveness));
    }
}
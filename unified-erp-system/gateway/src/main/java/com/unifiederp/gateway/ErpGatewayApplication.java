package com.unifiederp.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ErpGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ErpGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Employee Service Routes
                .route("employee-service", r -> r.path("/api/employees/**")
                        .uri("http://localhost:8081"))
                
                // Invoice Service Routes
                .route("invoice-service", r -> r.path("/api/invoices/**")
                        .uri("http://localhost:8082"))
                
                // Quiz Service Routes
                .route("quiz-service", r -> r.path("/api/quizzes/**")
                        .uri("http://localhost:8083"))
                
                // Job Service Routes
                .route("job-service", r -> r.path("/api/jobs/**")
                        .uri("http://localhost:8084"))
                
                // CRUD Service Routes
                .route("crud-service", r -> r.path("/api/crud/**")
                        .uri("http://localhost:8085"))
                
                // Health check routes
                .route("health-check", r -> r.path("/health/**")
                        .uri("http://localhost:8080"))
                
                .build();
    }
}
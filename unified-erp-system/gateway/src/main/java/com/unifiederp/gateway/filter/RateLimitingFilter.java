package com.unifiederp.gateway.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;

@Component
public class RateLimitingFilter implements GlobalFilter, Ordered {

    @Autowired
    private ReactiveRedisTemplate<String, String> redisTemplate;

    private static final int REQUESTS_PER_MINUTE = 100;
    private static final Duration WINDOW_DURATION = Duration.ofMinutes(1);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String clientId = getClientId(exchange);
        String key = "rate_limit:" + clientId;
        
        return redisTemplate.opsForValue()
                .get(key)
                .cast(String.class)
                .defaultIfEmpty("0")
                .flatMap(currentCount -> {
                    int count = Integer.parseInt(currentCount);
                    
                    if (count >= REQUESTS_PER_MINUTE) {
                        return handleRateLimitExceeded(exchange);
                    }
                    
                    // Increment counter
                    return redisTemplate.opsForValue()
                            .increment(key)
                            .flatMap(newCount -> {
                                if (newCount == 1) {
                                    // Set expiration for new key
                                    return redisTemplate.expire(key, WINDOW_DURATION)
                                            .then(chain.filter(exchange));
                                }
                                return chain.filter(exchange);
                            });
                })
                .onErrorResume(error -> {
                    // If Redis is unavailable, allow the request to proceed
                    return chain.filter(exchange);
                });
    }

    private String getClientId(ServerWebExchange exchange) {
        // Use IP address as client identifier
        String xForwardedFor = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = exchange.getRequest().getHeaders().getFirst("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return exchange.getRequest().getRemoteAddress() != null 
                ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
                : "unknown";
    }

    private Mono<Void> handleRateLimitExceeded(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
        response.getHeaders().add("X-Rate-Limit-Exceeded", "true");
        response.getHeaders().add("Retry-After", "60");
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return 0; // Execute after authentication but before routing
    }
}
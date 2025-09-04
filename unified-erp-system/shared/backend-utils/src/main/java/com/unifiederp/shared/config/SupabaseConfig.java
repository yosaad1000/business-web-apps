package com.unifiederp.shared.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
@ConditionalOnProperty(name = "supabase.enabled", havingValue = "true", matchIfMissing = true)
public class SupabaseConfig {

    @Value("${supabase.db.url}")
    private String supabaseDbUrl;

    @Value("${supabase.db.username}")
    private String supabaseDbUsername;

    @Value("${supabase.db.password}")
    private String supabaseDbPassword;

    @Bean
    @Primary
    public DataSource supabaseDataSource() {
        return DataSourceBuilder.create()
                .url(supabaseDbUrl)
                .username(supabaseDbUsername)
                .password(supabaseDbPassword)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
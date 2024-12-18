package com.example.taskmanager.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
public class SecurityConfig {

//    @Value("${frontend.url}")
//    private String frontendUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless applications (e.g., with JWT)
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    corsConfig.setAllowedOrigins(List.of("*"));
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE")); // Allowed HTTP methods
                    corsConfig.setAllowedHeaders(List.of("*")); // Allow all headers
//                    corsConfig.setAllowCredentials(true); // Allow cookies (if needed)
                    return corsConfig;
                }))
                .authorizeHttpRequests(authz -> authz
//                        .requestMatchers("/login", "/signup", "/callback").permitAll()
                        .requestMatchers("/api/tasks").permitAll()
                        .requestMatchers("/api/tasks/**").permitAll()
                        .anyRequest().authenticated() // All other requests must be authenticated
                )
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // Stateless authentication (JWT)

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManager.class); // Access the AuthenticationManager
    }
}
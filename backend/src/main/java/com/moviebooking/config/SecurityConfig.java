package com.moviebooking.config;

import com.moviebooking.security.JwtAuthenticationEntryPoint;
import com.moviebooking.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {})
            .csrf(AbstractHttpConfigurer::disable)
            .exceptionHandling(exception -> exception
                    .authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    // Static frontend files
                    .requestMatchers("/", "/index.html", "/assets/**", "/qr-payment.png", "/favicon.ico").permitAll()
                    // SPA routes (non-API paths)
                    .requestMatchers("/login", "/register", "/movies/**", "/cinemas", "/booking/**", "/my-bookings", "/payment/**", "/admin/**").permitAll()
                    // Public endpoints
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/payment/vnpay-callback").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/movies/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/cinemas/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/showtimes/**").permitAll()
                    // Swagger
                    .requestMatchers("/swagger-ui/**", "/api-docs/**", "/swagger-ui.html").permitAll()
                    // Admin endpoints
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/movies/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/movies/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/movies/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/cinemas/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/cinemas/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/cinemas/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/rooms/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/rooms/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/rooms/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/showtimes/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/showtimes/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/showtimes/**").hasRole("ADMIN")
                    // Authenticated endpoints
                    .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

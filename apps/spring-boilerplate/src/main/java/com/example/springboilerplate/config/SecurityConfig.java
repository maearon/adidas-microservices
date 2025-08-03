package com.example.springboilerplate.config;

import com.example.springboilerplate.security.JwtAuthenticationEntryPoint;
import com.example.springboilerplate.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    // Removed unused field customUserDetailsService
    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Sử dụng @Lazy để phá vỡ circular dependency
    public SecurityConfig(JwtAuthenticationEntryPoint unauthorizedHandler,
                          @Lazy JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "http://192.168.1.9:3001",
            "http://localhost:3002",
            "http://localhost:4200",
            "http://localhost:8000",
            "http://localhost:8080",
            "http://localhost:5173",
            "http://localhost:8081",
            "http://localhost:5555",
            "http://192.168.1.7:5555",
            "http://192.168.1.7:8081",
            "exp://192.168.1.7:8081",
            "http://localhost:19006",
            "https://aa9e-2001-ee0-4422-98f0-73c6-d4af-616c-fc1.ngrok-free.app",
            "https://studio.apollographql.com",
            "https://angular-boilerplate-eta-sepia.vercel.app",
            "https://funny-movies-79gl1t9ss-maearons-projects.vercel.app",
            "https://funny-movies-pied.vercel.app",
            "https://sample-1xdla8a74-maearons-projects.vercel.app",
            "https://sample-app-beta-lac.vercel.app",
            "https://vue-boilerplate-psi.vercel.app",
            "https://react-boilerplate-tau.vercel.app",
            "https://adidas-mocha.vercel.app"
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true); // Cho phép gửi cookie & auth header

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/favicon.ico").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/password-reset/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/home", "/about", "/help", "/contact").permitAll()
                .requestMatchers("/images/**", "/webjars/**").permitAll()
                .requestMatchers("/api/signup", "/api/login", "/api/social-login", "/error").permitAll()
                .requestMatchers("/api/users").permitAll()
                .requestMatchers("/account-activation/**").permitAll()
                .requestMatchers("/api/password-resets/**").permitAll()
                .requestMatchers(
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()
                .requestMatchers("/up").permitAll()
                .requestMatchers("/api/check-email").permitAll()
                .requestMatchers("/api/account_activations/**").permitAll()
                .anyRequest().authenticated()
            );

        // Thêm filter để xác thực JWT token
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        // Cho phép frames cho H2 console
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }
}

package com.example.springboilerplate.security;

import com.example.springboilerplate.security.JwtTokenProvider.TokenExpiredException;
import com.example.springboilerplate.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.AntPathMatcher;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(@Lazy CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    private static final List<String> EXCLUDED_PATHS = List.of(
            "/favicon.ico",
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/api/login",
            "/oauth/callback", "/api/oauth/**",
            "/api/signup",
            "/api/password-reset/**",
            "/api/account-activation",
            "/uploads/**",
            "/error"
    );

    private static final AntPathMatcher pathMatcher = new AntPathMatcher();

    private boolean isExcludedPath(String path) {
        boolean result = EXCLUDED_PATHS.stream().anyMatch(pattern -> {
            boolean matched = pathMatcher.match(pattern, path);
            if (matched) {
                System.out.println("✅ Excluded path matched: " + pattern + " with " + path);
            }
            return matched;
        });
        if (!result) {
            System.out.println("❌ Path not excluded: " + path);
        }
        return result;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String method = request.getMethod();
        String path = request.getRequestURI();
        System.out.println("JWT filter triggered for: " + method + " " + path);

        if (isExcludedPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = getJwtFromRequest(request);
            System.out.println("Extracted jwt: " + jwt);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String userId = null;
                try {
                    userId = tokenProvider.getUserIdFromJWT(jwt);
                    System.out.println("Extracted userId from token: " + userId);
                } catch (Exception e) {
                    logger.warn("Invalid JWT while extracting user ID", e);
                }

                if (userId != null) {
                    UserDetails userDetails = customUserDetailsService.loadUserById(userId);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (TokenExpiredException ex) {
            logger.warn("Token expired: " + ex.getMessage(), ex);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT token has expired");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

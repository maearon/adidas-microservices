package com.example.springboilerplate.controller.api;

import com.example.springboilerplate.dto.*;
import com.example.springboilerplate.model.User;
import com.example.springboilerplate.repository.UserRepository;
import com.example.springboilerplate.security.JwtTokenProvider;
import com.example.springboilerplate.service.AuthService;
import com.example.springboilerplate.service.OAuth2VerifierService;
import com.example.springboilerplate.service.UserService;
import lombok.RequiredArgsConstructor;
import java.time.Instant;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.springboilerplate.security.UserPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthApiController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final OAuth2VerifierService oAuth2VerifierService;
    private final AuthService authService;
    private final UserRepository userRepository;

    @GetMapping("/sessions")
    public ResponseEntity<?> sessions(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        SessionResponseDto.UserDto userDto = SessionResponseDto.UserDto.builder()
                .id(currentUser.getId())
                .email(currentUser.getEmail())
                .name(currentUser.getName())
                .admin(currentUser.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")))
                .avatar(currentUser.getGravatar())
                .level("LEVEL 1")
                .token(currentUser.getToken()) // ✅ giống Rails: json.token @current_user_token
                .build();

        return ResponseEntity.ok(Map.of("user", userDto));
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody EmailCheckRequestDto req) {
        String email = req.getEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                    "exists", true,
                    "user", Map.of(
                            "activated", user.isActivated() // assuming `isActivated()` is a boolean getter
                    )
            ));
        } else {
            return ResponseEntity.ok(Map.of("exists", false));
        }
    }

    @PostMapping("/oauth/callback")
    public ResponseEntity<?> handleOAuthCallback(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        String provider = body.getOrDefault("provider", "google");

        System.out.println("👉 Received OAuth callback: code=" + code + ", provider=" + provider);

        OAuthUserInfo oAuthInfo = oAuth2VerifierService.exchangeCodeForUserInfo(code);
        if (oAuthInfo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OAuth code");
        }

        User user = authService.findOrCreateUserFromOAuth(oAuthInfo, provider);

        // Tạo authentication và sinh token
        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        Instant expiresAt = tokenProvider.getExpirationFromToken(accessToken);
        Instant expiresAtRefresh = tokenProvider.getExpirationFromToken(refreshToken);

        JwtResponseDto jwtResponse = JwtResponseDto.builder()
            .user(JwtResponseDto.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .admin(principal.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")))
                .build())
            .tokens(JwtResponseDto.TokenGroupDto.builder()
                .access(JwtResponseDto.TokenDto.builder()
                    .token(accessToken)
                    .expires(expiresAt)
                    .build())
                .refresh(JwtResponseDto.TokenDto.builder()
                    .token(refreshToken)
                    .expires(expiresAtRefresh)
                    .build())
                .build())
            .build();

        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@Valid @RequestBody Map<String, SocialLoginDto> payload) {
        SocialLoginDto socialLoginDto = payload.get("session");
        Optional<User> userOpt = authService.findOrCreateUserFromProviderIdOrEmail(
                socialLoginDto.getProviderId(),
                socialLoginDto.getEmail(),
                socialLoginDto.getProvider()
        );

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        // sinh JWT
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userPrincipal, null, userPrincipal.getAuthorities()
        );

        String token = tokenProvider.generateToken(authentication);
        String refresh = tokenProvider.generateRefreshToken(authentication);

        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName()
            )
        ));
    }

    @PostMapping("/login")
    // public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDto loginDto) {
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody Map<String, LoginDto> payload) {
        LoginDto loginDto = payload.get("session");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        String jwtRefresh = tokenProvider.generateRefreshToken(authentication);
        
        // User user = (User) authentication.getPrincipal();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        // JwtResponseDto jwtResponse = new JwtResponseDto(
        //     jwt,
        //     userPrincipal.getId(),
        //     userPrincipal.getName(),
        //     userPrincipal.getEmail(),
        //     userPrincipal.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))
        // );
        // User user = userService.findById(userPrincipal.getId());

        Instant expiresAt = tokenProvider.getExpirationFromToken(jwt); // bạn cần cài đặt hàm này
        Instant expiresAtRefresh = tokenProvider.getExpirationFromToken(jwtRefresh); // bạn cần cài đặt hàm này

        JwtResponseDto jwtResponse = JwtResponseDto.builder()
            .user(JwtResponseDto.UserDto.builder()
                .id(userPrincipal.getId())
                .email(userPrincipal.getEmail())
                .name(userPrincipal.getName())
                .admin(userPrincipal.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")))
                // .passwordHash(user.getPasswordDigest()) // cần hàm `getPasswordDigest()` trong entity
                // .token(jwt)
                .build())
            .tokens(JwtResponseDto.TokenGroupDto.builder()
                .access(JwtResponseDto.TokenDto.builder()
                    .token(jwt)
                    .expires(expiresAt)
                    .build())
                .refresh(JwtResponseDto.TokenDto.builder()
                    .token(jwtRefresh) // bạn cần tạo refresh token nếu cần
                    .expires(expiresAtRefresh)
                    .build())
                .build())
            .build();
        return ResponseEntity.ok((Object) jwtResponse); // ép kiểu về Object
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        RegisterDto registerDto = request.getUser();
        if (userService.existsByEmail(registerDto.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Email is already taken!"));
        }
        String name = registerDto.getName();
        if (name == null || name.isBlank()) {
            name = registerDto.getEmail().split("@")[0];
        }
        try {
            userService.registerNewUser(
                name,
                registerDto.getEmail(),
                registerDto.getPassword()
            );

            // return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
            return ResponseEntity.ok(new ApiResponse(true, "Please check your email to activate your account."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Failed to register user."));
        }
    }

    @DeleteMapping("/logout")
    public ResponseEntity<?> destroy(@AuthenticationPrincipal UserPrincipal currentUser) {
        userService.revokeRefreshToken(currentUser.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequestDto request) {
        String refreshToken = request.getRefreshToken();
        Optional<User> userOpt = userRepository.findByRefreshToken(refreshToken);

        if (userOpt.isPresent() && isRefreshTokenValid(userOpt.get())) {
            User user = userOpt.get();

            // Tạo Authentication object thủ công
            UserPrincipal userPrincipal = UserPrincipal.create(user);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userPrincipal, null, userPrincipal.getAuthorities());

            String newJwt = tokenProvider.generateToken(authentication);
            String newJwtRefresh = tokenProvider.generateRefreshToken(authentication);

            // Update token mới trong DB
            user.setRefreshToken(newJwtRefresh);
            user.setRefreshTokenExpirationAt(LocalDateTime.now().plusDays(7));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "accessToken", newJwt,
                "refreshToken", newJwtRefresh
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid or expired refresh token"));
    }

    @PostMapping("/revoke")
    public ResponseEntity<?> revoke(@RequestBody RefreshTokenRequestDto request) {
        String refreshToken = request.getRefreshToken();
        Optional<User> userOpt = userRepository.findByRefreshToken(refreshToken);

        if (userOpt.isPresent() && isRefreshTokenValid(userOpt.get())) {
            User user = userOpt.get();
            user.setRefreshToken(null);
            user.setRefreshTokenExpirationAt(null);
            userRepository.save(user);
        }

        return ResponseEntity.ok().build();
    }

    private boolean isRefreshTokenValid(User user) {
        return user.getRefreshTokenExpirationAt() != null &&
               user.getRefreshTokenExpirationAt().isAfter(LocalDateTime.now());
    }
}

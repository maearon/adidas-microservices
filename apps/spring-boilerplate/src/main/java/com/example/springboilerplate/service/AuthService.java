package com.example.springboilerplate.service;

import com.example.springboilerplate.dto.AuthResponse;
import com.example.springboilerplate.dto.OAuthUserInfo;
import com.example.springboilerplate.model.User;
import com.example.springboilerplate.model.UserProvider;
import com.example.springboilerplate.repository.UserProviderRepository;
import com.example.springboilerplate.repository.UserRepository;
import com.example.springboilerplate.security.JwtTokenProvider;
import com.example.springboilerplate.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;



@Service
public class AuthService {

    @Autowired
    private UserProviderRepository userProviderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public Optional<User> checkEmailExists(String email) {
        return userRepository.findByEmail(email);
    }

    // Dùng trong xử lý OAuth login
    public User findOrCreateUserFromOAuth(OAuthUserInfo oauthInfo, String provider) {
        String providerUserId = oauthInfo.getProviderUserId();
        String email = oauthInfo.getEmail();
        String name = oauthInfo.getName();
        String avatar = oauthInfo.getAvatarUrl();

        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        User user;

        Optional<UserProvider> userProviderOpt = userProviderRepository
                .findByProviderAndProviderUserId(provider, providerUserId);

        if (userProviderOpt.isPresent()) {
            return userProviderOpt.get().getUser();
        }

        if (existingUserOpt.isPresent()) {
            // Nếu đã có user theo email → cập nhật thêm provider info
            user = existingUserOpt.get();
            user.setGoogleId(providerUserId); // hoặc tên field phù hợp với provider
            user.setProvider(provider);
            userRepository.save(user);
        } else {
            // Tạo mới user
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setAvatarUrl(avatar);
            user.setUsername(generateUsername(email));
            user.setDisplayName(generateUsername(email));
            userRepository.save(user);

            // Liên kết provider
            UserProvider userProvider = new UserProvider();
            userProvider.setUser(user);
            userProvider.setProvider(provider);
            userProvider.setProviderUserId(providerUserId);
            userProvider.setEmail(email);

            userProvider.setName(name);
            userProvider.setAvatarUrl(avatar);
            userProvider.setRawData(oauthInfo.getRawJson() != null ? oauthInfo.getRawJson() : "{}");

            userProviderRepository.save(userProvider);
        }
        return user;
    }

    private String generateUsername(String email) {
        String base = (email != null && email.contains("@")) 
            ? email.split("@")[0]
            : "user";

        String candidate = base;
        int counter = 0;

        while (userRepository.existsByUsername(candidate)) {
            counter++;
            candidate = base + counter;
        }

        return candidate;
    }

    // Login bằng OAuth → sinh JWT
    public AuthResponse loginOrRegisterOAuth(OAuthUserInfo oauthInfo) {
        User user = findOrCreateUserFromOAuth(oauthInfo, oauthInfo.getProvider());

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities()
        );

        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        return new AuthResponse(user, accessToken, refreshToken);
    }

    public Optional<User> findOrCreateUserFromProviderIdOrEmail(String providerId, String email, String provider) {
        // 1. Tìm theo providerId
        Optional<User> userOpt = userRepository.findByGoogleId(providerId); // Dùng tạm luôn là Google mở rộng các nhà cung cấp khác sau
        if (userOpt.isPresent()) {
            return userOpt;
        }

        // 2. Nếu không có thì tìm theo email
        userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User existingUser = userOpt.get();
            // cập nhật thêm provider info nếu chưa có
            existingUser.setProvider(provider);
            existingUser.setGoogleId(providerId); // Dùng tạm luôn là Google mở rộng các nhà cung cấp khác sau
            userRepository.save(existingUser);
            return Optional.of(existingUser);
        }

        // 3. Nếu vẫn không có, tạo mới
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setProvider(provider);
        newUser.setGoogleId(providerId); // Dùng tạm luôn là Google mở rộng các nhà cung cấp khác sau
        newUser.setName("New User"); // Hoặc lấy từ socialLoginDto nếu có
        // thêm các trường mặc định khác nếu cần
        userRepository.save(newUser);
        return Optional.of(newUser);
    }
}

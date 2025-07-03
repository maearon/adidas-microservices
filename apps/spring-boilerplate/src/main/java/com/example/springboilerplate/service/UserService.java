package com.example.springboilerplate.service;

import com.example.springboilerplate.dto.UpdateUserRequest;
import com.example.springboilerplate.dto.UsersResponseDto;
import com.example.springboilerplate.model.User;
import com.example.springboilerplate.repository.UserRepository;
import com.example.springboilerplate.utils.TokenUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // public Page<UsersResponseDto> findAll(Pageable pageable) {
    //     return userRepository.findAll(pageable);
    // }
    public Page<UsersResponseDto> findAll(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(m -> new UsersResponseDto(
                        m.getId(),
                        m.getName(),
                        m.getUsername(),
                        m.getEmail(),
                        m.getGravatar()
                ));
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // user.setActivationDigest(UUID.randomUUID().toString());
        
        String activationToken = TokenUtil.generateToken(); // token gốc gửi cho user
        String activationDigest = TokenUtil.generateDigest(activationToken); // digest lưu DB

        user.setActivationDigest(activationDigest);

        User savedUser = userRepository.save(user);
        emailService.sendActivationEmail(savedUser, activationDigest);
        return savedUser;
    }

    @Transactional
    public User update(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public boolean changePassword(User user, String newPassword) {
        if (user == null || !StringUtils.hasText(newPassword)) return false;
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return true;
    }

    @Transactional
    public boolean updateProfile(User user, UpdateUserRequest request) {
        boolean changed = false;

        // Update name
        if (StringUtils.hasText(request.getName()) && !request.getName().equals(user.getName())) {
            user.setName(request.getName());
            changed = true;
        }

        // Update email (only if not taken)
        if (StringUtils.hasText(request.getEmail())
                && !request.getEmail().equals(user.getEmail())) {

            if (existsByEmail(request.getEmail())) {
                return false; // Email đã được dùng
            }

            user.setEmail(request.getEmail());
            changed = true;
        }

        if (changed) {
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }

        return true;
    }

    @Transactional
    public void delete(String id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public boolean activate(String token) {
        Optional<User> userOpt = userRepository.findByActivationDigest(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setActivated(true);
            user.setActivatedAt(LocalDateTime.now());
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Transactional
    public void createPasswordReset(User user) {
        String token = TokenUtil.generateToken();
        String digest = TokenUtil.generateDigest(token);

        user.setResetDigest(digest);
        user.setResetSentAt(LocalDateTime.now());
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user, token); // cần truyền token thật
    }

    @Transactional
    public boolean resetPassword(String token, String password) {
        Optional<User> userOpt = userRepository.findByResetDigest(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Check if token is expired (2 hours)
            if (user.getResetSentAt().plusHours(2).isAfter(LocalDateTime.now())) {
                user.setPassword(passwordEncoder.encode(password));
                user.setResetDigest(null);
                user.setResetSentAt(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    public List<User> getFollowing(String userId) {
        return userRepository.findFollowing(userId);
    }

    public List<User> getFollowers(String userId) {
        return userRepository.findFollowers(userId);
    }

    public Page<UsersResponseDto> getFollowingPaginated(String userId, Pageable pageable) {
        return userRepository.findFollowingPaginated(userId, pageable)
                .map(m -> new UsersResponseDto(
                        m.getId(),
                        m.getName(),
                        m.getUsername(),
                        m.getEmail(),
                        m.getGravatar()
                ));
    }

    public Page<UsersResponseDto> getFollowersPaginated(String userId, Pageable pageable) {
        return userRepository.findFollowersPaginated(userId, pageable)
                .map(m -> new UsersResponseDto(
                        m.getId(),
                        m.getName(),
                        m.getUsername(),
                        m.getEmail(),
                        m.getGravatar()
                ));
    }


    // Add this method to the UserService class
    public User updateUser(String id, String name, String email, String password) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setName(name);
        user.setEmail(email);
        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        return userRepository.save(user);
    }

    // Other methods in UserService
    public boolean deleteUser(String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return true;
        }
        return false;
    }

    public boolean requestPasswordReset(String email) {
        // Implement the logic to handle password reset request
        // For example, check if the email exists and send a reset email
        // Return true if successful, false otherwise
        return true; // Placeholder implementation
    }

    // Add this method to the UserService class
    public User registerNewUser(String name, String email, String password) {
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        // user.setActivationDigest(UUID.randomUUID().toString());
        // User savedUser = userRepository.save(user);
        // emailService.sendActivationEmail(savedUser);
        // return savedUser;
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setName(name);
        user.setUsername(name);
        user.setDisplayName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Ensure password is hashed before saving

        // user.setActivationDigest(UUID.randomUUID().toString());
        // return userRepository.save(user); // Assuming userRepository is already defined


        // Tạo activation token + digest giống Rails Tutorial
        String activationToken = TokenUtil.generateToken(); // token gốc gửi cho user
        String activationDigest = TokenUtil.generateDigest(activationToken); // digest lưu DB

        user.setActivationDigest(activationDigest);
        user.setActivated(false); // mặc định chưa kích hoạt
        user.setActivatedAt(null);

        User savedUser = userRepository.save(user);

        // Gửi email chứa link activate
        emailService.sendActivationEmail(savedUser, activationToken);

        return savedUser;
    }

    public void revokeRefreshToken(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setRefreshToken(null);
            user.setRefreshTokenExpirationAt(null);
            userRepository.save(user);
        });
    }

    @Transactional
    public void sendActivationEmailAgain(User user) {
        String newToken = TokenUtil.generateToken();
        String newDigest = TokenUtil.generateDigest(newToken);
        user.setActivationDigest(newDigest);
        userRepository.save(user);
        emailService.sendActivationEmail(user, newToken);
    }

    @Transactional
    public boolean activateWithToken(String token, String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();

        if (user.isActivated()) return false;

        if (TokenUtil.matches(token, user.getActivationDigest())) {
            user.setActivated(true);
            user.setActivatedAt(LocalDateTime.now());
            userRepository.save(user);
            return true;
        }

        return false;
    }

    public boolean verifyResetToken(String token, User user) {
        if (user.getResetSentAt() == null || user.getResetSentAt().plusHours(2).isBefore(LocalDateTime.now())) {
            return false;
        }
        return TokenUtil.matches(token, user.getResetDigest());
    }

    @Transactional
    public boolean resetPasswordWithToken(User user, String password) {
        user.setPassword(passwordEncoder.encode(password));
        user.setResetDigest(null);
        user.setResetSentAt(null);
        userRepository.save(user);
        return true;
    }
}

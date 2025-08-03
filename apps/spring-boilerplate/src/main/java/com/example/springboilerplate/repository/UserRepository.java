package com.example.springboilerplate.repository;

import com.example.springboilerplate.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    Optional<User> findByActivationDigest(String activationDigest);
    Optional<User> findByResetDigest(String resetDigest);
    Optional<User> findByRefreshToken(String refreshToken);
    
    @Query("SELECT u FROM User u WHERE u.id IN (SELECT r.followed.id FROM Relationship r WHERE r.follower.id = :userId)")
    List<User> findFollowing(@Param("userId") String userId);
    
    @Query("SELECT u FROM User u WHERE u.id IN (SELECT r.follower.id FROM Relationship r WHERE r.followed.id = :userId)")
    List<User> findFollowers(@Param("userId") String userId);
    
    @Query("SELECT u FROM User u WHERE u.id IN (SELECT r.followed.id FROM Relationship r WHERE r.follower.id = :userId)")
    Page<User> findFollowingPaginated(@Param("userId") String userId, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.id IN (SELECT r.follower.id FROM Relationship r WHERE r.followed.id = :userId)")
    Page<User> findFollowersPaginated(@Param("userId") String userId, Pageable pageable);
}

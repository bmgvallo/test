package com.vallo.backend.controller;

import com.vallo.backend.entity.User;
import com.vallo.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // OPTIONS handler is not needed when using @CrossOrigin annotation
    @GetMapping("/{emailOrUsername}")
    public ResponseEntity<?> getProfile(@PathVariable String emailOrUsername) {
        try {
            // Try to find by email first, then by username
            User user = userRepository
                    .findByEmail(emailOrUsername)
                    .orElseGet(() -> userRepository
                            .findByUsername(emailOrUsername)
                            .orElseThrow(() -> new RuntimeException("User not found")));
            
            // Remove sensitive data before sending
            user.setPasswordHash(null);
            
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser) {
        try {
            User existingUser = userRepository.findById(updatedUser.getUserID())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Update only non-sensitive fields
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
            existingUser.setUpdatedAt(java.time.LocalDateTime.now());
            
            User savedUser = userRepository.save(existingUser);
            savedUser.setPasswordHash(null); // Remove password from response
            
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @GetMapping("/me/{userId}")
    public ResponseEntity<?> getProfileById(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setPasswordHash(null); // Remove password from response
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
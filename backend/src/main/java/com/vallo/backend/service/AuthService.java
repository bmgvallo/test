    package com.vallo.backend.service;

    import com.vallo.backend.entity.User;
    import com.vallo.backend.dto.RegisterRequest;
    import com.vallo.backend.dto.AuthResponse;
    import com.vallo.backend.repository.UserRepository;
    import com.vallo.backend.security.JwtUtil;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;

    @Service
    public class AuthService {
        
        @Autowired
        private UserRepository userRepository;
        
        @Autowired
        private PasswordEncoder passwordEncoder;
        
        @Autowired
        private AuthenticationManager authenticationManager;
        
        @Autowired
        private JwtUtil jwtUtil;
        
        public AuthResponse login(String username, String password) {
            try {
                // Authenticate
                Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
                );
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                // Generate JWT token
                String jwt = jwtUtil.generateToken(username);
                
                // Get user details
                User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                
                // Update last login
                user.setLastLoginAt(LocalDateTime.now());
                userRepository.save(user);
                
                // Return token with user info
                return new AuthResponse(jwt, user.getUserID(), user.getUsername(), 
                                    user.getEmail(), user.getFirstName(), user.getLastName());
                
            } catch (Exception e) {
                throw new RuntimeException("Invalid username or password");
            }
        }
        
        public User register(RegisterRequest request) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setPhoneNumber(request.getPhoneNumber());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setActive(true);
            user.setEmailVerified(false);
            user.setCreatedAt(LocalDateTime.now());
            
            return userRepository.save(user);
        }
        
        public boolean usernameExists(String username) {
            return userRepository.existsByUsername(username);
        }
        
        public boolean emailExists(String email) {
            return userRepository.existsByEmail(email);
        }
    }
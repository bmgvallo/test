package com.vallo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userID;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    
    // Constructor for when you only have token (like in your original code)
    public AuthResponse(String token) {
        this.token = token;
    }
}
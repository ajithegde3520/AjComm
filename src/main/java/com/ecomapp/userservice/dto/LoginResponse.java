package com.ecomapp.userservice.dto;

public class LoginResponse {
    
    private String token;
    private String tokenType = "Bearer";
    private UserResponse user;
    
    // Default constructor
    public LoginResponse() {}
    
    // Constructor with fields
    public LoginResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public UserResponse getUser() {
        return user;
    }
    
    public void setUser(UserResponse user) {
        this.user = user;
    }
} 
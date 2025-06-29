package com.ecomapp.userservice.service;

import com.ecomapp.userservice.dto.LoginRequest;
import com.ecomapp.userservice.dto.LoginResponse;
import com.ecomapp.userservice.dto.UserRegistrationRequest;
import com.ecomapp.userservice.dto.UserResponse;

import java.util.List;

public interface UserService {
    
    UserResponse registerUser(UserRegistrationRequest request);
    
    LoginResponse login(LoginRequest request);
    
    UserResponse getUserById(Long id);
    
    UserResponse getUserByUsername(String username);
    
    List<UserResponse> getAllUsers();
    
    UserResponse updateUser(Long id, UserRegistrationRequest request);
    
    void deleteUser(Long id);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
} 
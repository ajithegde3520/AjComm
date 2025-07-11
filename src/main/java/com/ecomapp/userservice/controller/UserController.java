package com.ecomapp.userservice.controller;

import com.ecomapp.userservice.dto.LoginRequest;
import com.ecomapp.userservice.dto.LoginResponse;
import com.ecomapp.userservice.dto.UserRegistrationRequest;
import com.ecomapp.userservice.dto.UserResponse;
import com.ecomapp.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User API", description = "Operations related to users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        System.out.println("Registration request received: " + request.getUsername() + ", " + request.getEmail());
        try {
            UserResponse userResponse = userService.registerUser(request);
            System.out.println("User registered successfully: " + userResponse.getUsername());
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            System.out.println("Registration failed: " + e.getMessage());
            throw e;
        }
    }
    
    @Operation(summary = "Login and get JWT token")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse userResponse = userService.getUserById(id);
        return ResponseEntity.ok(userResponse);
    }
    
    @Operation(summary = "Get user by username")
    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        UserResponse userResponse = userService.getUserByUsername(username);
        return ResponseEntity.ok(userResponse);
    }
    
    @Operation(summary = "Get all users")
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @Operation(summary = "Update user by ID")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserRegistrationRequest request) {
        UserResponse userResponse = userService.updateUser(id, request);
        return ResponseEntity.ok(userResponse);
    }
    
    @Operation(summary = "Delete user by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    // Temporary debug endpoint
    @Operation(summary = "Debug: Check if user exists")
    @GetMapping("/debug/check/{username}")
    public ResponseEntity<String> checkUserExists(@PathVariable String username) {
        boolean exists = userService.existsByUsername(username);
        return ResponseEntity.ok("User '" + username + "' exists: " + exists);
    }
} 
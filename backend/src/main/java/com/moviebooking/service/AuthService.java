package com.moviebooking.service;

import com.moviebooking.dto.request.LoginRequest;
import com.moviebooking.dto.request.RefreshTokenRequest;
import com.moviebooking.dto.request.RegisterRequest;
import com.moviebooking.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(String token);
}

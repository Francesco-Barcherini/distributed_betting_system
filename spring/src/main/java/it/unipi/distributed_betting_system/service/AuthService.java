package it.unipi.distributed_betting_system.service;

import it.unipi.distributed_betting_system.dto.AuthResponse;
import it.unipi.distributed_betting_system.dto.LoginRequest;
import it.unipi.distributed_betting_system.dto.RegisterRequest;
import it.unipi.distributed_betting_system.model.User;
import it.unipi.distributed_betting_system.repository.UserRepository;
import it.unipi.distributed_betting_system.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setAdmin(request.isAdmin());
        userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.isAdmin());
        return new AuthResponse(token, user.getId(), user.isAdmin(), jwtService.expiryEpochSeconds());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getId(), user.isAdmin());
        return new AuthResponse(token, user.getId(), user.isAdmin(), jwtService.expiryEpochSeconds());
    }
}

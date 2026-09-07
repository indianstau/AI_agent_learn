package net.javaguides.springboot.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.javaguides.springboot.model.User;
import net.javaguides.springboot.repository.UserRepository;

// @CrossOrigin(origins = "http://localhost:3000")
// @CrossOrigin(origins = {
//     "http://localhost:3000",
//     "https://frontendno1.up.railway.app"
// })
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (isBlank(request.nickname()) || isBlank(request.email()) || isBlank(request.phone())
                || isBlank(request.password())) {
            return error(HttpStatus.BAD_REQUEST, "Please complete all registration fields");
        }
        if (userRepository.existsByEmail(request.email())) {
            return error(HttpStatus.BAD_REQUEST, "Email is already registered");
        }
        if (userRepository.existsByPhone(request.phone())) {
            return error(HttpStatus.BAD_REQUEST, "Phone number is already registered");
        }

        User user = new User();
        user.setNickname(request.nickname());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(message("Registration successful. Please sign in."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (isBlank(request.identifier()) || isBlank(request.password())) {
            return error(HttpStatus.BAD_REQUEST, "Please enter your sign-in details");
        }

        String loginType = request.loginType() == null ? "email" : request.loginType();
        User user = loginType.equals("phone")
            ? userRepository.findByPhone(request.identifier()).orElse(null)
            : userRepository.findByEmail(request.identifier()).orElse(null);

        if (user == null || user.getPassword() == null
            || !passwordEncoder.matches(request.password(), user.getPassword())) {
            return error(HttpStatus.UNAUTHORIZED, "Incorrect email, phone number or password");
        }

        Map<String, String> response = message("Successfully signed in");
        response.put("id", user.getId().toString());
        response.put("nickname", user.getNickname());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody ProfileRequest request) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return error(HttpStatus.NOT_FOUND, "User not found");
        }
        if (isBlank(request.nickname()) || isBlank(request.email()) || isBlank(request.phone())) {
            return error(HttpStatus.BAD_REQUEST, "Nickname, email and phone number are required");
        }
        if (userRepository.findByEmailAndIdNot(request.email(), id).isPresent()) {
            return error(HttpStatus.BAD_REQUEST, "Email is already registered");
        }
        if (userRepository.findByPhoneAndIdNot(request.phone(), id).isPresent()) {
            return error(HttpStatus.BAD_REQUEST, "Phone number is already registered");
        }
        if (!isBlank(request.newPassword())) {
            if (isBlank(request.currentPassword()) || !passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
                return error(HttpStatus.BAD_REQUEST, "Current password is incorrect");
            }
            if (!request.newPassword().equals(request.confirmPassword())) {
                return error(HttpStatus.BAD_REQUEST, "New passwords do not match");
            }
            user.setPassword(passwordEncoder.encode(request.newPassword()));
        }

        user.setNickname(request.nickname());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        userRepository.save(user);

        Map<String, String> response = message("Profile updated successfully");
        response.put("id", user.getId().toString());
        response.put("nickname", user.getNickname());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        return ResponseEntity.ok(response);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(message(message));
    }

    private Map<String, String> message(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }

    private record RegisterRequest(String nickname, String email, String phone, String password) {
    }

    private record LoginRequest(String loginType, String identifier, String password) {
    }

    private record ProfileRequest(String nickname, String email, String phone,
            String currentPassword, String newPassword, String confirmPassword) {
    }
}

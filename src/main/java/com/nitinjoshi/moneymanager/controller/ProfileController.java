package com.nitinjoshi.moneymanager.controller;

import com.nitinjoshi.moneymanager.dto.AuthDTO;
import com.nitinjoshi.moneymanager.dto.ProfileDTO;
import com.nitinjoshi.moneymanager.service.AppUserDetailsService;
import com.nitinjoshi.moneymanager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final AppUserDetailsService  appUserDetailsService;
    private final ProfileService profileService;
    private final PasswordEncoder passwordEncoder;


    @PostMapping("/register")
    public ResponseEntity<ProfileDTO> registerProfile(
            @RequestBody ProfileDTO profileDTO) {

        ProfileDTO registeredProfile =
                profileService.registerProfile(profileDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(registeredProfile);
    }

    @GetMapping("/activate")
    public ResponseEntity<String> activateProfile(@RequestParam String token) {
        boolean isActivated = profileService.activateProfile(token);

        if (isActivated) {
            return ResponseEntity.ok("Profile activated successfully");
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Activation token not found or already used");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDTO authDTO) {
        try {
            if (!profileService.isAccountActive(authDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "message", "Account is not active. Please activate your account first."
                ));
            }

            Map<String, Object> response =
                    profileService.authenticateAndGenerateToken(authDTO);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/test")
    public String test() {
        return "Test successful";
    }

}
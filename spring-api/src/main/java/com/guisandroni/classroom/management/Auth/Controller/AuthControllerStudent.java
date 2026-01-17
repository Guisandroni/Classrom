package com.guisandroni.classroom.management.Auth.Controller;

import com.guisandroni.classroom.management.Auth.DTO.AuthResponseUser;
import com.guisandroni.classroom.management.Auth.DTO.LoginRequest;
import com.guisandroni.classroom.management.Auth.DTO.RegisterRequest;
import com.guisandroni.classroom.management.Auth.Service.AuthServiceUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth/user")
@RequiredArgsConstructor
public class AuthControllerUser {


    private final AuthServiceUser authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseUser> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseUser> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}

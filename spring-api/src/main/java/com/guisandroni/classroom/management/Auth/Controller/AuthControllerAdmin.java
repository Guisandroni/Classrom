package com.guisandroni.classroom.management.Auth.Controller;

import com.guisandroni.classroom.management.Auth.DTO.AuthResponseAdmin;
import com.guisandroni.classroom.management.Auth.DTO.LoginRequest;
import com.guisandroni.classroom.management.Auth.DTO.RegisterRequest;
import com.guisandroni.classroom.management.Auth.Service.AuthServiceAdmin;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
public class AuthControllerAdmin {

    private final AuthServiceAdmin authService;


    @PostMapping("/register")
    public ResponseEntity<AuthResponseAdmin> register (@Valid @RequestBody RegisterRequest request){
        return ResponseEntity.ok(authService.register(request));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponseAdmin> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}

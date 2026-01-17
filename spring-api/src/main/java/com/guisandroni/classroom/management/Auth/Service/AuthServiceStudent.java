package com.guisandroni.classroom.management.Auth.Service;

import com.guisandroni.classroom.management.Auth.DTO.AuthResponseStudent;
import com.guisandroni.classroom.management.Auth.DTO.LoginRequest;
import com.guisandroni.classroom.management.Auth.DTO.RegisterRequest;
import com.guisandroni.classroom.management.Auth.Entity.User;
import com.guisandroni.classroom.management.Auth.Enum.Role;
import com.guisandroni.classroom.management.Auth.Repository.UserRepository;
import com.guisandroni.classroom.management.Student.Entity.Student;
import com.guisandroni.classroom.management.Student.Repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceStudent {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final StudentRepository studentRepository;


    public AuthResponseStudent register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .build();

        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);

        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());

        studentRepository.save(student);


        return AuthResponseStudent.builder()
                .token(jwtToken)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponseStudent login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var jwtToken = jwtService.generateToken(user);

        return AuthResponseStudent.builder()
                .token(jwtToken)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .build();
    }
}

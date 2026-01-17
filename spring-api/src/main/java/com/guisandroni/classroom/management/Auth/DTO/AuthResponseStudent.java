package com.guisandroni.classroom.management.Auth.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseStudent {
    private String token;
    private String type;
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String role;
}

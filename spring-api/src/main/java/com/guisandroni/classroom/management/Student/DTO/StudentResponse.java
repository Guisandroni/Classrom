package com.guisandroni.classroom.management.Student.DTO;

import com.guisandroni.classroom.management.Enrollment.DTO.EnrollmentResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private List<EnrollmentResponse> enrollments;
}

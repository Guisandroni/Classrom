package com.guisandroni.classroom.management.Enrollment.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {
    private Long id;
    private Long classId;
    private String className;
    private Long studentId;
    private String studentName;
    private String studentEmail;
}

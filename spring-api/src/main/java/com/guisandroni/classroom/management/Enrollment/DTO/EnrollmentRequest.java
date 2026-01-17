package com.guisandroni.classroom.management.Enrollment.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequest {

    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotNull(message = "Student ID is required")
    private Long studentId;
}

package com.guisandroni.classroom.management.Enrollment.Mapper;

import com.guisandroni.classroom.management.Class.Entity.Class;
import com.guisandroni.classroom.management.Enrollment.DTO.EnrollmentResponse;
import com.guisandroni.classroom.management.Enrollment.Entity.Enrollment;
import com.guisandroni.classroom.management.Student.Entity.Student;
import lombok.experimental.UtilityClass;

@UtilityClass
public class EnrollmentMapper {

    public static Enrollment toEnrollment(Class classEntity, Student student) {
        return Enrollment.builder()
                .classEntity(classEntity)
                .studentEntity(student)
                .build();
    }

    public static EnrollmentResponse toEnrollmentResponse(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .classId(enrollment.getClassEntity().getId())
                .className(enrollment.getClassEntity().getName())
                .studentId(enrollment.getStudentEntity().getId())
                .studentName(enrollment.getStudentEntity().getName())
                .studentEmail(enrollment.getStudentEntity().getEmail())
                .build();
    }
}

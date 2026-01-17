package com.guisandroni.classroom.management.Student.Mapper;

import com.guisandroni.classroom.management.Enrollment.DTO.EnrollmentResponse;
import com.guisandroni.classroom.management.Enrollment.Mapper.EnrollmentMapper;
import com.guisandroni.classroom.management.Student.DTO.StudentRequest;
import com.guisandroni.classroom.management.Student.DTO.StudentResponse;
import com.guisandroni.classroom.management.Student.Entity.Student;
import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class StudentMapper {

    public static Student toStudent(StudentRequest request) {
        return Student.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .build();
    }

    public static StudentResponse toStudentResponse(Student student) {


        List<EnrollmentResponse> enrollments = student.getEnrollments().stream().map(enrollment -> EnrollmentMapper.toEnrollmentResponse(enrollment)).toList();

        return StudentResponse.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .phoneNumber(student.getPhoneNumber())
                .enrollments(enrollments)
                .build();
    }

    public static void updateStudent(Student student, StudentRequest request) {
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());
    }
}

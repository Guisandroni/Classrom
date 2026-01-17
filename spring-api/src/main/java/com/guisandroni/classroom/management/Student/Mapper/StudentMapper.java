package com.guisandroni.classroom.management.Student.Mapper;

import com.guisandroni.classroom.management.Student.DTO.StudentRequest;
import com.guisandroni.classroom.management.Student.DTO.StudentResponse;
import com.guisandroni.classroom.management.Student.Entity.Student;
import lombok.experimental.UtilityClass;

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
        return StudentResponse.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .phoneNumber(student.getPhoneNumber())
                .build();
    }

    public static void updateStudent(Student student, StudentRequest request) {
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());
    }
}

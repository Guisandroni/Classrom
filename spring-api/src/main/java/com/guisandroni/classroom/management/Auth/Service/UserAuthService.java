package com.guisandroni.classroom.management.Auth.Service;

import com.guisandroni.classroom.management.Auth.Entity.User;
import com.guisandroni.classroom.management.Enrollment.Repository.EnrollmentRepository;
import com.guisandroni.classroom.management.Student.Entity.Student;
import com.guisandroni.classroom.management.Student.Repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("userAuthService")
@RequiredArgsConstructor
public class UserAuthService {

    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;

    public boolean isEnrolledInTraining(Long trainingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User user)) {
            return false;
        }

        Student student = studentRepository.findByEmail(user.getEmail()).orElse(null);
        if (student == null) {
            return false;
        }

        return enrollmentRepository.existsByStudentIdAndTrainingId(student.getId(), trainingId);
    }
}

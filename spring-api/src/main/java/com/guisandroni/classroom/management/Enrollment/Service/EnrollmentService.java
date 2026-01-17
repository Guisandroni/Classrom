package com.guisandroni.classroom.management.Enrollment.Service;

import com.guisandroni.classroom.management.Auth.Entity.User;
import com.guisandroni.classroom.management.Class.Entity.Class;
import com.guisandroni.classroom.management.Class.Repository.ClassRepository;
import com.guisandroni.classroom.management.Enrollment.DTO.EnrollmentRequest;
import com.guisandroni.classroom.management.Enrollment.DTO.EnrollmentResponse;
import com.guisandroni.classroom.management.Enrollment.Entity.Enrollment;
import com.guisandroni.classroom.management.Enrollment.Mapper.EnrollmentMapper;
import com.guisandroni.classroom.management.Enrollment.Repository.EnrollmentRepository;
import com.guisandroni.classroom.management.Student.Entity.Student;
import com.guisandroni.classroom.management.Student.Repository.StudentRepository;
import com.guisandroni.classroom.management.Exception.ResourceNotFoundException;
import com.guisandroni.classroom.management.Exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> findAll() {
        return enrollmentRepository.findAll()
                .stream()
                .map(EnrollmentMapper::toEnrollmentResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EnrollmentResponse findById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + id));
        return EnrollmentMapper.toEnrollmentResponse(enrollment);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> findByClassId(Long classId) {
        return enrollmentRepository.findByClassEntityId(classId)
                .stream()
                .map(EnrollmentMapper::toEnrollmentResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> findByStudentId(Long studentId) {
        return enrollmentRepository.findByStudentEntityId(studentId)
                .stream()
                .map(EnrollmentMapper::toEnrollmentResponse)
                .toList();
    }

    @Transactional
    public EnrollmentResponse create(EnrollmentRequest request) {
        if (enrollmentRepository.existsByClassEntityIdAndStudentEntityId(request.getClassId(), request.getStudentId())) {
            throw new BusinessException("Student is already enrolled in this class");
        }

        Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        Enrollment enrollment = EnrollmentMapper.toEnrollment(classEntity, student);
        enrollment = enrollmentRepository.save(enrollment);
        return EnrollmentMapper.toEnrollmentResponse(enrollment);
    }

    @Transactional
    public void delete(Long id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new RuntimeException("Enrollment not found with id: " + id);
        }
        enrollmentRepository.deleteById(id);
    }

    @Transactional
    public void deleteByClassAndStudent(Long classId, Long studentId) {
        Enrollment enrollment = enrollmentRepository.findByClassEntityIdAndStudentEntityId(classId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for this class and student"));
        enrollmentRepository.delete(enrollment);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> findEnrollmentsForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
            throw new ResourceNotFoundException("Invalid user principal");
        }

        User user = (User) principal;
        Student student = studentRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for current user"));

        return enrollmentRepository.findByStudentEntityId(student.getId())
                .stream()
                .map(EnrollmentMapper::toEnrollmentResponse)
                .toList();
    }
}

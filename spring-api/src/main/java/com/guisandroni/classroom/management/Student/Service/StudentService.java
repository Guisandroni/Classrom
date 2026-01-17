package com.guisandroni.classroom.management.Student.Service;

import com.guisandroni.classroom.management.Auth.Entity.User;
import com.guisandroni.classroom.management.Student.DTO.StudentRequest;
import com.guisandroni.classroom.management.Student.DTO.StudentResponse;
import com.guisandroni.classroom.management.Student.Entity.Student;
import com.guisandroni.classroom.management.Student.Mapper.StudentMapper;
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
public class StudentService {

    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<StudentResponse> findAll() {
        return studentRepository.findAll()
                .stream()
                .map(StudentMapper::toStudentResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public StudentResponse findById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return StudentMapper.toStudentResponse(student);
    }

    @Transactional
    public StudentResponse create(StudentRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email is already in use");
        }
        if (studentRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BusinessException("Phone number is already in use");
        }

        Student student = StudentMapper.toStudent(request);
        student = studentRepository.save(student);
        return StudentMapper.toStudentResponse(student);
    }

    @Transactional
    public StudentResponse update(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if (!student.getEmail().equals(request.getEmail()) &&
            studentRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email is already in use");
        }
        if (!student.getPhoneNumber().equals(request.getPhoneNumber()) &&
            studentRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BusinessException("Phone number is already in use");
        }

        StudentMapper.updateStudent(student, request);
        student = studentRepository.save(student);
        return StudentMapper.toStudentResponse(student);
    }

    @Transactional
    public void delete(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public StudentResponse findCurrentStudent() {
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
        return StudentMapper.toStudentResponse(student);
    }
}

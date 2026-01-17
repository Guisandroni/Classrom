package com.guisandroni.classroom.management.Training.Service;

import com.guisandroni.classroom.management.Auth.Entity.User;
import com.guisandroni.classroom.management.Enrollment.Repository.EnrollmentRepository;
import com.guisandroni.classroom.management.Student.Entity.Student;
import com.guisandroni.classroom.management.Student.Repository.StudentRepository;
import com.guisandroni.classroom.management.Training.DTO.TrainingRequest;
import com.guisandroni.classroom.management.Training.DTO.TrainingResponse;
import com.guisandroni.classroom.management.Training.Entity.Training;
import com.guisandroni.classroom.management.Training.Mapper.TrainingMapper;
import com.guisandroni.classroom.management.Training.Repository.TrainingRepository;
import com.guisandroni.classroom.management.Exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingService {

    private final TrainingRepository trainingRepository;
    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional(readOnly = true)
    public List<TrainingResponse> findAll() {
        return trainingRepository.findAll()
                .stream()
                .map(TrainingMapper::toTrainingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TrainingResponse findById(Long id) {
        Training training = trainingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found with id: " + id));
        return TrainingMapper.toTrainingResponse(training);
    }

    @Transactional
    public TrainingResponse create(TrainingRequest request) {
        Training training = TrainingMapper.toTraining(request);
        training = trainingRepository.save(training);
        return TrainingMapper.toTrainingResponse(training);
    }

    @Transactional
    public TrainingResponse update(Long id, TrainingRequest request) {
        Training training = trainingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found with id: " + id));

        TrainingMapper.updateTraining(training, request);
        training = trainingRepository.save(training);
        return TrainingMapper.toTrainingResponse(training);
    }

    @Transactional
    public void delete(Long id) {
        if (!trainingRepository.existsById(id)) {
            throw new RuntimeException("Training not found with id: " + id);
        }
        trainingRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<TrainingResponse> findTrainingsForCurrentUser() {
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

        var enrollments = enrollmentRepository.findByStudentEntityId(student.getId());

        return enrollments.stream()
                .map(enrollment -> enrollment.getClassEntity().getTraining())
                .distinct()
                .map(TrainingMapper::toTrainingResponse)
                .collect(Collectors.toList());
    }
}

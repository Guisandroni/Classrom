package com.guisandroni.classroom.management.Class.Service;

import com.guisandroni.classroom.management.Class.DTO.ClassRequest;
import com.guisandroni.classroom.management.Class.DTO.ClassResponse;
import com.guisandroni.classroom.management.Class.Entity.Class;
import com.guisandroni.classroom.management.Class.Mapper.ClassMapper;
import com.guisandroni.classroom.management.Class.Repository.ClassRepository;
import com.guisandroni.classroom.management.Training.Entity.Training;
import com.guisandroni.classroom.management.Training.Repository.TrainingRepository;
import com.guisandroni.classroom.management.Exception.ResourceNotFoundException;
import com.guisandroni.classroom.management.Exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final ClassRepository classRepository;
    private final TrainingRepository trainingRepository;

    @Transactional(readOnly = true)
    public List<ClassResponse> findAll() {
        return classRepository.findAll()
                .stream()
                .map(ClassMapper::toClassResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClassResponse findById(Long id) {
        Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        return ClassMapper.toClassResponse(classEntity);
    }

    @Transactional(readOnly = true)
    public List<ClassResponse> findByTrainingId(Long trainingId) {
        return classRepository.findByTrainingId(trainingId)
                .stream()
                .map(ClassMapper::toClassResponse)
                .toList();
    }

    @Transactional
    public ClassResponse create(ClassRequest request) {
        Training training = trainingRepository.findById(request.getTrainingId())
                .orElseThrow(() -> new ResourceNotFoundException("Training not found with id: " + request.getTrainingId()));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BusinessException("End date must be after start date");
        }

        Class classEntity = ClassMapper.toClass(request, training);
        classEntity = classRepository.save(classEntity);
        return ClassMapper.toClassResponse(classEntity);
    }

    @Transactional
    public ClassResponse update(Long id, ClassRequest request) {
        Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));

        Training training = trainingRepository.findById(request.getTrainingId())
                .orElseThrow(() -> new ResourceNotFoundException("Training not found with id: " + request.getTrainingId()));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BusinessException("End date must be after start date");
        }

        ClassMapper.updateClass(classEntity, request, training);
        classEntity = classRepository.save(classEntity);
        return ClassMapper.toClassResponse(classEntity);
    }

    @Transactional
    public void delete(Long id) {
        if (!classRepository.existsById(id)) {
            throw new RuntimeException("Class not found with id: " + id);
        }
        classRepository.deleteById(id);
    }

}
